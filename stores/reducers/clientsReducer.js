const initState = {
    clients: []
}


const clientsReducer = (state=initState, action) => {
    switch (action.type) {
        case "ADD_ALL_CLIENTS":
            return{
                clients: state.clients.concat(action.clients)
            }
        case "UPDATE_CLIENT":
            const clientsUpdateCopy = [...state.clients];
            const clientIndex = clientsUpdateCopy.findIndex(client=> client.clientId == action.client.clientId);
            clientsUpdateCopy[clientIndex] = action.client;
            return {
                ...state,
                clients: clientsUpdateCopy
            }
        case "REMOVE_CLIENT":
            const clientsRemovedCopy = [...state.clients];
            const deletedIndex = clientsRemovedCopy.findIndex(client=> client.clientId == action.clientId);
            clientsRemovedCopy.splice(deletedIndex, 1);
            return {
                ...state,
                clients: clientsRemovedCopy
            }
        case "CLEAN_CLIENTS":
            return{
                clients: []
            }
        default:
            return state;
    }
}

export default clientsReducer; 