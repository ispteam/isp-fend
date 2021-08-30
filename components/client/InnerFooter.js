import Link from "next/link"
import { Fragment } from "react"

const InnerFooter = ({arabic}) => {
    return <div>
        <ul className="inner-footer-container">
        {!arabic ? 
        <Fragment>
        <li>
        <Link href="/en/contact">
            <a className="english-footer">Contact</a>
        </Link>
        </li>
        <li>
        <Link href="/en/about">
            <a className="english-footer">About</a> 
        </Link>
        </li>
        <li>
        <Link href="/en/profile">
            <a className="english-footer">Profile</a>
        </Link>
        </li>
        <li>
        <Link href="/en/auth/login">
            <a className="english-footer">Register</a>
        </Link>
        </li>
        <li>
        <Link href="/en/auth/login">
            <a className="english-footer">Login</a>
        </Link>
        </li>
        <li>
        <Link href="/en/requests/cars">
            <a className="english-footer">For Cars</a>
        </Link>
        </li>
        <li>
        <Link href="/en/requests/vehicles">
            <a className="english-footer">For Big Vehicles</a>
        </Link></li>
        </Fragment>
        :
        <Fragment>
        <li>
        <Link href="/auth/login">
            <a>تسجيل</a>
        </Link>
        </li>
        <li><Link href="/auth/login">
            <a>تسجيل دخول</a>
        </Link></li>
        <li>
        <Link href="/ar">
            <a>الصفحة الشخصية</a>
        </Link>
        </li>
        <li>
        <Link href="/contact">
            <a>للتواصل</a>
        </Link></li>
        <li><Link href="/about">
            <a>ISP عن</a>
        </Link></li>
        <li>للسيارات</li>
        <li>للمركبات الكبيرة</li>
        </Fragment>
        }
    </ul>
    <div className="contanct-container">
        <a className="contact-email">isp-spare@isp.com</a>
        <a className="contact-phone">+966533003199</a>
    </div>
</div>
}

export default InnerFooter