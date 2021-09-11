import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import generalActions from "../../stores/actions/generalActions";

const Feedback = ({arabic}) => {
    const generalReducer = useSelector((state)=>state.generalReducer);

    const dispatch = useDispatch();
    return <div className={
               generalReducer.showModalLogin && generalReducer.status.sending ? "feedback-container animate__bounceInDown show-feedback-login"
            :  generalReducer.showModalLogin && generalReducer.status.show ? "feedback-container animate__bounceInDown show-feedback-login"
            :  generalReducer.status.mood == "profile" && generalReducer.status.sending ? "feedback-container animate__bounceInDown show-feedback-profile"
            :  generalReducer.status.mood == "profile" && generalReducer.status.show ? "feedback-container animate__bounceInDown show-feedback-profile"
            :  generalReducer.status.mood == "addRequest" && generalReducer.status.sending ? "feedback-container animate__bounceInDown show-feedback-profile"
            :  generalReducer.status.mood == "addRequest" && generalReducer.status.show ? "feedback-container animate__bounceInDown show-feedback-profile"
            : !generalReducer.showModalLogin && generalReducer.status.show ? "feedback-container animate__bounceInDown show" 
            : !generalReducer.showModalLogin && generalReducer.status.sending ?  "feedback-container animate__bounceInDown show"
            :"feedback-container"}
            >
            {generalReducer.status.sending && <p className={!arabic ? "send-request english" : "send-request"}>{generalReducer.status.text}</p> }

            <ul className="validation-container">
                {generalReducer.status.show && generalReducer.validation.map((value, idx)=>(
                    <Fragment key={idx}>
                    <li className={!arabic ? "english" : 'arabic'} key={value}>{value}</li>
                    <hr className= "hr" />
                    </Fragment>
                ))}
            </ul>
            <button onClick={()=>dispatch(generalActions.emptyState())} className={!arabic ? "close-feedback-btn english" : "close-feedback-btn"}>{!arabic ? "Close" : "اغلق"}</button>
    </div>
}

export default Feedback