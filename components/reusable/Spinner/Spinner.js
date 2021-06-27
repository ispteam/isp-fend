import classes from './spinner-style.module.css';
const Spinner = () => {
    return <div className={classes.loaderContainer}><div className={classes.loader}><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div></div>
}

export default Spinner;