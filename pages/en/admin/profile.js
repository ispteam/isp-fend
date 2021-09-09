import { getSession } from "next-auth/client";
import { useDispatch, useSelector } from "react-redux";
import ProfileInformation from "../../../components/reusable/ProfileInformation";
import SharedNavLayout from "../../../components/reusable/SharedLayout";
import { addToken, parseCookie } from "../../../helper/functions";
import Head from "next/head";


const Profile = (props) => {
  const generalReducer = useSelector((state) => state.generalReducer);


    return <SharedNavLayout session={props.session} admin={true} navList={generalReducer.adminNav} logoLink={"/en/admin"} footerInnerValue={<p className="footer-inner-text">ADMIN PAGE</p>}>
                <Head>
                    <title>Profile</title>
                </Head>
                <ProfileInformation session={props.session}  token={props.token} admin={true}/>
        </SharedNavLayout>
}


export async function getServerSideProps({req}){
    const session = await getSession({req:req});
    const cookies = parseCookie(req);
    const token = cookies['__Secure-next-auth.session-token'];
    if(!session){
        return {
            redirect: {
                destination: '/en/auth'
            }
        }
    }else if(session){
        switch(session.user.name.userType){
          case "1":
              return {
                  redirect:{
                      destination: "/en/moderator"
                  }
              }
          case "2": {
              return {
                  redirect:{
                      destination: "/en/supplier"
                  }
              }
          }
          case "3": {
              return {
                  redirect:{
                      destination: "/en"
                  }
              }
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