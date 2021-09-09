import { Fragment, useEffect, useState } from "react";
import {useDispatch, useSelector } from "react-redux";
import Spinner from '../reusable/Spinner/Spinner';
import countries from '../../helper/countries.json';
import generalActions from "../../stores/actions/generalActions";
import { sendEmail, validateAccountsInput, validateAccountsInputArabic } from "../../helper/functions";
// import { sendEmail, validateAccountsInput, validateAccountsInputArabic } from 'helper/functions';


let SUPPLIERS_PREF_EMAILS = [];

const AddRequest = ({bigVehicle, token, arabic, session}) => {
    const dispatch = useDispatch();
    const generalReducer = useSelector((state)=>state.generalReducer);
    const [brands, setBrands] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [inputs, setInputs] = useState([]);
    const [cities, setCities] = useState([]);
    const [visible, setVisisble] = useState(false);

    const [requestData, setRequestData] = useState([bigVehicle?{
            brandId:"",
            modelNo:"",
            partNo:"",
            quantity:"",
            description:""
    }: {
        brandId:"",
        modelNo:"",
        partNo:"",
        year:"",
        quantity:"",
        description:""
    }]);

    const [registerationInfo, setRegistrationInfo] = useState({
        email:'',
        password: '',
        name:'',
        phone:''
    })

    const [information, setInformation] = useState({
        country:'',
        city:'',
        district:'',
        street:''
    })

    const [yearsList, setYearsList] = useState([]);
    const [suppliersEmails, setSuppliersEmail] = useState([]);



 
    const fetchBrands = async () => {
        try{
            setIsLoading(true);
            setSuppliersEmail([]);
            let data;
            if(bigVehicle){
                data = await fetch(`${generalReducer.ENDPOINT}/brand/brands-type/big vehicles`);
                const bigVehicleEmails = await fetch(`${generalReducer.ENDPOINT}/supplier/suppliers-emails/vehicles`);
                const responseEmails = await bigVehicleEmails.json();
                setSuppliersEmail(suppliersEmails.concat(responseEmails.emails));
            }else{
                data = await fetch(`${generalReducer.ENDPOINT}/brand/brands-type/cars`);
                const allSuppliersEmails = await fetch(`${generalReducer.ENDPOINT}/supplier/suppliers-emails/all`);
                const responseEmails = await allSuppliersEmails.json();
                setSuppliersEmail(suppliersEmails.concat(responseEmails.emails));
            }
            let response = await data.json();
            if(response.statusCode != 200){
                throw new Error(response.message);
            }
            setBrands(response.brands.map(br=>({
                key: br.brandId,
                value: br.brandId,
                text: br.brandName + "-" + br.brandNameInArabic
            })));
            setIsLoading(false);
        }catch(err){
            alert(err.message);
        }
    }
    
    useEffect(()=>{
        fetchBrands()
    }, [])

    const changeHandler = (e, index, name) => {
        const requestCopy = [...requestData];
        requestCopy[index][e.target.name] = e.target.value
        setRequestData(requestCopy);
        if(e.target.name == "brandId" && !bigVehicle){
            const prevBrandPerIndex = [];
            const brand = document.querySelector("#br" + e.target.value);
            prevBrandPerIndex[index] = brand.textContent.split("-")[0];
            SUPPLIERS_PREF_EMAILS[index] = prevBrandPerIndex[index];
        }
    }

    useEffect(()=>{
        if(!bigVehicle){
            if(yearsList.length < 1){
                const currentYear = new Date().getFullYear();
                for(let i= 1995; i<= currentYear; i++){
                    yearsList.push(i);
                }
            }
        }
    }, [])

    useEffect(()=>{
        if(bigVehicle){
            setInputs([
                {
                brandId: <select className={!arabic ? 'english' : ''} name="brandId" placeholder="Select Brand" onChange={(e)=>changeHandler(e, 0, "brandId")}><option selected disabled>{!arabic ? "Select Brand" : "اختر شركة"}</option>{brands.map(br=><option key={br.key} value={br.value}>{br.text}</option>)}</select>,
                modelNo: <input name="modelNo"  placeholder={!arabic ? "Crane" : " مثال: رافعة"} onChange={(e)=>changeHandler(e, 0, "modelNo")}  className={!arabic ? 'english-input' : ''}/>,
                year: <select style={{visibility:'hidden'}} className={!arabic ? 'english' : ''} name="year" placeholder="Select Year" onChange={(e)=>changeHandler(e, 0, "year")}><option selected disabled>{!arabic ? "Select Year" : "اختر سنة الصنع"}</option>{yearsList.map(yr=><option key={yr} value={yr}>{yr}</option>)}</select>,
                partNo: <input name="partNo" placeholder={!arabic ? "Ex:QAX1456" : "QAX1456 مثال" }  onChange={(e)=>changeHandler(e, 0, "partNo")}/>,
                quantity: <input name="quantity" inputMode="numeric" type="number" onChange={(e)=>changeHandler(e, 0, "quantity")}  className={!arabic ? 'english-input' : ''}/>,
                description: <textarea name='description' rows={5} cols={20} onChange={(e)=>changeHandler(e, 0, "description")} className={!arabic ? 'english-input' : ''}></textarea>
                }
            ])
        }else{
            setInputs([
                {
                    brandId: <select className={!arabic ? 'english' : ''} name="brandId" placeholder="Select Brand" onChange={(e)=>changeHandler(e, 0 , "brandId")}><option selected disabled>{!arabic ? "Select Brand" : "اختر شركة"}</option>{brands.map(br=><option key={br.key} id={"br" + br.value} value={br.value}>{br.text}</option>)}</select>,
                    modelNo: <input name="modelNo"  placeholder={!arabic ? "Ex:Avalon" : "مثال: افالون"}  onChange={(e)=>changeHandler(e, 0, "modelNo")} className={!arabic ? 'english-input' : ''}/>,
                    year: <select className={!arabic ? 'english' : ''} name="year" placeholder="Select Year" onChange={(e)=>changeHandler(e, 0, "year")}><option selected disabled>{!arabic ? "Select Year" : "اختر سنة الصنع"}</option>{yearsList.map(yr=><option key={yr} value={yr}>{yr}</option>)}</select>,
                    partNo: <input name="partNo"  onChange={(e)=>changeHandler(e, 0, "partNo")} className={!arabic ? 'english-input' : ''}/>,
                    quantity: <input name="quantity" inputMode="numeric"  type="number" onChange={(e)=>changeHandler(e, 0, "quantity")} className={!arabic ? 'english-input' : ''}/>,
                    description: <textarea name='description' rows={5} cols={20}  onChange={(e)=>changeHandler(e, 0, "description")} className={!arabic ? 'english-input' : ''}></textarea>
                }
            ])
        }

    },[brands])
    
    
    const addMoreFields = (e) => {
        e.preventDefault();
        if(bigVehicle){
            requestData.push({
                brandId:"",
                modelNo:"",
                partNo:"",
                quantity:"",
                description:""
            })
            setInputs(inputs.concat({
                brandId: <select className={!arabic ? 'english' : ''} name="brandId" placeholder="Select Brand" onChange={(e)=>changeHandler(e, (inputs.length-1 + 1), "brandId")}><option selected disabled>{!arabic ? "Select Brand" : "اختر شركة"}</option>{brands.map(br=><option key={br.key} value={br.value}>{br.text}</option>)}</select>,
                modelNo: <input name="modelNo" placeholder={!arabic ? "Ex:Crane" : "مثال: رافعة"} onChange={(e)=>changeHandler(e, (inputs.length-1 + 1), "modelNo")} className={!arabic ? 'english-input' : ''}/>,
                year: <select style={{visibility:'hidden'}} className={!arabic ? 'english' : ''} name="year" placeholder="Select Year" onChange={(e)=>changeHandler(e, 0, "year")}><option selected disabled>{!arabic ? "Select Year" : "اختر سنة الصنع"}</option>{yearsList.map(yr=><option key={yr} value={yr}>{yr}</option>)}</select>,
                partNo: <input name="partNo" placeholder={!arabic ? "Ex:QAX1456" : "QAX1456 رقم القطعة" } onChange={(e)=>changeHandler(e, (inputs.length-1 + 1), "partNo")}/>,
                quantity: <input name="quantity" inputMode="numeric" type="number" onChange={(e)=>changeHandler(e, (inputs.length-1 + 1), "quantity")} className={!arabic ? 'english-input' : ''}/>,
                description: <textarea name={`description`} rows={5} cols={20} onChange={(e)=>changeHandler(e, (inputs.length-1 + 1), "description")} className={!arabic ? 'english-input' : ''}></textarea>
            }))
        }else{
            requestData.push({
                brandId:"",
                modelNo:"",
                partNo:"",
                year:"",
                quantity:"",
                description:""
            })
            setInputs(inputs.concat({
                brandId: <select className={!arabic ? 'english' : ''} name="brandId" placeholder="Select Brand" onChange={(e)=>changeHandler(e, (inputs.length-1 + 1), "brandId")}><option selected disabled>{!arabic ? "Select Brand" : "اختر شركة"}</option>{brands.map(br=><option key={br.key} id={"br" + br.value} value={br.value}>{br.text}</option>)}</select>,
                modelNo: <input name="modelNo" placeholder={!arabic ? "Ex:Avalon" : "مثال: افالون"}  onChange={(e)=>changeHandler(e, (inputs.length-1 + 1), "modelNo")} className={!arabic ? 'english-input' : ''}/>,
                partNo: <input name="partNo"    onChange={(e)=>changeHandler(e, (inputs.length-1 + 1), "partNo")} className={!arabic ? 'english-input' : ''}/>,
                year: <select className={!arabic ? 'english' : ''} name="year" placeholder="Select Year" onChange={(e)=>changeHandler(e, (inputs.length-1 + 1), "year")}><option selected disabled>{!arabic ? "Select Year" : "اختر سنة الصنع"}</option>{yearsList.map(yr=><option key={yr} value={yr}>{yr}</option>)}</select>,
                quantity: <input name="quantity" inputMode="numeric" type="number" onChange={(e)=>changeHandler(e, (inputs.length-1 + 1), "quantity")} className={!arabic ? 'english-input' : ''}/>,
                description: <textarea name={`description`} rows={5} cols={20}></textarea>
            }))
        }
    }

    const cancelField = (e) => {
        e.preventDefault();
        const requestCopy = [...requestData];
        const inputsCopy = [...inputs];
        requestCopy.splice(inputsCopy.length-1, 1);
        inputsCopy.splice(inputsCopy.length-1, 1);
        setRequestData(requestCopy);
        setInputs(inputsCopy);
        SUPPLIERS_PREF_EMAILS.splice(SUPPLIERS_PREF_EMAILS.length - 1, 1);
    }


    const changeCountry = async (e) => {
        try{
            setInformation(prevState=>({
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

    const changeInformationHandler = (e) => {
        setInformation(prevState=>({
            ...prevState,
            [e.target.name]: e.target.value
        }))
    }

    const submitHandler = async () => {
        try{
        window.scrollTo({
            behavior:'smooth',
            top:300
        })
        dispatch(generalActions.emptyState());
        dispatch(generalActions.sendRequest(!arabic ? 'Adding..' : '..ارسال'));
        dispatch(generalActions.changeMood("addRequest"));

        let validateEmailMessage = null;
        let validatePasswordMessage = null;
        let validateNameMessage = null;
        let validatePhoneMessage = null;

        for(let i=0; i<requestData.length; i++){
            let validationModelNo = validateAccountsInputArabic(requestData[i].modelNo, false, false, false, false, false, false, false, true);
            let validationPartNo = validateAccountsInputArabic(requestData[i].partNo,false,false,false,false,false, false, false, true);
            let validationDescription = validateAccountsInputArabic(requestData[i].description,false,false,false,false,false, false, false, true);
            if(!arabic){
                validationModelNo = validateAccountsInput(requestData[i].modelNo, false, false, false, false, false, false, false, true);
                validationPartNo = validateAccountsInput(requestData[i].partNo,false,false,false,false,false, false, false, true);
                validationDescription = validateAccountsInput(requestData[i].description,false,false,false,false,false, false, false, true);
            }

            let validationYearMessage = null;

            if(!bigVehicle && arabic){
                validationYearMessage = validateAccountsInputArabic(requestData[i].year,false,false,false,false,false, false, false, false, true);
            }else if(!bigVehicle && !arabic){
                validationYearMessage = validateAccountsInput(requestData[i].year,false,false,false,false,false, false, false, false, true);
            }
            
            //Check the validation error if any we push it into the validation values.
            if (validationModelNo.length > 0) {
              dispatch(generalActions.changeValidation(validationModelNo));
            }
            if (validationPartNo.length > 0) {
              dispatch(generalActions.changeValidation(validationPartNo));
            }
            if (!bigVehicle && validationYearMessage.length > 0) {
              dispatch(generalActions.changeValidation(validationYearMessage));
            }
            if (validationDescription.length > 0) {
              dispatch(generalActions.changeValidation(validationDescription));
            }
            // If the validation values is not  empty, we terminate the function job and show the error messages
            if (
              validationModelNo.length > 0 ||
              validationPartNo.length > 0 ||
              validationDescription.length > 0 ||
              !bigVehicle && validationYearMessage.length > 0
            ) {
              dispatch(generalActions.showValidationMessages());
              return;
            }
        }

        if(!session && !arabic){
            validateEmailMessage = validateAccountsInput(registerationInfo.email, false, false, true);
            validatePasswordMessage = validateAccountsInput(registerationInfo.password,false,false,false,false,false, false, true);
            validateNameMessage = validateAccountsInput(registerationInfo.name, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true);
            validatePhoneMessage = validateAccountsInput(registerationInfo.phone, false, false, false, true);
        }else if(!session && arabic){
            validateEmailMessage = validateAccountsInputArabic(registerationInfo.email, false, false, true);
            validatePasswordMessage =validateAccountsInputArabic(registerationInfo.password,false,false,false,false,false, false, true);
            validateNameMessage = validateAccountsInputArabic(registerationInfo.name, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true);
            validatePhoneMessage = validateAccountsInputArabic(registerationInfo.phone, false, false, false, true);
        }
        
        let validateCountryMessage = validateAccountsInputArabic(information.country,false,false,false,false, true, false);
        let validateCityMessage = validateAccountsInputArabic(information.city,false,false,false,false,false, true);
        let validationDistrictMessage = validateAccountsInputArabic(information.district, true, false, false, false, false);
        let validationStreetMessage = validateAccountsInputArabic(information.street,true,false,false,false,false);
        if(!arabic){
            validateCountryMessage = validateAccountsInput(information.country,false,false,false,false, true, false);
            validateCityMessage = validateAccountsInput(information.city,false,false,false,false,false, true);
            validationDistrictMessage = validateAccountsInput(information.district, false, true, false, false, false);
            validationStreetMessage = validateAccountsInput(information.street,false,true,false,false,false);
        }

         if(validateEmailMessage != null && validateEmailMessage.length > 0){
            dispatch(generalActions.changeValidation(validateEmailMessage));
         }
         if(validatePasswordMessage != null && validatePasswordMessage.length > 0){
            dispatch(generalActions.changeValidation(validatePasswordMessage));
         }
         if(validateNameMessage != null && validateNameMessage.length > 0){
            dispatch(generalActions.changeValidation(validateNameMessage));
         }
         if(validatePhoneMessage != null && validatePhoneMessage.length > 0){
            dispatch(generalActions.changeValidation(validatePhoneMessage));
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

          if (
            validateEmailMessage != null && validateEmailMessage.length > 0 ||
            validatePasswordMessage != null && validatePasswordMessage.length > 0 ||
            validateNameMessage != null && validateNameMessage.length > 0 ||
            validatePhoneMessage != null && validatePhoneMessage.length > 0 ||
            validateCountryMessage.length > 0 ||
            validateCityMessage.length > 0 ||
            validationDistrictMessage.length > 0 ||
            validationStreetMessage.length > 0
          ) {
            dispatch(generalActions.showValidationMessages());
            return;
          }
        const data = await fetch(`${generalReducer.ENDPOINT}/request/request-operations`, {
            method:'POST',
            headers:{
                "Content-Type":"application/json",
                "Authorization": token
            },
            body: JSON.stringify({
                data: requestData.map(req=>({
                    ...req,
                    model:{
                        modelNo: req.modelNo.toUpperCase(),
                        partNo: req.partNo.toUpperCase(),
                        year: req.year,
                        description: req.description
                    }
                })),
                information:{
                    clientId:session ? session.user.name.id : null,
                    field: bigVehicle ? 'big vehicles' : 'cars',
                    address: information
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
         if (response.statusCode !== 201) {
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
            await sendEmail(!session? registerationInfo.email : session.user.email, "addRequest", "client");
        }else{
            await sendEmail(!session? registerationInfo.email : session.user.email, "addRequest", "client", true);
        }
        setTimeout(()=>{
            dispatch(generalActions.emptyState());
        }, 3000)
        if(bigVehicle){
            if(suppliersEmails.length > 0){
                for(let i= 0; i < suppliersEmails.length; i++){
                    await sendEmail(suppliersEmails[i].email, "addRequest" , "supplier")
                }
            }
        }else{
            let suppliersPrefs = [...new Set(SUPPLIERS_PREF_EMAILS)];
            let datas = [], responses = [], allMails = [];
            for(let i= 0; i < suppliersPrefs.length; i++){
                datas[i] = await fetch(`${generalReducer.ENDPOINT}/supplier/suppliers-emails/cars/${suppliersPrefs[i]}`);
                responses[i] = await datas[i].json();
            }
            if(responses.length > 0){
                for(let x=0; x<responses.length; x++){
                    for(let j=0; j<responses[x].emails.length; j++){
                        allMails.push(responses[x].emails[j].email);
                    }
                }
            }
            for(let y=0; y<suppliersEmails.length; y++){
                allMails.push(suppliersEmails[y].email);
            }
            suppliersPrefs = [...new Set(allMails)];
            if(suppliersEmails.length > 0 || suppliersPrefs.length > 0){
                for(let i= 0; i < suppliersPrefs.length; i++){
                    await sendEmail(suppliersPrefs[i], "addRequest" , "supplier")
                }
            }
            
        }
        }catch(err){
            dispatch(generalActions.changeValidation(err.message));
            dispatch(generalActions.showValidationMessages());
        }

    }

    const onChangeRegistartion = (e) => {
        setRegistrationInfo(prevState=>({
            ...prevState,
            [e.target.name]: e.target.value
        }))
    }


    

    return <section className="add-request-container">
        {!isLoading && brands.length > 0 ? 
            <Fragment>
            <form className="form-add-request-container animate__backInLeft">
                {inputs.map((input,idx)=>(
                    <Fragment key={idx}>
                        {input.brandId}
                        {input.year}
                        <div className="input-form-add-request-inner-container">
                            <label className={!arabic ? 'english' : ''}>{!arabic ? 'Model Name' : 'اسم الموديل'}</label>
                            {input.modelNo}
                        </div>
                        <div className="input-form-add-request-inner-container">
                            <label className={!arabic ? 'english' : ''}>{!bigVehicle ? !arabic ? 'Part Name/Part No' : 'اسم/رقم القطعة' : !arabic ? 'Part No' : 'رقم القطعة'}</label>
                            {input.partNo}
                        </div>
                        <div className="input-form-add-request-inner-container">
                            <label className={!arabic ? 'english' : ''}>{!arabic ? 'Quantity' : 'الكمية'}</label>
                            {input.quantity}
                        </div>
                        <div className="input-form-add-request-inner-container">
                            <label className={!arabic ? 'english' : ''}>{!arabic ? 'Description' : 'الوصف'}</label>
                            {input.description}
                        </div>
                    </Fragment>
                ))}
            </form>
            
            <div className="add-request-add-cancel-btns-container">
                <button onClick={addMoreFields} className={!arabic ? "btn-add english" : "btn-add"}>{!arabic ? "Add extra request" : "اضافة طلب اضافي"}</button>
                <button onClick={cancelField} className={!arabic ? "btn-remove english" : "btn-remove"} style={{backgroundColor: inputs.length <=1 && "#ccc", border: inputs.length <= 1 && "1px solid #ccc"}}   disabled={inputs.length <=1 ? true : false}> {!arabic ? "Cancel Extra Request" : "الغاء طلب اضافي"}</button>
            </div>
            <Fragment>
            {!visible && 
                <div className={!arabic ? "btn-next-container" :"btn-next-container"}>
                    <button className={!arabic ? "btn-add-request-next english" : "btn-add-request-next"} onClick={()=>setVisisble(!visible)}  >{!arabic ? "Continue To Next Step" : "الانتقال الى الخطوة الثانية"}</button>
                </div>
            }
            </Fragment>
            </Fragment>
            
            : <div><Spinner/></div> 
            }
            {visible && 
                <Fragment>
                <div className="address-add-request-container animate__backInLeft">
                {!arabic ?
                <select className={!arabic ? 'english' : ''} name="country" placeholder="Select Country" onChange={changeCountry} >
                    <option selected disabled>{"Select Country" }</option>{countries.COUNTRIES.map(cntry=><option key={cntry} value={cntry.toLowerCase()}>{cntry}</option>)})
                </select> : <select className={!arabic ? 'english' : ''} name="country" placeholder="Select Country" onChange={changeCountry} >
                <option selected disabled>{"اختر دولة" }</option>{countries.CNTRIESARABIC.map(cntry=><option key={cntry} value={cntry.toLowerCase()}>{cntry}</option>)})
            </select> }
                {!arabic ? 
                <select className={!arabic ? 'english' : ''} name="city" placeholder="Select Country" onChange={changeInformationHandler}>
                    <option selected disabled>{!arabic ? "Select City" : "اختر مدينة" }</option>{cities.map(city=><option key={city} value={city}>{city}</option>)}
                </select> : <input className={!arabic ? 'english-input english-field' : ''} name="city"  placeholder={"المدينة"}  onChange={changeInformationHandler} /> }
                <input className={!arabic ? 'english-input english-field' : ''} name="district" placeholder={!arabic ? "Your District" : "الحي"} onChange={changeInformationHandler}/>
                <input className={!arabic ? 'english-input english-field' : ''} name="street" placeholder={!arabic ? "Street Name" : "الشارع" } onChange={changeInformationHandler}/>
                </div>
                {!session && <div className="registration-landing-form animate__bounceInRight" style={{marginTop:'2rem', display:'block'}}>
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
                <div className="submit-add-request-btn-container">
                    <button style={{display:'block', marginBottom:0}} className={!arabic ? "submit-step-landing english" : "submit-step-landing" } disabled={inputs[0].brandId == null ? true : false}  onClick={submitHandler}>{!arabic ? "Submit" : "اطلب"}</button>
                </div>
            </Fragment>
            }
    </section>
}

export default AddRequest;