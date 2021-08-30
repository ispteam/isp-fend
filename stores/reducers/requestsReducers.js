const initState = {
    requests: [],
    remaining: 0,
    length:null,
}


const requestsReducer = (state=initState, action) => {
    switch (action.type) {
        case "ADD_ALL_REQUESTS":
            return{
                requests: state.requests.concat(action.requests),
                length: action.length ? action.length : null,
                remaining: action.remaining
            }
        case "ADD_REQUESTS":{
            return{
                requests: state.requests.concat(action.requests)
            }
        }
        case "EMPTY_REQUESTS":{
            return {
                requests: []
            }
        }
        default:
            return state;
    }
}

export default requestsReducer;