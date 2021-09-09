import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import SharedNavLayout from "components/reusable/SharedLayout";
import ENDPOINT from "helper/ENDPOINT";
import { addToken, formatRecordsAddress, parseCookie } from "helper/functions";
import requestsActions from "stores/actions/requestsActions";
import AllRequests from "components/reusable/AllRequests";
import InnerFooter from "components/client/InnerFooter";
import { getSession } from "next-auth/client";
import Head from "next/head";
const MyRequests = (props) => { 
    const generalReducer = useSelector((state)=>state.generalReducer);
    const dispatch = useDispatch();
    useEffect(()=>{
          dispatch(requestsActions.emptyRequest());
          const formattedRequests = formatRecordsAddress(props.requests);
          dispatch(requestsActions.addAllRequests(formattedRequests, props.length, ( props.length - props.requests.length )));
    }, [dispatch, props.length, props.requests]);
    return <SharedNavLayout navList={generalReducer.clientNav} session={props.session} logoLink={"/en"} footerInnerValue={<InnerFooter/>} client={true}> 
      <Head>
        <title>My Requests</title>
      </Head>
      <AllRequests supplier={false} token={props.token} session={props.session}/>
    </SharedNavLayout>
}


export async function getServerSideProps(context){
    const session = await getSession({req: context.req});
    const cookies = parseCookie(context.req);
    const token = cookies['next-auth.session-token'];
    if(!session){
        return {
          redirect:{
            destination: '/en'
          }
        }
      }else if(session){
        switch(session.user.name.userType){
            case "0":
                return {
                    redirect:{
                        destination: "/ar/auth"
                    }
                }
            case "1": {
                return {
                    redirect:{
                        destination: "/ar/moderator"
                    }
                }
            }
            case "2": {
                return {
                    redirect:{
                        destination: "/ar/supplier"
                    }
                }
            }
        } 
      }
    const tokenResponse = await addToken(session.user.name.id, token);
    if (tokenResponse.statusCode !== 200) {
      return {
          notFound: true
      }
    }
    const data = await fetch(`${ENDPOINT}/request/request-operations/${session.user.name.id}`);
    const response = await data.json();
    if(response.statusCode != 200){
        return {
            notFound: true
        }
    }

    return {
        props:{
            requests: response.requests,
            length: response.length,
            session: session,
            token
        }
    }
}

export default MyRequests;