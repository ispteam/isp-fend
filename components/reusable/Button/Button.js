const Button = (props) => {
    if(props.cancel){
        return <div className="bg-red-500 text-white border-red-300 rounded-xl text-sm font-Raleway outline-none focus:outline-none hover:text-white hover:bg-red-700 transition-all duration-200">
                    <button className="p-2 outline-none focus:outline-none" {...props}>{props.text}</button>
            </div>
    }

    if(props.submit) {
        return <div className="bg-green-500 text-white border-green-300 rounded-xl text-sm font-Raleway outline-none focus:outline-none hover:text-white hover:bg-green-700 transition-all duration-200">
                    <button className="p-2 outline-none focus:outline-none" {...props}>{props.text}</button>
            </div>
    }
}

export default Button;