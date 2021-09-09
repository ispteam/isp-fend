import { Fragment } from 'react';
import ForgetPasswordForm from '../../components/client/ForgetPasswordForm';
const ForgetPassword = () => {
    return <Fragment>
        <Fragment>
            <title>اعادة تعيين كلمة المرور</title>
        </Fragment>
        <ForgetPasswordForm client={true} arabic={true}/>
    </Fragment>
}

export default ForgetPassword;