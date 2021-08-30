import MainNavbar from "../Navbar/MainNavbar";
import Footer from "./Footer";
import {BsChevronLeft } from "react-icons/bs";
import {useRouter} from 'next/router';
import { useSelector } from "react-redux";
import { useEffect } from "react";

const SharedNavLayout = ({navList, logoLink, children, footerInnerValue, client, supplier, arabic, disable, admin}) => {
    const generalReducer = useSelector((state)=>state.generalReducer);
    const router = useRouter();
    useEffect(()=>{
        const container = document.querySelector("#container");
        // const body = document.querySelector('body');
        if(generalReducer.showModalLogin){
            container.style.opacity = '0.09';
            container.style.overflow = 'hidden'
        }else{
            container.style.opacity = '1';
            container.style.overflow = 'auto';
        }
    }, [generalReducer.showModalLogin])
    return <div>
            <MainNavbar navList={navList} logoLink={logoLink} client={client} supplier={supplier} arabic={arabic} disable={disable} admin={admin}/>
        <div id="container">
            {children}
            <Footer>
                {footerInnerValue}
                {!arabic ? <p className="footer-text english">All Rights Reserved &copy;</p> : <p className="footer-text">&copy; جميع الحقوق محفوظة</p>}
            </Footer>
        </div>
    </div>
}

export default SharedNavLayout;