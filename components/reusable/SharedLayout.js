import MainNavbar from "../Navbar/MainNavbar";
import Footer from "./Footer";
import classes from './reusable-style.module.css';
import {BsChevronLeft } from "react-icons/bs";
import {useRouter, userRouter} from 'next/router';

const SharedNavLayout = ({navList, logoLink, children, footerInnerValue}) => {
    const router = useRouter();
    return <div>
    <div className="flex flex-col md:grid grid-cols-3">
        <div className="md:col-span-1">
            <MainNavbar navList={navList} logoLink={logoLink}/>
        </div>
        <div className="mt-52 md:m-0 md:col-span-2">
            {/** Will appear only in mobiles */}
            <div className={ router.pathname == logoLink ? "hidden" : classes.btnBack}>
                <BsChevronLeft size={40} color={"#1f2937"} onClick={()=>router.back()}/>
            </div>
            {children}
            <Footer>
                {footerInnerValue}
                <p>All Rights Reserved &copy;</p>
            </Footer>
        </div>
    </div>
</div>
}

export default SharedNavLayout;