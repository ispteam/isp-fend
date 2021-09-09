import { Fragment, useState } from "react";
import { useSelector } from "react-redux";
import { validateAccountsInput, validateAccountsInputArabic, sendEmail } from "helper/functions";

import { useDispatch } from "react-redux";
import generalActions from "stores/actions/generalActions";
import Feedback from "components/reusable/Feedback";
import Footer from "components/reusable/Footer";

const ChangePasswordForm = ({arabic, rememberToken}) => {

   const generalReducer = useSelector((state)=>state.generalReducer);
   const [password, setPassword] = useState('');
   const dispatch = useDispatch();
   const onChanegEmailHandler = (e) => {
       setPassword(e.target.value)
   }

    const SaveNewPaawordHandler = async () => {
        try{
            dispatch(generalActions.emptyState());
            dispatch(generalActions.sendRequest(!arabic ? "Sending.." : "..ارسال"));
            dispatch(generalActions.changeMood("profile"));
            let validatePasswordMessage = validateAccountsInput(password, false, false, false, false, false, false, true);
            if(arabic){
                validatePasswordMessage = validateAccountsInputArabic(password, false, false, false, false, false, false, true);
            }
            if(validatePasswordMessage.length > 0){
                dispatch(generalActions.changeValidation(validateEmailMessage));
                dispatch(generalActions.showValidationMessages());
                return;
            }

            const data = await fetch(`${generalReducer.ENDPOINT}/update-password`, {
                method:'PATCH',
                headers:{
                    'Content-Type':'application/json'
                },
                body: JSON.stringify({
                    password,
                    rememberToken
                })
            })
            const response = await data.json();
            if (response.statusCode !== 200) {
                let fullResponse = response.message;
                for(const keys in response){
                    if(keys=="validationMessage"){
                        for(const key in response[keys]){
                            fullResponse= response[keys][key];
                        }
                    }
                }
                const error = new Error(fullResponse);
                throw error;
            }
            if(!arabic){
                dispatch(generalActions.sendRequest(response.message));
            }else{
                dispatch(generalActions.sendRequest(response.messageInArabic));
            }
            setTimeout(()=>{
                if(!arabic){
                    window.location.href = "/"
                }else{
                    window.location.href = "/en"
                }
                dispatch(generalActions.emptyState());
          }, 1000)
        }catch(err){
            dispatch(generalActions.changeValidation(err.message));
            dispatch(generalActions.showValidationMessages());
        }
    }

    return <Fragment>
                <div className="forget-password-container" style={{marginBottom:'40rem'}}>
                <Feedback arabic={arabic} />
                <div className="form-add-brand-container send-email">
                <input className={!arabic ? "english-input" : ""} type="password" placeholder={!arabic?"Type new password.." : "...ادخل الرقم السري الجديد"} onChange={onChanegEmailHandler} />
                <button
                    className={!arabic ? "english" : ""}
                    onClick={SaveNewPaawordHandler}
                >
                    {!arabic ? "Reset password" : "اعادة تعيين كلمة السر"}
                </button>
            </div>
            </div>
            <Footer>
                <p className="footer-auth-text">
                    ISP
                </p>
                <p className="footer-auth-text">All rights reserved &copy;</p>
            </Footer>
    </Fragment>
}

export default ChangePasswordForm;