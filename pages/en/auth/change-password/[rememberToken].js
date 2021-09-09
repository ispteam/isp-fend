import ChangePasswordForm from "components/client/ChangePassword";
import Head from "next/head";
import { Fragment } from "react";


const ChangePassword = (props) => {
    return <Fragment>
            <Head>
                <title>Change Password</title>
            </Head>
            <ChangePasswordForm rememberToken={props.rememberToken}/>
        </Fragment>
}


export async function getServerSideProps({params}) {
    if(!params.rememberToken){
        return {
            notFound:true
        }
    }

    return {
        props:{
            rememberToken: params.rememberToken
        }
    }
}

export default ChangePassword;