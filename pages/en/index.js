import Landing from "components/client/landing";
import InnerFooter from "components/client/InnerFooter";
import SharedNavLayout from "components/reusable/SharedLayout";
import { useSelector } from "react-redux";
import Head from 'next/head';
import { getSession } from "next-auth/client";
const Home = (props) => {
    const generalReducer = useSelector(state=>state.generalReducer);

    return <SharedNavLayout admin={false} navList={generalReducer.clientNav} session={props.session} logoLink={"/en"} client={true} footerInnerValue={<InnerFooter arabic={false}/>}>
        <Head>
            <title>Home</title>
            <meta name="description" content="Spare parts is a website to order cars and vehicles spare parts anywhere around the world without taking care about the shipping and delivering." />
        </Head>
        <Landing session={props.session}/>
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
                        destination: "/en/supplier"
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