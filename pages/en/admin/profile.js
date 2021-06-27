import { getSession } from "next-auth/client";
import { useSelector } from "react-redux";
import ProfileInformation from "../../../components/admin-moderator/Profile/ProfileInformation";
import SharedNavLayout from "../../../components/reusable/SharedLayout";
import { addToken, parseCookie } from "../../../helper/functions";
import {useRouter} from 'next/router';
import { useEffect } from "react";
import Cookies from "js-cookie";
const Profile = (props) => {
  const router = useRouter();
  const generalReducer = useSelector((state) => state.generalReducer);
  useEffect(()=>{
    Cookies.set('lastUrl', router.pathname);
}, [])


    return <SharedNavLayout navList={generalReducer.adminNav} logoLink={"/en/admin"} footerInnerValue={<p>ADMIN PAGE</p>}>
                <ProfileInformation  token={props.token} admin={true}/>
            </SharedNavLayout>
}


export async function getServerSideProps({req}){
    const session = await getSession({req:req});
    const cookies = parseCookie(req);
    const token = cookies['next-auth.session-token'];
    const lastUrl = cookies['lastUrl'];
    if(!session){
        return {
            redirect: {
                destination: '/en/admin/auth/login'
            }
        }
    }else if(session.user.name.userType != 0){
        return {
          redirect: {
            destination: lastUrl
          }
        }
      }
    const tokenResponse = await addToken(session.user.name.id, token);
    if(tokenResponse.statusCode !== 200){
        return {
            notFound: true,
        }
    }
    return{
        props:{
            session: session,
            token: token
        }
    }
}

export default Profile;