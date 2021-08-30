import AuthForm from "components/admin-moderator/AuthForm";
import Footer from "components/reusable/Footer";
import { getSession } from "next-auth/client";
import Head from "next/head";
import { Fragment } from "react";

const Auth = () => {
    return <Fragment>
            <Head>
                <title>ADMIN|MODERATOR AUTH</title>
            </Head>
            <AuthForm/>
    </Fragment>
}


export async function getServerSideProps({req}){
    const session = await getSession({req: req});
    if(session) {
        switch(session.user.name.userType){
            case '0':
                return {
                    redirect:{
                        destination:'/en/admin'
                    }
                }
            case '1':
                return {
                    redirect:{
                        destination:'/en/moderator'
                    }
                }
        }
    }

    return {
        props:{}
    }
}

export default Auth;