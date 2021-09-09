import { useDispatch, useSelector } from "react-redux";
import SharedNavLayout from "../../../../components/reusable/SharedLayout";
import { useEffect } from "react";
import { addToken, parseCookie } from "../../../../helper/functions";
import brandsActions from "../../../../stores/actions/brandsActions";
import BrandsDashboard from "../../../../components/admin-moderator/BrandsDashboard";
import { getSession } from "next-auth/client";
import ENDPOINT from '../../../../helper/ENDPOINT';
import Head from "next/head";

const Brands = (props) => {
  const dispatch= useDispatch();
  const generalReducer = useSelector((state) => state.generalReducer);
  const brands = useSelector((state)=>state.brandsReducer.brands);

  useEffect(() => {
    if(brands.length == 0){
      dispatch(brandsActions.addAllbrands(props.brands));
    }
  }, []);


  
  return (
    <SharedNavLayout session={props.session} admin={true} navList={generalReducer.moderatorNav} logoLink={"/en/moderator"} footerInnerValue={<p className="footer-inner-text">MODERATOR PAGE</p>}>
        <Head>
          <title>Brands</title>
        </Head>
        <BrandsDashboard session={props.session} token={props.token}/>
    </SharedNavLayout>
  );
};



export async function getServerSideProps({req}){
  const cookies = parseCookie(req);
  const session = await getSession({req: req});
  const token = cookies['__Secure-next-auth.session-token'];
  if(!session){
    return {
      redirect:{
        destination: '/en/auth'
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
      case "2": {
          return {
              redirect:{
                  destination: "/en/supplier"
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
  
  const data = await fetch(`${ENDPOINT}/brand/brand-operations`);
  const response = await data.json();
  const tokenResponse = await addToken(session.user.name.id, token);
  
  if (response.statusCode !== 200 || tokenResponse.statusCode !== 200) {
    return {
        notFound: true
    }
  }



  return {
    props: {
      token: token,
      brands: response.brands,
      session: session
    },
  };
}

export default Brands;
