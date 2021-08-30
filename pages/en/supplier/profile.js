import { getSession } from "next-auth/client";
import { useSelector } from "react-redux";
import ProfileInformation from "components/reusable/ProfileInformation";
import SharedNavLayout from "components/reusable/SharedLayout";
import { addToken, parseCookie } from "helper/functions";
import InnerFooter from 'components/client/InnerFooter';
import Head from 'next/head';
const Profile = (props) => {
  const generalReducer = useSelector((state) => state.generalReducer);

//   token={props.token}

    return <SharedNavLayout navList={generalReducer.supplierNav} logoLink={"/en"}>
            <Head>
                <title>Profile</title>
            </Head>
            <ProfileInformation token={props.token} supplier={true}/>
        </SharedNavLayout>
}


export async function getServerSideProps({req}){
    const session = await getSession({req:req});
    const cookies = parseCookie(req);
    const token = cookies['next-auth.session-token'];
    if(!session){
        return {
            redirect: {
                destination: '/'
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
    if(tokenResponse.statusCode !== 200){
        return {
            notFound: true,
        }
    }
    return{
        props:{
            session: session,
            token: token
        }
    }
} 

export default Profile;