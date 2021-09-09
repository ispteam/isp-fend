import Feedback from "components/reusable/Feedback";
import Footer from "components/reusable/Footer";
import { signIn } from "next-auth/client";
import { Fragment, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import generalActions from "stores/actions/generalActions";
import {FiUser} from 'react-icons/fi';
import { validateAccountsInput } from "helper/functions";

const AuthForm = () => {
    const [enteryId, setEnteryId] = useState('');
    const [userType, setUserType] = useState('admin');
    const dispatch = useDispatch();


    const onChange = (e) => {
        setEnteryId(e.target.value);
    }

    const changeUserType = (userType) => {
        setUserType(userType);
    }


    const signInHandler = async (e) => {
        try{
            e.preventDefault();
            dispatch(generalActions.emptyState());
            dispatch(generalActions.sendRequest("Login.."));
            dispatch(generalActions.changeMood("profile"));
            const validateEnteryIdMessage = validateAccountsInput(enteryId, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true)
            if(validateEnteryIdMessage.length > 0){
                dispatch(generalActions.changeValidation(validateEnteryIdMessage));
            }
            if(validateEnteryIdMessage.length > 0){
                dispatch(generalActions.showValidationMessages());
                return
            }
            const response = await signIn('credentials', {
                redirect: false,
                enteryId: enteryId,
                [userType]:true,
            });
            if(response.error){
                throw new Error(response.error);
            }
            window.location.reload();
        }catch(err){
            dispatch(generalActions.changeValidation(err.message));
            dispatch(generalActions.showValidationMessages());
        }
    }

    return <Fragment>
        <Feedback />
        <div className="login-auth-container">
            <p className="title-auth-page">ADMIN/MODERATOR LOGIN</p>
            <div className="user-type-auth-inner-container">
                <div className={userType == "admin" ? "user-type-inner-container active" : "user-type-inner-container"} onClick={()=>changeUserType('admin')}>
                    <p>ADMIN</p>
                    <FiUser size={35}  className="user-icon" color={userType == "admin" ? '#ffd523' : 'black'}/>
                </div>
                <div className={userType == "moderator" ? "user-type-inner-container active" : "user-type-inner-container"} onClick={()=>changeUserType('moderator')}>
                    <p>MODERATOR</p>
                    <FiUser size={35} className="user-icon" color={userType == "moderator" ? '#ffd523' : 'black'}/>
                </div>
            </div>
            <form className='login-auth-form-container' onSubmit={signInHandler}>
                <input className="english-input" type="text" name="enteryId" value={enteryId} onChange={onChange} placeholder="Enter Your entery Id" minLength={9} maxLength={9}/>
                <button className="english">Login</button>
            </form>
        </div>
        <Footer>
            <p className="footer-auth-text">
                ADMIN/MODERATOR PAGE
            </p>
            <p className="footer-auth-text">All rights reserved &copy;</p>
        </Footer>
    </Fragment>
}


export default AuthForm;