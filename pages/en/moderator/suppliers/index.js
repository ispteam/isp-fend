import { useDispatch, useSelector } from "react-redux";
import SharedNavLayout from "../../../../components/reusable/SharedLayout";
import { useEffect } from "react";
import { addToken, parseCookie } from "../../../../helper/functions";
import suppliersActions from "../../../../stores/actions/suppliersActions";
import { getSession } from "next-auth/client";
import ENDPOINT from "../../../../helper/ENDPOINT";
import SuppliersDashboard from "../../../../components/admin-moderator/SuppliersDashboard";
import Head from "next/head";

const Suppliers = (props) => {
  const dispatch= useDispatch();
  const generalReducer = useSelector((state) => state.generalReducer);
  useEffect(() => {
      dispatch(suppliersActions.addAllsuppliers(props.suppliers));
  }, []);

  
  return (
    <SharedNavLayout session={props.session} admin={true} navList={generalReducer.moderatorNav} logoLink={"/en/moderator"} footerInnerValue={<p className="footer-inner-text">MODERATOR PAGE</p>}>
        <Head>
          <title>Suppliers</title>
        </Head>
        <SuppliersDashboard session={props.session} token={props.token} />
    </SharedNavLayout>
  );
};


export async function getServerSideProps({req}){
  const cookies = parseCookie(req);
  const session = await getSession({req:req});
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
  
  const data = await fetch(`${ENDPOINT}/supplier/supplier-operations`);
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
      suppliers:response.suppliers,
      session: session
    },
  };
}

export default Suppliers;
