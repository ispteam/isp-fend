import Head from 'next/head';
import { Fragment } from 'react';
import ForgetPasswordForm from '../../../components/client/ForgetPasswordForm';
const ForgetPassword = () => {
    return <Fragment>
        <Head>
            <title>Forget Password</title>
        </Head>    
    <ForgetPasswordForm client={true}/>
    </Fragment>
}

export default ForgetPassword;