import { getSession } from "next-auth/client";
import { useSelector } from "react-redux";
import ProfileInformation from "../../components/reusable/ProfileInformation";
import SharedNavLayout from "../../components/reusable/SharedLayout";
import { addToken, parseCookie } from "../../helper/functions";
import Head from 'next/head';
const Profile = (props) => {
  const generalReducer = useSelector((state) => state.generalReducer);

//   token={props.token}

    return <SharedNavLayout session={props.session} navList={generalReducer.supplierArabicNav} client={true} arabic={true} logoLink={"/"}>
            <Head>
                <title>معلوماتي</title>
            </Head>
            <ProfileInformation arabic={true} token={props.token} session={props.session} supplier={true}/>
        </SharedNavLayout>
}


export async function getServerSideProps({req}){
    const session = await getSession({req:req});
    const cookies = parseCookie(req);
    const token = cookies['__Secure-next-auth.session-token'];
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