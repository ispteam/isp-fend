import {Input} from 'semantic-ui-react';
import classes from '../reusable-style.module.css';
const SearchInput =(props)=>{
    const styles = [classes.inputStyle, classes.searchInput]
    return <Input icon={props.icon} {...props} type="text" className={styles.join(' ') + " mb-7 ml-10 w-full rounded-md md:ml-0"}/>
}


export default SearchInput