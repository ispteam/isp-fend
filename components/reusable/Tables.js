const Table = ({headers, children, details}) => {
    return <table className={!details ? "table-container" : "table-details-container" }>
        <tbody>
            <tr>
                {headers}
            </tr>
            {children}
        </tbody>
    </table>
}

export default Table;