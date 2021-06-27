import { useEffect, useState } from "react";
import {getSession} from 'next-auth/client';
import {parseCookie } from "../../../../helper/functions";
import LoginForm from "../../../../components/reusable/Login/LogingForm";
const Login = () => {
    return <LoginForm userType={"moderator"}/>
}



// const fecthProfileData = async ()




export async function getServerSideProps({req, res}){
    const cookies = parseCookie(req);
    // const isToken = cookies["isTokenAdded"];
    const token = cookies['next-auth.session-token'];
    const session = await getSession({req: req});
    const lastUrl = cookies['lastUrl'];
    if(session && session.user.name.userType == 1){
        return {
            redirect: {
                destination: lastUrl? lastUrl : "/en/moderator/"
            }
        }
    }

    return {
        props: {}
    }
}

export default Login;