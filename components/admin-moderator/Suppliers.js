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
import suppliersActions from "../../stores/actions/suppliersActions";
import {BsHash} from "react-icons/bs";
import SearchInput from "../reusable/Input/SearchInput";
import Td from "../reusable/Table/Td";
import MyChart from "../reusable/charts/Chart";
import {Bar} from 'react-chartjs-2';
import {getSession} from 'next-auth/client';

const TABLE_SUPPLIERS_HEADERS = ["ID", "Name", "Name(AR)", "Eamil", "Phone", "CO", "CO(AR)", "VERIFIED"];

const SuppliersDashboard = ({token, moderator}) => {
  const [session, setSession] = useState();
  const router = useRouter();
  const suppliers = useSelector((state) => state.suppliersReducer);
  const [suppliersOrder, setSupplierOrder] = useState([]);
  const generalReducer = useSelector((state) => state.generalReducer);
  const suppliersData = findStatisticsPerMonth(suppliers.suppliers);    
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const [filtering, setFiltering] = useState({
      order: false,
      verified: false,
      notVerified: false,
      susbended: false
  });
  const [status, setStatus] = useState({
      sending: false,
      succeed:false,
      manage:null,
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

 useEffect(async()=>{
   const session = await getSession();
   setSession(session)
 },[]);

 useEffect(()=>{
    setSupplierOrder(suppliers.suppliers);
 },[suppliers.suppliers])


 const switchToEditable = (supplierId) => {
    const supplier = suppliers.suppliers.find(
      (supplier) => supplier.supplierId == supplierId
    );
    if (!supplier) {
      setShow(false);
    }
    setEditMood(supplier);
    setShow(true);
  };

  const changeHandler = (e) => {
    setEditMood((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
      accounts: {
        ...editMood.accounts,
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
      const validateCompanyMessage = validateAccountsInput(editMood.companyInEnglish,false,true,false,false, false, false);
      const validateCopanyArabicMessage = validateAccountsInput(editMood.companyInArabic,true,false,false,false,false);
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
      if (validateCompanyMessage.length > 0) {
        changeValidationState(validateCompanyMessage);
      }
      if(validateCopanyArabicMessage.length > 0){
          changeValidationState(validateCopanyArabicMessage);
      }
      if (
        validateEmailMessage.length > 0 ||
        validateNameMessage.length > 0 ||
        validateNameArabicMessage.length > 0 ||
        validatePhoneMessage.length > 0 ||
        validateCompanyMessage.length > 0 ||
        validateCopanyArabicMessage.length > 0
      ) {
        setStatus(prevState=>({
            ...prevState,
            sending: false,
            text:"",
            show: true
        }));
        return;
      }
      const data = await fetch(`${generalReducer.ENDPOINT}/moderator/update-supplier`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token
        },
        body: JSON.stringify({
          uid: session.user.name.id,
          supplierId: editMood.supplierId,  
          name: editMood.accounts.name,
          nameInArabic: editMood.accounts.nameInArabic,
          email: editMood.accounts.email,
          phone: editMood.accounts.phone,
          companyInEnglish: editMood.companyInEnglish,
          companyInArabic: editMood.companyInArabic,
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
      dispatch(suppliersActions.updateSupplier(editMood));
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
            text:"",
            show: true,
        }));
    }
  };


  const cancelEditMood = () =>{
    setShow(false);
    setEditMood(null);
  }


const navigateToDetails = (supplierId) => {
    if(moderator){
      router.push(`/en/moderator/suppliers/${supplierId}`)
      return;
    }
    router.push(`/en/admin/suppliers/${supplierId}`)
}


  const searchRecord = (e) =>{
      const copy = [...suppliers.suppliers];
      const supplier = copy.find(supplier=>supplier.accounts.phone  == e.target.value);
      if(e.target.value.trim() == "" && e.target.value.length <= 1){
        setsearchedValue(prevState=>({
          ...prevState,
          showSearchedValue: false,
          value: {}
        }));
      }
      if(!supplier){
        setsearchedValue(prevState=>({
          ...prevState,
          showSearchedValue: !prevState.showSearchedValue,
          value: {}
        }));
      }
      setsearchedValue(prevState=>({
        ...prevState,
        showSearchedValue: !prevState.showSearchedValue,
        value: supplier
      }))
  }


const filterData = (e) => {
  if(e.target.name == "sort"){
    setFiltering(prevState=>({
      ...prevState,
      order: !prevState.order
    }));
    if(filtering.order){
      setSupplierOrder(suppliersOrder.sort((id1, id2)=> id1.supplierId < id2.supplierId ? -1 : 1));
    }else{
      setSupplierOrder(suppliersOrder.sort((id1, id2)=> id1.supplierId > id2.supplierId ? -1 : 1));
    }
  }else if(e.target.name == "verified"){
    setFiltering(prevState=>({
      ...prevState,
      verified: !prevState.verified,
      notVerified: false,
      susbended: false,
    }));
    if(!filtering.verified){
      setSupplierOrder(suppliersOrder.filter(supplier=>supplier.verified == 1));
    }else{
      setSupplierOrder([...suppliers.suppliers]);
    }
  }else if(e.target.name == "notVerified"){
    setFiltering(prevState=>({
      ...prevState,
      notVerified: !prevState.notVerified,
      verified: false,
      susbended: false,
    }));
    if(!filtering.notVerified){
      setSupplierOrder(suppliersOrder.filter(supplier=>supplier.verified == 0));
    }else{
      setSupplierOrder([...suppliers.suppliers]);
    }
  }else if(e.target.name == "susbended"){
    setFiltering(prevState=>({
      ...prevState,
      susbended: !prevState.susbended,
      verified: false,
      notVerified: false,
    }));
    if(!filtering.susbended){
      setSupplierOrder(suppliersOrder.filter(supplier=>supplier.verified == 2));
    }else{
      setSupplierOrder([...suppliers.suppliers]);
    }
  }
}


const manageSupplierProcess = async (supplierId,endpoint) => {
    let response;
    const data = await fetch(`${generalReducer.ENDPOINT}/moderator/${endpoint}`, {
      method: "PATCH",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token
      },
      body:JSON.stringify({
        uid: session.user.name.id,
        supplierId: supplierId
      })
    });

    response = await data.json();
    
    return response;
}



const manageSupplier = async (supplierId, verify, unverify, suspend) => {
  try{
    emptyState();
    setStatus(prevState=>({
      ...prevState,
      manage: supplierId,
      text: "progress..."
    }))
    let response;
    if(verify){
      response = await manageSupplierProcess(supplierId,"verify-supplier")
      if(response.statusCode == 421 || response.statusCode == 404){
        const error = new Error(response.message);
        throw error;
      }else if(response.statusCode != 200){
        const error = new Error(response.message);
        throw error;
      }
      dispatch(suppliersActions.verifySupplier(supplierId));
    }else if(unverify){
      response = await manageSupplierProcess(supplierId,"unverify-supplier");
      if(response.statusCode == 421 || response.statusCode == 404){
        const error = new Error(response.message);
        throw error;
      }else if(response.statusCode != 200){
        const error = new Error(response.message);
        throw error;
      }
      dispatch(suppliersActions.unverifySupplier(supplierId));
    }else if(suspend){
      response = await manageSupplierProcess(supplierId,"suspend-supplier");
      if(response.statusCode == 421 || response.statusCode == 404){
        const error = new Error(response.message);
        throw error;
      }else if(response.statusCode != 200){
        const error = new Error(response.message);
        throw error;
      }
      dispatch(suppliersActions.suspendSupplier(supplierId));
    }

    changeValidationState(response.message);
    setStatus(prevState=>({
      ...prevState,
      show:true,
      manage:null,
      succeed:true,
      text:"" 
  }))
  setTimeout(()=>{
    emptyState();
  }, 3000)
  }catch(err){
      changeValidationState(err.message)
      setStatus(prevState=>({
          ...prevState,
          manage:null,
          text:"",
          show: true,
      }));
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
        title="Total numbers of registered suppliers"
        style="grid-list-gray-style"
        link="/en/admin/suppliers"
        children={suppliers.suppliers.length}
        titleStyle={classes.titleStyle}
        cardContainerSyle={classes.cardContainerRectangleDetails}
        />
    </div>

      <div className="ml-16 md:ml-0">
        <MyChart
        Component={Bar}
        label="suppliers"
        title="Numbers of registered suppliers per month"
        data={suppliersData}
        bgColor={generalReducer.BAR_COLORS}
        brdrColor={generalReducer.BAR_COLORS}
        />
      </div>

      <div className="flex flex-col md:justify-evenly">
        <div className="self-center">
          <SearchInput type="text" maxLength="13" onChange={(e)=>searchRecord(e)} icon="search" placeholder="Search By Phone.."/>
        </div>
        <div className="flex flex-row justify-between md:justify-evenly pb-6 mt-7">
           <div className="flex flex-row items-center pb-6 ml-5 md:ml-0">
            <Input type="checkbox" id="sort" name="sort" onChange={filterData}/>
            <label htmlFor="sort" className="font-Raleway text-xl ml-3 md:text-lg">DESC</label>
          </div>
           <div className="flex flex-row items-center pb-6 ml-5 md:ml-0">
            <Input type="checkbox" id="verified" name="verified" checked={filtering.verified ? true : false} onChange={filterData}/>
            <label htmlFor="verified" className="font-Raleway text-xl ml-3 md:text-lg">verified</label>
          </div>
           <div className="flex flex-row items-center pb-6 ml-5 md:ml-0">
            <Input type="checkbox" id="nVerified" name="notVerified" checked={filtering.notVerified ? true : false} onChange={filterData}/>
            <label htmlFor="nVerified" className="font-Raleway text-xl ml-3 md:text-lg">Not verified</label>
          </div>
           <div className="flex flex-row items-center pb-6 ml-5 md:ml-0">
            <Input type="checkbox" id="susbended" name="susbended" checked={filtering.susbended ? true : false} onChange={filterData} />
            <label htmlFor="susbended" className="font-Raleway text-xl ml-3 md:text-lg">Susbended</label>
          </div>
        </div>
      </div>

    <Table
        headers={TABLE_SUPPLIERS_HEADERS.map((header) => (
          <th key={header}>{header}</th>
        ))}
        style={show ? classes.editModeTable : classes.detailsTable}
      >
        {!searchedValue.showSearchedValue ? suppliersOrder.map((supplier) => {
          return (
            <Fragment>
              <tr key={supplier.supplierId}>
                <Td key={supplier.supplierId} value={supplier.supplierId}/>
                <Td value={supplier.accounts.name} onClick={()=>navigateToDetails(supplier.supplierId)}/>
                <Td value={supplier.accounts.nameInArabic} onClick={()=>navigateToDetails(supplier.supplierId)}/>
                <Td key={supplier.accounts.email} value={supplier.accounts.email}/>
                <Td key={supplier.accounts.phone} value={supplier.accounts.phone}/>
                <Td key={supplier.companyInEnglish} value={supplier.companyInEnglish}/>
                <Td key={supplier.companyInArabic} value={supplier.companyInArabic}/>
                <Td key={supplier.verified} 
                value={supplier.verified == 0 ? "N" : supplier.verified == 1 ? "V" : supplier.verified == 2 ? "S" : null } 
                className={supplier.verified == 0 ? classes.notVerified : supplier.verified == 2 ? classes.suspend:null}/>
                <Td className={classes.tdAction} value={<Menu.Menu position="right">
                        <Dropdown item text={status.manage == supplier.supplierId ? status.text :"actions"} disabled ={status.sending && editMood.supplierId == supplier.supplierId ? true : status.manage == supplier.supplierId ? true : false}>
                          <Dropdown.Menu>
                            <Dropdown.Item
                              onClick={() => switchToEditable(supplier.supplierId)}
                            >
                              Edit
                            </Dropdown.Item>
                            {supplier.verified != 1 &&
                            <Dropdown.Item
                            onClick={()=>manageSupplier(supplier.supplierId, true, false, false)} 
                            >Verify</Dropdown.Item>
                            }
                            {supplier.verified != 0 && 
                            <Dropdown.Item 
                            onClick={()=>manageSupplier(supplier.supplierId, false, true , false)} 
                            >Unverify</Dropdown.Item>
                            }
                            {supplier.verified != 2 && 
                            <Dropdown.Item 
                            onClick={()=>manageSupplier(supplier.supplierId, false, false, true)} 
                            >Suspend</Dropdown.Item>
                            }
                          </Dropdown.Menu>
                        </Dropdown>
                      </Menu.Menu>}/>
              </tr>
              {show && editMood.supplierId == supplier.supplierId && (
                <Fragment>
                  <tr key={supplier.supplierId}>
                    <Td value="-"/>
                    <Td value="-"/>
                    <Td value={<Input type="text" value={editMood.accounts.name} required name="name" minLength="2" maxLength="30" 
                      onChange={(e) => changeHandler(e)}/>}/>
                    <Td value={<Input type="text" value={editMood.accounts.nameInArabic} minLength="2" maxLength="30" required name="nameInArabic" 
                    onChange={(e) => changeHandler(e)}/>}/>
                    <Td value={<Input type="email" value={editMood.accounts.email} required minLength="2" maxLength="30" name="email" 
                    onChange={(e) => changeHandler(e)} />}/> 
                    <Td value={<Button disabled = {status.sending && editMood.supplierId == supplier.supplierId ? true : false } text={status.sending && editMood.supplierId == supplier.supplierId ? status.text : "Update" } submit={true} onClick={submitHandler}/>}/>
                    <Td value="-"/> <Td value="-"/>
                  </tr>
                  <tr>
                  <Td value="-"/> <Td value="-"/>
                    <Td value ={<Input type="text" value={editMood.accounts.phone} required minLength="10" maxLength="13" name="phone" 
                    onChange={(e) => changeHandler(e)}/>}/>
                    <Td value={<Input type="text" value={editMood.companyInEnglish} required name="companyInEnglish" minLength="10" maxLength="25" 
                    onChange={(e) => changeHandler(e)}/>}/>
                    <Td value={<Input type="text" value={editMood.companyInArabic} required name="companyInArabic" minLength="10" maxLength="25" 
                    onChange={(e) => changeHandler(e)}/>}/>
                    <Td value={<Button disabled = {status.sending && editMood.supplierId == supplier.supplierId ? true : false } text="Cancel" cancel={true} 
                    onClick={cancelEditMood}
                    />}/>
                  <Td value="-"/> <Td value="-"/>
                  </tr>
                </Fragment>
              )}
            </Fragment>
          );
        }) : searchedValue.value && <Fragment>
        <tr key={searchedValue.value.supplierId}>
        <td>{searchedValue.value.supplierId}</td>
        <Td onClick={()=>navigateToDetails(searchedValue.value.supplierId)} value={searchedValue.value.accounts.name}/>
        <Td onClick={()=>navigateToDetails(searchedValue.value.supplierId)} value={searchedValue.value.accounts.nameInArabic}/>
        <Td value={searchedValue.value.accounts.email}/>
        <Td value={searchedValue.value.accounts.phone}/>
        <Td value={searchedValue.value.companyInEnglish}/> 
        <Td value={searchedValue.value.companyInArabic}/>
        <Td key={searchedValue.value.verified} value={searchedValue.value.verified == 0 ? "N" : searchedValue.value.verified == 1 ? "V" : searchedValue.value.verified == 2 ? "S" : null }/>
        <Td className={classes.tdAction} value={<Menu.Menu position="right">
        <Dropdown item text={status.manage == searchedValue.value.supplierId ? status.text :"actions"} disabled ={status.sending && editMood.supplierId == supplier.supplierId ? true : status.manage == searchedValue.value.supplierId ? true : false}>
        <Dropdown.Menu>
          <Dropdown.Item
            onClick={() => switchToEditable(supplier.supplierId)}
          >
            Edit
          </Dropdown.Item>
          {searchedValue.value.verified != 1 &&
          <Dropdown.Item 
          onClick={()=>manageSupplier(editMood.supplierId, true, false, false)} 
          >Verify</Dropdown.Item>
          }
          {searchedValue.value.verified != 0 &&
          <Dropdown.Item 
          className={searchedValue.value.verified == 0 ? "hidden" : null}
          onClick={()=>manageSupplier(editMood.supplierId, false, true , false)} 
          >Unverify</Dropdown.Item>
          }
          {searchedValue.value.verified != 2 && 
          <Dropdown.Item 
          className={searchedValue.value.verified == 2 ? "hidden" : null}
          onClick={()=>manageSupplier(editMood.supplierId, false, false, true)} 
          >Suspend</Dropdown.Item>
          }
        </Dropdown.Menu>
      </Dropdown>
      </Menu.Menu>}/>
      </tr>
      {show &&  searchedValue.value.supplierId == editMood.supplierId && (
        <Fragment>
        <tr key={searchedValue.value.supplierId}>
        <Td value="-"/> <Td value="-"/>
        <Td value={<Input type="text" value={editMood.accounts.name} required name="name" minLength="2" maxLength="30" 
        onChange={(e) => changeHandler(e)}/>}/>
        <Td value={<Input type="text" value={editMood.accounts.nameInArabic} minLength="2" maxLength="30" required name="nameInArabic" 
        onChange={(e) => changeHandler(e)}/>}/>
        <Td value={<Input type="email" value={editMood.accounts.email} required minLength="2" maxLength="30" name="email" 
        onChange={(e) => changeHandler(e)} />}/> 
        <Td value={<Button disabled = {status.sending && editMood.supplierId == searchedValue.value.supplierId ? true : false } 
        text={status.sending && editMood.supplierId == searchedValue.value.supplierId ? status.text : "Update" } submit={true} onClick={submitHandler}
        />}/>
        <Td value="-"/> <Td value="-"/>
      </tr>
      <tr>
        <Td value="-"/> <Td value="-"/>
          <Td value ={<Input type="text" value={editMood.accounts.phone} required minLength="10" maxLength="13" name="phone" 
          onChange={(e) => changeHandler(e)}/>}/>
          <Td value={<Input type="text" value={editMood.companyInEnglish} required name="companyInEnglish" minLength="10" maxLength="25" 
          onChange={(e) => changeHandler(e)}/>}/>
          <Td value={<Input type="text" value={editMood.companyInArabic} required name="companyInArabic" minLength="10" maxLength="25" 
          onChange={(e) => changeHandler(e)}/>}/>
          <Td value={<Button disabled = {status.sending && editMood.supplierId == searchedValue.value.supplierId ? true : false } text="Cancel" cancel={true} 
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

export default SuppliersDashboard;
