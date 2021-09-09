import Landing from "components/client/landing";
import InnerFooter from "components/client/InnerFooter";
import SharedNavLayout from "components/reusable/SharedLayout";
import { useSelector } from "react-redux";
import Head from 'next/head';
import { getSession } from "next-auth/client";
import { useEffect } from "react";

const Home = (props) => {
    const generalReducer = useSelector(state=>state.generalReducer);
    return <SharedNavLayout navList={generalReducer.clientNavArabic} session={props.session} client={true} logoLink={"/"} arabic={true} footerInnerValue={<InnerFooter arabic={true}/>}>
        <Head>
            <title>الرئيسية</title>
            <meta name="description" content="اي اس بي لطلب قطع غيار السيارات والمركبات الكبيرة من جميع انحاء العالم"/>
        </Head>  
        <Landing arabic={true} session={props.session}/>
    </SharedNavLayout>
}

export async function getServerSideProps(context){
    const session = await getSession({req: context.req});

    if(session){
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
                        destination: "/supplier"
                    }
                }
            }
          }
        }

        return {
            props:{
                session: session
            }
        }
}

export default Home;