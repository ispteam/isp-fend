const requestsActions= {
    addAllModerators: (requests)=>{
        return{
            type:"ADD_ALL_REQUESTS",
            requests
        }
    }
}


export default requestsActions; 