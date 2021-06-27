const initState = {
    suppliers: []
}


const suppliersReducer = (state=initState, action) => {
    switch (action.type) {
        case "ADD_ALL_SUPPLIERS":
            return{
                suppliers: state.suppliers.concat(action.suppliers)
            }
        case "UPDATE_SUPPLIER":
            const supplierUpdateCopy = [...state.suppliers];
            const supplierIndex = supplierUpdateCopy.findIndex(supplier=> supplier.supplierId == action.supplier.supplierId);
            supplierUpdateCopy[supplierIndex] = action.supplier;
            return {
                ...state,
                suppliers: supplierUpdateCopy
            }
        case "VERIFY_SUPPLIER":
            const updateVerifiedCopy = [...state.suppliers];
            const verifiedIndex = updateVerifiedCopy.findIndex(supplier=> supplier.supplierId == action.supplierId);
            updateVerifiedCopy[verifiedIndex].verified = "1";
            return {
                ...state,
                suppliers: updateVerifiedCopy
            }
        case "UNVERIFY_SUPPLIER":
            const updateUnVerifiedCopy = [...state.suppliers];
            const unverifiedIndex = updateUnVerifiedCopy.findIndex(supplier=> supplier.supplierId == action.supplierId);
            updateUnVerifiedCopy[unverifiedIndex].verified = "0";
            return {
                ...state,
                suppliers: updateUnVerifiedCopy
            }
        case "SUSPEND_SUPPLIER":
            const updateUnSuspendedCopy = [...state.suppliers];
            const suspendIndex = updateUnSuspendedCopy.findIndex(supplier=> supplier.supplierId == action.supplierId);
            updateUnSuspendedCopy[suspendIndex].verified = "2";
            return {
                ...state,
                suppliers: updateUnSuspendedCopy
            }
        default:
            return state;
    }
}

export default suppliersReducer;