import classes from '../reusable-style.module.css';
const Input = (props) => {
    return <input {...props} className={classes.inputStyle + " p-2 text-gray-900 focus:outline-none outline-none rounded-md" }/>
}


export default Input;