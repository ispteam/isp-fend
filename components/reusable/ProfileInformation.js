import { Fragment, useEffect, useState } from 'react';
import Spinner from 'components/reusable/Spinner/Spinner';
import { getSession } from 'next-auth/client';
import { useDispatch, useSelector } from 'react-redux';
import {BsToggleOff, BsToggleOn} from 'react-icons/bs';
import { validateAccountsInput, validateAccountsInputArabic } from 'helper/functions';
import generalActions from 'stores/actions/generalActions';
import Feedback from './Feedback';
// import Cookies from 'js-cookie';

const ProfileInformation = ({token, admin, moderator, client, arabic, supplier, session}) => {

        /**
     * ======================
     * NOTE: IF THERE IS NO COMMENT IN ANY FUNCTION, OR ANY THING RELATED THAT IS MEAN IT WAS EXPLAINED IN THE SUPPLIERS COMPONENT
     * ======================
     */

    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(true);
    const generalReducer=useSelector((state) => state.generalReducer);
    const [profileInfo, setProfileInfo] = useState({});
    const [profileCopy, setProfileCopy] = useState({});
    const [editMood, setEditMood] = useState(false);
    const [brands, setBrands] = useState([]);

    const [supplierPref, setSupplierPref] = useState({
      pref:'',
      carsPref: [],
      carsPrefUpdated: []
    });




    
   const fetchProfileInfo = async () => {
        try{
            let data;
            let response;
            dispatch(generalActions.emptyState());
            setIsLoading(true);
            if(admin){
              data = await fetch(`${generalReducer.ENDPOINT}/admin/admin-operations/${session.user.name.id}`);
            }else if(moderator){
              data = await fetch(`${generalReducer.ENDPOINT}/moderator/moderator-operations/${session.user.name.id}`);
            }else if(client){
              data = await fetch(`${generalReducer.ENDPOINT}/client/client-operations/${session.user.name.id}`);
            }else if(supplier){
              data = await fetch(`${generalReducer.ENDPOINT}/supplier/supplier-operations/${session.user.name.id}`);
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
            }else if(client){
              setProfileCopy(response.client);
              setProfileInfo(response.client);
            }else if(supplier){
              setProfileCopy(response.supplier);
              setProfileInfo(response.supplier);
              setSupplierPref(prevState=>({
                ...prevState,
                pref: response.supplier.pref,
                carsPref: response.supplier.carsPref.split(',')
              }))
            }
            setIsLoading(false);
        }catch(err){
          dispatch(generalActions.changeValidation(err.message));
          dispatch(generalActions.showValidationMessages());
        }
   } 

   useEffect(()=>{
        if(!session){
            return
        }
        fetchProfileInfo();
   }, [session]);

   const changeHandler = (e) => {
        if(supplier){
            setProfileCopy(prevState=>({
              ...prevState,
              account:{
                  ...prevState.account,
                  [e.target.name]: e.target.value
              },
              [e.target.name]: e.target.value
          }))
        }else{
          setProfileCopy(prevState=>({
              ...prevState,
              account:{
                  ...prevState.account,
                  [e.target.name]: e.target.value
              }
          }))
        }
   }

   const toggleEdit = () => {
       setProfileCopy(profileInfo);
       setEditMood(!editMood);
   }

   const submitHandler = async() => {
    try {
        let data;
        window.scrollTo({
          behavior:'smooth',
          top:20
        })
        dispatch(generalActions.emptyState());
        dispatch(generalActions.sendRequest(!arabic ? "Updating..." : "..تحديث"));
        dispatch(generalActions.changeMood("profile"))
        let validateNameMessage = null;
        let validateEmailMessage = validateAccountsInput(profileCopy.account.email, false, false, true, false, false);
        if(!supplier){
           validateNameMessage = validateAccountsInput(profileCopy.account.name,false,false,false,false,false, false, false, false, false, false, false, false, false, false, false, false, true);
        }
        let validatePhoneMessage = validateAccountsInput(profileCopy.account.phone, false, false, false, true);
        let validateCompanyNameMessage= null;
        let validateCompanyNameInArabicMessage = null;
        let validateCarsPrefMessage = null;
        if(supplier){
            validateCompanyNameMessage = validateAccountsInput(profileCopy.companyInEnglish, false, true );
            validateCompanyNameInArabicMessage = validateAccountsInput(profileCopy.companyInArabic, true);
            if(supplierPref.pref == 'cars'){
              if(supplierPref.carsPrefUpdated.length > 1){
                  validateCarsPrefMessage = validateAccountsInput(supplierPref.carsPrefUpdated.length, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true);
              }
            }
            if(arabic){
              validateCompanyNameMessage = validateAccountsInputArabic(profileCopy.companyInEnglish, false, true );
              validateCompanyNameInArabicMessage = validateAccountsInputArabic(profileCopy.companyInArabic, true);
              if(supplierPref.pref == 'cars'){
                if(supplierPref.carsPrefUpdated.length > 1)
                    validateCarsPrefMessage = validateAccountsInputArabic(supplierPref.carsPrefUpdated.length, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true);
              }
            }
        }
        if(arabic){
         validateEmailMessage = validateAccountsInputArabic(profileCopy.account.email, false, false, true, false, false);
         if(!supplier){
           validateNameMessage = validateAccountsInputArabic(profileCopy.account.name,false,false,false,false,false, false, false, false, false, false, false, false, false, false, false, false, true);
         }
         validatePhoneMessage = validateAccountsInputArabic(profileCopy.account.phone,false,false,false,true,false);
        }
        if (validateEmailMessage.length > 0) {
          dispatch(generalActions.changeValidation(validateEmailMessage));
        }
        if (validateNameMessage != null && validateNameMessage.length > 0) {
          dispatch(generalActions.changeValidation(validateNameMessage));
        }
        if (validatePhoneMessage.length > 0) {
          dispatch(generalActions.changeValidation(validatePhoneMessage));
        }

        if(validateCompanyNameMessage != null && validateCompanyNameMessage.length > 0){
          dispatch(generalActions.changeValidation(validateCompanyNameMessage));
        }
        if(validateCompanyNameInArabicMessage != null && validateCompanyNameInArabicMessage.length > 0){
          dispatch(generalActions.changeValidation(validateCompanyNameInArabicMessage));
        }

        if(profileCopy.pref == 'cars'){
          if(validateCarsPrefMessage != null && validateCarsPrefMessage.length > 0){
              dispatch(generalActions.changeValidation(validateCarsPrefMessage));
          }
      }

        if (
          validateCompanyNameMessage != null && validateCompanyNameMessage.length > 0 ||
          validateCompanyNameInArabicMessage != null && validateCompanyNameInArabicMessage.length > 0 ||
          validateCarsPrefMessage != null && validateCarsPrefMessage.length > 1 ||
          validateEmailMessage.length > 0 ||
          validateNameMessage != null && validateNameMessage.length > 0 ||
          validatePhoneMessage.length > 0
        ) {
          dispatch(generalActions.showValidationMessages());
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
        }else if(client){
          data = await fetch(`${generalReducer.ENDPOINT}/client/client-operations/${session.user.name.id}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              "Authorization": token
            },
            body: JSON.stringify({
              uid: session.user.name.id,
              clientId: session.user.name.id,
              name: profileCopy.account.name,
              nameInArabic: profileCopy.account.nameInArabic,
              email: profileCopy.account.email,
              phone: profileCopy.account.phone,
            }),
          });
        }else if(supplier){
          data = await fetch(`${generalReducer.ENDPOINT}/supplier/supplier-operations/${session.user.name.id}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              "Authorization": token
            },
            body: JSON.stringify({
              uid: session.user.name.id,
              supplierId: session.user.name.id,
              email: profileCopy.account.email,
              phone: profileCopy.account.phone,
              companyInEnglish: profileCopy.companyInEnglish,
              companyInArabic: profileCopy.companyInArabic,
              pref: supplierPref.pref,
              carsPref: supplierPref.carsPrefUpdated.length > 0 ? supplierPref.carsPrefUpdated.join(',') :  supplierPref.carsPref.join(",")
            }),
          });
          // Cookies.set("pref", supplierPref.pref);
          // Cookies.set("carsPref", supplierPref.carsPref);
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
        dispatch(generalActions.sendRequest(!arabic ? response.message : response.messageInArabic))
        setTimeout(()=>{
             dispatch(generalActions.emptyState());
             window.location.reload();
        }, 3000)
      } catch (err) {
        dispatch(generalActions.changeValidation(err.message));
        dispatch(generalActions.showValidationMessages());
      }
   }

   const fetchBrands = async () => {
    try{
        let data = await fetch(`${generalReducer.ENDPOINT}/brand/brand-operations`);
        let response = await data.json();
        if(response.statusCode != 200){
            throw new Error(response.message);
        }
        setBrands(response.brands.filter(br=>br.field == "cars").map(br=>({
            key: br.brandId,
            value: br.brandName,
            text: br.brandName + "-" + br.brandNameInArabic
        })));
    }catch(err){
        alert(err.message);
    }
}

    useEffect(()=>{
        if(supplier){
            fetchBrands()
        }
    }, [])

  const changeSupplierPref = (e) => {
      if(e.target.name == "pref"){
        setSupplierPref(prevState=>({
            ...prevState,
            pref: e.target.value,
            carsPrefUpdated: []
        }))
    }else{
        const carsPrefCopy = [...supplierPref.carsPrefUpdated];
        const existingPref = carsPrefCopy.findIndex(pref=>pref == e.target.value);
        if(existingPref > -1){
            carsPrefCopy.splice(existingPref, 1);
            setSupplierPref(prevState=>({
                ...prevState,
                carsPrefUpdated: carsPrefCopy
            }))
            return;
        }
        setSupplierPref(prevState=>({
            ...prevState,
            carsPrefUpdated: supplierPref.carsPrefUpdated.concat(e.target.value)
        }))
    }
  }
   

  const requestUpdate = async () => {
      try{
        dispatch(generalActions.emptyState());
        dispatch(generalActions.sendRequest(!arabic ? 'Requesting..' : '..طلب'));
        const data = await fetch(`${generalReducer.ENDPOINT}/supplier/request-update`, {
          method: 'PATCH',
          headers:{
            'Content-Type':'application/json',
            'Authorization': token
          },
          body: JSON.stringify({
            uid: session.user.name.id
          })
        });
        const response = await data.json();
        if(response.statusCode != 200){
          throw new Error(response.message);
        }
        dispatch(generalActions.sendRequest(!arabic ? response.message : response.messageInArabic));
        setTimeout(() => {
          dispatch(generalActions.emptyState());
          window.location.reload();
        }, 3000);
      }catch(err){
          dispatch(generalActions.changeValidation(err.message));
          dispatch(generalActions.showValidationMessages());
      }
  }
    

    return  <div>
    <div>
    {isLoading ? <div><Spinner/></div> : profileInfo &&
    <div className="profile-container" >
       <div className={!arabic ? "profile-title english" : "profile-title"}>{!arabic ? 'Profile' : 'المعلومات الشخصية' }</div>
      {!arabic ?   
      <div className="user-type english">
      {profileInfo.account.userType == 0 ? "ADMIN" 
      : profileInfo.account.userType == 1 ? "MODERATOR" 
      : profileInfo.account.userType == 2 ? "SUPPLIER" 
      : profileInfo.account.userType == 3 ? "CLIENT" : null}</div>
      : <div className="user-type">
        {profileInfo.account.userType == 0 ? "مدير" 
        : profileInfo.account.userType == 1 ? "مشرف" 
        : profileInfo.account.userType == 2 ? "موّرد" 
        : profileInfo.account.userType == 3 ? "عميل" : null}</div> }
        <form className="form-profile-container">
            <div className="form-inner-container">
                <label className={!arabic ? "english" : ''} style={{fontSize:'15px'}}>{!arabic ? 'Email' : 'البريد الالكتروني'}</label>
                <input type="email" name="email" className={!arabic ? 'english-input' : ''} disabled={editMood ? false : true} value={profileCopy.account.email} onChange={(e)=>changeHandler(e)}/>
            </div>
            {!supplier &&
            <div className="form-inner-container">
                <label className={!arabic ? "english" : ''} style={{fontSize:'15px'}}>{!arabic ? 'Name' : 'الاسم'}</label>
                <input type="text" name="name" className={!arabic ? 'english-input' : ''} disabled={editMood ? false : true} value={profileCopy.account.name} onChange={(e)=>changeHandler(e)}/>
            </div>
            }
            <div className="form-inner-container">
                <label className={!arabic ? "english" : ''} style={{fontSize:'15px'}}>{!arabic ? 'Phone' : 'رقم الجوال'}</label>
                <input type="text" name="phone" className={!arabic ? 'english-input' : ''} disabled={editMood ? false : true} value={profileCopy.account.phone} onChange={(e)=>changeHandler(e)}/>
            </div>
            {supplier &&
              <Fragment>
                <div className="form-inner-container">
                    <label className={!arabic ? "english" : ''} style={{fontSize:'15px'}}>{!arabic ? 'Company/Shop Name In English' : 'اسم الشركة/المحل بالانجليزي'}</label>
                    <input type="text" className={!arabic ? 'english-input' : ''} name="companyInEnglish" disabled={editMood ? false : true} value={profileCopy.companyInEnglish} onChange={(e)=>changeHandler(e)}/>
                </div>
                <div className="form-inner-container">
                    <label className={!arabic ? "english" : ''} style={{fontSize:'15px'}}>{!arabic ? 'Comapny/Shop Name In Arabic' : 'اسم الشركة/المحل بالعربي'}</label>
                    <input type="text" className={!arabic ? 'english-input' : ''} name="companyInArabic" disabled={editMood ? false : true} value={profileCopy.companyInArabic} onChange={(e)=>changeHandler(e)}/>
                </div>
                {/* <div className={!arabic ? "form-inner-container english" : "form-inner-container"}>
                    <label className={!arabic ? "english" : ''} style={{fontSize:'15px'}}>{!arabic ? 'Requests completed time' : 'عدد الطلبات المكتلمة'}</label>
                    <input type="text" name="completedRequests" disabled={true} value={profileCopy.cancelTimes} onChange={(e)=>changeHandler(e)}/>
                </div> */}
                <div className="form-inner-container">
                    <label className={!arabic ? "english" : ''} style={{fontSize:'15px'}}>{!arabic ? 'Requests cancelations time' : 'عدد مرات الغاء الطلبات'}</label>
                    <input type="text" className={!arabic ? 'english-input' : ''} name="cancelationsTime" disabled={true} value={profileCopy.cancelTimes} onChange={(e)=>changeHandler(e)}/>
                </div>
                <div className="field-container">
                      <div>
                          <label style={{color:'#1d1d1d'}} htmlFor="cars" className={!arabic ? 'english' : ''} >{!arabic ? 'Cars' : 'سيارات'}</label>
                          <input type="radio" id="cars" value="cars" name="pref" checked={supplierPref.pref == "cars" ? true : false} onChange={changeSupplierPref}/> 
                      </div>
                      <div>
                          <label style={{color:'#1d1d1d'}} htmlFor="vehicles" className={!arabic ? 'english' : ''}>{!arabic ? 'Vehicles' : 'مركبات'}</label>
                          <input type="radio" id="vehicles" value="vehicles" name="pref" checked={supplierPref.pref == "vehicles" ? true : false} onChange={changeSupplierPref}/>
                      </div>
                      <div>
                          <label style={{color:'#1d1d1d'}} htmlFor="all" className={!arabic ? 'english' : ''}>{!arabic ? 'All' : 'الكل'}</label>
                          <input type="radio" id="all" value="all" name="pref"  checked={supplierPref.pref == "all" ? true : false} onChange={changeSupplierPref}/>
                      </div>
                  </div>
                  {supplierPref.pref == "cars" && brands.length > 0 &&
                    <Fragment>
                      <div className="cars-pref-container">
                      <p className={!arabic ? "english" : ""}>{!arabic ? "Your cars preferences" : "تفضيلات السيارات المختارة"}</p>
                      <div className="cars-profile-prefs">
                        {supplierPref.carsPref.map(carPref=><p key={carPref} className={!arabic ? 'english' : ''}>{carPref}</p>)}
                      </div>
                      </div>
                      <hr className="hr" />
                        <div className="cars-brands-container">
                            <div>
                                <label style={{color:'#1d1d1d'}} htmlFor="all cars" className={!arabic ? 'english' : ''} >{"All - الكل"}</label>
                                <input type="checkbox" id="all" value="all cars" name="all cars" onChange={changeSupplierPref}/> 
                            </div>
                            {brands.map((br, idx)=>(
                              <div key={br.text}>
                                  <label style={{color:'#1d1d1d'}} htmlFor={br.value} className={!arabic ? 'english' : ''} >{br.text}</label>
                                  <input type="checkbox" id={br.value} value={br.value} name={br.value} onChange={changeSupplierPref}/> 
                              </div>
                            ))}
                        </div>
                        </Fragment>
                    }
                </Fragment>
            }
        </form>
        <Feedback arabic={arabic} />
        {editMood && <button className={!arabic ? 'update-btn english' : 'update-btn' } disabled={generalReducer.status.sending ? true : false}  onClick={submitHandler}>{!arabic ? "Update" :"تحديث"}</button>
         }

         {supplier && profileCopy.updateRequest == 1 && <p className={!arabic ? "warning-cancelation-text english" : "warning-cancelation-text" }>{!arabic ? 'Request for updating information has been sent' : 'تم ارسال طلب تحديث معلوماتك'}</p>}

         {supplier && profileCopy.updateRequest == 0 &&
           <button 
           className={!arabic ? 'update-btn english' : 'update-btn' } 
           disabled={generalReducer.status.sending ? true : false} 
           onClick={requestUpdate}>{!arabic ? "Request Update" :"طلب تحديث"}</button>
         }

         {supplier && profileCopy.updateRequest == 2 ? 
          !arabic ?
          <div className="update-btn-container">
          <span className={!arabic ? 'english' : ''} >Toggle to {editMood? `close editting` : `Update`}</span>{editMood ? <BsToggleOn size={30} color="#90ee90" onClick={()=>toggleEdit()} /> : <BsToggleOff size={30} onClick={()=>toggleEdit()} /> }
          </div>
          : <div className="update-btn-container-ar">
            <span>{editMood? `اغلق وضع التحديث` : `تحديث؟`}</span>{editMood ? <BsToggleOn size={30} color="#90ee90" onClick={()=>toggleEdit()} /> : <BsToggleOff size={30} onClick={()=>toggleEdit()} /> }
            </div>
          : client && !arabic ?
          <div className="update-btn-container">
          <span className={!arabic ? 'english' : ''} >Toggle to {editMood? `close editting` : `Update`}</span>{editMood ? <BsToggleOn size={30} color="#90ee90" onClick={()=>toggleEdit()} /> : <BsToggleOff size={30} onClick={()=>toggleEdit()} /> }
          </div>
          : client && arabic ? <div className="update-btn-container-ar">
            <span>{editMood? `اغلق وضع التحديث` : `تحديث؟`}</span>{editMood ? <BsToggleOn size={30} color="#90ee90" onClick={()=>toggleEdit()} /> : <BsToggleOff size={30} onClick={()=>toggleEdit()} /> }
            </div>
          : admin && !arabic ? 
            <div className="update-btn-container">
            <span className={!arabic ? 'english' : ''} >Toggle to {editMood? `close editting` : `Update`}</span>{editMood ? <BsToggleOn size={30} color="#90ee90" onClick={()=>toggleEdit()} /> : <BsToggleOff size={30} onClick={()=>toggleEdit()} /> }
            </div>
          : moderator && !arabic && 
            <div className="update-btn-container">
            <span className={!arabic ? 'english' : ''} >Toggle to {editMood? `close editting` : `Update`}</span>{editMood ? <BsToggleOn size={30} color="#90ee90" onClick={()=>toggleEdit()} /> : <BsToggleOff size={30} onClick={()=>toggleEdit()} /> }
            </div>
         }
        
        </div>
    }
  </div>
  </div>
}

export default ProfileInformation;