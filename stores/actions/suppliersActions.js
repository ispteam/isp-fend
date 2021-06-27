const suppliersActions= {
    addAllsuppliers: (suppliers)=>{
        return{
            type:"ADD_ALL_SUPPLIERS",
            suppliers
        }
    },
    updateSupplier: (supplier)=>{
        return {
            type: "UPDATE_SUPPLIER",
            supplier
        }
    },
    removeSupplier: (supplierId) => {
        return {
            type: "REMOVE_SUPPLIER",
            supplierId
        }
    },
    verifySupplier:  (supplierId) => {
        return {
            type: "VERIFY_SUPPLIER",
            supplierId
        }
    },
    unverifySupplier:  (supplierId) => {
        return {
            type: "UNVERIFY_SUPPLIER",
            supplierId
        }
    },
    suspendSupplier:  (supplierId) => {
        return {
            type: "SUSPEND_SUPPLIER",
            supplierId
        }
    },
}


export default suppliersActions; 