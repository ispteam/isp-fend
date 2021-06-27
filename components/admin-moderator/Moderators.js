import { Fragment, useEffect} from "react";
import {useRouter} from 'next/router';
import Table from "../reusable/Table/Table";
import classes from "../reusable/reusable-style.module.css";
import { useDispatch, useSelector } from "react-redux";
import GridLayout from "../reusable/GridLayout";
import GridList from "../reusable/GridList";
import {validateAccountsInput,} from "../../helper/functions";
import { Menu, Dropdown, Modal, Form, Button as BBT} from "semantic-ui-react";
import { useState } from "react";
import Input from "../reusable/Input/input";
import Button from "../reusable/Button/Button";
import moderatorsActions from "../../stores/actions/moderatorActions";
import {BsHash} from "react-icons/bs";
import SearchInput from "../reusable/Input/SearchInput";
import Td from "../reusable/Table/Td";
import {getSession} from 'next-auth/client';
const TABLE_MODERATORS_HEADERS = ["ID", "Name", "Name(AR)", "Eamil", "Phone"];

const ModeratorsDashboard = ({token}) => {
  const [session, setSession] = useState();
  const moderators = useSelector((state) => state.moderatorReducer);
  const [moderatorsOrder, setModeratorOrder] = useState([]);
  const generalReducer = useSelector((state) => state.generalReducer);
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
  const [editMood, setEditMood] = useState({accounts:{}});
  const [newModeratorInfo, setNewModeratorInfo] = useState({
      name: '',
      nameInArabic: '',
      email: '',
      password:'',
      phone: ''
  })
  const [validation, setValidation] = useState({
      values: [],
  });
  const [searchedValue, setsearchedValue] = useState({
    showSearchedValue: false,
    value: {}
  });



  useEffect(async()=>{
    const session = await getSession();
    setSession(session);
},[])

useEffect(()=>{
  setModeratorOrder(moderators.moderators);
},[moderators.moderators])


  const switchToEditable = (moderatorId) => {
    const moderator = moderators.moderators.find(
      (moderator) => moderator.moderatorId == moderatorId
    );
    if (!moderator) {
      setShow(false);
    }
    setEditMood(moderator);
    setShow(true);
  };

  const changeHandler = (e) => {
    setEditMood((prevState) => ({
      ...prevState,
      account: {
        ...editMood.account,
        [e.target.name]: e.target.value,
      },
    }));
  };


  const changeNewModeratorHandler = (e)=>{
    setNewModeratorInfo(prevState=>({
        ...prevState,
        [e.target.name]: e.target.value
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

  const submitHandler = async (newModerator) => {
    try {
      emptyState();
      setStatus(prevState=>({
          ...prevState,
          sending:true,
          text: "sending..."
      }))
      let data;
      let validateEmailMessage;
      let validateNameMessage;
      let validateNameArabicMessage;
      let validatePhoneMessage;
      let validatePasswordMessage;
      if(newModerator){
        validateEmailMessage = validateAccountsInput(newModeratorInfo.email, false, false, true, false, false);
        validateNameMessage = validateAccountsInput(newModeratorInfo.name,false,true,false,false,false);
        validateNameArabicMessage = validateAccountsInput(newModeratorInfo.nameInArabic,true,false,false,false,false);
        validatePhoneMessage = validateAccountsInput(newModeratorInfo.phone,false,false,false,true,false);
        validatePasswordMessage = validateAccountsInput(newModeratorInfo.password,false,false,false,false,false, false, true);
        if (validatePasswordMessage.length > 0) {
          changeValidationState(validatePasswordMessage);
        }
      }else{
        validateEmailMessage = validateAccountsInput(editMood.account.email, false, false, true, false, false);
        validateNameMessage = validateAccountsInput(editMood.account.name,false,true,false,false,false);
        validateNameArabicMessage = validateAccountsInput(editMood.account.nameInArabic,true,false,false,false,false);
        validatePhoneMessage = validateAccountsInput(editMood.account.phone,false,false,false,true,false);
      }
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
        validatePasswordMessage != null && validatePasswordMessage.length > 0 ||
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
            nameInArabic: newModeratorInfo.nameInArabic,
            email: newModeratorInfo.email,
            password: newModeratorInfo.password,
            phone: newModeratorInfo.phone,
        }),
        });
      }else{
       data = await fetch(`${generalReducer.ENDPOINT}/moderator/moderator-operations/${editMood.moderatorId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token
        },
        body: JSON.stringify({
          uid: session.user.name.id,
          moderatorId: editMood.moderatorId,  
          name: editMood.account.name,
          nameInArabic: editMood.account.nameInArabic,
          email: editMood.account.email,
          phone: editMood.account.phone,
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
      if(newModerator){
        dispatch(moderatorsActions.addNewModerator({
            moderatorId: response.moderatorId,
            account: {
                ...newModeratorInfo
            }
        }));
        setNewModeratorInfo({
            name: '',
            nameInArabic: '',
            password: '',
            email: '',
            phone: ''
        })
      }else{
          dispatch(moderatorsActions.updateModerator(editMood));
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
            show: true,
        }));
    }
  };

  const removeHandler = async (moderatorId) => {
    try{
        emptyState();
        setEditMood(moderatorId);
        setStatus(prevState=>({
            ...prevState,
            sending:true,
            text: "deleting..."
        }))
        const data = await fetch(`${generalReducer.ENDPOINT}/moderator/moderator-operations/${moderatorId}`, {
        method: "DELETE",
        headers:{
            "Content-Type": "application/json",
            "Authorization": token
        },
        body: JSON.stringify({
            uid: session.user.name.id,
            moderatorId: moderatorId
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
        dispatch(moderatorsActions.removeModerator(moderatorId));
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
            text:'',
            show: true,
        }));
    }
  }


  const cancelEditMood = () =>{
    setShow(false);
    setEditMood(null);
  }



  const searchRecord = (e) =>{
      const copy = [...moderators.moderators];
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
        value: moderator
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
        title="Total numbers of registered moderators"
        style="grid-list-gray-style"
        link="/en/admin/moderators"
        children={moderators.moderators.length}
        titleStyle={classes.titleStyle}
        cardContainerSyle={classes.cardContainerRectangleDetails}
        />
    </div>

    <Form className="absolute top-5 left-16 mb-14 md:relative md:w-1/2 md:ml-40 md:mb-16">
        <Form.Field>
        <label>Moderator Name English</label>
        <input placeholder='Moderator Name English' required name="name" onChange={(e)=>changeNewModeratorHandler(e)} value={newModeratorInfo.name} />
        </Form.Field>
        <Form.Field>
        <label>Moderator Name Arabic</label>
        <input placeholder='Moderator Name Arabic' required name="nameInArabic" onChange={(e)=>changeNewModeratorHandler(e)} value={newModeratorInfo.nameInArabic} />
        </Form.Field>
        <Form.Field>
        <label>Moderator Email</label>
        <input placeholder='Moderator Email' required type="email" name="email" onChange={(e)=>changeNewModeratorHandler(e)} value={newModeratorInfo.email}/>
        </Form.Field>
        <Form.Field>
        <label>Moderator Password</label>
        <input placeholder='Moderator password' required type="password" name="password" onChange={(e)=>changeNewModeratorHandler(e)} value={newModeratorInfo.password} />
        </Form.Field>
        <Form.Field>
        <label>Moderator Phone</label>
        <input placeholder='Moderator Phone +966..' required name="phone" minLength="10" maxLength="13" onChange={(e)=>changeNewModeratorHandler(e)} value={newModeratorInfo.phone} />
        </Form.Field>
        <BBT disabled={status.sending ? true : false} positive onClick={()=>submitHandler(true)}>{status.sending ? status.text : "Add moderator"}</BBT>
    </Form>

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
        headers={TABLE_MODERATORS_HEADERS.map((header) => (
          <th key={header}>{header}</th>
        ))}
        style={show ? classes.editModeTable : classes.detailsTable}
      >
        {!searchedValue.showSearchedValue ? moderatorsOrder.sort().map((moderator) => {
          return (
            <Fragment>
              <tr key={moderator.moderatorId}>
                <Td key={moderator.moderatorId} value={moderator.moderatorId}/>
                <Td value={moderator.account.name} onClick={()=>navigateToDetails(moderator.moderatorId)}/>
                <Td value={moderator.account.nameInArabic} onClick={()=>navigateToDetails(moderator.moderatorId)}/>
                <Td value={moderator.account.email}/>
                <Td  value={moderator.account.phone}/>
                <Td className={classes.tdAction} value={<Menu.Menu position="right">
                        <Dropdown item text="actions" disabled ={status.sending && editMood.moderatorId == moderator.moderatorId ? true : false}>
                          <Dropdown.Menu>
                            <Dropdown.Item
                              onClick={() => switchToEditable(moderator.moderatorId)}
                            >
                              Edit
                            </Dropdown.Item>
                            <Dropdown.Item 
                            onClick={()=>removeHandler(moderator.moderatorId)} 
                            >Remove</Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </Menu.Menu>}/>
              </tr>
              {show && editMood.moderatorId == moderator.moderatorId && (
                <Fragment>
                  <tr key={moderator.moderatorId}>
                    <Td value="-"/>
                    <Td value="-"/>
                    <Td value={<Input type="text" value={editMood.account.name} required name="name" minLength="2" maxLength="30" 
                      onChange={(e) => changeHandler(e)}/>}/>
                    <Td value={<Input type="text" value={editMood.account.nameInArabic} minLength="2" maxLength="30" required name="nameInArabic" 
                    onChange={(e) => changeHandler(e)}/>}/>
                    <Td value={<Button disabled = {status.sending && editMood.moderatorId == moderator.moderatorId ? true : false } 
                    text={status.sending && editMood.moderatorId == moderator.moderatorId ? status.text : "Update" } submit={true} onClick={()=>submitHandler(false)}/>}/>
                    <Td value="-"/> <Td value="-"/>
                  </tr>
                  <tr>
                  <Td value="-"/> <Td value="-"/>
                  <Td value={<Input type="email" value={editMood.account.email} required minLength="2" maxLength="30" name="email" 
                  onChange={(e) => changeHandler(e)} />}/> 
                  <Td value ={<Input type="text" value={editMood.account.phone} required minLength="10" maxLength="13" name="phone" 
                  onChange={(e) => changeHandler(e)}/>}/>
                    <Td value={<Button disabled = {status.sending && editMood.moderatorId == moderator.moderatorId ? true : false } text="Cancel" cancel={true} 
                    onClick={cancelEditMood}
                    />}/>
                  <Td value="-"/> <Td value="-"/>
                  </tr>
                </Fragment>
              )}
            </Fragment>
          );
        }) : searchedValue.value && <Fragment>
        <tr key={searchedValue.value.moderatorId}>
        <td>{searchedValue.value.moderatorId}</td>
        <Td onClick={()=>navigateToDetails(searchedValue.value.moderatorId)} value={searchedValue.value.account.name}/>
        <Td onClick={()=>navigateToDetails(searchedValue.value.moderatorId)} value={searchedValue.value.account.nameInArabic}/>
        <Td value={searchedValue.value.account.email}/>
        <Td value={searchedValue.value.account.phone}/>
        <Td value="-"/>
        <Td value="-"/>
        <Td className={classes.tdAction} value={<Menu.Menu position="right">
        <Dropdown item text="actions" disabled ={status.sending && editMood.moderatorId == searchedValue.value.moderatorId ? true : false}>
          <Dropdown.Menu>
            <Dropdown.Item
              onClick={() => switchToEditable(searchedValue.value.moderatorId)}
            >
              Edit
            </Dropdown.Item>
            <Dropdown.Item 
            onClick={()=>removeHandler(searchedValue.value.moderatorId)} 
            >Remove</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </Menu.Menu>}/>
      </tr>
      {show &&  searchedValue.value.moderatorId == editMood.moderatorId && (
        <Fragment>
        <tr key={editMood.moderatorId}>
        <Td value="-"/>
        <Td value="-"/>
        <Td value={<Input type="text" value={editMood.account.name} required name="name" minLength="2" maxLength="30" 
          onChange={(e) => changeHandler(e)}/>}/>
        <Td value={<Input type="text" value={editMood.account.nameInArabic} minLength="2" maxLength="30" required name="nameInArabic" 
        onChange={(e) => changeHandler(e)}/>}/>
        <Td value={<Input type="email" value={editMood.account.email} required minLength="2" maxLength="30" name="email" 
        onChange={(e) => changeHandler(e)} />}/> 
        <Td value ={<Input type="text" value={editMood.account.phone} required minLength="10" maxLength="13" name="phone" 
        onChange={(e) => changeHandler(e)}/>}/>
        <Td value="-"/> <Td value="-"/>
      </tr>
        <tr>
        <Td value="-"/> <Td value="-"/>
        <Td value={<Button disabled = {status.sending && editMood.moderatorId == moderator.moderatorId ? true : false } 
        text={status.sending && editMood.moderatorId == moderator.moderatorId ? status.text : "Update" } submit={true} onClick={()=>submitHandler(false)}/>}/>
            <Td value={<Button disabled = {status.sending && editMood.moderatorId == moderator.moderatorId ? true : false } text="Cancel" cancel={true} 
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

export default ModeratorsDashboard;
