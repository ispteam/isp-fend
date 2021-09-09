import InnerFooter from "../../components/client/InnerFooter";
import SharedNavLayout from "../../components/reusable/SharedLayout";
import { useSelector } from "react-redux";
import Head from 'next/head';
import { getSession } from "next-auth/client";
import { addToken, parseCookie } from "../../helper/functions";
import PaymentInformation from "../../components/client/PymentInformation";
const Payment = (props) => {
    const generalReducer = useSelector(state=>state.generalReducer);
    return <SharedNavLayout navList={generalReducer.clientNavArabic} session={props.session} logoLink={"/"}  client={true} arabic={true} footerInnerValue={<InnerFooter arabic={true}/>}>
        <Head>
            <title>دفع</title>
        </Head>
        <PaymentInformation arabic={true} />
    </SharedNavLayout>
}

export async function getServerSideProps(context){
    const session = await getSession({req: context.req});
    const cookies = parseCookie(context.req);
    const token = cookies['__Secure-next-auth.session-token'];
    if(!session){
        return {
            props: "/"
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
          session: session
        }
    }
}

export default Payment;