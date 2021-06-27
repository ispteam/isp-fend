const moderatorsActions= {
    addAllModerators: (moderators)=>{
        return{
            type:"ADD_ALL_MODERATORS",
            moderators
        }
    },
    updateModerator: (moderator)=>{
        return {
            type: "UPDATE_MODERATOR",
            moderator
        }
    },
    removeModerator: (moderatorId) => {
        return {
            type: "REMOVE_MODERATOR",
            moderatorId
        }
    },
    addNewModerator: (newModerator) => {
        return {
            type: "ADD_NEW_MODERATOR",
            newModerator
        }
    }
}


export default moderatorsActions; 