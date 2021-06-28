import { useEffect, useState } from "react";
import GridLayout from "../reusable/GridLayout";
import Spinner from "../reusable/Spinner/Spinner";
import {FaUserAlt} from 'react-icons/fa';
import {BiEditAlt} from 'react-icons/bi';
import classes from '../reusable/reusable-style.module.css';
import {Table, Input, Button, Modal} from 'semantic-ui-react';
import { validateAccountsInput } from "../../helper/functions";
import { useDispatch, useSelector } from "react-redux";
import clientsActions from "../../stores/actions/clientsActions";
import {getSession} from 'next-auth/client';
const ClientInformation = ({client, token}) => {

        /**
     * ======================
     * NOTE: IF THERE IS NO COMMENT IN ANY FUNCTION, OR ANY THING RELATED THAT IS MEAN IT WAS EXPLAINED IN THE SUPPLIERS COMPONENT
     * ======================
     */

    const [session, setSession] = useState();
    const [editMood, setEditMood] = useState(false);
    const [clientEditMood, setClientEditMood] = useState(client);
    const generalReducer = useSelector((state)=>state.generalReducer);
    const dispatch = useDispatch();
    const switchToEdit = () => {
        setEditMood(!editMood);
        setClientEditMood(client);
    }
    const [status, setStatus] = useState({
        sending: false,
        succeed:false,
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

    if(!client){
        return <GridLayout>
            <Spinner/>
        </GridLayout>
    }

    const createdAt = new Date(client.created_at).toLocaleDateString('en-US', {
        year:'numeric',
        month: 'short',
        day: 'numeric'
    });


    const changeHandler = (e) => {
        setClientEditMood(prevState=>({
            ...prevState,
            accounts: {
                ...prevState.accounts,
                [e.target.name]: e.target.value
            },
            address: {
                ...prevState.address,
                [e.target.name]: e.target.value
            }
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
        }))
        const validateEmailMessage = validateAccountsInput(clientEditMood.accounts.email, false, false, true, false, false);
        const validateNameMessage = validateAccountsInput(clientEditMood.accounts.name,false,true,false,false,false);
        const validateNameArabicMessage = validateAccountsInput(clientEditMood.accounts.nameInArabic,true,false,false,false,false);
        const validatePhoneMessage = validateAccountsInput(clientEditMood.accounts.phone,false,false,false,true,false);
        const validateCountryMessage = validateAccountsInput(clientEditMood.address.country,false,false,false,false, true, false);
        const validateCityMessage = validateAccountsInput(clientEditMood.address.city,false,false,false,false,false, true);
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
        validatePhoneMessage.length > 0 ||
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
            clientId: clientEditMood.clientId,  
            name: clientEditMood.accounts.name,
            nameInArabic: clientEditMood.accounts.nameInArabic,
            email: clientEditMood.accounts.email,
            phone: clientEditMood.accounts.phone,
            address: {
            country: clientEditMood.address.country,
            city: clientEditMood.address.city,
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


    return <div className="ml-14 mb-36">
            <div className="flex flex-row justify-around items-center md:mt-14 md:justify-evenly md:-ml-96">
            <div className="border border-gray-900 rounded-full bg-gray-900">
                <FaUserAlt size={90} color={"white"} className="p-3"/> 
            </div>
            <div>
                <p className="text-3xl font-Raleway text-gray-900">{client.accounts.name}</p>
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
                <Table.Cell textAlign='center'>{client.clientId}</Table.Cell>
             </Table.Row>
             <Table.Row>
                <Table.HeaderCell className={classes.theader}>Created At</Table.HeaderCell>
                <Table.Cell textAlign='center'>{createdAt}</Table.Cell>
            </Table.Row>
             <Table.Row>
                <Table.HeaderCell className={classes.theader}>Name</Table.HeaderCell>
                <Table.Cell textAlign='center'><Input className={classes.tdetails} disabled={!editMood ? true : false} value={clientEditMood.accounts.name} required type="text" name="name" onChange={(e)=>changeHandler(e)} /></Table.Cell>
            </Table.Row>
             <Table.Row>
                <Table.HeaderCell className={classes.theader}>Name(AR)</Table.HeaderCell>
                <Table.Cell textAlign='center'><Input className={classes.tdetails} disabled={!editMood ? true : false} value={clientEditMood.accounts.nameInArabic} required type="text" name="nameInArabic" onChange={(e)=>changeHandler(e)} /></Table.Cell>
            </Table.Row>
             <Table.Row>
                <Table.HeaderCell className={classes.theader}>Email</Table.HeaderCell>
                <Table.Cell textAlign='center'><Input className={classes.tdetails} disabled={!editMood ? true : false} value={clientEditMood.accounts.email} required type="email" name="email" onChange={(e)=>changeHandler(e)}/></Table.Cell>
            </Table.Row>
             <Table.Row>
                <Table.HeaderCell className={classes.theader}>Phone</Table.HeaderCell>
                <Table.Cell textAlign='center'><Input className={classes.tdetails} disabled={!editMood ? true : false} value={clientEditMood.accounts.phone} required type="text" name="phone" onChange={(e)=>changeHandler(e)} /></Table.Cell>
            </Table.Row>
             <Table.Row>
                <Table.HeaderCell className={classes.theader}>Country</Table.HeaderCell>
                <Table.Cell textAlign='center'><Input className={classes.tdetails} disabled={!editMood ? true : false} value={clientEditMood.address.country} required type="text" name="country" onChange={(e)=>changeHandler(e)} /></Table.Cell>
            </Table.Row>
             <Table.Row>
                <Table.HeaderCell className={classes.theader}>City</Table.HeaderCell>
                <Table.Cell textAlign='center'><Input className={classes.tdetails} disabled={!editMood ? true : false} value={clientEditMood.address.city} required type="text" name="city"  onChange={(e)=>changeHandler(e)}/></Table.Cell>
            </Table.Row>
            </Table.Header>
    
          </Table>
            
            </div>

        </GridLayout>
        
        <div className={editMood ? "m-auto ml-32 md:ml-56 mt-20" : "hidden" }>
        <Button className="w-1/2 md:w-1/3" positive onClick={submitHandler} disabled={status.sending ? true : false} >{status.sending ? status.text : "Update"}</Button>
    </div>

        
    </div>
}


export default ClientInformation;