import { useEffect, useState } from "react";
import GridLayout from "../reusable/GridLayout";
import Spinner from "../reusable/Spinner/Spinner";
import {FaUserAlt} from 'react-icons/fa';
import {BiEditAlt} from 'react-icons/bi';
import classes from '../reusable/reusable-style.module.css';
import {Table, Input, Button, Modal} from 'semantic-ui-react';
import { validateAccountsInput } from "../../helper/functions";
import { useDispatch, useSelector } from "react-redux";
import suppliersActions from "../../stores/actions/suppliersActions";
import {getSession} from 'next-auth/client';
const SupplierInformation = ({supplier, token}) => {
    const [session, setSession] = useState()
    const [editMood, setEditMood] = useState(false);
    const [supplierEditMood, setSupplierEditMood] = useState(supplier);
    const generalReducer = useSelector((state)=>state.generalReducer);
    const dispatch = useDispatch();
    const switchToEdit = () => {
        setEditMood(!editMood);
        setSupplierEditMood(supplier);
    }
    const [status, setStatus] = useState({
        sending: false,
        succeed:false,
        manage: false,
        text: "",
        show: false,
    });
    const [validation, setValidation] = useState({
        values: [],
    });

    useEffect(async()=>{
        const session = await getSession();
        setSession(session);
    },[])

    if(!supplier){
        return <GridLayout>
            <Spinner/>
        </GridLayout>
    }

    const createdAt = new Date(supplier.created_at).toLocaleDateString('en-US', {
        year:'numeric',
        month: 'short',
        day: 'numeric'
    });


    const changeHandler = (e) => {
        setSupplierEditMood(prevState=>({
            ...prevState,
            accounts: {
                ...prevState.accounts,
                [e.target.name]: e.target.value
            },
        }));
    }

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
        }));
        const validateEmailMessage = validateAccountsInput(supplierEditMood.accounts.email, false, false, true, false, false);
        const validateNameMessage = validateAccountsInput(supplierEditMood.accounts.name,false,true,false,false,false);
        const validateNameArabicMessage = validateAccountsInput(supplierEditMood.accounts.nameInArabic,true,false,false,false,false);
        const validatePhoneMessage = validateAccountsInput(supplierEditMood.accounts.phone,false,false,false,true,false);
        const validateCompanyMessage = validateAccountsInput(supplierEditMood.companyInEnglish,false,true,false,false, false, false);
        const validateCopanyArabicMessage = validateAccountsInput(supplierEditMood.companyInArabic,true,false,false,false,false);
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
            'Authorization': token
        },
        body: JSON.stringify({
            uid: session.user.name.id,
            supplierId: supplierEditMood.supplierId,  
            name: supplierEditMood.accounts.name,
            nameInArabic: supplierEditMood.accounts.nameInArabic,
            email: supplierEditMood.accounts.email,
            phone: supplierEditMood.accounts.phone,
            companyInEnglish: supplierEditMood.companyInEnglish,
            companyInArabic: supplierEditMood.companyInArabic,
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
            sending: false,
            show: true,
        }));
    }
    };

    
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
          manage: true,
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
          manage:false,
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
              manage:false,
              text:"",
              show: true,
          }));
        }
    }

    return <div className="ml-14 mb-36">
            <div className="flex flex-row justify-around items-center md:mt-14 md:justify-evenly md:-ml-96">
            <div className="border border-gray-900 rounded-full bg-gray-900">
                <FaUserAlt size={90} color={"white"} className="p-3"/> 
            </div>
            <div>
                <p className="text-3xl font-Raleway text-gray-900">{supplier.accounts.name}</p>
            </div>
            <div>
                <p className="text-3xl font-Raleway text-red-600">{supplier.verified == 0 ? "NOT VERIFIED" : supplier.verified == 1 ? "VERIFIED" : supplier.verified == 2 ? "SUSPENDED" : null}</p>
            </div>
        </div>
        <BiEditAlt size={60} color={"white"} onClick={switchToEdit} className={editMood ? "m-auto mt-10 border bg-green-600 p-3 cursor-pointer" : "m-auto mt-10 border bg-gray-900 p-3 cursor-pointer" } />
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
            <div className="w-full mt-10 ml-5 md:ml-0">
            <Table color={'green'} className={classes.tableContainerInformation}>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell className={classes.theader}>ID</Table.HeaderCell>
                <Table.Cell textAlign='center'>{supplier.supplierId}</Table.Cell>
             </Table.Row>
             <Table.Row>
                <Table.HeaderCell className={classes.theader}>Created At</Table.HeaderCell>
                <Table.Cell textAlign='center'>{createdAt}</Table.Cell>
            </Table.Row>
             <Table.Row>
                <Table.HeaderCell className={classes.theader}>Name</Table.HeaderCell>
                <Table.Cell textAlign='center'><Input className={classes.tdetails} disabled={!editMood ? true : false} value={supplierEditMood.accounts.name} required type="text" name="name" onChange={(e)=>changeHandler(e)} /></Table.Cell>
            </Table.Row>
             <Table.Row>
                <Table.HeaderCell className={classes.theader}>Name(AR)</Table.HeaderCell>
                <Table.Cell textAlign='center'><Input className={classes.tdetails} disabled={!editMood ? true : false} value={supplierEditMood.accounts.nameInArabic} required type="text" name="nameInArabic" onChange={(e)=>changeHandler(e)} /></Table.Cell>
            </Table.Row>
             <Table.Row>
                <Table.HeaderCell className={classes.theader}>Email</Table.HeaderCell>
                <Table.Cell textAlign='center'><Input className={classes.tdetails} disabled={!editMood ? true : false} value={supplierEditMood.accounts.email} required type="email" name="email" onChange={(e)=>changeHandler(e)}/></Table.Cell>
            </Table.Row>
             <Table.Row>
                <Table.HeaderCell className={classes.theader}>Phone</Table.HeaderCell>
                <Table.Cell textAlign='center'><Input className={classes.tdetails} disabled={!editMood ? true : false} value={supplierEditMood.accounts.phone} required type="text" name="phone" onChange={(e)=>changeHandler(e)} /></Table.Cell>
            </Table.Row>
             <Table.Row>
                <Table.HeaderCell className={classes.theader}>Company(EN)</Table.HeaderCell>
                <Table.Cell textAlign='center'><Input className={classes.tdetails} disabled={!editMood ? true : false} value={supplierEditMood.companyInEnglish} required type="text" name="companyInEnglish" onChange={(e)=>changeHandler(e)} /></Table.Cell>
            </Table.Row>
             <Table.Row>
                <Table.HeaderCell className={classes.theader}>Company(AR)</Table.HeaderCell>
                <Table.Cell textAlign='center'><Input className={classes.tdetails} disabled={!editMood ? true : false} value={supplierEditMood.companyInArabic} required type="text" name="companyInArabic"  onChange={(e)=>changeHandler(e)}/></Table.Cell>
            </Table.Row>
            </Table.Header>
    
          </Table>
            
            </div>

        </GridLayout>
        
        <div className={editMood ? "m-auto ml-32 md:ml-56 mt-20" : "hidden" }>
        <Button className="w-1/2 md:w-1/3" positive onClick={submitHandler} disabled={status.sending ? true : status.manage ? true : false} >{status.sending ? status.text : "Update"}</Button>
        <div className="flex flex-col mt-5">
            <div className={supplier.verified == 1 ? "hidden" :"mb-5"}>
                <Button className="w-1/2 md:w-1/3" primary onClick={()=>manageSupplier(supplier.supplierId, true, false, false)} disabled={status.manage ? true : status.sending ? true : false} >{status.manage ? status.text : "Verify"}</Button>
            </div>
            <div className={supplier.verified == 0 ? "hidden" :"mb-5"}>
                <Button className="w-1/2 md:w-1/3" negative onClick={()=>manageSupplier(supplier.supplierId, false, true, false)} disabled={status.manage ? true : status.sending ? true : false} >{status.manage ? status.text : "Unverify"}</Button>
            </div>
            <div className={supplier.verified == 2 ? "hidden" :"mb-5"}>
                <Button className="w-1/2 md:w-1/3" negative onClick={()=>manageSupplier(supplier.supplierId, false, false, true)} disabled={status.manage ? true : status.sending ? true : false} >{status.manage ? status.text : "Suspend"}</Button>
            </div>
        </div>
    </div>

        
    </div>
}


export default SupplierInformation;