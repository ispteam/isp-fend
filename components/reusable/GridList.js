import Link from 'next/link';
const GridList = ({icon, title, style, children, link, cardContainerSyle, titleStyle}) => {
    return <div className={"grid-list-container-style " + cardContainerSyle + " " +  style}>
        <div className="grid-list-inner-container-style">
            <div className="grid-list-icon-title-container-style">
                <div className="p-6 w-full">{icon}</div>
            </div>
            <div className="text-center text-lg font-bold text-white font-Raleway">
            <Link href={link}>
                <a className="text-white hover:text-green-400 transition-all ease-linear duration-200">{title}</a>
            </Link>
            </div>
        </div>
        <hr className="w-4/5 m-auto"/>
        <div className={titleStyle}>
            {children}
        </div>
    </div>
}

export default GridList;