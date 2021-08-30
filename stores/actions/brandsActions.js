const brandsActions= {
    addAllbrands: (brands)=>{
        return{
            type:"ADD_ALL_BRANDS",
            brands
        }
    },
    updatebrand: (brand)=>{
        return {
            type: "UPDATE_BRAND",
            brand
        }
    },
    removebrand: (brandId) => {
        return {
            type: "REMOVE_BRAND",
            brandId
        }
    },
    addNewBrand: (newBrand) => {
        return {
            type: "ADD_NEW_BRAND",
            newBrand
        }
    }
}


export default brandsActions; 