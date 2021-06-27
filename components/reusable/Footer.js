import classes from './reusable-style.module.css';

const Footer = ({children}) => {
    return <footer className={"w-full bg-gray-900 font-Raleway text-center text-green-400 text-xl p-10 " + classes.footer}>
        {children}
    </footer>
}


export default Footer;