import { getSession } from "next-auth/client";
import { useDispatch, useSelector } from "react-redux";
import ProfileInformation from "../../../components/reusable/ProfileInformation";
import SharedNavLayout from "../../../components/reusable/SharedLayout";
import { addToken, parseCookie } from "../../../helper/functions";
import Head from "next/head";
import { useEffect } from "react";
import generalActions from "stores/actions/generalActions";

const Profile = (props) => {
  const generalReducer = useSelector((state) => state.generalReducer);

    return <SharedNavLayout session={props.session} admin={true} navList={generalReducer.moderatorNav} logoLink={"/en/moderator"} footerInnerValue={<p className="footer-inner-text">MODERATOR PAGE</p>}>
                <Head>
                    <title>Profile</title>
                </Head>
                <ProfileInformation session={props.session} token={props.token} moderator={true}/>
        </SharedNavLayout>
}


export async function getServerSideProps({req}){
    const session = await getSession({req:req});
    const cookies = parseCookie(req);
    const token = cookies['next-auth.session-token'];
    if(!session){
        return {
            redirect: {
                destination: '/en/auth'
            }
        }
    }else if(session){
        switch(session.user.name.userType){
          case "0":
              return {
                  redirect:{
                      destination: "/en/admin"
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