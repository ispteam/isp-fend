const initState = {
    brands: []
}


const brandsReducer = (state=initState, action) => {
    switch (action.type) {
        case "ADD_ALL_BRANDS":
            return{
                brands: state.brands.concat(action.brands)
            }
        case "ADD_NEW_BRAND":
            return{
                ...state,
                brands: state.brands.concat(action.newBrand)
            }
        case "UPDATE_BRAND":
            const brandsUpdateCopy = [...state.brands];
            const brandIndex = brandsUpdateCopy.findIndex(brand=> brand.brandId == action.brand.brandId);
            brandsUpdateCopy[brandIndex] = action.brand;
            return {
                ...state,
                brands: brandsUpdateCopy
            }
        case "REMOVE_BRAND":
            const brandsRemovedCopy = [...state.brands];
            const deletedIndex = brandsRemovedCopy.findIndex(brand=> brand.brandId == action.brandId);
            brandsRemovedCopy.splice(deletedIndex, 1);
            return {
                ...state,
                brands: brandsRemovedCopy
            }
        default:
            return state;
    }
}

export default brandsReducer;