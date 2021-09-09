import {AiOutlineInfoCircle, AiOutlineUser} from 'react-icons/ai';
import{IoCheckmarkDone, IoPricetagsSharp} from 'react-icons/io5';
import {AiOutlineUsergroupAdd, AiOutlineForm} from 'react-icons/ai';
import {RiAdminLine, RiBillLine} from 'react-icons/ri';
import {FaUserShield} from 'react-icons/fa';
const initState = {
    adminNav: [
        {
            title: "My Info",
            link: "/en/admin/profile",
            icon: <AiOutlineInfoCircle color={'white'} size={25} className="icon" />
        },
        {
            title: "Clients",
            link: "/en/admin/clients",
            icon: <AiOutlineUser color={'white'} size={25} className="icon" />
        },
        {
            title: "Suppliers",
            link: "/en/admin/suppliers",
            icon: <AiOutlineUsergroupAdd color={'white'} size={25} className="icon" />
        },
        {
            title: "Moderators",
            link: "/en/admin/moderators",
            icon: <AiOutlineUsergroupAdd color={'white'} size={25} className="icon" />
        },
        {
            title: "Brands",
            link: "/en/admin/brands",
            icon: <IoPricetagsSharp color={'white'} size={25} className="icon" />
        },
        {
            title: "Requests",
            link: "/en/admin/requests",
            icon: <AiOutlineForm color={'white'} size={25} className="icon" />
        },
        {
            title: "Logs",
            link: "/en/admin/logs",
            icon: <RiBillLine color={'white'} size={25} className="icon" />
        },
    
    ],
    moderatorNav: [
        {
            title: "My Info",
            link: "/en/moderator/profile",
            icon: <AiOutlineInfoCircle color={'white'} size={25} className="icon" />
        },
        {
            title: "Clients",
            link: "/en/moderator/clients",
            icon: <AiOutlineUser color={'white'} size={25} className="icon" />
        },
        {
            title: "Suppliers",
            link: "/en/moderator/suppliers",
            icon: <AiOutlineUsergroupAdd color={'white'} size={25} className="icon" />
        },
        {
            title: "Brands",
            link: "/en/moderator/brands",
            icon: <IoPricetagsSharp color={'white'} size={25} className="icon" />
        },
        {
            title: "Requests",
            link: "/en/moderator/requests",
            icon: <AiOutlineForm color={'white'} size={25} className="icon" />
        },    
    
    ],
    clientNav: [
        {
            title: "Cars",
            link: "/en/requests/cars",
            icon: <img src={"/imgs/cars.svg"} width="25" height="25" className="icon" />
        },
        {
            title: "Vehilces",
            link: "/en/requests/vehicles",
            icon: <img src={"/imgs/vehicles.png"} width="25" height="25" className="icon" />
        },    
        {
            title: "Requests",
            link: "/en/requests/my-requests",
            icon: <IoCheckmarkDone color={'white'} size={25} className="icon" />
        },    
        {
            title: "My Info",
            link: "/en/profile",
            icon: <AiOutlineInfoCircle color={'white'} size={25} className="icon" />
        },
        {
            title: "Arabic",
            link: "/",
            icon: <img src={"/imgs/arabic.svg"} width="25" height="25" className="icon" />
        },  
    ],
    clientNavArabic: [
        {
            title: "سيارات",
            link: "/requests/cars",
            icon: <img src={"/imgs/cars.svg"} width="25" height="25" className="icon" />
        },
        {
            title: "مركبات",
            link: "/requests/vehicles",
            icon: <img src={"/imgs/vehicles.png"} width="25" height="25" className="icon" />
        },    
        {
            title: "طلباتي",
            link: "/requests/my-requests",
            icon: <IoCheckmarkDone color={'white'} size={25} className="icon" />
        },    
        {
            title: "معلوماتي",
            link: "/profile",
            icon: <AiOutlineInfoCircle color={'white'} size={25} className="icon" />
        },
        {
            title: "انجليزي",
            link: "/",
            icon: <img src={"/imgs/en.svg"} width="25" height="25" className="icon" />
        },    
    ],

    supplierNav: [
        {
            title: "My Info",
            link: "/en/supplier/profile",
            icon: <AiOutlineInfoCircle color={'white'} size={25} className="icon" />
        },   
        {
            title: "Requests",
            link: "/en/supplier/my-requests",
            icon: <IoCheckmarkDone color={'white'} size={25} className="icon" />
        },    
        {
            title: "Arabic",
            link: "/",
            icon: <img src={"/imgs/arabic.svg"} width="25" height="25" className="icon" />
        },  
    ],

    supplierArabicNav: [
        {
            title: "معلوماتي",
            link: "/supplier/profile",
            icon: <AiOutlineInfoCircle color={'white'} size={25} className="icon" />
        }, 
        {
            title: "طلباتي",
            link: "/supplier/my-requests",
            icon: <IoCheckmarkDone color={'white'} size={25} className="icon" />
        },    
        {
            title: "انجليزي",
            link: "/",
            icon: <img src={"/imgs/en.svg"} width="25" height="25" className="icon" />
        },    
    ],

    BAR_COLORS: [
        "rgba(255, 99, 112, 0.3)",
        "rgba(255, 159, 64, 0.3)",
        "rgba(255, 205, 86, 0.3)",
        "rgba(75, 192, 192, 0.3)",
        "rgba(54, 162, 235, 0.3)",
        "rgba(153, 102, 255, 0.3)",
        "rgba(201, 203, 207, 0.3)",
    ],
    // ENDPOINT: "http://127.0.0.1:8000/api",
    ENDPOINT: "https://isp-bend.herokuapp.com/api",
    showModalLogin: false,
    validation: [],
    status: {
        sending: false,
        succeed: false,
        show:false,
        text:'',
        mood:''
    },
    toggleModal: false,
    toggleNavMenu: false,
    toggleModalDetails: false
}


const generalReducer = (state=initState, action) => {
    switch (action.type) {
        case "TOGGLE_MODAL_LOGIN":
            return{
                ...state,
                showModalLogin: !state.showModalLogin
            }
        case 'EMPTY_STATE':
            return {
                ...state,
                validation: [],
                status: {
                    sending: false,
                    succeed: false,
                    show:false,
                    mood:''
                }
            }
        case "CHANGE_VALIDATION":
            if(typeof(action.value) != "string"){
                return{
                    ...state,
                    validation: action.value
                }
            }
            return {
                ...state,
                validation: state.validation.concat(action.value)
            }
        case 'SHOW_VALIDATION':
            return{
                ...state,
                status:{
                    ...state.status,
                    sending: false,
                    show: true
                }
            }
        case 'SEND_REQUEST':
            return{
                ...state,
                status:{
                    ...state.status,
                    sending: true,
                    text: action.value
                }
            }
        case 'CHANGE_MOOD':
            return {
                ...state,
                status:{
                    ...state.status,
                    mood: action.value
                }
            }
        case 'TOGGLE_MODAL':
            return{
                ...state,
                toggleModal: !state.toggleModal
            }
        case 'TOGGLE_NAV_MENU':
            return{
                ...state,
                toggleNavMenu: !state.toggleNavMenu
            }
        case 'TOGGLE_MODAL_DETAILS':
            return {
                ...state,
                toggleModalDetails: !state.toggleModalDetails
            }
        case 'CLOSE_NAV_MENU':
            return{
                ...state,
                toggleNavMenu: false
            }
        default:
            return state;
    }
}


export default generalReducer;
