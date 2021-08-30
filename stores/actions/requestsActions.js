const requestsActions= {
    addAllRequests: (requests, length, remaining)=>{
        return{
            type:"ADD_ALL_REQUESTS",
            requests,
            length,
            remaining
        }
    },
    addRequests: (requests) => {
        return {
            type: "ADD_REQUESTS",
            requests
        }
    },
    emptyRequest: () => {
        return {
            type: "EMPTY_REQUESTS"
        }
    }
}


export default requestsActions; 