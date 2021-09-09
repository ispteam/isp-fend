import { useDispatch, useSelector } from "react-redux";
import SharedNavLayout from "../../../../components/reusable/SharedLayout";
import { useEffect } from "react";
import { addToken, formatRecordsAddress, parseCookie } from "../../../../helper/functions";
import requestsActions from "../../../../stores/actions/requestsActions";
import RequestsDashboard from "../../../../components/admin-moderator/RequestsDashboard";
import { getSession } from "next-auth/client";
import ENDPOINT from "../../../../helper/ENDPOINT";
import Head from "next/head";

const Requests = (props) => {
  const dispatch= useDispatch();
  const generalReducer = useSelector((state) => state.generalReducer);
  const requests = useSelector((state)=>state.requestsReducer.requests);
  useEffect(() => {
      const formattedRequests = formatRecordsAddress(props.requests);
      dispatch(requestsActions.addAllRequests(formattedRequests));
  }, []);


  
  return (
    <SharedNavLayout session={props.session} admin={true} navList={generalReducer.moderatorNav} logoLink={"/en/moderator"} footerInnerValue={<p className="footer-inner-text">MODERATOR PAGE</p>}>
        <Head>
          <title>Requests</title>
        </Head>
        <RequestsDashboard token={props.token}/>
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
  
  const data = await fetch(`${ENDPOINT}/request/request-operations`);
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
      requests: response.requests,
      session: session
    },
  };
}

export default Requests;
