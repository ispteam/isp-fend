import { useDispatch, useSelector } from "react-redux";
import SharedNavLayout from "components/reusable/SharedLayout";
import ClientsDashboard from "components/admin-moderator/ClientsDashboard";
import { useEffect } from "react";
import { addToken, formatRecordsAddress, parseCookie } from "helper/functions";
import clientsActions from "stores/actions/clientsActions";
import { getSession } from "next-auth/client";
import ENDPOINT from "helper/ENDPOINT";
import Head from "next/head";

const Clients = (props) => {
  const dispatch= useDispatch();
  const generalReducer = useSelector((state) => state.generalReducer);
  const clients = useSelector((state)=>state.clientsReducer.clients);
  useEffect(() => {
      const formattedClients = formatRecordsAddress(props.clients);
      dispatch(clientsActions.addAllclients(formattedClients));
  }, []);



  
  return (
    <SharedNavLayout session={props.session} admin={true} navList={generalReducer.adminNav} logoLink={"/en/admin"} footerInnerValue={<p className="footer-inner-text">ADMIN PAGE</p>}>
        <Head>
          <title>Clients</title>
        </Head>
        <ClientsDashboard token={props.token} session={props.session}/>
    </SharedNavLayout>
  );
};



export async function getServerSideProps({req}){
  const cookies = parseCookie   (req);
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
  
  const data = await fetch(`${ENDPOINT}/client/client-operations`);
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
      clients:response.clients,
      session: session
    },
  };
}

export default Clients;
