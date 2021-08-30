import Link from 'next/link';
import { Fragment, useEffect, useState } from 'react';
import {useRouter} from 'next/router';
import {getSession } from 'next-auth/client';
import generalActions from 'stores/actions/generalActions';
import { useDispatch, useSelector } from 'react-redux';

const ListItem = ({arabic, list, idx, admin}) => {
    const router = useRouter();
    const [session, setSession] = useState();
    const dispatch = useDispatch();
    const generalReducer = useSelector(state=>state.generalReducer);
    // className={list.link == router.pathname ? "anchor-style-active" : "anchor-style"}
    // className={list.link == router.pathname ? "anchor-style-active-arabic" : "anchor-style-arabic"}
//     className={list.link == router.pathname ? "anchor-style-active" : "anchor-style"}
// className={list.link == router.pathname ? "anchor-style-active-arabic" : "anchor-style-arabic"}
// className={list.link == router.pathname ? "anchor-style-active" : "anchor-style"}
// className={list.link == router.pathname ? "anchor-style-active-arabic" : "anchor-style-arabic"}

    useEffect(()=>{
        const listItems = document.querySelectorAll(admin ? ".nav-link-container-admin" : ".nav-link-container");
        if(window.screen.width >= 768){
            if(admin){
                setTimeout(()=>{
                    for(let i=0; i < listItems.length; i++){
                        listItems[i].style.transition = "all 0.2s"
                        listItems[i].style.right = "-5.5rem";
                    }
                }, 700)
                window.addEventListener('scroll', ()=>{
                    if(window.scrollY > 0){
                        for(let i=0; i < listItems.length; i++){
                            listItems[i].style.transition = "all 0.2s"
                            listItems[i].style.right = "-5.5rem";
                        }
                    }
                })
            }else{
                setTimeout(()=>{
                    for(let i=0; i < listItems.length; i++){
                        listItems[i].style.transition = "all 0.2s"
                        listItems[i].style.right = "-4.9rem";
                    }
                }, 700)
                window.addEventListener('scroll', ()=>{
                    if(window.scrollY > 0){
                        for(let i=0; i < listItems.length; i++){
                            listItems[i].style.transition = "all 0.2s"
                            listItems[i].style.right = "-4.9rem";
                        }
                    }
                })
            }
        }else if(window.screen.width < 735){
            //-4.6rem
            if(admin){
                console.log(admin);
                setTimeout(()=>{
                    for(let i=0; i < listItems.length; i++){
                        listItems[i].style.transition = "all 0.2s"
                        listItems[i].style.right = "-7rem";
                    }
                }, 700);
            }else{
                setTimeout(()=>{
                    for(let i=0; i < listItems.length; i++){
                        listItems[i].style.transition = "all 0.2s"
                        listItems[i].style.right = "-3.6rem";
                    }
                }, 700)
                window.addEventListener('scroll', ()=>{
                    if(window.scrollY > 0){
                        for(let i=0; i < listItems.length; i++){
                            listItems[i].style.transition = "all 0.2s"
                            listItems[i].style.right = "-3.6rem";
                        }
                    }
                })
            }
            
        }
    },[]);

    useEffect( async ()=>{
        const session = await getSession();
        setSession(session);
    },[])

    const toggleShowDetails = (idx) => {
        const listItems = document.querySelectorAll(admin ? ".nav-link-container-admin"  : ".nav-link-container");
        listItems[idx].style.transition = "all 0.2s"
        listItems[idx].style.right = "0rem";
    }


    return <Fragment>
        {list.title == "My Info" || list.title == "معلوماتي" ?
        <li className={admin ? "nav-link-container-admin" : !arabic ? 'nav-link-container english' : 'nav-link-container' } style={{display: !session && 'none'}}>
                <Link href={list.link}>
                    <a>{list.title}</a>
                </Link>
                <div className={admin ? "icon-container-admin" : !arabic ? "icon-container-english" : "icon-container" } onClick={()=>toggleShowDetails(idx)}>
                    {list.icon}
                </div>
            </li> : 
            list.title == "Requests" || list.title == "طلباتي" ?
            <li className={admin ? "nav-link-container-admin" : !arabic ? 'nav-link-container english' : 'nav-link-container'}  style={{display: !session && 'none'}}>
                <Link href={list.link}>
                    <a>{list.title}</a>
                </Link>
                <div className={admin ? "icon-container-admin" : !arabic ? "icon-container-english" : "icon-container" } onClick={()=>toggleShowDetails(idx)}>
                    {list.icon}
                </div>
            </li>
            :
            <li className={admin ? "nav-link-container-admin" : !arabic ? 'nav-link-container english' : 'nav-link-container' }>
                {list.title == "Arabic" ? 
                <Link href={list.link + `/${router.pathname.slice(4)}`}>
                    <a>{list.title}</a>
                </Link>  
                : list.title == "انجليزي" ? 
                <Link href={list.link + `en/${router.pathname.slice(4)}`}>
                    <a>{list.title}</a>
                </Link> 
                : <Link href={list.link}>
                    <a>{list.title}</a>
                </Link> }
                <div className={admin ? "icon-container-admin" : !arabic ? "icon-container-english" : "icon-container" } onClick={()=>toggleShowDetails(idx)}>
                    {list.icon}
                </div>
            </li>
        }
    </Fragment>
} 


export default ListItem;