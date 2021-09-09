import MainNavbar from "../navbar/MainNavbar";
import Footer from "./Footer";
import {BsChevronLeft } from "react-icons/bs";
import {useRouter} from 'next/router';
import { useSelector } from "react-redux";
import { Fragment, useEffect } from "react";
import Feedback from "./Feedback";
import Login from "./Login";

const SharedNavLayout = ({navList, logoLink, children, footerInnerValue, client, supplier, arabic, disable, admin, session}) => {
    const generalReducer = useSelector((state)=>state.generalReducer);
    const router = useRouter();

    useEffect(()=>{
        const bodyContent = document.querySelector("#container");
        if(generalReducer.status.show || generalReducer.status.sending){
            bodyContent.style.opacity = "0.2";
        }else if(generalReducer.showModalLogin){
            bodyContent.style.opacity = "0.2";
        }else{
            bodyContent.style.opacity = "1";
        }
    }, [generalReducer.status.show, generalReducer.status.sending, generalReducer.showModalLogin])
    return <Fragment>
            <MainNavbar session={session} navList={navList} logoLink={logoLink} client={client} supplier={supplier} arabic={arabic} disable={disable} admin={admin}/>
            <Feedback arabic={arabic} />
            <Login arabic={arabic}/>
        <div id="container">
            {children}
            <Footer>
                {footerInnerValue}
                {!arabic ? <p className="footer-inner-text english">All Rights Reserved &copy;</p> : <p className="footer-inner-text">&copy; جميع الحقوق محفوظة</p>}
            </Footer>
        </div>
    </Fragment>
}

export default SharedNavLayout;