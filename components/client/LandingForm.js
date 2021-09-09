const { Fragment, useState } = require("react")
import countries from 'helper/countries.json';
import { sendEmail, validateAccountsInput, validateAccountsInputArabic } from '../../helper/functions';
import { useDispatch, useSelector } from 'react-redux';
import generalActions from '../../stores/actions/generalActions';


let SUPPLIERS_PREF_EMAILS = [];

const LandingAddRequestForm = ({arabic, option, chooseOption ,brands, yearsList, session, suppliersEmails}) => {

    const generalReducer = useSelector(state=>state.generalReducer);
    const dispatch = useDispatch();
    const nextStep = () => {
        const addressForm = document.querySelector(".address-landing-container");
        const nextStepButton = document.querySelector(".next-step-landing");
        const submitBtn = document.querySelector(".submit-step-landing");
        const registrationLandingForm = document.querySelector('.registration-landing-form');
        addressForm.style.display = "grid";
        nextStepButton.style.display = "none";
        submitBtn.style.display = "block";
        if(!session){
            registrationLandingForm.style.display = "block";
        }
    }

    const [cities, setCities] = useState([]);

    const [registerationInfo, setRegistrationInfo] = useState({
        email:'',
        password: '',
        name:'',
        phone:''
    })

    const [requestData, setRequestData] = useState({
        brandId: '',
        year: null,
        modelNo: '',
        partNo:'',
        quantity: '',
        description: '',
        country:'',
        city:'',
        district: '',
        street:''
    })
    
    const onChangeHandler = (e) => {
        if(e.target.name == "brandId" && option == "cars"){
            const prevBrandPerIndex = [];
            const brand = document.querySelector("#br" + e.target.value);
            prevBrandPerIndex[0] = brand.textContent.split("-")[0];
            SUPPLIERS_PREF_EMAILS[0] = prevBrandPerIndex[0];
        }
        setRequestData(prevState=>({
            ...prevState,
            [e.target.name]: e.target.value
        }))
    }

    const changeCountry = async (e) => {
        try{
            setRequestData(prevState=>({
                ...prevState,
                country: e.target.value
            }))
            if(!arabic){
                const data = await fetch("https://countriesnow.space/api/v0.1/countries/cities", {
                    method:"POST",
                    headers:{
                        "Content-Type":"application/json"
                    },
                    body: JSON.stringify({
                        country: e.target.value
                    })
                })
                const response = await data.json();
                if(response.error){
                    throw new Error("Can not fetch cities");
                }
                setCities(response.data);
            }
        }catch(err){
            alert(err.message);
        }
    }

    const onChangeRegistartion = (e) => {
        setRegistrationInfo(prevState=>({
            ...prevState,
            [e.target.name]: e.target.value
        }))
    }

    const submitRequest = async () => {
        try{
            window.scrollTo({
                behavior:'smooth',
                top:300
            })
            console.log(requestData);
            console.log(registerationInfo);
            dispatch(generalActions.emptyState());
            dispatch(generalActions.sendRequest(!arabic ? 'Sending..' : '..ارسال'));
            let validationModelNo = validateAccountsInputArabic(requestData.modelNo, false, false, false, false, false, false, false, true);
            let validationPartNo = validateAccountsInputArabic(requestData.partNo,false,false,false,false,false, false, false, true);
            let validationDescription = validateAccountsInputArabic(requestData.description,false,false,false,false,false, false, false, true);
            let validateCountryMessage = validateAccountsInputArabic(requestData.country,false,false,false,false, true, false);
            let validateCityMessage = validateAccountsInputArabic(requestData.city,false,false,false,false,false, true);
            let validationDistrictMessage = validateAccountsInputArabic(requestData.district, true, false, false, false, false);
            let validationStreetMessage = validateAccountsInputArabic(requestData.street,true,false,false,false,false);
            let validateEmailMessage = null;
            let validatePasswordMessage = null;
            let validateNameMessage = null;
            let validatePhoneMessage = null;
            if(!session && !arabic){
                validateEmailMessage = validateAccountsInput(registerationInfo.email, false, false, true);
                validatePasswordMessage = validateAccountsInput(registerationInfo.password, false, false, false, false, false, false, true);
                validateNameMessage = validateAccountsInput(registerationInfo.name, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true);
                validatePhoneMessage = validateAccountsInput(registerationInfo.phone, false, false, false, true);
            }else if(!session && arabic){
                validateEmailMessage = validateAccountsInputArabic(registerationInfo.email, false, false, true);
                validatePasswordMessage = validateAccountsInputArabic(registerationInfo.password, false, false, false, false, false, false, true);
                validateNameMessage = validateAccountsInputArabic(registerationInfo.name, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true);
                validatePhoneMessage = validateAccountsInputArabic(registerationInfo.phone, false, false, false, true);
            }
            if(!arabic){
                validationModelNo = validateAccountsInput(requestData.modelNo, false, false, false, false, false, false, false, true);
                validationPartNo = validateAccountsInput(requestData.partNo,false,false,false,false,false, false, false, true);
                validationDescription = validateAccountsInput(requestData.description,false,false,false,false,false, false, false, true);
                validateCountryMessage = validateAccountsInput(requestData.country,false,false,false,false, true, false);
                validateCityMessage = validateAccountsInput(requestData.city,false,false,false,false,false, true);
                validationDistrictMessage = validateAccountsInput(requestData.district, false, true, false, false, false);
                validationStreetMessage = validateAccountsInput(requestData.street,false,true,false,false,false);
            }

            let validationYearMessage = null;

            if(option != "cars" && arabic){
                validationYearMessage = validateAccountsInputArabic(requestData.year,false,false,false,false,false, false, false, false, true);
            }else if(!option != "cars" && !arabic){
                validationYearMessage = validateAccountsInput(requestData.year,false,false,false,false,false, false, false, false, true);
            }
            
            //Check the validation error if any we push it into the validation values.
            if(!session && validateEmailMessage != null && validateEmailMessage.length > 0){
                dispatch(generalActions.changeValidation(validateEmailMessage));
            }
            if(!session && validatePasswordMessage != null && validatePasswordMessage.length > 0){
                dispatch(generalActions.changeValidation(validatePasswordMessage));
            }
            if(!session && validateNameMessage != null && validateNameMessage.length > 0){
                dispatch(generalActions.changeValidation(validateNameMessage));
            }
            if(!session && validatePhoneMessage != null && validatePhoneMessage.length > 0){
                dispatch(generalActions.changeValidation(validatePhoneMessage));
            }
            if (validationModelNo.length > 0) {
              dispatch(generalActions.changeValidation(validationModelNo));
            }
            if (validationPartNo.length > 0) {
              dispatch(generalActions.changeValidation(validationPartNo));
            }
            if (option != "cars" && validationYearMessage.length > 0) {
              dispatch(generalActions.changeValidation(validationYearMessage));
            }
            if (validationDescription.length > 0) {
              dispatch(generalActions.changeValidation(validationDescription));
            }
            if (validateCountryMessage.length > 0) {
                dispatch(generalActions.changeValidation(validateCountryMessage));
              }
              if (validateCityMessage.length > 0) {
                dispatch(generalActions.changeValidation(validateCityMessage));
              }
              if (validationDistrictMessage.length > 0) {
                dispatch(generalActions.changeValidation(validationDistrictMessage));
              }
              if (validationStreetMessage.length > 0) {
                dispatch(generalActions.changeValidation(validationStreetMessage));
              }
            // If the validation values is not  empty, we terminate the function job and show the error messages
            if (
              validateEmailMessage != null && validateEmailMessage.length > 0 ||
              validatePasswordMessage != null && validatePasswordMessage.length > 0 ||
              validateNameMessage != null && validateNameMessage.length > 0 ||
              validatePhoneMessage != null && validatePhoneMessage.length > 0 ||
              validationModelNo.length > 0 ||
              validationPartNo.length > 0 ||
              validationDescription.length > 0 ||
              option != "cars" && validationYearMessage.length > 0 || 
              validateCountryMessage.length > 0 ||
              validateCityMessage.length > 0 ||
              validationDistrictMessage.length > 0 ||
              validationStreetMessage.length > 0
            ) {
              dispatch(generalActions.showValidationMessages());
              return;
            }
            
            const data = await fetch(`${generalReducer.ENDPOINT}/request/add-signle-request`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    brandId: requestData.brandId,
                    year: requestData.year,
                    description: requestData.description,
                    quantity: requestData.quantity,
                    model: {
                        modelNo: requestData.modelNo.toUpperCase(),
                        partNo: requestData.partNo.toUpperCase()
                    },
                    information:{
                        clientId: !session ? null : session.user.name.id,
                        field: option != 'cars' ? 'big vehicles' : 'cars',
                        address: {
                            country: requestData.country,
                            city: requestData.city,
                            district: requestData.district,
                            street: requestData.street
                        }
                    },
                    registration: !session ? {
                        email:registerationInfo.email,
                        password: registerationInfo.password,
                        name: registerationInfo.name,
                        phone: registerationInfo.phone
                    } : null
                })
            })
            const response = await data.json();
            if(response.statusCode == 421 || response.statusCode == 404){
                let error
                if(!arabic){
                error = new Error(response.message);
                }else{
                error = new Error(response.messageInArabic);
                }
            throw error;
            }else if (response.statusCode !== 201) {
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
            if(!arabic){
                await sendEmail(!session ? registerationInfo.email : session.user.email, "addRequest", "client");
            }else{
                await sendEmail(!session ? registerationInfo.email : session.user.email, "client", true);
            }
            setTimeout(()=>{
                dispatch(generalActions.emptyState());
                setRequestData({
                    brandId: '',
                    year: null,
                    modelNo: '',
                    partNo:'',
                    quantity: '',
                    description: '',
                    country:'',
                    city:'',
                    district: '',
                    street:''
                });
                setRegistrationInfo({
                    email:'',
                    password:'',
                    name:'',
                    phone:''
                })
            }, 3000)
            if(option != "cars"){
                for(let i= 0; i < suppliersEmails.length; i++){
                    await sendEmail(suppliersEmails[i].email, "addRequest" , "supplier")
                }
            }else{
                let suppliersPrefs = [...new Set(SUPPLIERS_PREF_EMAILS)];
                let datas = [], responses = [], allMails = [];
                for(let i= 0; i < suppliersPrefs.length; i++){
                    datas[i] = await fetch(`${generalReducer.ENDPOINT}/supplier/suppliers-emails/cars/${suppliersPrefs[i]}`);
                    responses[i] = await datas[i].json();
                }
                for(let x=0; x<responses.length; x++){
                    for(let j=0; j<responses[x].emails.length; j++){
                        allMails.push(responses[x].emails[j].email);
                    }
                }
                for(let y=0; y<suppliersEmails.length; y++){
                    allMails.push(suppliersEmails[y].email);
                }
                suppliersPrefs = [...new Set(allMails)];
                for(let i= 0; i < suppliersPrefs.length; i++){
                    await sendEmail(suppliersPrefs[i], "addRequest" , "supplier")
                }
            }
            }catch(err){
                dispatch(generalActions.changeValidation(err.message));
                dispatch(generalActions.showValidationMessages());
            }
    }

    return <Fragment>
            <div className="landing-option-inner-container">
                    <div className="option-container animate__bounceInLeft" onClick={()=>chooseOption('cars')} style={{borderColor: option == 'cars' ? '#ffd523' : ''}}>
                        <h3 className={!arabic ? 'english' : ''}>{!arabic? "Cars" : "سيارات"}</h3>
                        <img src={"/imgs/car1.svg"} alt="car1" className="icon-style" />
                    </div>
                    <div className="option-container animate__bounceInRight" onClick={()=>chooseOption('vehicles')} style={{borderColor: option == 'vehicles' ? '#ffd523' : ''}} >
                        <h3 className={!arabic ? 'english' : ''} >{!arabic? "Heavy Vehicles" : "مركبات ثقيلة"}</h3>
                        <img src={"/imgs/vehicle.svg"} alt="vehicle" className="icon-style"/>
                    </div>
                </div>
                <form className="form-landing-container animate__backInLeft">
                    <select className={!arabic ? 'english' : ''} name="brandId" onChange={onChangeHandler}>
                        <option selected disabled>{brands.length < 1 ? !arabic ? 'Wait' : 'انتظر' : !arabic ? 'Select brand' : 'اختر شركة' }</option>
                        {brands.length > 0 && brands.map(brand=> (
                            <option key={brand.key} value={brand.value} id={"br" + brand.value}>{brand.text}</option>
                        ))}
                    </select>
                    <select style={{visibility:option != 'cars' ? 'hidden' : 'visible'}} name="year" className={!arabic ? 'english' : ''} onChange={onChangeHandler}>
                        <option>{!arabic ? 'Model year' : 'سنة الصنع' }</option>
                        {yearsList.map(year=>(
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>
                    <div className="input-form-inner-container">
                        <label className={!arabic ? 'english' : ''}>{!arabic ? 'Model Name' : 'اسم الموديل'}</label>
                        <input className={!arabic ? 'english-input' : ''} placeholder={option != 'cars' ? !arabic ? "Crane" : " مثال: رافعة" : !arabic ? "Ex:Avalon" : "مثال: افالون"} type="text" name="modelNo" onChange={onChangeHandler} value={requestData.modelNo}/>
                    </div>
                    <div className="input-form-inner-container">
                        <label className={!arabic ? 'english' : ''}>{option == 'cars' ?  !arabic ? 'Part Name/Part No' : 'اسم/رقم القطعة' : !arabic ? 'Part No' : 'رقم القطعة'}</label>
                        <input className={!arabic ? 'english-input' : ''} placeholder={option != 'cars' ? !arabic ? "Ex:QAX1456" : "QAX1456 مثال" : null } type="text" name="partNo" onChange={onChangeHandler} value={requestData.partNo}/>
                    </div>
                    <div className="input-form-inner-container">
                        <label className={!arabic ? 'english' : ''}>{!arabic ? 'Quantity' : 'الكمية'}</label>
                        <input className={!arabic ? 'english-input' : ''} type="number" name="quantity" inputMode="numeric" value={requestData.quantity} onChange={onChangeHandler}/>
                    </div>
                    <div className="input-form-inner-container">
                        <label className={!arabic ? 'english' : ''}>{!arabic ? 'Description' : 'الوصف'}</label>
                        <textarea className={!arabic ? 'english-input' : ''} name="description" rows={5} cols={20} onChange={onChangeHandler} value={requestData.description}></textarea>
                    </div>
                </form>
                <button className={!arabic ? "next-step-landing english animate__backInLeft" : "next-step-landing animate__backInLeft"} style={{fontSize: !arabic ? '14.5px' : ''}} onClick={nextStep}>{!arabic ? 'Add address' : 'اضف عنوانك'}</button>
                <div className="address-landing-container animate__backInLeft">
                    {!arabic ?
                    <select name="country" className={!arabic ? 'english' : ''} onChange={changeCountry}>
                        <option selected disabled>{"Select Country" }</option>{countries.COUNTRIES.map(cntry=><option key={cntry} value={cntry.toLowerCase()}>{cntry}</option>)})
                    </select> : <select name="country" placeholder="Select Country" onChange={onChangeHandler}>
                        <option selected disabled>{"اختر دولة" }</option>{countries.CNTRIESARABIC.map(cntry=><option key={cntry} value={cntry.toLowerCase()}>{cntry}</option>)})
                    </select>
                    }
                    {!arabic ? 
                    <select name="city" placeholder="Select Country" className={!arabic ? 'english' : ''} onChange={onChangeHandler}>
                        <option selected disabled>{!arabic ? "Select City" : "اختر مدينة" }</option>{cities.map(city=><option key={city} value={city}>{city}</option>)}
                    </select> : <input className={!arabic ? 'english-input' : ''} name="city"  placeholder={"المدينة"} onChange={onChangeHandler} value={requestData.city} /> }
                    <input className={!arabic ? 'english-input english-field' : ''} name="district" placeholder={!arabic ? "Your District" : "الحي"} onChange={onChangeHandler} value={requestData.district}/>
                    <input className={!arabic ? 'english-input english-field' : ''} name="street" placeholder={!arabic ? "Street Name" : "الشارع" } onChange={onChangeHandler} value={requestData.street}/>
                </div>
                {!session && <div className="registration-landing-form animate__bounceInRight" style={{marginTop:'2rem'}}>
                    <p className={!arabic ? "english warning-landing-text" : "warning-landing-text" }>{!arabic ? "*Don't have an account? complete registration below" : 'غير مسجل؟ اكمل التسجيل في الاسفل*' }</p>
                    <div className="input-form-inner-container">
                        <label className={!arabic ? 'english' : ''}>{!arabic ? 'Email' : 'البريد'}</label>
                        <input className={!arabic ? 'english-input' : ''} type="email" name="email" style={{paddingLeft:'0.5rem'}} onChange={onChangeRegistartion} value={registerationInfo.email}/>
                    </div>
                    <div className="input-form-inner-container">
                        <label className={!arabic ? 'english' : ''}>{!arabic ? 'Password' : 'الرقم السري'}</label>
                        <input className={!arabic ? 'english-input' : ''} type="password" name="password" style={{paddingLeft:'0.5rem'}} onChange={onChangeRegistartion}  value={registerationInfo.password}/>
                    </div>
                    <div className="input-form-inner-container">
                        <label className={!arabic ? 'english' : ''}>{!arabic ? 'Name' : 'الاسم'}</label>
                        <input className={!arabic ? 'english-input' : ''} type="text" name="name" style={{paddingLeft:'0.5rem'}} onChange={onChangeRegistartion} value={registerationInfo.name}/>
                    </div>
                    <div className="input-form-inner-container">
                        <label className={!arabic ? 'english' : ''}>{!arabic ? 'Phone' : 'الجوال'}</label>
                        <input className={!arabic ? 'english-input' : ''} type="text" inputMode='tel' name="phone" placeholder="966xx" style={{paddingLeft:'0.5rem'}} onChange={onChangeRegistartion} value={registerationInfo.phone}/>
                    </div>
                </div>}
                <button onClick={submitRequest} type='submit' style={{fontSize: !arabic ? '14.5px' : ''}} className={!arabic ? "submit-step-landing english" : "submit-step-landing"}>{!arabic ? 'Add request' : 'اضف الطلب'}</button>
    </Fragment>
}


export default LandingAddRequestForm;