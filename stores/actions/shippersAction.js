const shippersActions= {
    addAllShippers: (shippers)=>{
        return{
            type:"ADD_ALL_SHIPPERS",
            shippers
        }
    },
    updateShipper: (shipper)=>{
        return {
            type: "UPDATE_SHIPPER",
            shipper
        }
    },
    removeShipper: (shipperId) => {
        return {
            type: "REMOVE_SHIPPER",
            shipperId
        }
    },
    addNewShipper: (newShipper) => {
        return {
            type: "ADD_NEW_SHIPPER",
            newShipper
        }
    }
}


export default shippersActions; 