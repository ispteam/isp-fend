import { useDispatch, useSelector } from "react-redux";
import SharedNavLayout from "../../../../components/reusable/SharedLayout";
import { useEffect } from "react";
import { addToken, formatRecordsAddress, parseCookie } from "../../../../helper/functions";
import clientsActions from "../../../../stores/actions/clientsActions";
import suppliersActions from "../../../../stores/actions/suppliersActions";
import moderatorsActions from "../../../../stores/actions/moderatorActions";
import brandsActions from "../../../../stores/actions/brandsActions";
import requestsActions from "../../../../stores/actions/requestsActions";
import SuppliersDashboard from "../../../../components/admin-moderator/Suppliers";
import { getSession } from "next-auth/client";
import {useRouter} from 'next/router';
import Cookies from "js-cookie";
const Suppliers = (props) => {
  const dispatch= useDispatch();
  const generalReducer = useSelector((state) => state.generalReducer);
  const clients = useSelector((state)=>state.clientsReducer.clients);
  const requests = useSelector((state)=>state.requestsReducer.requests);
  const suppliers = useSelector((state)=>state.suppliersReducer.suppliers);
  const brands = useSelector((state)=>state.brandsReducer.brands);
  const moderators = useSelector((state)=>state.moderatorReducer.moderators);
  const router = useRouter();
  useEffect(() => {
    if(clients.length == 0 && suppliers.length == 0 && requests.length == 0 && brands.length == 0 && moderators.length == 0){
      const formattedClients = formatRecordsAddress(props.clients);
      const formattedRequests = formatRecordsAddress(props.requests);
      dispatch(clientsActions.addAllclients(formattedClients));
      dispatch(suppliersActions.addAllsuppliers(props.suppliers));
      dispatch(moderatorsActions.addAllModerators(props.moderators));
      dispatch(requestsActions.addAllModerators(formattedRequests));
      dispatch(brandsActions.addAllbrands(props.brands));
    }
  }, []);

  useEffect(()=>{
    Cookies.set('lastUrl', router.pathname);
}, [])
  
  return (
    <SharedNavLayout navList={generalReducer.adminNav} logoLink={"/en/admin"} footerInnerValue={<p>ADMIN PAGE</p>}>
        <SuppliersDashboard token={props.token} />
    </SharedNavLayout>
  );
};


export async function getServerSideProps({req}){
  const cookies = parseCookie(req);
  const session = await getSession({req:req});
  const token = cookies['next-auth.session-token'];
  const lastUrl = cookies['lastUrl'];
  if(!session){
    return {
      redirect:{
        destination: '/en/admin/auth/login'
      }
    }
  }else if(session.user.name.userType != 0){
    return {
      redirect: {
        destination: lastUrl
      }
    }
  }
  
  const data = await fetch("http://localhost:8000/api/moderator/all-records/admin");
  const response = await data.json();
  const tokenResponse = await addToken(session.user.name, token);
  
  if (response.statusCode !== 200 || tokenResponse.statusCode !== 200) {
    return {
        notFound: true
    }
  }



  return {
    props: {
      token: token,
      clients:response.clients,
      suppliers:response.suppliers,
      moderators: response.moderators,
      requests: response.requests,
      brands: response.brands
    },
  };
}

export default Suppliers;
