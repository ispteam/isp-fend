import Link from 'next/link';
const GridData = ({icon, title, children, link}) => {
    return <div className="grid-data-container">
        <div className="grid-data-icon-title-container">
            <div className="grid-data-icon">
                <div>{icon}</div>
            </div>
            <div className="grid-title-container">
                <Link href={link}>
                    <a className="grid-data-title">{title}</a>
                </Link>
            </div>
        </div>
        <hr/>
        <div className="children-grid-data-style">
            {children}
        </div>
    </div>
}

export default GridData;