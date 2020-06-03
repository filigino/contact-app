import React from 'react'
import {connect} from 'react-redux'
import ContactTracing from 'react-native-contact-tracing'
import {NativeEventEmitter, NativeModules, Switch, Text, View} from 'react-native'
import {logMyID, logOtherID, clearOldIDs, setTracingStatus} from '../../redux/ActionCreators'

const mapStateToProps = (state) => ({
    tracingIsEnabled: state.settings.tracingIsEnabled
})

const mapDispatchToProps = (dispatch) => ({
    logMyID: (ID) => dispatch(logMyID(ID)),
    logOtherID: (ID) => dispatch(logOtherID(ID)),
    clearOldIDs: () => dispatch(clearOldIDs()),
    setTracingStatus: (status) => dispatch(setTracingStatus(status))
})

class Home extends React.Component {
    componentDidMount() {
        this.props.clearOldIDs()
        const eventEmitter = new NativeEventEmitter(NativeModules.ContactTracing)
        this.advertiseListener = eventEmitter.addListener('Advertise', (ID) => {
            this.props.logMyID(ID)
        })
        this.discoveryListener = eventEmitter.addListener('Discovery', (ID) => {
            this.props.logOtherID(ID)
        })
        if (this.props.tracingIsEnabled) {
            this.startTracing()
        }
    }

    componentWillUnmount() {
        this.advertiseListener.remove()
        this.discoveryListener.remove()
        this.stopTracing()
    }

    startTracing() {
        ContactTracing.start()
        .catch((err) => console.log('Starting error: ' + err))
    }

    stopTracing() {
        ContactTracing.stop()
        .catch((err) => console.log('Stopping error: ' + err))
    }

    render() {
        const {styles} = this.props.route.params
        return (
            <View style={styles.container}>
                <View style={{flex: 1, justifyContent: 'center'}}>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                        <Text>Enable contact tracing</Text>
                        <Switch
                            value={this.props.tracingIsEnabled}
                            onValueChange={() => {
                                ContactTracing.isEnabled()
                                .then((isEnabled) => {
                                    if (isEnabled) {
                                        this.stopTracing()
                                    } else {
                                        this.startTracing()
                                    }
                                    this.props.setTracingStatus(!this.props.tracingIsEnabled)
                                })
                            }}
                        />
                    </View>
                </View>
            </View>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)
