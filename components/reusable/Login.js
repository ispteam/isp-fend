import { sendEmail, validateAccountsInput, validateAccountsInputArabic } from 'helper/functions';
import { signIn } from 'next-auth/client';
import { useRouter } from 'next/router';
import { Fragment, useEffect, useState } from 'react';
import {AiOutlineClose, AiOutlineUpload} from 'react-icons/ai';
import { useDispatch, useSelector } from 'react-redux';
import generalActions from 'stores/actions/generalActions';
import Feedback from './Feedback';

const Login = ({arabic, disable}) => {
    const dispatch = useDispatch();
    const router = useRouter()
    const generalReducer = useSelector((state)=>state.generalReducer);
    const [login, setLogin] = useState(true);
    const [userType, setUserType] = useState('client');
    const [loginInfo, setLoginInfo] = useState({
        email:'',
        password: '',
        name: '',
        nameInArabic: '',
        phone: '',
        companyName: '',
        companyNameInArabic: '',
        shopCertificate: null,
        pref: '',
        carsPref: []
    });

    const [brands, setBrands] = useState([]);

    // useEffect(()=>{
    //     window.scrollTo({
    //         top:0,
    //         behavior:'smooth'
    //     })
    // },[])

    const changeHandler = (e) => {
        if(e.target.files){
            if(e.target.files[0]){
                const file = e.target.files[0];
                if(file.type != "image/png" && file.type != "image/jpeg" && file.type != "image/jpeg" && file.type != "application/pdf"){
                    window.alert("File type is not accepted. Please choose another");
                    setLoginInfo(prevState=>({
                        ...prevState,
                        [e.target.name]: []
                    }));
                    return;
                }else if(e.target.files[0].size > 100000){
                    window.alert("File type is too large. Please choose another");
                    setLoginInfo(prevState=>({
                        ...prevState,
                        [e.target.name]: []
                    }));
                    return;
                }
                setLoginInfo(prevState=>({
                    ...prevState,
                    shopCertificate: e.target.files[0]
                }));
            }
        }else{
            setLoginInfo(prevState=>({
                ...prevState,
                [e.target.name]: e.target.value
            }));
        }
    }

    const changeUserType = (user) => {
        setUserType(user);
        dispatch(generalActions.emptyState())
    }


    const changeSupplierPref = (e) => {
        if(e.target.name == "pref"){
            setLoginInfo(prevState=>({
                ...prevState,
                pref: e.target.value,
                carsPref: []
            }))
        }else{
            const carsPrefCopy = [...loginInfo.carsPref];
            const existingPref = carsPrefCopy.findIndex(pref=>pref == e.target.value);
            if(existingPref > -1){
                carsPrefCopy.splice(existingPref, 1);
                setLoginInfo(prevState=>({
                    ...prevState,
                    carsPref: carsPrefCopy
                }))
                return;
            }
            setLoginInfo(prevState=>({
                ...prevState,
                carsPref: loginInfo.carsPref.concat(e.target.value)
            }))
        }
    }

    const submitHandler = async (e) => {
        try{
            e.preventDefault();
            dispatch(generalActions.emptyState());
            dispatch(generalActions.sendRequest(!arabic ? "Sigining in.." : "..دخول"))
            let validateEmailMessage = validateAccountsInput(loginInfo.email, false, false, true, false, false, false);
            let validatePasswordMessage = validateAccountsInput(loginInfo.password,false,false,false,false,false, false, true);
            if(arabic){
                validateEmailMessage = validateAccountsInputArabic(loginInfo.email, false, false, true, false, false, false);
                validatePasswordMessage = validateAccountsInputArabic(loginInfo.password,false,false,false,false,false, false, true);                
            }
            if (validateEmailMessage.length > 0) {
                dispatch(generalActions.changeValidation(validateEmailMessage));
            }
            if (validatePasswordMessage.length > 0) {
                dispatch(generalActions.changeValidation(validatePasswordMessage));
            }
            if (
                validateEmailMessage.length > 0||
                validatePasswordMessage.length > 0
                ) {
                dispatch(generalActions.showValidationMessages());
                return;
            }
            const response = await signIn('credentials', {
                redirect: false,
                email: loginInfo.email,
                password: loginInfo.password,
                [userType]:true,
                arabic
            });
            if(response.error){
                throw new Error(response.error);
            }
            setTimeout(()=>{
                dispatch(generalActions.emptyState());
          }, 3000)
            window.location.reload();

        }catch(err){
            dispatch(generalActions.changeValidation(err.message));
            dispatch(generalActions.showValidationMessages());
        }
    }

    const submitRegistarionHandler = async (e) => {
        try{
            let data;
            e.preventDefault();
            dispatch(generalActions.emptyState());
            dispatch(generalActions.sendRequest(!arabic ? "Registering.." : "..تسجيل"))
            let validateEmailMessage = validateAccountsInput(loginInfo.email, false, false, true, false, false, false);
            let validatePasswordMessage = validateAccountsInput(loginInfo.password,false,false,false,false,false, false, true);
            let validateNameMessage = validateAccountsInput(loginInfo.name, false, true);
            let validateNameInArabicMessage = validateAccountsInput(loginInfo.nameInArabic, true);
            let validatePhoneMessage = validateAccountsInput(loginInfo.phone, false, false, false, true);
            
            if(arabic){
                validateEmailMessage = validateAccountsInputArabic(loginInfo.email, false, false, true, false, false, false);
                validatePasswordMessage = validateAccountsInputArabic(loginInfo.password,false,false,false,false,false, false, true);
                validateNameMessage = validateAccountsInputArabic(loginInfo.name, false, true);
                validateNameInArabicMessage = validateAccountsInputArabic(loginInfo.nameInArabic, true);
                validatePhoneMessage = validateAccountsInputArabic(loginInfo.phone, false, false, false, true);
            }
            let validateCompanyNameMessage= null;
            let validateCompanyNameInArabicMessage = null;
            let validateImageMessage = null;
            let validateFieldMessage = null;
            let validateCarsPrefMessage = null;
            if (validateEmailMessage.length > 0) {
                dispatch(generalActions.changeValidation(validateEmailMessage));
            }
            if (validatePasswordMessage.length > 0) {
                dispatch(generalActions.changeValidation(validatePasswordMessage));
            }
            if(validateNameMessage.length > 0){
                dispatch(generalActions.changeValidation(validateNameMessage))
            }
            if(validateNameInArabicMessage.length > 0){
                dispatch(generalActions.changeValidation(validateNameInArabicMessage));
            }
            
            if(validatePhoneMessage.length > 0){
                dispatch(generalActions.changeValidation(validatePhoneMessage));
            }
            
            if(userType == "supplier"){
                validateCompanyNameMessage = validateAccountsInput(loginInfo.companyName, false, true);
                validateCompanyNameInArabicMessage = validateAccountsInput(loginInfo.companyNameInArabic, true);
                validateImageMessage = validateAccountsInput(loginInfo.shopCertificate, false, false, false, false,false,false,false,false,false, true);
                validateFieldMessage = validateAccountsInput(loginInfo.pref, false, false, false, false, false, false, false, false, false, false, false, false, false, true);
                if(loginInfo.pref == 'cars'){
                    validateCarsPrefMessage = validateAccountsInput(loginInfo.carsPref.length, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true);
                }
                if(arabic){
                    validateCompanyNameMessage = validateAccountsInputArabic(loginInfo.companyName, false, true);
                    validateCompanyNameInArabicMessage = validateAccountsInputArabic(loginInfo.companyNameInArabic, true);
                    validateImageMessage = validateAccountsInputArabic(loginInfo.shopCertificate, false, false, false, false,false,false,false,false,false, true);
                    validateFieldMessage = validateAccountsInputArabic(loginInfo.pref, false, false, false, false, false, false, false, false, false, false, false, false, false, true);
                    if(loginInfo.pref == 'cars'){
                        validateCarsPrefMessage = validateAccountsInputArabic(loginInfo.carsPref.length, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true);
                    }
                }
                if(validateCompanyNameMessage.length > 0){
                    dispatch(generalActions.changeValidation(validateCompanyNameMessage));
                }
                if(validateCompanyNameInArabicMessage.length > 0){
                    dispatch(generalActions.changeValidation(validateCompanyNameInArabicMessage));
                }
                if(validateImageMessage.length > 0){
                    dispatch(generalActions.changeValidation(validateImageMessage));
                }
                if(validateFieldMessage.length > 0){
                    dispatch(generalActions.changeValidation(validateFieldMessage));
                }
                if(loginInfo.pref == 'cars'){
                    if(validateCarsPrefMessage.length > 0){
                        dispatch(generalActions.changeValidation(validateCarsPrefMessage));
                    }
                }
            }

            if (
                validateCompanyNameMessage != null && validateCompanyNameMessage.length > 0 ||
                validateCompanyNameInArabicMessage != null && validateCompanyNameInArabicMessage.length > 0 ||
                validateImageMessage != null && validateImageMessage.length > 0 ||
                validateFieldMessage != null && validateFieldMessage.length > 0 ||
                validateCarsPrefMessage != null && validateCarsPrefMessage.length > 0 ||
                validateEmailMessage.length > 0 ||
                validatePhoneMessage.length > 0 ||
                validatePasswordMessage.length > 0 ||
                validateNameMessage.length > 0 ||
                validateNameInArabicMessage.length > 0
                ) {
                dispatch(generalActions.showValidationMessages())
                return;
            }
            if(userType == "client"){
                console.log(loginInfo);
                data= await fetch(`${generalReducer.ENDPOINT}/client/client-operations`, {
                    method:'POST',
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        name: loginInfo.name,
                        nameInArabic: loginInfo.nameInArabic,
                        email: loginInfo.email,
                        password: loginInfo.password,
                        phone: "+"+loginInfo.phone
                    })
                })
            }else if(userType == "supplier"){
                const formData = new FormData();
                formData.append('name', loginInfo.name);
                formData.append('nameInArabic', loginInfo.nameInArabic);
                formData.append("email", loginInfo.email);
                formData.append("password", loginInfo.password);
                formData.append("phone", loginInfo.phone);
                formData.append("companyInEnglish", loginInfo.companyName.toUpperCase());
                formData.append("companyInArabic", loginInfo.companyNameInArabic);
                formData.append("companyCertificate", loginInfo.shopCertificate);
                formData.append("pref", loginInfo.pref);
                formData.append("carsPref", loginInfo.carsPref);
                data= await fetch(`${generalReducer.ENDPOINT}/supplier/supplier-operations`, {
                    method:'POST',
                    body: formData
                })
            }
            const response = await data.json();
            if (response.statusCode !== 201) {
                /**
                 * If the validation error came from the backend, it will be in an array
                 * So, wi loop through the array values inside the response object and convert it into an array
                 */
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
            dispatch(generalActions.sendRequest(!arabic ? response.message : response.messageInArabic));
             setLoginInfo({
                email:'',
                password: '',
                name: userType == "client" ? '' : userType == "supplier" ? '' : null,
                nameInArabic: userType == "client" ? '' : userType == "supplier" ? '' : null,
                phone: userType == "client" ? '' : userType == "supplier" ? '' : null,
                companyName: userType == "supplier" ? '' : null,
                companyNameInArabic: userType == "supplier" ? '' : null,
                shopCertificate: userType == "supplier" ? null : null,
                pref: userType == "supplier" ? '' : null,
                carsPref: userType == "supplier"? '' : null
              })
            //   setLogin(!login);
            //   if(userType == "client"){
            //     await sendEmail(loginInfo.email, "registration", "client")
            //   }else if(userType == "supplier"){
            //     await sendEmail(loginInfo.email, "registration", "supplier")
            //   }
            setTimeout(()=>{
                dispatch(generalActions.emptyState());
          }, 3000)
        }catch(err){
            dispatch(generalActions.changeValidation(err.message))
            dispatch(generalActions.showValidationMessages());
        }
    }

    const toggleAuth = () => {
        setLogin(!login)
        dispatch(generalActions.emptyState())
    }

    const fetchBrands = async () => {
        try{
            const data = await fetch(`${generalReducer.ENDPOINT}/brand/brands-type/cars`);
            const response = await data.json();
            if(response.statusCode != 200){
                throw new Error(response.message);
            }
            setBrands(response.brands.map(br=>({
                key: br.brandId,
                value: br.brandName,
                text: br.brandName + "-" + br.brandNameInArabic
            })));
        }catch(err){
            alert(arabic ? err.messageInArabic : err.message);
        }
    }
    
    useEffect(async()=>{
        if(userType == "supplier"){
            await fetchBrands()
        }
    }, [userType])


    return <div className={!generalReducer.showModalLogin ? "modal-container" : "modal-container show"}>
        <div className="header-modal-container">
            {!disable && <AiOutlineClose size={27} color={"#FE346E"} className="close-icon" onClick={()=>{
                dispatch(generalActions.toggleLoginModal())
                dispatch(generalActions.emptyState())
                }}/> }
            <h3 className={!arabic ? "login-title english" : "login-title"} style={{fontSize:!arabic && '18px'}}>{!arabic ? "Login" : "تسجيل دخول"}</h3>
        </div>
        <div className="user-type-container">
            <p className={!arabic ? 'english' : ''} onClick={()=>changeUserType('client')} style={{borderBottom: userType == 'client' && '3px solid #FE346E', transition:'all 0.2s'}}>{!arabic? 'Client' : 'عميل'}</p>
            <p className={!arabic ? 'english' : ''} onClick={()=>changeUserType('supplier')} style={{borderBottom: userType != 'client' && '3px solid #FE346E', transition:'all 0.2s'}}>{!arabic? 'Supplier' : 'مورد'}</p>
        </div>
        <hr/>
        <form className={!arabic ? "form-auth-container english" : "form-auth-container"} onSubmit={login ? submitHandler : submitRegistarionHandler}>
            <input type='text' name="email" value={loginInfo.email} onChange={changeHandler} placeholder={!arabic ? "email" : "البريد"}  />
            <input type='password' name="password" value={loginInfo.password} onChange={changeHandler} placeholder={!arabic ? "password" : "الرقم السري"}  />
            {!login &&
                <Fragment>
                    <input type='text' name="name" value={loginInfo.name} onChange={changeHandler} placeholder={!arabic ? "Name English" : "الاسم بالانجليزي"}  />
                    <input type='text' name="nameInArabic" value={loginInfo.nameInArabic} onChange={changeHandler} placeholder={!arabic ? "Name Arabic" : "الاسم بالعربي"}  />
                    <input type='number' name="phone" value={loginInfo.phone} onChange={changeHandler} placeholder={!arabic ? "Phone 9665xxx" : "9665xxx الجوال"}  />
                    {userType == "supplier" && 
                    <Fragment>
                        <input type='text' name="companyName" value={loginInfo.companyName} onChange={changeHandler} placeholder={!arabic ? "Company/Shop Name" : "اسم الشركة/المحل"}  />
                        <input type='text' name="companyNameInArabic" value={loginInfo.companyNameInArabic} onChange={changeHandler} placeholder={!arabic ? "Company/Shop Name Arabic" : "اسم الشركة/المحل عربي"}  />
                        <div onChange={changeSupplierPref} className="flex flex-col justify-center items-center">
                        <p className={!arabic ? 'field-title english' : 'field-title'}>{!arabic ? 'What is your field ?' : 'ماهو مجالك؟' }</p>
                        <div className="field-container">
                            <div>
                                <label htmlFor="cars" className={!arabic ? 'english' : ''} >{!arabic ? 'Cars' : 'سيارات'}</label>
                                <input type="radio" id="cars" value="cars" name="pref" /> 
                            </div>
                            <div>
                                <label htmlFor="vehicles" className={!arabic ? 'english' : ''}>{!arabic ? 'Vehicles' : 'مركبات'}</label>
                                <input type="radio" id="vehicles" value="vehicles" name="pref" />
                            </div>
                            <div>
                                <label htmlFor="all" className={!arabic ? 'english' : ''}>{!arabic ? 'All' : 'الكل'}</label>
                                <input type="radio" id="all" value="all" name="pref" />
                            </div>
                        </div>
                        </div>
                        {loginInfo.pref == "cars" && brands.length > 0 &&
                            <div className="cars-brands-container">
                                <div>
                                    <label htmlFor="all cars" className={!arabic ? 'english' : ''} >{"All - الكل"}</label>
                                    <input type="checkbox" id="all" value="all cars" name="all" onChange={changeSupplierPref}/> 
                                </div>
                                {brands.map(br=>(
                                <div key={br.text}>
                                    <label htmlFor={br.value} className={!arabic ? 'english' : ''} >{br.text}</label>
                                    <input disabled={loginInfo.carsPref.includes('all cars') ? true : false} type="checkbox" id={br.value} value={br.value} name={br.value} onChange={changeSupplierPref}/> 
                                </div>
                                ))}
                            </div>
                        }
                        <div className='upload-container'>
                            <label className={!arabic ? 'english' : ''}>
                                {!arabic ? 'Upload Your Store/Warehouse Certificate' : 'ارفع شهادة السجل التجاري'}
                                <span>PNG, JPG, JPEG, PDF ONLY</span>
                                <span>{!arabic ? 'Max file size is 100MB' : 'اقصى حجم 100 ميقا'}</span>
                                <AiOutlineUpload size={45} color={"#b1b1b1"} style={{marginTop:'1rem'}}/>
                                {loginInfo.shopCertificate != null && 
                                <span>{loginInfo.shopCertificate.name}</span>
                                }
                                <input hidden type='file' name="shopCertificate" accept=".png , .jpeg, .jpg, .pdf" onChange={changeHandler}/>
                            </label>
                        </div>
                    </Fragment>
                    }
                </Fragment> 
            }
            <button className={!arabic ? 'english' : ''} type='submit'>{!login && !arabic ? 'Register' : !login && arabic ? 'تسجيل' : login && !arabic ? 'Login': login && arabic ? 'دخول' : null}</button>
        </form>
        <p onClick={toggleAuth} className={!arabic ? 'register-text english' : 'register-text'} >{login && !arabic ? 'Register' : login && arabic ? 'تسجيل' : !login && !arabic ? 'Login': !login && arabic ? 'دخول' : null}</p>
        {disable && <p className={!arabic ? 'register-text english' : 'register-text'} onClick={()=>{
            router.push(!arabic ? '/en' : '/')
            dispatch(generalActions.toggleLoginModal())
        }}>{!arabic ? 'Go home' : 'الرئيسية'}</p>}

        <Feedback arabic={arabic} />
        
    </div>
}

export default Login;