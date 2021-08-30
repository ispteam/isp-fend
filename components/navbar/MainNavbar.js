import ListItem from "./ListItem";
import {RiMenu5Line} from 'react-icons/ri';
import {AiOutlineArrowUp} from 'react-icons/ai';
import Link from 'next/link';
import { Fragment, useEffect, useState } from "react";
import {useSession, signOut, getSession} from 'next-auth/client';
import Cookies from 'js-cookie';
import { useDispatch, useSelector } from "react-redux";
import {useRouter} from 'next/router';
import Login from "components/reusable/Login";
import generalActions from "stores/actions/generalActions";



const MainNavbar = ({navList, logoLink, client, supplier, arabic, disable, admin}) => {
    const dispatch= useDispatch();
    //Just to open and close the menu [! ONLY FOR SMALL SCREEN !]
    const [show, setShow] = useState(false);
    //To specify the screen of the device whether a mobile or not [INITIALLY IS TRUE WHIC MEANS IT IS A DEVICE]
    const [isMobile, setIsMobile]= useState(true);
    //To check if there is a user or not 
    const [session, setSession] = useState();


    const generalReducer = useSelector((state)=>state.generalReducer);

    let REMAIINIG_TIME = 3600000;

    useEffect(()=>{
        const iconUp = document.querySelector(".up-icon");
        addEventListener('scroll', ()=>{
            if(window.scrollY >= 70){
                iconUp.style.display = "block"
            }else if(window.screenY < 70){
                iconUp.style.display = "none";
            }
        })
    }, []);

    useEffect(async ()=>{
        const session = await getSession();
        setSession(session);
    }, []);


    //To check if the user enters the page after more than one hour after refresh the page
    // useEffect(()=>{
    //     if(session){
    //         const hourTime = new Date().getTime() + 3600000;
    //         const sessionTime = new Date(session.expires).getTime();
    //         if(hourTime > sessionTime){
    //             signOutHandler();
    //         }
    //     }
    // },[session]);


    // To log the user out automatically after 1 hour
    useEffect(()=>{
        if(!localStorage.getItem("remainingTime")){
            localStorage.setItem("remainingTime", REMAIINIG_TIME );
        }
        if(session){
        const timer = setInterval(()=>{
            REMAIINIG_TIME =  localStorage.getItem("remainingTime") - 60000;
            localStorage.setItem("remainingTime", REMAIINIG_TIME);
            if(REMAIINIG_TIME < 1000){
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

    const goUp = () =>{
        window.scrollTo({
            top:0,
            behavior:'smooth',
        })
    }

    const toggleNavList = () => {
        const listItems = document.querySelectorAll('.nav-link-container-admin');
        const ulContainer = document.querySelector('.nav-ul-container-admin');
        if(!generalReducer.toggleNavMenu){
            for(let i=0; i < listItems.length; i++){
                listItems[i].style.transition = "all 0.2s"
                listItems[i].style.right = "0.5rem";
            }
            ulContainer.style.right = "0";
            dispatch(generalActions.toggleNavMenu());
        }else{
            for(let i=0; i < listItems.length; i++){
                listItems[i].style.transition = "all 0.2s"
                listItems[i].style.right = "-7rem";
            }
            ulContainer.style.right = "-20rem";
            dispatch(generalActions.toggleNavMenu());
        }
    }

    return <Fragment>
            <Login arabic={arabic} disable={disable}/>
            <nav className="nav-container">
                <div style={{margin:"auto"}}>
                    <Link href={logoLink}>
                        <a className="nav-links">ISP</a>
                    </Link>
                </div>
                {session ?
                    <div className='auth-btn-container'>
                        <button className={!arabic ? "btn-logout-style english" :  "btn-logout-style"} onClick={signOutHandler}>{!arabic ? "Logout" : "تسجيل خروج"}</button>
                        {admin && window.screen.width < 735 && <button onClick={()=>toggleNavList()} className="toggle-nav-list-btn english">{generalReducer.toggleNavMenu ? 'Close Menu' : 'Show Menu'}</button> }
                    </div>:
                    <div className='auth-btn-container'>
                        <button disabled={disable ? true : false} className={!arabic ? "btn-login-style english" :  "btn-login-style"} onClick={navigateToSignIn}>{!arabic ? "Login | Register" : "دخول | تسجيل"}</button>
                    </div>
                    }
                <AiOutlineArrowUp size={27} className="up-icon" color={"black"} onClick={goUp}/>
                <ul className={!admin ? "nav-ul-container" : "nav-ul-container-admin"}>
                    {navList.map((list, idx)=>(
                        <ListItem key={list.link} list={list} idx={idx} arabic={arabic} admin={admin}/>
                    ))}
                </ul>
            </nav>
        </Fragment>
}

export default MainNavbar;