const Button = (props) => {
    return <button {...props} className="show-table-btn english" style={{fontSize:'11px'}}>{props.children}</button>
}

export default Button;