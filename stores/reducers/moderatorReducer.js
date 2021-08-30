const initState = {
    moderators: []
}


const moderatorReducer = (state=initState, action) => {
    switch (action.type) {
        case "ADD_ALL_MODERATORS":
            return{
                moderators: state.moderators.concat(action.moderators)
            }
        case "ADD_NEW_MODERATOR":
            return{
                ...state,
                moderators: state.moderators.concat(action.newModerator)
            }
        case "UPDATE_MODERATOR":
            const moderatorsUpdateCopy = [...state.moderators];
            const moderatorIndex = moderatorsUpdateCopy.findIndex(moderator=> moderator.moderatorId == action.moderator.moderatorId);
            moderatorsUpdateCopy[moderatorIndex] = action.moderator;
            return {
                ...state,
                moderators: moderatorsUpdateCopy
            }
        case "REMOVE_MODERATOR":
            const moderatorsRemovedCopy = [...state.moderators];
            const deletedIndex = moderatorsRemovedCopy.findIndex(moderator=> moderator.moderatorId == action.moderatorId);
            moderatorsRemovedCopy.splice(deletedIndex, 1);
            return {
                ...state,
                moderators: moderatorsRemovedCopy
            }
        default:
            return state;
    }
}

export default moderatorReducer;