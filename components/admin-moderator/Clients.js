import { Fragment, useEffect} from "react";
import {useRouter} from 'next/router';
import Table from "../reusable/Table/Table";
import classes from "../reusable/reusable-style.module.css";
import { useDispatch, useSelector } from "react-redux";
import GridLayout from "../reusable/GridLayout";
import GridList from "../reusable/GridList";
import {findStatisticsPerMonth, validateAccountsInput,} from "../../helper/functions";
import { Menu, Dropdown, Modal, Search } from "semantic-ui-react";
import { useState } from "react";
import Input from "../reusable/Input/input";
import Button from "../reusable/Button/Button";
import clientsActions from "../../stores/actions/clientsActions";
import {BsHash} from "react-icons/bs";
import SearchInput from "../reusable/Input/SearchInput";
import Td from "../reusable/Table/Td";
import MyChart from "../reusable/charts/Chart";
import {Bar} from 'react-chartjs-2';
import {getSession} from 'next-auth/client';
const TABLE_CLIENTS_HEADERS = ["ID", "Name", "Name(AR)", "Eamil", "Phone", "Country", "City"];

const ClientsDashboard = ({token, moderator}) => {
  const [session, setSession] = useState();
  const router = useRouter();
  const clients = useSelector((state) => state.clientsReducer);
  const [clientsOrder, setClientsOrder] = useState([]);
  const generalReducer = useSelector((state) => state.generalReducer);
  const clientsData = findStatisticsPerMonth(clients.clients);
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const [filtering, setFiltering] = useState({
    order: false,
  });
  const [status, setStatus] = useState({
      sending: false,
      succeed:false,
      text: "",
      show: false,
  });
  const [editMood, setEditMood] = useState(null);
  const [validation, setValidation] = useState({
      values: [],
  });
  const [searchedValue, setsearchedValue] = useState({
    showSearchedValue: false,
    value: {}
  });

  const [switchOrder, setSwitchOrder] = useState(false);

  useEffect(async()=>{
    const session = await getSession();
    setSession(session);
  }, [])

  useEffect(()=>{
    setClientsOrder(clients.clients);
  },[clients.clients])


  const switchToEditable = (clientId) => {
    const client = clients.clients.find(
      (client) => client.clientId == clientId
    );
    if (!client) {
      setShow(false);
    }
    setEditMood(client);
    setShow(true);
  };

  const changeHandler = (e) => {
    setEditMood((prevState) => ({
      ...prevState,
      accounts: {
        ...editMood.accounts,
        [e.target.name]: e.target.value,
      },
      address: {
        ...editMood.address,
        [e.target.name]: e.target.value,
      },
    }));
  };

  const changeValidationState = (value) => {
    if(typeof(value) != "string"){
      setValidation((prevState) => ({
        ...prevState,
          values: value
      }));
    }
    setValidation((prevState) => ({
      ...prevState,
        values: prevState.values.concat(value)
    }));
  };

  const emptyState = () => {
    setValidation({
        values: [],
    });
    setStatus(prevState=>({
        ...prevState,
        sending: false,
        succeed:false,
        text:"",
        show: false
    }));
  };

  const submitHandler = async () => {
    try {
      emptyState();
      setStatus(prevState=>({
          ...prevState,
          sending:true,
          text: "sending..."
      }))
      const validateEmailMessage = validateAccountsInput(editMood.accounts.email, false, false, true, false, false);
      const validateNameMessage = validateAccountsInput(editMood.accounts.name,false,true,false,false,false);
      const validateNameArabicMessage = validateAccountsInput(editMood.accounts.nameInArabic,true,false,false,false,false);
      const validatePhoneMessage = validateAccountsInput(editMood.accounts.phone,false,false,false,true,false);
      const validateCountryMessage = validateAccountsInput(editMood.address.country,false,false,false,false, true, false);
      const validateCityMessage = validateAccountsInput(editMood.address.city,false,false,false,false,false, true);
      if (validateEmailMessage.length > 0) {
        changeValidationState(validateEmailMessage);
      }
      if (validateNameMessage.length > 0) {
        changeValidationState(validateNameMessage);
      }
      if (validateNameArabicMessage.length > 0) {
        changeValidationState(validateNameArabicMessage);
      }
      if (validatePhoneMessage.length > 0) {
        changeValidationState(validatePhoneMessage);
      }
      if (validateCountryMessage.length > 0) {
        changeValidationState(validateCountryMessage);
      }
      if(validateCityMessage.length > 0){
          changeValidationState(validateCityMessage);
      }
      if (
        validateEmailMessage.length > 0 ||
        validateNameMessage.length > 0 ||
        validateNameArabicMessage.length > 0 ||
        validatePhoneMessage.length > 0 ||
        validateCountryMessage.length > 0 ||
        validateCityMessage.length > 0
      ) {
        setStatus(prevState=>({
            ...prevState,
            sending: false,
            text:"",
            show: true
        }));
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
          clientId: editMood.clientId,  
          name: editMood.accounts.name,
          nameInArabic: editMood.accounts.nameInArabic,
          email: editMood.accounts.email,
          phone: editMood.accounts.phone,
          address: {
            country: editMood.address.country,
            city: editMood.address.city,
          },
        }),
      });
      const response = await data.json();
      if(response.statusCode == 421 || response.statusCode == 404){
        const error = new Error(response.message);
        throw error;
      }else if (response.statusCode !== 200 && response.statusCode !== 201) {
        let fullResponse;
        for(const keys in response){
            if(keys=="message"){
                for(const key in response[keys]){
                    fullResponse= response[keys][key];
                }
            }
        }
        const error = new Error(fullResponse);
        throw error;
      }
      dispatch(clientsActions.updateClient(editMood));
      changeValidationState(response.message);
      setStatus(prevState=>({
        ...prevState,
        show:true,
        sending:false,
        succeed:true,
        text:"" 
      }))
      setTimeout(()=>{
            emptyState();
      }, 3000)
    } catch (err) {
        changeValidationState(err.message)
        setStatus(prevState=>({
            ...prevState,
            sending:false,
            show: true,
        }));
    }
  };

  const removeHandler = async (clientId) => {
    try{
        emptyState();
        setEditMood(clientId);
        setStatus(prevState=>({
            ...prevState,
            sending:true,
            text: "deleting..."
        }))
        const data = await fetch(`${generalReducer.ENDPOINT}/client/client-operations/${clientId}`, {
        method: "DELETE",
        headers:{
            "Content-Type": "application/json",
            "Authorization": token
        },
        body: JSON.stringify({
            uid: session.user.name.id,
            clientId: clientId
        })
        });
        const response = await data.json();
        if (response.statusCode !== 200 && response.statusCode !== 201) {
        const error = new Error(response.message);
        throw error;
        }
        dispatch(clientsActions.removeClient(clientId));
        changeValidationState(response.message);
        setStatus(prevState=>({
            ...prevState,
            show:true,
            sending:false,
            succeed:true,
            text:"" 
        }))
        setTimeout(()=>{
            emptyState();
        }, 3000)
    } catch (err) {
        changeValidationState(err.message)
        setStatus(prevState=>({
            ...prevState,
            show: true,
        }));
    }
  }


  const cancelEditMood = () =>{
    setShow(false);
    setEditMood(null);
  }


  const navigateToDetails = (clientId) => {
    if(moderator){
      router.push(`/en/moderator/clients/${clientId}`)
      return;
    }
    router.push(`/en/admin/clients/${clientId}`)
  }


  const searchRecord = (e) =>{
      const copy = [...clients.clients];
      const client = copy.find(client=>client.accounts.phone  == e.target.value);
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
        value: client
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





  return (
    <GridLayout>

    <Modal
    size={'tiny'}
    open= {status.show}
    onClose={() => setStatus(prevState=>({...prevState, show:false}))}>
        <Modal.Header>Information!</Modal.Header>
        <Modal.Content>
            <ol>
                {!status.succeed ? validation.values.map(value=>(
                    <li key={value} className="text-red-600 p-4 text-xl md:text-lg">{value}</li>
                ))
                : validation.values.map(value=>(
                    <li key={value} className="text-green-600 text-xl p-4">{value}</li>
                ))
                }
           </ol>
        </Modal.Content>
    </Modal>



    <div className="ml-12 md:ml-96 md:mb-28">
        <GridList
        icon={<BsHash size={25} color="white" />}
        title="Total numbers of registered clients"
        style="grid-list-gray-style"
        link="/en/admin/clients"
        children={clients.clients.length}
        titleStyle={classes.titleStyle}
        cardContainerSyle={classes.cardContainerRectangleDetails}
        />
    </div>

      <div className="ml-16 md:ml-0">
          <MyChart
          Component={Bar}
          label="clients"
          title="Numbers of registered clients per month"
          data={clientsData}
          bgColor={generalReducer.BAR_COLORS}
          brdrColor={generalReducer.BAR_COLORS}
        />
      </div>

      <div className="flex flex-row justify-between items-center md:justify-evenly">
        <div className="flex flex-row items-center pb-6">
        <Input type="checkbox" id="sort" name="sort" onChange={filterData}/>
          <label htmlFor="sort" className="font-Raleway text-xl ml-3 md:text-lg">DESC</label>
        </div>
        <div className="relative">
          <SearchInput type="text" maxLength="13" onChange={(e)=>searchRecord(e)} icon="search" placeholder="Search By Phone.."/>
        </div>
      </div>

    <Table
        headers={TABLE_CLIENTS_HEADERS.map((header) => (
          <th key={header}>{header}</th>
        ))}
        style={show ? classes.editModeTable : classes.detailsTable}
      >
        {!searchedValue.showSearchedValue ? clientsOrder.sort().map((client) => {
          return (
            <Fragment>
              <tr key={client.clientId}>
                <Td value={client.clientId}/>
                <Td value={client.accounts.name} onClick={()=>navigateToDetails(client.clientId)}/>
                <Td value={client.accounts.nameInArabic} onClick={()=>navigateToDetails(client.clientId)}/>
                <Td value={client.accounts.email}/>
                <Td value={client.accounts.phone}/>
                <Td value={client.address.country}/>
                <Td value={client.address.city}/>
                <Td className={classes.tdAction} value={<Menu.Menu position="right">
                        <Dropdown item text="actions" disabled ={status.sending && editMood.clientId == client.clientId ? true : false}>
                          <Dropdown.Menu>
                            <Dropdown.Item
                              onClick={() => switchToEditable(client.clientId)}
                            >
                              Edit
                            </Dropdown.Item>
                            <Dropdown.Item 
                            onClick={()=>removeHandler(client.clientId)} 
                            >Remove</Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </Menu.Menu>}/>
              </tr>
              {show && editMood.clientId == client.clientId && (
                <Fragment>
                  <tr key={client.clientId}>
                    <Td value="-"/>
                    <Td value="-"/>
                    <Td value={<Input type="text" value={editMood.accounts.name} required name="name" minLength="2" maxLength="30" 
                      onChange={(e) => changeHandler(e)}/>}/>
                    <Td value={<Input type="text" value={editMood.accounts.nameInArabic} minLength="2" maxLength="30" required name="nameInArabic" 
                    onChange={(e) => changeHandler(e)}/>}/>
                    <Td value={<Input type="email" value={editMood.accounts.email} required minLength="2" maxLength="30" name="email" 
                    onChange={(e) => changeHandler(e)} />}/> 
                    <Td value={<Button disabled = {status.sending && editMood.clientId == client.clientId ? true : false } text={status.sending && editMood.clientId == client.clientId ? status.text : "Update" } submit={true} onClick={submitHandler}/>}/>
                    <Td value="-"/> <Td value="-"/>
                  </tr>
                  <tr>
                  <Td value="-"/> <Td value="-"/>
                    <Td value ={<Input type="text" value={editMood.accounts.phone} required minLength="10" maxLength="13" name="phone" 
                    onChange={(e) => changeHandler(e)}/>}/>
                    <Td value={<Input type="text" value={editMood.address.country} required name="country" minLength="10" maxLength="25" 
                    onChange={(e) => changeHandler(e)}/>}/>
                    <Td value={<Input type="text" value={editMood.address.city} required name="city" minLength="10" maxLength="25" 
                    onChange={(e) => changeHandler(e)}/>}/>
                    <Td value={<Button disabled = {status.sending && editMood.clientId == client.clientId ? true : false } text="Cancel" cancel={true} 
                    onClick={cancelEditMood}
                    />}/>
                  <Td value="-"/> <Td value="-"/>
                  </tr>
                </Fragment>
              )}
            </Fragment>
          );
        }) : searchedValue.value && <Fragment>
        <tr key={searchedValue.value.clientId}>
        <td>{searchedValue.value.clientId}</td>
        <Td onClick={()=>navigateToDetails(searchedValue.value.clientId)} value={searchedValue.value.accounts.name}/>
        <Td onClick={()=>navigateToDetails(searchedValue.value.clientId)} value={searchedValue.value.accounts.nameInArabic}/>
        <Td value={searchedValue.value.accounts.email}/>
        <Td value={searchedValue.value.accounts.phone}/>
        <Td value={searchedValue.value.address.country}/> 
        <Td value={searchedValue.value.address.city}/>
        <Td className={classes.tdAction} value={<Menu.Menu position="right">
        <Dropdown item text="actions" disabled ={status.sending && editMood.clientId == searchedValue.value.clientId ? true : false}>
          <Dropdown.Menu>
            <Dropdown.Item
              onClick={() => switchToEditable(searchedValue.value.clientId)}
            >
              Edit
            </Dropdown.Item>
            <Dropdown.Item 
            onClick={()=>removeHandler(searchedValue.value.clientId)} 
            >Remove</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </Menu.Menu>}/>
      </tr>
      {show &&  searchedValue.value.clientId == editMood.clientId && (
        <Fragment>
        <tr key={searchedValue.value.clientId}>
        <Td value="-"/> <Td value="-"/>
        <Td value={<Input type="text" value={editMood.accounts.name} required name="name" minLength="2" maxLength="30" 
        onChange={(e) => changeHandler(e)}/>}/>
        <Td value={<Input type="text" value={editMood.accounts.nameInArabic} minLength="2" maxLength="30" required name="nameInArabic" 
        onChange={(e) => changeHandler(e)}/>}/>
        <Td value={<Input type="email" value={editMood.accounts.email} required minLength="2" maxLength="30" name="email" 
        onChange={(e) => changeHandler(e)} />}/> 
        <Td value={<Button disabled = {status.sending && editMood.clientId == searchedValue.value.clientId ? true : false } 
        text={status.sending && editMood.clientId == searchedValue.value.clientId ? status.text : "Update" } submit={true} onClick={submitHandler}
        />}/>
        <Td value="-"/> <Td value="-"/>
      </tr>
      <tr>
        <Td value="-"/> <Td value="-"/>
          <Td value ={<Input type="text" value={editMood.accounts.phone} required minLength="10" maxLength="13" name="phone" 
          onChange={(e) => changeHandler(e)}/>}/>
          <Td value={<Input type="text" value={editMood.address.country} required name="country" minLength="10" maxLength="25" 
          onChange={(e) => changeHandler(e)}/>}/>
          <Td value={<Input type="text" value={editMood.address.city} required name="city" minLength="10" maxLength="25" 
          onChange={(e) => changeHandler(e)}/>}/>
          <Td value={<Button disabled = {status.sending && editMood.clientId == searchedValue.value.clientId ? true : false } text="Cancel" cancel={true} 
          onClick={cancelEditMood}
          />}/>
        <Td value="-"/> <Td value="-"/>
        </tr>
      </Fragment>
      ) }
        
      </Fragment>
      
    
          }
      </Table>
      
      
    </GridLayout>
  );
};

export default ClientsDashboard;
