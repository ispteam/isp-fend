import { getSession, session } from "next-auth/client"; 
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ENDPOINT from "../../../helper/ENDPOINT";
import { addToken, formatRecordsAddress, parseCookie } from "../../../helper/functions";
import SharedNavLayout from "../../../components/reusable/SharedLayout";
import AllRequests from "../../../components/reusable/AllRequests";
import requestsActions from "../../../stores/actions/requestsActions";
import Head from "next/head";

const PendingRequests = (props) => {
  const generalReducer = useSelector((state)=>state.generalReducer);
  const dispatch = useDispatch();
    useEffect(()=>{
          dispatch(requestsActions.emptyRequest());
          const formattedRequests = formatRecordsAddress(props.requests);
          dispatch(requestsActions.addAllRequests(formattedRequests, props.length, ( props.length - props.requests.length )));
    }, [dispatch, props.length, props.requests]);
    return <SharedNavLayout navList={generalReducer.supplierNav} session={props.session} logoLink={"en/supplier"} arabic={true} supplier={true}> 
        <Head>
          <title>Home</title>
        </Head>
       <AllRequests supplier={true} token={props.token} session={props.session}/>
    </SharedNavLayout>
}


export async function getServerSideProps(context){
    const session = await getSession({req: context.req});
    const cookies = parseCookie(context.req);
    const token = cookies['next-auth.session-token'];
    if(!session){
        return {
          redirect:{
            destination: '/'
          }
        }
      }else if(session){
        switch(session.user.name.userType){
          case "0":
              return {
                  redirect:{
                      destination: "/en/admin/auth"
                  }
              }
          case "1": {
              return {
                  redirect:{
                      destination: "/en/moderator"
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
    if (tokenResponse.statusCode !== 200) {
      return {
          notFound: true
      }
    }


    let data;
    if(session.user.name.pref == 'cars'){
        data = await fetch(`${ENDPOINT}/request/pending-requests/0/${session.user.name.pref}`, {
           method: 'POST',
           headers:{
               'Content-Type': 'application/json'
           },
           body: JSON.stringify({
               supplierCarsPref: session.user.name.carsPref.split(",")
           })
       });
    }else{
        data = await fetch(`${ENDPOINT}/request/pending-requests/0/${session.user.name.pref}`, {
           method: 'POST',
           headers:{
               'Content-Type': 'application/json'
           }
       });
    }
    
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
            token: token,
            session: session
        }
    }
}


export default PendingRequests;