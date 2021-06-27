import { useState } from "react";
import {signIn} from 'next-auth/client';
import { Card, Modal } from 'semantic-ui-react'
import classes from './login-form-style.module.css';
import {AiOutlineUser, AiOutlineLock, AiOutlineLogin} from 'react-icons/ai';
import Link from "next/link";
import { validateAccountsInput } from "../../../helper/functions";

const LoginForm = ({userType}) => {
    const [loginInfo, setLoginInfo] = useState({
        email:'',
        password: ''
    });

    const [status, setStatus] = useState({
        sending: false,
        succeed:false,
        manage:null,
        text: "",
        show: false,
      });

    const [validation, setValidation] = useState({
        values: [],
    });

    const changeHandler = (e) => {
        setLoginInfo(prevState=>({
            ...prevState,
            [e.target.name]: e.target.value
        }));
    }

    const changeValidationState = (value) => {
        if(typeof(value) != "string"){
            setValidation((prevState) => ({
                ...prevState,
                  values: value
              }));
        }
        setValidation((prevState) => ({
          ...prevState,
            values: prevState.values.concat(value)
        }));
    };

    const emptyState = () => {
        setValidation({
            values: [],
        });
        setStatus(prevState=>({
            ...prevState,
            sending: false,
            succeed:false,
            text:"",
            show: false
        }));
    };

    const submitHandler = async (e) => {
        try{
            e.preventDefault();
            emptyState();
            setStatus(prevState=>({
                ...prevState,
                sending:true,
                text: "sending..."
            }))
            const validateEmailMessage = validateAccountsInput(loginInfo.email, false, false, true, false, false, false);
            const validatePasswordMessage = validateAccountsInput(loginInfo.password,false,false,false,false,false, false, true);
            if (validateEmailMessage.length > 0) {
                changeValidationState(validateEmailMessage);
            }
            if (validatePasswordMessage.length > 0) {
                changeValidationState(validatePasswordMessage);
            }
            if (
                validateEmailMessage.length > 0||
                validatePasswordMessage.length > 0
                ) {
                setStatus(prevState=>({
                    ...prevState,
                    sending: false,
                    text:"",
                    show: true
                }));
                return;
            }
            const response = await signIn('credentials', {
                redirect: false,
                email: loginInfo.email,
                password: loginInfo.password,
                [userType]:true,
            });
            if(response.error){
                throw new Error(response.error);
            }
            setTimeout(()=>{
                emptyState();
          }, 3000)
            window.location.reload();

        }catch(err){
            changeValidationState(err.message)
            setStatus(prevState=>({
                ...prevState,
                sending:false,
                text:"",
                show: true,
            }));
        }
    }

    return  <div className={"bg-gradient-to-bl from-gray-400 to-green-600 " + classes.LoginFormContainer}>
        <Modal
        size={'tiny'}
        open= {status.show}
        onClose={() => setStatus(prevState=>({...prevState, show:false}))}>
            <Modal.Header>Information!</Modal.Header>
            <Modal.Content>
                <ol>
                    { validation.values.map(value=>(
                        <li key={value} className="text-red-600 p-4 text-xl md:text-lg">{value}</li>
                    ))
                    }
            </ol>
            </Modal.Content>
        </Modal>
    <Card className={classes.cardContainer}>
    <Card.Content className={classes.cardContent}>
      <Card.Header textAlign="center" className={classes.cardHeader}>Login</Card.Header>
        <form className={classes.cardForm} onSubmit={submitHandler}>
            <div>
                <label>Email</label>
                <input type="email" name="email" placeholder="Type your email.." onChange={changeHandler}/>
                <AiOutlineUser size={20} color={"#b1b1b1"} className={classes.icon}/>
            </div>
            <div>
                <label>Password</label>
                <input type="password" name="password" placeholder="Type your password.." onChange={changeHandler}/>
                <AiOutlineLock size={20} color={"#b1b1b1"} className={classes.iconPassword}/>
            </div>
            <div className="bg-gradient-to-bl from-purple-300 to-green-600 w-16 rounded-full m-auto outline-none focus:outline-none">
                <button className="p-3 outline-none focus:outline-none">
                    <AiOutlineLogin size={33} color={"white"} className="ml-mlh"/>
                </button>
            </div>
        </form>
        <Link href="/">
            <a className="text-blue-500 hover:text-blue-500 hover:underline cursor-pointer text-sm font-Raleway">Forget Password?</a>
        </Link>
     </Card.Content>
  </Card>
  </div>
}

export default LoginForm;