const initState = {
    requests: []
}


const requestsReducer = (state=initState, action) => {
    switch (action.type) {
        case "ADD_ALL_REQUESTS":
            return{
                requests: state.requests.concat(action.requests)
            }
        default:
            return state;
    }
}

export default requestsReducer;