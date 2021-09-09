import { Fragment, useState } from "react";
import { useSelector } from "react-redux";
import { validateAccountsInput, validateAccountsInputArabic, sendEmail } from "../../helper/functions";
import {v4 as uuid4} from 'uuid';
import Link from 'next/link';
import Feedback from "../reusable/Feedback";
import { useDispatch } from "react-redux";
import generalActions from "stores/actions/generalActions";
import Footer from "../reusable/Footer";

const ForgetPasswordForm = ({arabic, client, supplier, moderator, admin}) => {

   const generalReducer = useSelector((state)=>state.generalReducer);
   const [email, setEmail] = useState('');
   const dispatch = useDispatch();


   const onChanegEmailHandler = (e) => {
       setEmail(e.target.value)
   }

    const sendEmailHandler = async () => {
        try{
            dispatch(generalActions.emptyState());
            dispatch(generalActions.sendRequest(!arabic ? "Sending.." : "..ارسال"));
            dispatch(generalActions.changeMood("profile"));
            let validateEmailMessage = validateAccountsInput(email, false, false, true);
            if(arabic){
                validateEmailMessage = validateAccountsInputArabic(email, false, false, true);
            }
            if(validateEmailMessage.length > 0){
                dispatch(generalActions.changeValidation(validateEmailMessage));
                dispatch(generalActions.showValidationMessages());
                return;
            }
    
            const rememberToken = uuid4() + new Date().toISOString();
            const data = await fetch(`${generalReducer.ENDPOINT}/store-remember-token`, {
                method:'PATCH',
                headers:{
                    'Content-Type':'application/json'
                },
                body: JSON.stringify({
                    email,
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
                await sendEmail(email, "password", "all", false, rememberToken);
                dispatch(generalActions.sendRequest("Email has been sent!"));
            }else{
                await sendEmail(email, "password", "all", true, rememberToken);
                dispatch(generalActions.sendRequest("تم ارسال البريد الالكتروني"));
            }
            setTimeout(()=>{
                dispatch(generalActions.emptyState());
          }, 1000)
        }catch(err){
            dispatch(generalActions.changeValidation(err.message));
            dispatch(generalActions.showValidationMessages());
        }
    }

    return <Fragment>
            <div className="forget-password-container">
            <Feedback arabic={arabic} />
            <div className="to-website-link">
                <Link href={
                    !arabic && client ? "/en" : arabic && client ? "/ar" : !arabic && supplier? "/en/supplier" : arabic && supplier ? "/ar/supplier" : moderator? "/en/moderator" : admin? "/en/admin": null
                }>
                    {!arabic ? <a>To the website</a> : <a>الى الموقع</a>}
                </Link>
            </div>
            <div className="form-add-brand-container send-email">
            <input className={!arabic ? "english-input" : ""} type="email" placeholder={!arabic?"Type your email.." : "...ادخل البريد الالكتروني"} onChange={onChanegEmailHandler} />
            <button
                className={!arabic ? "english" : ""}
                onClick={sendEmailHandler}
            >
                {!arabic ? "Send re-password link" : "ارسل رابط اعادة تعيين كلمة المرور"}
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

export default ForgetPasswordForm;