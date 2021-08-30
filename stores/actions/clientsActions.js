const clientsActions= {
    addAllclients: (clients)=>{
        return{
            type:"ADD_ALL_CLIENTS",
            clients
        }
    },
    updateClient: (client)=>{
        return {
            type: "UPDATE_CLIENT",
            client
        }
    },
    removeClient: (clientId) => {
        return {
            type: "REMOVE_CLIENT",
            clientId
        }
    },
    cleanClients: () => {
        return {
            type: "CLEAN_CLIENTS"
        }
    }
}


export default clientsActions; 