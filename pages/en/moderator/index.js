import HomePage from "../../../components/admin-moderator/HomePage";
import SharedNavLayout from "../../../components/reusable/SharedLayout";
import ENDPOINT from "../../../helper/ENDPOINT";
import { addToken, formatRecordsAddress, parseCookie } from "../../../helper/functions";
import { getSession } from "next-auth/client";
import Head from "next/head";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import clientsActions from "../../../stores/actions/clientsActions";
import generalActions from "../../../stores/actions/generalActions";
import requestsActions from "../../../stores/actions/requestsActions";
import suppliersActions from "../../../stores/actions/suppliersActions";

const Home = (props) => {
    const dispatch = useDispatch();
    const generalReducer = useSelector((state) => state.generalReducer);
    const clients = useSelector((state)=>state.clientsReducer.clients);
    const requests = useSelector((state)=>state.requestsReducer.requests);
    const suppliers = useSelector((state)=>state.suppliersReducer.suppliers);
    const brands = useSelector((state)=>state.brandsReducer.brands);
    const moderators = useSelector((state)=>state.moderatorReducer.moderators);
  
  
  
    useEffect(() => {
      if(clients.length == 0 && suppliers.length == 0 && requests.length == 0 && brands.length == 0 && moderators.length == 0){
        dispatch(clientsActions.addAllclients(props.clients));
        dispatch(suppliersActions.addAllsuppliers(props.suppliers));
        dispatch(requestsActions.addAllRequests(props.requests));
      }
      return ()=>{
        dispatch(clientsActions.cleanClients());
        dispatch(suppliersActions.cleanSuppliers());
        dispatch(requestsActions.emptyRequest());
        dispatch(generalActions.toggleNavMenu());
      }
    }, []);


   return <SharedNavLayout session={props.session} navList={generalReducer.moderatorNav} logoLink={"/en/moderator"} footerInnerValue={<p className="footer-inner-text">MODERATOR PAGE</p>} admin={true}>
          <Head>
            <title>Dashboard</title>
          </Head>
          <HomePage />
  </SharedNavLayout>
  
}



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
    
    const data = await fetch(`${ENDPOINT}/moderator/all-records`);
    const response = await data.json();
    const tokenResponse = await addToken(session.user.name.id, token);
    if (tokenResponse.statusCode !== 200) {
      return {
          notFound: true
      }
    }
  
  
  
    return {
      props: {
        clients:response.clients,
        suppliers:response.suppliers,
        requests: response.requests,
        session: session
      },
    };
  }

export default Home;