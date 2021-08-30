import { Fragment } from "react";
import { useSelector } from "react-redux";

const Feedback = ({arabic}) => {
    const generalReducer = useSelector((state)=>state.generalReducer);
    return <Fragment>
            {generalReducer.status.sending && <p className={!arabic ? "send-request english" : "send-request"}>{generalReducer.status.text}</p> }

            <ul className="validation-container">
                {generalReducer.status.show && generalReducer.validation.map(value=>(
                    <li className={!arabic ? "english" : 'arabic'} key={value}>{value}</li>
                ))}
            </ul>
    </Fragment>
}

export default Feedback