const buffer = 1209600000 // 14 days in milliseconds

const ids = (state = {myIds: [], otherIds: []}, action) => {
    switch (action.type) {
        case 'ADD_MY_ID':
            return {...state, myIds: [...state.myIds, {id: action.id, timestamp: Date.now()}]}
        case 'ADD_OTHER_ID':
            return {...state, otherIds: [...state.otherIds, {id: action.id, timestamp: Date.now()}]}
        case 'DELETE_OTHER_ID':
            return {...state, otherIds: state.otherIds.filter(id => (id.id !== action.id))}
        case 'CLEAR_OLD_IDS':
            const now = Date.now()
            return {
                myIds: state.myIds.filter(id => (now - id.timestamp < buffer)),
                otherIds: state.otherIds.filter(id => (now - id.timestamp < buffer))
            }
        case 'CLEAR_ALL_IDS': // debug
            return {myIds: [], otherIds: []}
        default:
            return state
    }
}

export default ids
