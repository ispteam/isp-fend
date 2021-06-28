import classes from './profile-info-style.module.css';
import {Modal, Card, Button} from 'semantic-ui-react';
import { useEffect, useState } from 'react';
import Spinner from '../../reusable/Spinner/Spinner';
import { getSession } from 'next-auth/client';
import { useSelector } from 'react-redux';
import {BsToggleOff, BsToggleOn} from 'react-icons/bs';
import { validateAccountsInput } from '../../../helper/functions';


const ProfileInformation = ({token, admin, moderator}) => {

        /**
     * ======================
     * NOTE: IF THERE IS NO COMMENT IN ANY FUNCTION, OR ANY THING RELATED THAT IS MEAN IT WAS EXPLAINED IN THE SUPPLIERS COMPONENT
     * ======================
     */

    const [isLoading, setIsLoading] = useState(true);
    const generalReducer=useSelector((state) => state.generalReducer);
    const [session, setSession] = useState();
    const [profileInfo, setProfileInfo] = useState({});
    const [profileCopy, setProfileCopy] = useState({});
    const [validation, setValidation] = useState({
        values: [],
    });
    const [editMood, setEditMood] = useState(false);
    const [status, setStatus] = useState({
        sending: false,
        succeed:false,
        text: "",
        show: false,
    });

    useEffect(async()=>{
        const session = await getSession();
        setSession(session);
    }, []);


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
    
   const fetchProfileInfo = async () => {
        try{
            let data;
            let response;
            emptyState();
            setIsLoading(true);
            if(admin){
              data = await fetch(`${generalReducer.ENDPOINT}/admin/admin-operations/${session.user.name.id}`);
            }else if(moderator){
              data = await fetch(`${generalReducer.ENDPOINT}/moderator/moderator-operations/${session.user.name.id}`);
            }
            response = await data.json();
            if(response.statusCode != 200 ){
                throw new Error(response.message);
            }
            if(admin){
              setProfileCopy(response.admin);
              setProfileInfo(response.admin);
            }else if(moderator){
              setProfileCopy(response.moderator);
              setProfileInfo(response.moderator);
            }
            setIsLoading(false);
        }catch(err){
            changeValidationState(err.message);
            setStatus(prevState=>({
                ...prevState,
                show: true,
            }));
        }
   } 

   useEffect(async()=>{
        if(!session){
            return
        }
        await fetchProfileInfo();
   }, [session]);

   const changeHandler = (e) => {
        setProfileCopy(prevState=>({
            ...prevState,
            account:{
                ...prevState.account,
                [e.target.name]: e.target.value
            }
        }))
   }

   const toggleEdit = () => {
       setProfileCopy(profileInfo);
       setEditMood(!editMood);
   }

   const submitHandler = async() => {
    try {
        let data;
        emptyState();
        setStatus(prevState=>({
            ...prevState,
            sending:true,
            text: "sending..."
        }))
        const validateEmailMessage = validateAccountsInput(profileCopy.account.email, false, false, true, false, false);
        const validateNameMessage = validateAccountsInput(profileCopy.account.name,false,true,false,false,false);
        const validateNameArabicMessage = validateAccountsInput(profileCopy.account.nameInArabic,true,false,false,false,false);
        const validatePhoneMessage = validateAccountsInput(profileCopy.account.phone,false,false,false,true,false);
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
        if (
          validateEmailMessage.length > 0 ||
          validateNameMessage.length > 0 ||
          validateNameArabicMessage.length > 0 ||
          validatePhoneMessage.length > 0
        ) {
          setStatus(prevState=>({
              ...prevState,
              sending: false,
              text:"",
              show: true
          }));
          return;
        }
        if(admin){
            data = await fetch(`${generalReducer.ENDPOINT}/admin/admin-operations/${session.user.name.id}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              "Authorization": token
            },
            body: JSON.stringify({
              uid: session.user.name.id,
              adminId: session.user.name.id,
              name: profileCopy.account.name,
              nameInArabic: profileCopy.account.nameInArabic,
              email: profileCopy.account.email,
              phone: profileCopy.account.phone,
            }),
          });
        }else if(moderator){
          data = await fetch(`${generalReducer.ENDPOINT}/moderator/moderator-operations/${session.user.name.id}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              "Authorization": token
            },
            body: JSON.stringify({
              uid: session.user.name.id,
              moderatorId: session.user.name.id,
              name: profileCopy.account.name,
              nameInArabic: profileCopy.account.nameInArabic,
              email: profileCopy.account.email,
              phone: profileCopy.account.phone,
            }),
          });
        }
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
   }
    
    

    return  <div className={classes.profileContainer}>
        <div className={"bg-gradient-to-bl from-gray-900 to-green-400 " + classes.background}></div>
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
    <Card className={classes.cardContainer} >
    {isLoading ? <div className={classes.spinner}><Spinner/></div> : profileInfo &&
    <Card.Content className={classes.cardContent}>
      <Card.Header textAlign="center" className={classes.cardHeader}>{profileInfo.account.name + "'s"} Profile</Card.Header>
      <Card.Header textAlign="center" className={profileInfo.account.userType == 0 ? classes.adminTitle 
      : profileInfo.account.userType == 1 ? classes.moderatorTitle : profileInfo.account.userType == 2 ? classes.supplierTitle 
      : profileInfo.account.userType == 3 ? classes.clientTitle : null}>
      {profileInfo.account.userType == 0 ? "ADMIN" 
      : profileInfo.account.userType == 1 ? "MODERATOR" 
      : profileInfo.account.userType == 2 ? "SUPPLIER" 
      : profileInfo.account.userType == 3 ? "CLIENT" : null}</Card.Header>
        <form className={classes.cardForm}>
            <div>
                <label>Email</label>
                <input type="email" name="email" disabled={editMood ? false : true} value={profileCopy.account.email} onChange={(e)=>changeHandler(e)}/>
            </div>
            <div>
                <label>Name</label>
                <input type="text" name="name" disabled={editMood ? false : true} value={profileCopy.account.name} onChange={(e)=>changeHandler(e)}/>
            </div>
            <div>
                <label>Name(AR)</label>
                <input type="text" name="nameInArabic" disabled={editMood ? false : true} value={profileCopy.account.nameInArabic} onChange={(e)=>changeHandler(e)}/>
            </div>
            <div>
                <label>Phone</label>
                <input type="text" name="phone" disabled={editMood ? false : true} value={profileCopy.account.phone} onChange={(e)=>changeHandler(e)}/>
            </div>
        </form>
        {editMood && <Button className="w-1/2 block" positive disabled={status.sending ? true : status.manage ? true : false} onClick={submitHandler}>{status.sending ? status.text : "Update"}</Button>
         }
        <span className={editMood && "block mt-4"}>Toggle to {editMood? `close editting` : `Update`}</span>{editMood ? <BsToggleOn size={30} color="#90ee90" onClick={()=>toggleEdit()} /> : <BsToggleOff size={30} onClick={()=>toggleEdit()} /> }
     </Card.Content>
    }
  </Card>
  </div>
}

export default ProfileInformation;