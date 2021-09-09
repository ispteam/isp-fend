import { Fragment, useEffect} from "react";
import {useRouter} from 'next/router';
import Table from "components/reusable/Tables";
import { useDispatch, useSelector } from "react-redux";
import GridLayout from "components/reusable/GridLayout";
import GridData from "components/reusable/GridData";
import {findStatisticsPerMonth, sendEmail, validateAccountsInput} from "helper/functions";
import { useState } from "react";
import {BsHash} from "react-icons/bs";
import MyChart from "components/reusable/Chart";
import {Bar} from 'react-chartjs-2';
import {getSession} from 'next-auth/client';
import Td from "components/reusable/Td";
import Button from "components/reusable/Button";
import ModalDetails from "./ModalDetails";
import generalActions from "stores/actions/generalActions";
import suppliersActions from "stores/actions/suppliersActions";

const TABLE_SUPPLIERS_HEADERS = ["Eamil", "Phone", "CO", "CO(AR)", "Cert" ,"Verified", "Details"];

const SuppliersDashboard = ({token, session}) =>{
    const router = useRouter();
    const suppliers = useSelector((state) => state.suppliersReducer); //To fecth all the suppliers information from the store.
    /**
     * Why we made a copy of the suppliers information?
     * In order to change the sort of the array and display the sorted values.
     */
    const [suppliersOrder, setSupplierOrder] = useState([]);
    const generalReducer = useSelector((state) => state.generalReducer); //To get the general store values.
    const suppliersData = findStatisticsPerMonth(suppliers.suppliers); // To get the statistics data of the suppliers
    const dispatch = useDispatch();
    const [data, setData] = useState(null);
  
    //to show the information by any property of filtering.
    const [filtering, setFiltering] = useState({
        order: false,
        verified: false,
        notVerified: false,
        susbended: false
    });
  

  

  
      //To search a specific value of suppliers
      const [searchedValue, setsearchedValue] = useState({
          showSearchedValue: false,
          value: {},
          idx:''
      });
  
  
      //To update the copy state with the suppliers data.
      useEffect(()=>{
          setSupplierOrder(suppliers.suppliers);
      },[suppliers.suppliers])
  

  
      //To submit the updated value of a supplier
      const submitHandler = async (ignore, ignore2, datas) => {
        try {
         dispatch(generalActions.emptyState());
         dispatch(generalActions.sendRequest("Updating.."))
          //Validate the inputs field that will be sent
          const validateEmailMessage = validateAccountsInput(datas.account.email, false, false, true, false, false);
          const validatePhoneMessage = validateAccountsInput(datas.account.phone,false,false,false,true,false);
          const validateCompanyMessage = validateAccountsInput(datas.companyInEnglish,false,true,false,false, false, false);
          const validateCopanyArabicMessage = validateAccountsInput(datas.companyInArabic,true,false,false,false,false);
  
          //Check the validation error if any we push it into the validation values.
          if (validateEmailMessage.length > 0) {
            dispatch(generalActions.changeValidation(validateEmailMessage));
          }
          if (validatePhoneMessage.length > 0) {
            dispatch(generalActions.changeValidation(validatePhoneMessage));
          }
          if (validateCompanyMessage.length > 0) {
            dispatch(generalActions.changeValidation(validateCompanyMessage));
          }
          if(validateCopanyArabicMessage.length > 0){
              dispatch(generalActions.changeValidation(validateCopanyArabicMessage));
          }
  
          // If the validation values is not  empty, we terminate the function job and show the error messages
          if (
            validateEmailMessage.length > 0 ||
            validatePhoneMessage.length > 0 ||
            validateCompanyMessage.length > 0 ||
            validateCopanyArabicMessage.length > 0
          ) {
           dispatch(generalActions.showValidationMessages());
            return;
          }
  
          //Here we send the request to the endpoint.
          const data = await fetch(`${generalReducer.ENDPOINT}/moderator/update-supplier`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              "Authorization": token
            },
            body: JSON.stringify({
              uid: session.user.name.id,
              supplierId: datas.supplierId,  
              email: datas.account.email,
              phone: datas.account.phone,
              companyInEnglish: datas.companyInEnglish,
              companyInArabic: datas.companyInArabic,
            }),
          });
          const response = await data.json();
  
          //This if condition is for the authorization error.
          if(response.statusCode == 421 || response.statusCode == 404){
            const error = new Error(response.message);
            throw error;
          }else if (response.statusCode !== 200 && response.statusCode !== 201) {
            /**
             * If the validation error came from the backend, it will be in an array
             * So, wi loop through the array values inside the response object and convert it into an array
             */
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
          //We sent the updated supplier value into the store.
          dispatch(suppliersActions.updateSupplier(datas));
          
          //add the successful message to the validation values in order to be displayed inside the modal
          dispatch(generalActions.sendRequest(response.message));
  
          //The valaidation values and the status will be empty after 3 seconds
          setTimeout(()=>{
                dispatch(generalActions.emptyState());
          }, 3000)
        } catch (err) {
          //if there is any error that caught, the error message will be added to validation error and the function job will be terminated.
          dispatch(generalActions.changeValidation(err.message));
          dispatch(generalActions.showValidationMessages())
        }
      };
  

  
    //To search a specific record by phone
    const searchRecord = (e) =>{
        const copy = [...suppliers.suppliers];
        const idx = copy.findIndex(supplier=>supplier.account.phone == e.target.value);
        const supplier = copy.find(supplier=>supplier.account.phone  == e.target.value);
        //if the search input field is empty we don't do anything
        if(e.target.value.trim() == "" && e.target.value.length <= 1){
          setsearchedValue(prevState=>({
            ...prevState,
            showSearchedValue: false,
            value: {}
          }));
        }
        // if there is no record we close the search mood
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
          value: supplier,
          idx: idx
        }))
    }
  
  
    //To filter data by any of specified property.
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
  
    //function that will send a request to update the supplier information
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
  
  
    //To update the verifcation status of the supplier by each selected manage type in the parameter
    const manageSupplier = async (supplierId, verify, suspend, supplierEmail) => {
      try{
        dispatch(generalActions.emptyState());
        dispatch(generalActions.sendRequest(verify ? 'Verifying' : suspend ? 'Suspending..' : null))
        let response;
        if(verify){
          response = await manageSupplierProcess(supplierId,"verify-supplier");
          if(response.statusCode == 421 || response.statusCode == 404){
            const error = new Error(response.message);
            throw error;
          }else if(response.statusCode != 200){
            const error = new Error(response.message);
            throw error;
          }
          dispatch(suppliersActions.verifySupplier(supplierId));
          await sendEmail(supplierEmail, "verified", "supplier");
        }else if(suspend){
          response = await manageSupplierProcess(supplierId,"suspend-supplier");
          if(response.statusCode == 421 || response.statusCode == 404){
            const error = new Error(response.message);
            throw error;
          }else if(response.statusCode != 200){
            const error = new Error(response.message);
            throw error;
          }
          await sendEmail(supplierEmail, "suspend", "supplier");
          dispatch(suppliersActions.suspendSupplier(supplierId));
        }
        dispatch(generalActions.sendRequest(response.message));
      setTimeout(()=>{
        dispatch(generalActions.emptyState());
      }, 3000)
      }catch(err){
          dispatch(generalActions.changeValidation(err.message));
          dispatch(generalActions.showValidationMessages());
    }
}

    const toggleModalDetails = (idx) => {
        const tableContainer = document.querySelector('.table-details-container');
          setData(null);
          setData(suppliersOrder[idx]);
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

    const acceptUpdateProfile = async (datas) => {
      try{
        dispatch(generalActions.emptyState());
        dispatch(generalActions.sendRequest("Accepting.."));
        const data = await fetch(`${generalReducer.ENDPOINT}/supplier/accept-update`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "Authorization": token
          },
          body: JSON.stringify({
            uid: session.user.name.id,
            supplierId: datas.supplierId,  
          }),
        });
        const response = await data.json();
        if(response.statusCode == 421 || response.statusCode == 404 || response.statusCode != 200){
          const error = new Error(response.message);
          throw error;
        }
          //add the successful message to the validation values in order to be displayed inside the modal
          dispatch(generalActions.sendRequest(response.message));

          await sendEmail(datas.account.email, "acceptUpdate", "supplier");
  
          //The valaidation values and the status will be empty after 3 seconds
          setTimeout(()=>{
                dispatch(generalActions.emptyState());
                window.location.reload()
          }, 3000)

      }catch(err){
          dispatch(generalActions.changeValidation(err.message));
          dispatch(generalActions.showValidationMessages())
      }
    }

    const rejectUpdateProfile = async (datas) => {
      try{
        dispatch(generalActions.emptyState());
        dispatch(generalActions.sendRequest("Rejecting.."));
        const data = await fetch(`${generalReducer.ENDPOINT}/supplier/reject-update`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "Authorization": token
          },
          body: JSON.stringify({
            uid: session.user.name.id,
            supplierId: datas.supplierId,  
          }),
        });
        const response = await data.json();
        if(response.statusCode == 421 || response.statusCode == 404){
          const error = new Error(response.message);
          throw error;
        }
          //add the successful message to the validation values in order to be displayed inside the modal
          dispatch(generalActions.sendRequest(response.message));

          await sendEmail(datas.account.email, "rejectUpdate", "supplier");
  
          //The valaidation values and the status will be empty after 3 seconds
          setTimeout(()=>{
                dispatch(generalActions.emptyState());
                window.location.reload()
          }, 3000)

      }catch(err){
          dispatch(generalActions.changeValidation(err.message));
          dispatch(generalActions.showValidationMessages())
      }
    }

    return  <Fragment>

    <div className="grid-data-details-container">
        <GridData
        icon={<BsHash size={25} color="white" />}
        title="Total numbers of registered suppliers"
        link="/en/admin/suppliers"
        data={suppliers.suppliers.length}
        />
    </div>

    <GridLayout chart={
         <MyChart
        Component={Bar}
        label="suppliers"
        title="Numbers of registered suppliers per month"
        data={suppliersData}
        bgColor={generalReducer.BAR_COLORS}
        brdrColor={generalReducer.BAR_COLORS}
    />
    } />

    <br/> <br />

    <div>
        <div className="sort-option-container">
           <div>
            <input type="checkbox" id="sort" name="sort" onChange={filterData}/>
            <label htmlFor="sort">DESC</label>
          </div>
           <div>
            <input type="checkbox" id="verified" name="verified" checked={filtering.verified ? true : false} onChange={filterData}/>
            <label htmlFor="verified">Verified</label>
          </div>
           <div>
            <input type="checkbox" id="nVerified" name="notVerified" checked={filtering.notVerified ? true : false} onChange={filterData}/>
            <label htmlFor="nVerified">Not verified</label>
          </div>
           <div>
            <input type="checkbox" id="susbended" name="susbended" checked={filtering.susbended ? true : false} onChange={filterData} />
            <label htmlFor="susbended">Susbended</label>
          </div>
        </div>
        <div className="search-input">
            <input type="text" maxLength="13" onChange={(e)=>searchRecord(e)} placeholder="Search By Phone..+966" inputMode='tel' className="english-input"/>
        </div>
      </div>

      <br /> <br /> <br />

      {data !== null &&  <ModalDetails setDatas={setData} acceptUpdate={acceptUpdateProfile} rejectUpdate={rejectUpdateProfile} supplier={true} info={data}  title={"Manage Supplier"} update={submitHandler} manageSupplier={manageSupplier}/> }
    <Table
        headers={TABLE_SUPPLIERS_HEADERS.map((header) => (
          <th key={header}>{header}</th>
        ))}
        details={true}
      >
        {!searchedValue.showSearchedValue ? suppliersOrder.length > 0 && suppliersOrder[0].account != null && suppliersOrder.sort().map((supplier, idx) => {
          return (
            <Fragment key={supplier.supplierId}>
              <tr key={supplier.supplierId}>
                <Td key={supplier.account.email} value={supplier.account.email}/>
                <Td key={supplier.account.phone} value={supplier.account.phone}/>
                <Td key={supplier.companyInEnglish} value={supplier.companyInEnglish}/>
                <Td key={supplier.companyInArabic} value={supplier.companyInArabic}/>
                <Td key={supplier.companyCertificate} value={<a className="cert-link" href={`https://isp-bend.herokuapp.com/certificates/${supplier.companyCertificate}`} target="_blank" rel="noreferrer">{supplier.companyCertificate}</a>}/>
                <Td key={supplier.verified} 
                value={supplier.verified == 0 ? "N" : supplier.verified == 1 ? "V" : supplier.verified == 2 ? "S" : null }
                className={supplier.verified == 0 ? "not-v" : supplier.verified == 1 ? 'ver' : 'sus'}/>
                <Td value= {<Button disabled={generalReducer.toggleModalDetails ? true : false} onClick={()=>toggleModalDetails(idx)}>Show</Button>} />
              </tr>
            </Fragment>
          );
        }) : searchedValue.value && <Fragment>
        <tr key={searchedValue.value.supplierId}>
                <Td key={searchedValue.value.account.email} value={searchedValue.value.account.email}/>
                <Td key={searchedValue.value.account.phone} value={searchedValue.value.account.phone}/>
                <Td key={searchedValue.value.companyInEnglish} value={searchedValue.value.companyInEnglish}/>
                <Td key={searchedValue.value.companyInArabic} value={searchedValue.value.companyInArabic}/>
                <Td key={searchedValue.value.companyCertificate} value={<a className="cert-link" href={`https://isp-bend.herokuapp.com/certificates/${searchedValue.value.companyCertificate}`} target="_blank" rel="noreferrer">{searchedValue.value.account.name}</a>}/>
                <Td key={searchedValue.value.verified} 
                value={searchedValue.value.verified == 0 ? "N" : searchedValue.value.verified == 1 ? "V" : searchedValue.value.verified == 2 ? "S" : null }
                className={searchedValue.value.verified == 0 ? "not-v" : searchedValue.value.verified == 1 ? 'ver' : 'sus'}/>
                <Td value= {<Button disabled={generalReducer.toggleModalDetails ? true : false} onClick={()=>toggleModalDetails(searchedValue.idx)}>Show</Button>} />
              </tr>
        
      </Fragment>
          }
      </Table>
  </Fragment> 

}

export default SuppliersDashboard;