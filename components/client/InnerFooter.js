import Link from "next/link"
import { Fragment } from "react"

const InnerFooter = ({arabic}) => {
    return <div className="inner-footer-container">
        <ul className="footer-nav-container">
            {!arabic ? 
            <Fragment>
            <li>
            <Link href="/en/contact">
                <a className="english">Contact</a>
            </Link>
            </li>
            <li>
            <Link href="/en/about">
                <a className="english">About</a> 
            </Link>
            </li>
            <li>
            <Link href="/en/profile">
                <a className="english">Profile</a>
            </Link>
            </li>
            <li>
            <Link href="/en/auth/login">
                <a className="english">Register</a>
            </Link>
            </li>
            <li>
            <Link href="/en/auth/login">
                <a className="english">Login</a>
            </Link>
            </li>
            <li>
            <Link href="/en/requests/cars">
                <a className="english">For Cars</a>
            </Link>
            </li>
            <li>
            <Link href="/en/requests/vehicles">
                <a className="english">For heavy vehicles</a>
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
            <li><Link href="/about">
                <a>سيارات</a>
            </Link></li>
            <li><Link href="/about">
                <a>مركبات ثقيلة</a>
            </Link></li>
            </Fragment>
            }
        </ul>
        <div className="contact-footer-container">
            <a>isp-spare@isp.com</a>
            <a>+966533003199</a>
        </div>
</div>
}

export default InnerFooter