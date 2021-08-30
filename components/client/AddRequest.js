import { Fragment, useEffect, useState } from "react";
import {useDispatch, useSelector } from "react-redux";
import Spinner from 'components/reusable/Spinner/Spinner';
import countries from 'helper/countries.json';
import {getSession} from 'next-auth/client';
import generalActions from "stores/actions/generalActions";
import Feedback from "components/reusable/Feedback";
import { sendEmail, validateAccountsInput, validateAccountsInputArabic } from "helper/functions";
// import { sendEmail, validateAccountsInput, validateAccountsInputArabic } from 'helper/functions';


let SUPPLIERS_PREF_EMAILS = [];
const AddRequest = ({bigVehicle, token, arabic}) => {
    const dispatch = useDispatch();
    const [session, setSession] = useState(); // To get the session values after login.
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
    const [information, setInformation] = useState({
        country:'',
        city:'',
        district:'',
        street:''
    })

    const [yearsList, setYearsList] = useState([]);

    const [clientEmail, setClientEmail] = useState('');
    const [suppliersEmails, setSuppliersEmail] = useState([]);


      //To get the session value after the component was rendered.
      useEffect(async()=>{
        const session = await getSession();
        if(!session){
            if(generalReducer.showModalLogin){
                return
            }
            dispatch(generalActions.toggleLoginModal())
            return
        }
        let data = await fetch(`${generalReducer.ENDPOINT}/client/client-email/${session.user.name.id}`);
        let response = await data.json();
        setClientEmail(response.email);
        setSession(session);
      },[]);

 
    const fetchBrands = async () => {
        try{
            setIsLoading(true);
            setSuppliersEmail([]);
            let data;
            if(bigVehicle){
                data = await fetch(`${generalReducer.ENDPOINT}/brand/brands-type/big vehicles`);
            }else{
                data = await fetch(`${generalReducer.ENDPOINT}/brand/brands-type/cars`);
            }
            let response = await data.json();
            if(response.statusCode != 200){
                throw new Error(response.message);
            }
            setBrands(response.brands.map(br=>({
                key: br.brandId,
                value: br.brandId,
                text: !arabic ? br.brandName : br.brandNameInArabic
            })));
            setIsLoading(false);
            data = await fetch(`${generalReducer.ENDPOINT}/supplier/suppliers-emails/vehicles`);
            response = await data.json();
            setSuppliersEmail(suppliersEmails.concat(response.emails));
        }catch(err){
            alert(err.message);
        }
    }
    
    useEffect(async()=>{
        await fetchBrands()
    }, [])

    const changeHandler = async (e, index, name) => {
        const requestCopy = [...requestData];
        requestCopy[index][e.target.name] = e.target.value
        setRequestData(requestCopy);
        if(e.target.name == "brandId" && !bigVehicle){
            const prevBrandPerIndex = [];
            const brand = document.querySelector("#br" + e.target.value);
            prevBrandPerIndex[index] = brand.textContent;
            SUPPLIERS_PREF_EMAILS[index] = prevBrandPerIndex[index];
        }
    }

    useEffect(()=>{
        if(!bigVehicle){
            const currentYear = new Date().getFullYear();
            for(let i= 1995; i<= currentYear; i++){
                yearsList.push(i);
            }
        }
    }, [])

    useEffect(()=>{
        if(bigVehicle){
            setInputs([
                {
                brandId: <select name="brandId" placeholder="Select Brand" onChange={(e)=>changeHandler(e, 0, "brandId")}><option selected disabled>{!arabic ? "Select Brand" : "اختر شركة"}</option>{brands.map(br=><option key={br.key} value={br.value}>{br.text}</option>)}</select>,
                modelNo: <input name="modelNo"  placeholder={!arabic ? "Model Name. Ex:Crane" : " اسم الموديل. مثال: رافعة"} onChange={(e)=>changeHandler(e, 0, "modelNo")} />,
                modelNo: <input name="modelNo"  placeholder={!arabic ? "Model Name. Ex:Crane" : " اسم الموديل. مثال: رافعة"} onChange={(e)=>changeHandler(e, 0, "modelNo")} />,
                partNo: <input name="partNo" placeholder={!arabic ? "Part No. Ex:QAX1456" : "QAX1456 رقم القطعة" }  onChange={(e)=>changeHandler(e, 0, "partNo")}/>,
                quantity: <input name="quantity" placeholder={!arabic ? "Quantity. Ex:10" : "10 الكمية" } type="number" onChange={(e)=>changeHandler(e, 0, "quantity")} />,
                description: <textarea name='description' placeholder={!arabic ? "Tell Us More" : "اخبرنا المزيد"} rows={5} cols={20} onChange={(e)=>changeHandler(e, 0, "description")}></textarea>
                }
            ])
        }else{
            setInputs([
                {
                    brandId: <select name="brandId" placeholder="Select Brand" onChange={(e)=>changeHandler(e, 0 , "brandId")}><option selected disabled>{!arabic ? "Select Brand" : "اختر شركة"}</option>{brands.map(br=><option key={br.key} id={"br" + br.value} value={br.value}>{br.text}</option>)}</select>,
                    modelNo: <input name="modelNo"  placeholder={!arabic ? "Model Name. Ex:Avalon" : " اسم الموديل. مثال: افالون"}  onChange={(e)=>changeHandler(e, 0, "modelNo")} />,
                    year: <select name="year" placeholder="Select Year" onChange={(e)=>changeHandler(e, 0, "year")}><option selected disabled>{!arabic ? "Select Year" : "اختر سنة الصنع"}</option>{yearsList.map(yr=><option key={yr} value={yr}>{yr}</option>)}</select>,
                    partNo: <input name="partNo" placeholder={!arabic ? "Piece No/Piece Name" : "اسم القطعة او رقم القطعة"}  onChange={(e)=>changeHandler(e, 0, "partNo")}/>,
                    quantity: <input name="quantity" placeholder={!arabic ? "Quantity. Ex:10" : "10 الكمية" } type="number" onChange={(e)=>changeHandler(e, 0, "quantity")} />,
                    description: <textarea name='description' placeholder={!arabic ? "Tell Us More" : "اخبرنا المزيد"} rows={5} cols={20}  onChange={(e)=>changeHandler(e, 0, "description")}></textarea>
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
                brandId: <select name="brandId" placeholder="Select Brand" onChange={(e)=>changeHandler(e, (inputs.length-1 + 1), "brandId")}><option selected disabled>{!arabic ? "Select Brand" : "اختر شركة"}</option>{brands.map(br=><option key={br.key} value={br.value}>{br.text}</option>)}</select>,
                modelNo: <input name="modelNo" placeholder={!arabic ? "Model Name. Ex:Crane" : " اسم الموديل. مثال: رافعة"} onChange={(e)=>changeHandler(e, (inputs.length-1 + 1), "modelNo")} />,
                modelNo: <input name="modelNo" placeholder={!arabic ? "Model Name. Ex:Crane" : " اسم الموديل. مثال: رافعة"} onChange={(e)=>changeHandler(e, (inputs.length-1 + 1), "modelNo")} />,
                partNo: <input name="partNo" placeholder={!arabic ? "Part No. Ex:QAX1456" : "QAX1456 رقم القطعة" } onChange={(e)=>changeHandler(e, (inputs.length-1 + 1), "partNo")}/>,
                quantity: <input name="quantity" placeholder={!arabic ? "Quantity. Ex:10" : "10 الكمية" } type="number" onChange={(e)=>changeHandler(e, (inputs.length-1 + 1), "quantity")} />,
                description: <textarea name={`description`} placeholder={!arabic ? "Tell Us More" : "اخبرنا المزيد"} rows={5} cols={20} onChange={(e)=>changeHandler(e, (inputs.length-1 + 1), "description")}></textarea>
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
                brandId: <select name="brandId" placeholder="Select Brand" onChange={(e)=>changeHandler(e, (inputs.length-1 + 1), "brandId")}><option selected disabled>{!arabic ? "Select Brand" : "اختر شركة"}</option>{brands.map(br=><option key={br.key} id={"br" + br.value} value={br.value}>{br.text}</option>)}</select>,
                modelNo: <input name="modelNo" placeholder={!arabic ? "Model Name. Ex:Avalon" : " اسم الموديل. مثال: افالون"}  onChange={(e)=>changeHandler(e, (inputs.length-1 + 1), "modelNo")} />,
                partNo: <input name="partNo"  placeholder={!arabic ? "Piece No/Piece Name" : "اسم القطعة او رقم القطعة"}   onChange={(e)=>changeHandler(e, (inputs.length-1 + 1), "partNo")}/>,
                year: <select name="year" placeholder="Select Year" onChange={(e)=>changeHandler(e, (inputs.length-1 + 1), "year")}><option selected disabled>{!arabic ? "Select Year" : "اختر سنة الصنع"}</option>{yearsList.map(yr=><option key={yr} value={yr}>{yr}</option>)}</select>,
                quantity: <input name="quantity" placeholder={!arabic ? "Quantity. Ex:10" : "10 الكمية" } type="number" onChange={(e)=>changeHandler(e, (inputs.length-1 + 1), "quantity")} />,
                description: <textarea name={`description`} placeholder={!arabic ? "Tell Us More" : "اخبرنا المزيد"} rows={5} cols={20}></textarea>
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
        dispatch(generalActions.emptyState());
        dispatch(generalActions.sendRequest(!arabic ? 'Adding..' : '..ارسال'))
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
            validateCountryMessage.length > 0 ||
            validateCityMessage.length > 0 ||
            validationDistrictMessage.length > 0 ||
            validationStreetMessage.length > 0
          ) {
            dispatch(generalActions.showValidationMessages());
            return;
          }
        let data;
        if(bigVehicle){
            for(let i= 0; i < suppliersEmails.length; i++){
                await sendEmail(suppliersEmails[i].email, "addRequest" , "supplier")
            }
            data = await fetch(`${generalReducer.ENDPOINT}/request/request-operations`, {
                method:'POST',
                headers:{
                    "Content-Type":"application/json",
                    "Authorization": token
                },
                body: JSON.stringify({
                    uid: session.user.name.id,
                    data: requestData.map(req=>({
                        ...req,
                        requestNum: Math.floor(Math.random() * 10000000000) + session.user.name.id,
                        model:{
                            modelNo: req.modelNo.toUpperCase(),
                            partNo: req.partNo.toUpperCase(),
                        }
                    })),
                    information:{
                        clientId:session.user.name.id,
                        field: 'big vehicles',
                        address: information
                    }
                })
            })
        }else{
            const suppliersPrefs = [...new Set(SUPPLIERS_PREF_EMAILS)];
            let datas = [], responses = [];
            if(suppliersEmails.length > 0){
                for(let i= 0; i < suppliersPrefs.length; i++){
                    datas[i] = await fetch(`${generalReducer.ENDPOINT}/supplier/suppliers-emails/cars/${suppliersPrefs[i]}`);
                    responses[i] = await datas[i].json();
                    suppliersEmails.push(responses[i].emails[0]);
                }
                for(let i= 0; i < suppliersEmails.length; i++){
                    await sendEmail(suppliersEmails[i].email, "addRequest" , "supplier")
                }

            }
            data = await fetch(`${generalReducer.ENDPOINT}/request/request-operations`, {
                 method:'POST',
                 headers:{
                     "Content-Type":"application/json",
                     "Authorization": token
                 },
                 body: JSON.stringify({
                     uid: session.user.name.id,
                     data: requestData.map(req=>({
                         ...req,
                         requestNum: Math.floor(Math.random() * 10000000000) + session.user.name.id,
                         model:{
                             modelNo: req.modelNo.toUpperCase(),
                             partNo: req.partNo.toUpperCase(),
                             year: req.year,
                             description: req.description
                         }
                     })),
                     information:{
                         clientId:session.user.name.id,
                         field: 'cars',
                         address: information
                     }
                 })
             })
        }
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
            await sendEmail(clientEmail, "addRequest", "client");
        }else{
            await sendEmail(clientEmail, "addRequest", "client", true);
        }
        setTimeout(()=>{
            dispatch(generalActions.emptyState());
        }, 3000)
        }catch(err){
            dispatch(generalActions.changeValidation(err.message));
            dispatch(generalActions.showValidationMessages());
        }

    }



    

    return <section className="add-request-container">
        {!isLoading && brands.length > 0 ? 
            <Fragment>
            <form className="request-form-container">
                {inputs.map((input,idx)=>(
                    <Fragment key={idx}>
                    <div className={!arabic ? "inner-form-container english" :"inner-form-container" }>
                        <div className="brand-year-container">
                        {input.brandId}
                        {!bigVehicle && input.year}
                        </div>
                        {input.modelNo}
                        {input.partNo}
                        {input.quantity}
                        {input.description}
                    </div>
                    </Fragment>
                ))}
            </form>
            <div className="btns-container">
                <button onClick={addMoreFields} className={!arabic ? "btn-add english" : "btn-add"}>{!arabic ? "Add extra request" : "اضافة طلب اضافي"}</button>
                <button onClick={cancelField} style={{backgroundColor: inputs.length <=1 && "#ccc", border: inputs.length <= 1 && "1px solid #ccc"}} className={!arabic ? "btn-remove english" : "btn-remove"} disabled={inputs.length <=1 ? true : false}> {!arabic ? "Cancel Extra Request" : "الغاء طلب اضافي"}</button>
            </div>
            <Fragment>
            {!visible && 
                <div className={!arabic ? "btn-next-container-english" :"btn-next-container"}>
                    <button className={!arabic ? "btn-next english" : "btn-next"}  onClick={()=>setVisisble(!visible)}>{!arabic ? "Continue To Next Step" : "الانتقال الى الخطوة الثانية"}</button>
                </div>
            }
            </Fragment>
            </Fragment>
            
            : <div><Spinner/></div> 
            }
            {visible && 
                <Fragment>
                <div className="address-info-container">
                {!arabic ?
                <select name="country" placeholder="Select Country" onChange={changeCountry} >
                    <option selected disabled>{"Select Country" }</option>{countries.COUNTRIES.map(cntry=><option key={cntry} value={cntry.toLowerCase()}>{cntry}</option>)})
                </select> : <select name="country" placeholder="Select Country" onChange={changeCountry} >
                <option selected disabled>{"اختر دولة" }</option>{countries.CNTRIESARABIC.map(cntry=><option key={cntry} value={cntry.toLowerCase()}>{cntry}</option>)})
            </select> }
                {!arabic ? 
                <select name="city" placeholder="Select Country" onChange={changeInformationHandler}>
                    <option selected disabled>{!arabic ? "Select City" : "اختر مدينة" }</option>{cities.map(city=><option key={city} value={city}>{city}</option>)}
                </select> : <input name="city"  placeholder={"المدينة"}  onChange={changeInformationHandler} /> }
                <input name="district" placeholder={!arabic ? "Your District" : "الحي"} onChange={changeInformationHandler}/>
                <input name="street" placeholder={!arabic ? "Street Name" : "الشارع" } onChange={changeInformationHandler}/>
                </div>
            <div className="btn-submit-container">
                {!arabic ? 
                    <button className="btn-submit english" disabled={inputs[0].brandId == null ? true : false}  onClick={submitHandler}>{status.sending? status.text : "Submit" }</button>
                :  <button className="btn-submit" onClick={submitHandler}>{status.sending? status.text : "اطلب" }</button> 
                }
            </div>
            <Feedback arabic={arabic} />
            </Fragment>
            }
    </section>
}

export default AddRequest;