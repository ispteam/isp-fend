const initState = {
    shippers: []
}

const shippersReducer = (state=initState, action) => {
    switch (action.type) {
        case "ADD_ALL_SHIPPERS":
            return{
                shippers: state.shippers.concat(action.shippers)
            }
        case "ADD_NEW_SHIPPER":
            return{
                ...state,
                shippers: state.shippers.concat(action.newShipper)
            }
        case "UPDATE_SHIPPER":
            const shippersUpdateCopy = [...state.shippers];
            const shipperIndex = shippersUpdateCopy.findIndex(shipper=> shipper.shipperId == action.shipper.shipperId);
            shippersUpdateCopy[shipperIndex] = action.shipper;
            return {
                ...state,
                shippers: shippersUpdateCopy
            }
        case "REMOVE_SHIPPER":
            const shippersRemovedCopy = [...state.shippers];
            const deletedIndex = shippersRemovedCopy.findIndex(shipper=> shipper.shipperId == action.shipperId);
            shippersRemovedCopy.splice(deletedIndex, 1);
            return {
                ...state,
                shippers: shippersRemovedCopy
            }
        default:
            return state;
    }
}

export default shippersReducer