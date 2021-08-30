import {useSelector } from "react-redux";
import SharedNavLayout from "components/reusable/SharedLayout";
import ENDPOINT from "helper/ENDPOINT";
import RequestDetails from "components/client/RequestDetails";
import InnerFooter from "components/client/InnerFooter";
import { addToken, formatSingleAddress, parseCookie } from "../../../../helper/functions";
import { getSession } from "next-auth/client";
import Head from 'next/head'
const MyRequests = (props) => {
    const generalReducer = useSelector((state)=>state.generalReducer);
    const formattedRequest= formatSingleAddress(props.request);
    return <SharedNavLayout navList={generalReducer.clientNav} logoLink={"/en"} footerInnerValue={<InnerFooter/>} client={true}>
        <Head>
          <title>{formattedRequest.requestNum}</title>
        </Head>
       <RequestDetails request={formattedRequest} client={true} token={props.token}/>
    </SharedNavLayout>
}


export async function getServerSideProps(context){
    const session = await getSession({req: context.req});
    const cookies = parseCookie(context.req);
    const token = cookies['next-auth.session-token'];
    if(!session){
        return {
          redirect:{
            destination: '/en/'
          }
        }
      }else if(session){
        const tokenResponse = await addToken(session.user.name.id, token);
        if (tokenResponse.statusCode !== 200) {
          return {
              notFound: true
          }
        }
        switch(session.user.name.userType){
            case "0":
                return {
                    redirect:{
                        destination: "/en/admin"
                    }
                }
            case "1": {
                return {
                    redirect:{
                        destination: "/en/moderator"
                    }
                }
            }
            case "2": {
                return {
                    redirect:{
                        destination: "/en/supplier"
                    }
                }
            }
        }
        
    }
    const tokenResponse = await addToken(session.user.name.id, token);
    if (tokenResponse.statusCode != 200) {
      return {
          notFound: true
      }
    }
    const data = await fetch(`${ENDPOINT}/request/detailed-request`, {
        method:'POST',
        headers:{
            'Content-Type':'application/json',
            "Authorization": token
        },
        body: JSON.stringify({
            uid: session.user.name.id,
            clientId: session.user.name.id,
            requestId: context.params.requestId
        })
    });
    const response = await data.json();
    if(response.statusCode != 200){
        return {
            notFound: true
        }
    }

    
    return {
        props:{
            request: response.request,
            token: token,
        }
    }
}

export default MyRequests;