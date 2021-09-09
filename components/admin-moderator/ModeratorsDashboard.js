import { Fragment, useEffect} from "react";
import Table from "../../components/reusable/Tables";
import { useDispatch, useSelector } from "react-redux";
import GridData from "../../components/reusable/GridData";
import {sendEmail, validateAccountsInput} from "../../helper/functions";
import { useState } from "react";
import {BsHash} from "react-icons/bs";
import {getSession} from 'next-auth/client';
import Td from "../../components/reusable/Td";
import Button from "../../components/reusable/Button";
import ModalDetails from "./ModalDetails";
import generalActions from "../../stores/actions/generalActions";
import Feedback from "../../components/reusable/Feedback";
import moderatorsActions from "../../stores/actions/moderatorActions";

const TABLE_MODERATORS_HEADERS = ["Name", "Eamil", "Phone", "Details"];

const ModeratorsDashboard = ({token, session}) => {
    /**
     * ======================
     * NOTE: IF THERE IS NO COMMENT IN ANY FUNCTION, OR ANY THING RELATED THAT IS MEAN IT WAS EXPLAINED IN THE SUPPLIERS COMPONENT
     * ======================
     */

     const moderators = useSelector((state) => state.moderatorReducer);
     const [moderatorsOrder, setModeratorOrder] = useState([]);
     const generalReducer = useSelector((state) => state.generalReducer);
     const dispatch = useDispatch();
     const [data, setData] = useState(null);
     const [filtering, setFiltering] = useState({
       order: false,
     });
     const [newModeratorInfo, setNewModeratorInfo] = useState({
         name: '',
         email: '',
         password:'',
         phone: ''
     })

     const [searchedValue, setsearchedValue] = useState({
       showSearchedValue: false,
       value: {},
       idx:''
     });
   
   
   
   
   useEffect(()=>{
     setModeratorOrder(moderators.moderators);
   },[moderators.moderators])
   
   
   
   
     const changeNewModeratorHandler = (e)=>{
       setNewModeratorInfo(prevState=>({
           ...prevState,
           [e.target.name]: e.target.value
       }));
     }

   
     const submitHandler = async (newModerator,e, datas) => {
       try {
         e && e.preventDefault();
         dispatch(generalActions.emptyState());
         dispatch(generalActions.sendRequest(newModerator ? 'Adding..' : 'Updating..'));
         let data;
         let validateEmailMessage;
         let validateNameMessage;
         let validatePhoneMessage;
         let validatePasswordMessage;
         if(newModerator){
           dispatch(generalActions.changeMood("profile"));
           validateEmailMessage = validateAccountsInput(newModeratorInfo.email, false, false, true, false, false);
           validateNameMessage = validateAccountsInput(newModeratorInfo.name,false,false,false,false,false, false, false, false, false, false, false, false, false, false, false, false, true);
           validatePhoneMessage = validateAccountsInput(newModeratorInfo.phone,false,false,false,true,false);
           validatePasswordMessage = validateAccountsInput(newModeratorInfo.password,false,false,false,false,false, false, true);
           if (validatePasswordMessage.length > 0) {
             dispatch(generalActions.changeValidation(validatePasswordMessage));
           }
         }else{
           validateEmailMessage = validateAccountsInput(datas.account.email, false, false, true, false, false);
           validateNameMessage = validateAccountsInput(datas.account.name,false,false,false,false,false, false, false, false, false, false, false, false, false, false, false, false, true);
           validatePhoneMessage = validateAccountsInput(datas.account.phone,false,false,false,true,false);
         }
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
           validatePasswordMessage != null && validatePasswordMessage.length > 0 ||
           validateEmailMessage.length > 0 ||
           validateNameMessage.length > 0 ||
           validatePhoneMessage.length > 0
         ) {
           dispatch(generalActions.showValidationMessages());
           return;
         }
         if(newModerator){
           data = await fetch(`${generalReducer.ENDPOINT}/moderator/moderator-operations`, {
           method: "POST",
           headers: {
               "Content-Type": "application/json",
               "Authorization": token
           },
           body: JSON.stringify({
               uid: session.user.name.id,
               name: newModeratorInfo.name,
               email: newModeratorInfo.email,
               password: newModeratorInfo.password,
               phone: newModeratorInfo.phone,
           }),
           });
         }else{
          data = await fetch(`${generalReducer.ENDPOINT}/moderator/moderator-operations/${datas.moderatorId}`, {
           method: "PATCH",
           headers: {
             "Content-Type": "application/json",
             "Authorization": token
           },
           body: JSON.stringify({
             uid: session.user.name.id,
             moderatorId: datas.moderatorId,  
             name: datas.account.name,
             email: datas.account.email,
             phone: datas.account.phone,
           }),
         });
       }
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
         if(newModerator){
           dispatch(moderatorsActions.addNewModerator({
             moderatorId: response.moderatorId,
             account: {
               ...newModeratorInfo
             }
           }));
           setNewModeratorInfo({
             name: '',
             password: '',
             email: '',
             phone: ''
           })
           await sendEmail(newModeratorInfo.email, "registration", "moderator");
         }else{
             dispatch(moderatorsActions.updateModerator(datas));
         }
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
           dispatch(generalActions.sendRequest("Removing.."))
           const data = await fetch(`${generalReducer.ENDPOINT}/moderator/moderator-operations/${moderatorId}`, {
           method: "DELETE",
           headers:{
               "Content-Type": "application/json",
               "Authorization": token
           },
           body: JSON.stringify({
               uid: session.user.name.id,
               moderatorId: datas.moderatorId
           })
           });
           const response = await data.json();
           if(response.statusCode == 421 || response.statusCode == 404){
             const error = new Error(response.message);
             throw error;
           }else if (response.statusCode !== 200 && response.statusCode !== 201) {
           const error = new Error(response.message);
           throw error;
           }
           dispatch(moderatorsActions.removeModerator(datas.moderatorId));
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
         const copy = [...moderators.moderators];
         const idx = copy.findIndex(moderator=>moderator.account.phone == e.target.phone);
         const moderator = copy.find(moderator=>moderator.account.phone  == e.target.value);
         if(e.target.value.trim() == "" && e.target.value.length <= 1){
           setsearchedValue(prevState=>({
             ...prevState,
             showSearchedValue: false,
             value: {}
           }));
         }
         if(!moderator){
           setsearchedValue(prevState=>({
             ...prevState,
             showSearchedValue: !prevState.showSearchedValue,
             value: {}
           }));
         }
         setsearchedValue(prevState=>({
           ...prevState,
           showSearchedValue: !prevState.showSearchedValue,
           value: moderator,
           idx: idx
         }))
     }
   
   
     const filterData = (e) => {
       if(e.target.name == "sort"){
         setFiltering(prevState=>({
           ...prevState,
           order: !prevState.order
         }));
         if(filtering.order){
           setModeratorOrder(moderatorsOrder.sort((id1, id2)=> id1.moderatorId < id2.moderatorId ? -1 : 1));
         }else{
           setModeratorOrder(moderatorsOrder.sort((id1, id2)=> id1.moderatorId > id2.moderatorId ? -1 : 1));
         }
       }
     }

     const toggleModalDetails = (idx) => {
        const tableContainer = document.querySelector('.table-details-container');
          setData(null);
          setData(moderatorsOrder[idx]);
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
        title="Total numbers of moderators"
        link="/en/admin/moderators"
        data={moderators.moderators.length}
        />
    </div>
    <br/> <br />

    <form className= "form-add-brand-container">
            <input type="text" name="name" className="english-input"  onChange={(e)=>changeNewModeratorHandler(e)} placeholder="Name"/>
            <input type="email" name="email" className="english-input"  onChange={(e)=>changeNewModeratorHandler(e)} placeholder="email"/>
            <input type="password" name="password" className="english-input"  onChange={(e)=>changeNewModeratorHandler(e)} placeholder="password"/>
            <input type="phone" inputMode="tel" className="english-input" name="phone"  onChange={(e)=>changeNewModeratorHandler(e)} placeholder="Phone 966xxx" minLength="10" maxLength="13"/>
            <button onClick={(e)=>submitHandler(true, e)}>Register Moderator</button>
    </form>

    <div className="sort-option-container">
            <input type="checkbox" id="sort" name="sort" onChange={filterData}/>
            <label htmlFor="sort">DESC</label>
          </div>
          <div className="search-input">
            <input type="text" maxLength="13" onChange={(e)=>searchRecord(e)} placeholder="Search By Phone..+966" inputMode='tel' className="english-input"/>
      </div>
      <br /> <br />
    {data !== null &&  <ModalDetails setDatas={setData} client={true} info={data} remove={removeHandler} title={"Manage Moderators"} update={submitHandler}/> }

    <Table
        headers={TABLE_MODERATORS_HEADERS.map((header) => (
          <th key={header}>{header}</th>
        ))}
        details={true}
      >
        {!searchedValue.showSearchedValue ? moderatorsOrder.length > 0 && moderatorsOrder[0].account != null && moderatorsOrder.sort().map((moderator, idx) => {
          return (
            <Fragment key={moderator.moderatorId}>
              <tr key={moderator.moderatorId}>
                <Td key={moderator.account.name} value={moderator.account.name}/>
                <Td key={moderator.account.email} value={moderator.account.email}/>
                <Td key={moderator.account.phone} value={moderator.account.phone}/>
                <Td value= {<Button disabled={generalReducer.toggleModalDetails ? true : false} onClick={()=>toggleModalDetails(idx)}>Show</Button>} />
              </tr>
            </Fragment>
          );
        }) : searchedValue.value && <Fragment>
        <tr key={searchedValue.value.moderatorId}>
        <Td key={searchedValue.value.account.name} value={searchedValue.value.account.name}/>
        <Td key={searchedValue.value.account.email} value={searchedValue.value.account.email}/>
        <Td key={searchedValue.value.account.phone} value={searchedValue.value.account.phone}/>
        <Td value= {<Button disabled={generalReducer.toggleModalDetails ? true : false} onClick={()=>toggleModalDetails(searchedValue.idx)}>Show</Button>} />
      </tr>
        
      </Fragment>
      
    
          }
      </Table>


     </Fragment>

}

export default ModeratorsDashboard;