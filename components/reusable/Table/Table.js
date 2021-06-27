

const Table = ({headers, children, style, containerStyle}) => {
    return <div>

    <table className={style}>
        <tbody>
            <tr>
                {headers}
            </tr>
            {children}
        </tbody>
    </table>
    
    </div>
}

export default Table;