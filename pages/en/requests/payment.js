import InnerFooter from "components/client/InnerFooter";
import SharedNavLayout from "components/reusable/SharedLayout";
import { useSelector } from "react-redux";
import Head from 'next/head';
import AddRequest from "components/client/AddRequest";
import { getSession } from "next-auth/client";
import { addToken, parseCookie } from "helper/functions";
import PaymentInformation from "components/client/PymentInformation";

const Payment = (props) => {
    const generalReducer = useSelector(state=>state.generalReducer);
    return <SharedNavLayout navList={generalReducer.clientNav} session={props.session} logoLink={"/en"} client={true} footerInnerValue={<InnerFooter/>}>
        <Head>
            <title>Payment</title>
        </Head>
        <PaymentInformation />
    </SharedNavLayout>
}

export async function getServerSideProps(context){
    const session = await getSession({req: context.req});
    const cookies = parseCookie(context.req);
    const token = cookies['next-auth.session-token'];
    if(!session){
        return {
            props: "/en"
        }
      }else if(session){
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
    if (tokenResponse.statusCode !== 200) {
      return {
          notFound: true
      }
    }

    return {
        props:{
          token: token,
          session: session,
        }
    }
}

export default Payment;