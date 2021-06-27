import ListItem from "./ListItem";
import classes from './listItem.module.css';
import {RiMenu5Line} from 'react-icons/ri';
import Link from 'next/link';
import { useEffect, useState } from "react";
import {useSession, signOut} from 'next-auth/client';
import Cookies from 'js-cookie';
import { useSelector } from "react-redux";
import {useRouter} from 'next/router';


const MainNavbar = ({navList, logoLink}) => {

    //Just to open and close the menu [! ONLY FOR SMALL SCREEN !]
    const [show, setShow] = useState(false);
    //To specify the screen of the device whether a mobile or not [INITIALLY IS TRUE WHIC MEANS IT IS A DEVICE]
    const [isMobile, setIsMobile]= useState(true);
    //To check if there is a user or not 
    const [session, loading] = useSession();

    const router = useRouter();

    const generalReducer = useSelector((state)=>state.generalReducer);

    let REMAIINIG_TIME = 3600000;
    //To Check the size of the screen
    useEffect(()=>{
        //The required screen size to detirmine the screen is big.
        const media = window.matchMedia('(min-width:700px)');

        /** 
         * Check whether the screen matches the media screen condition or not
         * If matched, then we set the isMobile condition to false
        */
        if(media.matches){
            setIsMobile(false);
        }
    },[])

    //To check if the user enters the page after more than one hour after refresh the page
    useEffect(()=>{
        if(session){
            const hourTime = new Date().getTime();
            const sessionTime = new Date(session.expires).getTime() + 3600000;
            if(hourTime > sessionTime){
                signOutHandler();
            }
        }
    },[session]);


    //To log the user out automatically after 1 hour
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

    //To change the status of show from true to false and vice versa
    const toggleDrawer = () => {
        setShow(!show);
    }

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
        signOut();
    }




    return <div className={isMobile ? "mobile-nav-container" : "big-device-nav-container " + classes.navbar }>
           <div className={isMobile ? "mobile-position-nav" : "big-device-position-nav"}>
            <nav>
                <div className="md:mt-2">
                    <Link href={logoLink}>
                        <a className="logo-text-style">ISP</a>
                    </Link>
                </div>
                <ul className={!show && !isMobile? "big-device-nav" : show && isMobile ? "mobile-nav-ul" : !show && "hidden"}>
                    {navList.map((list)=>(
                        <ListItem key={list.link} list={list}/>
                    ))}
                    {session && !loading &&
                    <li className="mt-8 md:mb-8">
                        <button className="btn-logout-style" onClick={signOutHandler}>Logout</button>
                    </li>
                    }
                </ul>
            </nav>
            <RiMenu5Line size={30} color="#34d399" className="block md:hidden" onClick={toggleDrawer}/>
          </div>
    </div>
}

export default MainNavbar;