const generalActions = {
    toggleLoginModal: ()=> {
        return{
            type: 'TOGGLE_MODAL_LOGIN'
        }
    },
    emptyState: ()=> {
        return {
            type: 'EMPTY_STATE'
        }
    },
    changeValidation: (value)=> {
        return {
            type:'CHANGE_VALIDATION',
            value
        }
    },
    showValidationMessages: ()=> {
        return {
            type:'SHOW_VALIDATION',
        }
    },
    sendRequest: (value)=> {
        return {
            type: 'SEND_REQUEST',
            value
        }
    },
    toggleModal: ()=> {
        return {
            type: 'TOGGLE_MODAL'
        }
    },
    toggleNavMenu: () => {
        return {
            type: 'TOGGLE_NAV_MENU'
        }
    },
    toggleModalDetails: () => {
        return {
            type: 'TOGGLE_MODAL_DETAILS'
        }
    },
    closeNavMenu: () => {
        return {
            type: 'CLOSE_NAV_MENU'
        }
    },
    changeMood: (value)=> {
        return {
            type: 'CHANGE_MOOD',
            value
        }
    }
}

export default generalActions;