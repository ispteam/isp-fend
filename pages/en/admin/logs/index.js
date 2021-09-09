import { getSession } from "next-auth/client";
import Head from "next/head";
import {useSelector } from "react-redux";
import LogsDashboard from "../../../../components/admin-moderator/LogsDashboard";
import SharedNavLayout from '../../../../components/reusable/SharedLayout';
import ENDPOINT from "../../../../helper/ENDPOINT";
import { addToken, parseCookie } from "../../../../helper/functions";

const Logs = (props) => {
    const generalReducer = useSelector((state)=>state.generalReducer);

    return <SharedNavLayout session={props.session} admin={true} navList={generalReducer.adminNav} logoLink={"/en/admin"} footerInnerValue={<p className="footer-inner-text">ADMIN PAGE</p>}>
            <Head>
              <title>Logs</title>
            </Head>
            <LogsDashboard session={props.session} logs={props.logs} token={props.token}/> 
        </SharedNavLayout>
}


export async function getServerSideProps({req}){
    const cookies = parseCookie(req);
    const session = await getSession({req: req});
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
    
    const data = await fetch(`${ENDPOINT}/payment/payment-operations`);
    const response = await data.json();
    const tokenResponse = await addToken(session.user.name.id, token);
  
    if (response.statusCode !== 200 || tokenResponse.statusCode !== 200) {
      return {
          notFound: true
      }
    }
  
  
  
    return {
      props: {
        logs: response.logs,
        token: token,
        session: session
      },
    };
  }


export default Logs;