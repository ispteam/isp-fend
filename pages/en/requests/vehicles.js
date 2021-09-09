import InnerFooter from "../../../components/client/InnerFooter";
import SharedNavLayout from "../../../components/reusable/SharedLayout";
import Head from 'next/head';
import AddRequest from "../../../components/client/AddRequest";
import { getSession } from "next-auth/client";
import { addToken, parseCookie } from "../../../helper/functions";

const vehicles = (props) => {
    return <SharedNavLayout navList={generalReducer.clientNav} session={props.session} client={true} logoLink={"/en"} footerInnerValue={<InnerFooter/>}>
        <Head>
          <title>Vehicles</title>
        </Head>
        <AddRequest bigVehicle={true} token={props.token} session={props.session}/>
    </SharedNavLayout>
}

export async function getServerSideProps(context){
    const session = await getSession({req: context.req});
    const cookies = parseCookie(context.req);
    const token = cookies['next-auth.session-token'];
    if(!session){
        return {
          props: {}
        }
      }else if(session){
        switch(session.user.name.userType){
            case "0":
                return {
                    redirect:{
                        destination: "/en/auth"
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
    if (tokenResponse.statusCode !== 200) {
      return {
          notFound: true
      }
    }

    return {
        props:{
          token: token,
          session: session
        }
    }
}
export default vehicles;
