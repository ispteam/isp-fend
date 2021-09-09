import ListItem from "./ListItem";
import {RiMenu5Line} from 'react-icons/ri';
import {AiOutlineArrowUp, AiOutlineClose} from 'react-icons/ai';
import {HiMenuAlt3} from 'react-icons/hi';
import Link from 'next/link';
import { Fragment, useEffect, useRef, useState } from "react";
import {useSession, signOut, getSession} from 'next-auth/client';
import Cookies from 'js-cookie';
import { useDispatch, useSelector } from "react-redux";
import {useRouter} from 'next/router';
import Login from "../../components/reusable/Login";
import generalActions from "../../stores/actions/generalActions";



const MainNavbar = ({navList, logoLink, client, supplier, arabic, admin, session}) => {
    const dispatch= useDispatch();
    //Just to open and close the menu [! ONLY FOR SMALL SCREEN !]
    const [show, setShow] = useState(false);
    //To specify the screen of the device whether a mobile or not [INITIALLY IS TRUE WHIC MEANS IT IS A DEVICE]
    const [isMobile, setIsMobile]= useState(true);
    //To check if there is a user or not 


    const generalReducer = useSelector((state)=>state.generalReducer);

    const REMAIINIG_TIME = useRef(3600000);



    // To log the user out automatically after 1 hour
    useEffect(()=>{
        if(!localStorage.getItem("remainingTime")){
            localStorage.setItem("remainingTime", REMAIINIG_TIME );
        }
        if(session){
        const timer = setInterval(()=>{
            REMAIINIG_TIME.current =  localStorage.getItem("remainingTime") - 60000;
            localStorage.setItem("remainingTime", REMAIINIG_TIME.current);
            if(REMAIINIG_TIME.current < 1000){
                clearInterval(timer);
                signOutHandler();
            }
        }, 60000)
        }

    }, [session])


    const signOutHandler = async () => {
        await fetch(`${generalReducer.ENDPOINT}/logout`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                uid: session.user.name
            })
        });
        localStorage.removeItem("remainingTime");
        Cookies.remove("pref");
        Cookies.remove("carsPref");
        signOut();
    }


    const navigateToSignIn = () => {
        dispatch(generalActions.toggleLoginModal());
    }

    // const goUp = () =>{
    //     window.scrollTo({
    //         top:0,
    //         behavior:'smooth',
    //     })
    // }

    const toggleNavList = () => {
        setShow(!show);
        const outerContainer = document.querySelector(".nav-outer-container");
        const itemsContainer = document.querySelector("#nav-container-mobile");
        const items = document.querySelector(".ul-nav-container");
        if(items.style.display == "grid"){
            items.style.display = "none";
            // items.classList.remove("animate__bounceInDown")
            outerContainer.style.height = "7rem";
        }else{
            outerContainer.style.height = "15.5rem";
            items.style.display = "grid";
            items.classList.add("animate__bounceInDown")
            itemsContainer.appendChild(items);
        }
    }

    return <div className="nav-outer-container">
            {/* <Login arabic={arabic} disable={disable}/> */}
            <nav className="nav-container">
                <div >
                    <Link href={logoLink}>
                        <a className={!arabic ? "logo-link english" : "logo-link"} style={{fontWeight: !arabic && 'bold'}} >{!arabic ?  'ISP' : 'اي اس بي'}</a>
                    </Link>
                </div>
                {session ?
                    <div className="auth-btn-container">
                        <button className={!arabic ? 'english' : ''} onClick={signOutHandler}>{!arabic ? "Logout" : "تسجيل خروج"}</button>
                    </div>:
                    <div className="auth-btn-container">
                        <button className={!arabic ? 'english' : ''}  onClick={navigateToSignIn}>{!arabic ? "Login | Register" : "دخول | تسجيل"}</button>
                    </div>
                }
                    
                {/* <AiOutlineArrowUp size={27} className="up-icon" color={"black"} onClick={goUp}/> */}
                <AiOutlineClose style={{display: show ? "block" : "none"}} size={28} onClick={toggleNavList} className="menu-icon" color={"#ebebeb"} /> 
               <HiMenuAlt3 size={28} style={{display: show ? "none" : "block"}} onClick={toggleNavList} className="menu-icon" color={"#ebebeb"} />
                <ul className="ul-nav-container">
                    {navList.map((list, idx)=>(
                        <ListItem key={list.link} list={list} idx={idx} arabic={arabic} admin={admin} session={session} />
                    ))}
                </ul>
            </nav>
            <div id="nav-container-mobile"></div>
        </div>
}

export default MainNavbar;