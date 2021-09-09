import { useDispatch, useSelector } from "react-redux";
import SharedNavLayout from "components/reusable/SharedLayout";
import { useEffect } from "react";
import { addToken, parseCookie } from "helper/functions";
import { getSession } from "next-auth/client";
import ENDPOINT from "helper/ENDPOINT";
import Head from "next/head";
import ModeratorsDashboard from "components/admin-moderator/ModeratorsDashboard";
import moderatorsActions from "stores/actions/moderatorActions";
import generalActions from "stores/actions/generalActions";

const Moderators = (props) => {
  const dispatch= useDispatch();
  const generalReducer = useSelector((state) => state.generalReducer);
  useEffect(() => {
      dispatch(moderatorsActions.addAllModerators(props.moderators));
  }, []);

  
  return (
    <SharedNavLayout session={props.session} admin={true} navList={generalReducer.adminNav} logoLink={"/en/admin"} footerInnerValue={<p className="footer-inner-text">ADMIN PAGE</p>}>
        <Head>
          <title>Moderators</title>
        </Head>
        <ModeratorsDashboard session={props.session} token={props.token} />
    </SharedNavLayout>
  );
};


export async function getServerSideProps({req}){
  const cookies = parseCookie(req);
  const session = await getSession({req:req});
  const token = cookies['next-auth.session-token'];
  if(!session){
    return {
      redirect:{
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
  
  const data = await fetch(`${ENDPOINT}/moderator/moderator-operations`);
  const response = await data.json();
  const tokenResponse = await addToken(session.user.name.id, token);
  
  if (response.statusCode !== 200 || tokenResponse.statusCode !== 200) {
    return {
        notFound: true
    }
  }



  return {
    props: {
      token: token,
      moderators:response.moderators,
      session: session
    },
  };
}

export default Moderators;
