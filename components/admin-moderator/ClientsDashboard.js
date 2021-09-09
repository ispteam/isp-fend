import { Fragment, useEffect} from "react";
import {useRouter} from 'next/router';
import Table from "components/reusable/Tables";
import { useDispatch, useSelector } from "react-redux";
import GridLayout from "components/reusable/GridLayout";
import GridData from "components/reusable/GridData";
import {findStatisticsPerMonth, validateAccountsInput} from "helper/functions";
import { useState } from "react";
import clientsActions from "stores/actions/clientsActions";
import {BsHash} from "react-icons/bs";
import MyChart from "components/reusable/Chart";
import {Bar} from 'react-chartjs-2';
import {getSession} from 'next-auth/client';
import Td from "components/reusable/Td";
import Button from "components/reusable/Button";
import ModalDetails from "./ModalDetails";
import generalActions from "stores/actions/generalActions";


const TABLE_CLIENTS_HEADERS = ["Name", "Eamil", "Details"];

const ClientsDashboard = ({token, moderator, sesson}) => {

      /**
     * ======================
     * NOTE: IF THERE IS NO COMMENT IN ANY FUNCTION, OR ANY THING RELATED THAT IS MEAN IT WAS EXPLAINED IN THE SUPPLIERS COMPONENT
     * ======================
     */

  const router = useRouter();
  const clients = useSelector((state) => state.clientsReducer);
  const [clientsOrder, setClientsOrder] = useState([]);
  const generalReducer = useSelector((state) => state.generalReducer);
  const clientsData = findStatisticsPerMonth(clients.clients);
  const dispatch = useDispatch();
  const [data, setData] = useState(null);
  const [filtering, setFiltering] = useState({
    order: false,
  });

  const [searchedValue, setsearchedValue] = useState({
    showSearchedValue: false,
    value: {},
    idx: ''
  });


  useEffect(()=>{
    setClientsOrder(clients.clients);
  },[clients.clients, clientsOrder])



  const submitHandler = async (ignored, ignored2, datas) => {
    try {
      dispatch(generalActions.emptyState());
      dispatch(generalActions.sendRequest("Updating.."));
      const validateEmailMessage = validateAccountsInput(datas.account.email, false, false, true, false, false);
      const validateNameMessage = validateAccountsInput(datas.account.name,false,false,false,false,false, false, false, false, false, false, false, false, false, false, false, false, true);
      const validatePhoneMessage = validateAccountsInput(datas.account.phone,false,false,false,true,false);
      if (validateEmailMessage.length > 0) {
        dispatch(generalActions.changeValidation(validateEmailMessage));
      }
      if (validateNameMessage.length > 0) {
        dispatch(generalActions.changeValidation(validateNameMessage));
      }
      if (validatePhoneMessage.length > 0) {
        dispatch(generalActions.changeValidation(validatePhoneMessage));
      }
      if (
        validateEmailMessage.length > 0 ||
        validateNameMessage.length > 0 ||
        validatePhoneMessage.length > 0
      ) {
        dispatch(generalActions.showValidationMessages());
        return;
      }
      const data = await fetch(`${generalReducer.ENDPOINT}/moderator/update-client`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token
        },
        body: JSON.stringify({
          uid: session.user.name.id,
          clientId: datas.clientId,  
          name: datas.account.name,
          email: datas.account.email,
          phone: datas.account.phone,
        }),
      });
      const response = await data.json();
      if(response.statusCode == 421 || response.statusCode == 404){
        const error = new Error(response.message);
        throw error;
      }else if (response.statusCode !== 200 && response.statusCode !== 201) {
        let fullResponse = response.message;
        for(const keys in response){
            if(keys=="validationMessage"){
                for(const key in response[keys]){
                    fullResponse= response[keys][key];
                }
            }
        }
        const error = new Error(fullResponse);
        throw error;
      }
      dispatch(clientsActions.updateClient(datas));
      dispatch(generalActions.sendRequest(response.message));
      setTimeout(()=>{
          dispatch(generalActions.emptyState());
      }, 3000)
    } catch (err) {
        dispatch(generalActions.changeValidation(err.message));
        dispatch(generalActions.showValidationMessages());
    }
  };

  const removeHandler = async (datas) => {
    try{
      dispatch(generalActions.emptyState());
      dispatch(generalActions.sendRequest("Deleting.."))
        const data = await fetch(`${generalReducer.ENDPOINT}/client/client-operations/${datas.clientId}`, {
        method: "DELETE",
        headers:{
            "Content-Type": "application/json",
            "Authorization": token
        },
        body: JSON.stringify({
            uid: session.user.name.id,
            clientId: datas.clientId
        })
        });
        const response = await data.json();
        if (response.statusCode !== 200 && response.statusCode !== 201) {
        const error = new Error(response.message);
        throw error;
        }
        dispatch(clientsActions.removeClient(datas.clientId));
        dispatch(generalActions.sendRequest(response.message));
      setTimeout(()=>{
          dispatch(generalActions.emptyState());
      }, 3000)
    } catch (err) {
        dispatch(generalActions.changeValidation(err.message));
        dispatch(generalActions.showValidationMessages());
    }
  }



  const searchRecord = (e) =>{
      const copy = [...clients.clients];
      const idx = copy.findIndex(client=>client.account.phone == e.target.value);
      const client = copy.find(client=>client.account.phone  == e.target.value);
      if(e.target.value.trim() == "" && e.target.value.length <= 1){
        setsearchedValue(prevState=>({
          ...prevState,
          showSearchedValue: false,
          value: {}
        }));
      }
      if(!client){
        setsearchedValue(prevState=>({
          ...prevState,
          showSearchedValue: !prevState.showSearchedValue,
          value: {}
        }));
      }
      setsearchedValue(prevState=>({
        ...prevState,
        showSearchedValue: !prevState.showSearchedValue,
        value: client,
        idx
      }))
  }


  const filterData = (e) => {
    if(e.target.name == "sort"){
      setFiltering(prevState=>({
        ...prevState,
        order: !prevState.order
      }));
      if(filtering.order){
        setClientsOrder(clientsOrder.sort((date1, date2)=> date1.created_at < date2.created_at ? -1 : 1));
      }else{
        setClientsOrder(clientsOrder.sort((date1, date2)=> date1.created_at > date2.created_at ? -1 : 1));
      }
    }
  }

  const toggleModalDetails = (idx) => {
    const tableContainer = document.querySelector('.table-details-container');
      setData(null);
      setData(clientsOrder[idx]);
      tableContainer.style.opacity = '0.2';
      dispatch(generalActions.toggleModalDetails());
      if(window.screen.width < 735){
        scrollTo({
          behavior:'smooth',
          top:'500'
        })
      }else{
        scrollTo({
          behavior:'smooth',
          top:'1000'
        })
      }
  }

 


  return <Fragment>

        <div className="grid-data-details-container">
            <GridData
            icon={<BsHash size={25} color="white" />}
            title="Total numbers of registered clients"
            link="/en/admin/clients"
            data={clients.clients.length}
            />
        </div>

        <GridLayout chart={
             <MyChart
            Component={Bar}
            label="clients"
            title="Numbers of registered clients per month"
            data={clientsData}
            bgColor={generalReducer.BAR_COLORS}
            brdrColor={generalReducer.BAR_COLORS}
        />
        } />

        <br/>
          <div className="sort-option-container">
            <input type="checkbox" id="sort" name="sort" onChange={filterData}/>
            <label htmlFor="sort">DESC</label>
          </div>
          <div className="search-input">
            <input type="text" maxLength="13" onChange={(e)=>searchRecord(e)} placeholder="Search By Phone..+966" inputMode='tel' className="english-input"/>
          </div>

          
        {data !== null &&  <ModalDetails setDatas={setData} client={true} info={data} remove={removeHandler} title={"Manage Client"} update={submitHandler}/> }
    
    <Table
        headers={TABLE_CLIENTS_HEADERS.map((header) => (
          <th key={header}>{header}</th>
        ))}
        details={true}
      >
        {!searchedValue.showSearchedValue ? clientsOrder.length > 0 && clientsOrder[0].account != null && clientsOrder.sort().map((client, idx) => {
          return (
            <Fragment key={client.clientId}>
              <tr key={client.clientId}>
                <Td key={client.account.name} value={client.account.name}/>
                <Td key={client.account.email} value={client.account.email}/>
                <Td value= {<Button className="btn-details-admin" disabled={generalReducer.toggleModalDetails ? true : false} onClick={()=>toggleModalDetails(idx)}>Show</Button>} />
              </tr>
            </Fragment>
          );
        }) : searchedValue.value && <Fragment>
        <tr key={searchedValue.value.clientId}>
        <Td key={searchedValue.value.account.name} value={searchedValue.value.account.name}/>
        <Td key={searchedValue.value.account.email} value={searchedValue.value.account.email}/>
        <Td value= {<Button disabled={generalReducer.toggleModalDetails ? true : false} onClick={()=>toggleModalDetails(searchedValue.idx)}>Show</Button>} />
      </tr>
        
      </Fragment>
      
    
          }
      </Table>
  </Fragment> 
};

export default ClientsDashboard;
