import { useDispatch, useSelector } from "react-redux";
import {BsArrowRight, BsArrowLeft} from 'react-icons/bs';
import {useRouter} from 'next/router';
import { Fragment, useEffect, useState } from "react";
import { formatRecordsAddress, sendEmail, validateAccountsInput, validateAccountsInputArabic } from "helper/functions";
import { getSession } from "next-auth/client";
import requestsActions from "stores/actions/requestsActions";
import generalActions from "stores/actions/generalActions";
import Feedback from "./Feedback";
import Modal from "./Modal";

let OFFSET = 0;
let PREVIOUS_OFFSET = 0;


const SUPPLIERS_CANCEL_REASONS = [
        "Stock is over - انتهى المخزون",
        "Request could not be shipped - الطلب لا يمكن شحنه",
        "Request may take longer time to be shipped - قد يستغرق الطلب وقت اطول للشحن"
    ]


const AllRequests = ({arabic, supplier, token, view}) => {
    const [session, setSession] = useState();
    const requests = useSelector((state)=>state.requestsReducer);
    const generalReducer = useSelector((state)=>state.generalReducer);
    const [amount, setAmount] = useState('');
    const router = useRouter();
    const [toggleDetails, setToggleDetails] = useState({
        idx:'',
        show:false
    });
    const [shippers, setShippers] = useState({
        showShippers:false,
        showShipBtn: false,
        requestId: null
    });

    const [data, setData] = useState({
        clientEmail: '',
        requestId: '',
        requestNum: '',
    });


    const dispatch = useDispatch();
      //To set the status of the sent request to the database.
    const [status, setStatus] = useState({
        sending: false,
        succeed:false,
        text: "",
        show: false,
        nextPage:false,
        previousPage: false
    });

    const [requestPriceOptions, setRequestPriceOptions] = useState({
        shipmentIncluded: [],
        shipmentFees: [],
    });

    const [shipperDetails, setShipperDetails] = useState({
        shipperName: '',
        trackingNumber:''
    })

    useEffect(async()=>{
        const session = await getSession();
        setSession(session)
      },[]);

    const onChangeHandler = (e) => {
        setAmount(e.target.value);
    }


    const changePriceOptions = (e, idx) => {
        if(e.target.name == "shipment" && e.target.checked){
            const copyShipment = [...requestPriceOptions.shipmentIncluded];
            copyShipment[idx] = true
            setRequestPriceOptions(prevState=>({
                ...prevState,
                shipmentIncluded: copyShipment,
            }))
        }else if(e.target.name == "shipment" && !e.target.checked){
            const copyShipment = [...requestPriceOptions.shipmentIncluded];
            copyShipment[idx] = false
            setRequestPriceOptions(prevState=>({
                ...prevState,
                shipmentIncluded: copyShipment,
            }))
        }
    }

    const changePrice = (e, idx) => {
        if(e.target.name == "shipmentFees"){
            const copyShipmentFees = [...requestPriceOptions.shipmentFees];
            copyShipmentFees[idx] = e.target.value
            setRequestPriceOptions(prevState=>({
                ...prevState,
                shipmentFees: copyShipmentFees,
            }))
        }
    }

    // To add th validation error messages
    const changeValidationState = (value) => {
        //if the error message is not a single string such as an array, so we replace the validation values array with the new array without push or concat,..etc.
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


    const submitAmount = async (requestId, clientEmail, requestNum, idx) => {
        try{
            dispatch(generalActions.emptyState());
            dispatch(generalActions.sendRequest(!arabic ? 'Submitting..' : '..تقديم'))
            let validateAmountMessage = validateAccountsInput(amount, false, false,false,false,false,false,false,false,false,false, true);
            if(arabic){
                validateAmountMessage = validateAccountsInputArabic(amount, false, false,false,false,false,false,false,false,false,false, true);
            }
            let validateShipmentFeesMeesage;
            if(requestPriceOptions.shipmentIncluded[idx] == true){
                validateShipmentFeesMeesage = validateAccountsInput(requestPriceOptions.shipmentFees[idx], false, false,false,false,false,false,false,false,false,false, true);
                if(arabic){
                    validateShipmentFeesMeesage = validateAccountsInputArabic(requestPriceOptions.shipmentFees[idx], false, false,false,false,false,false,false,false,false,false, true);
                }
                if(validateShipmentFeesMeesage.length > 0){
                    dispatch(generalActions.changeValidation(validateShipmentFeesMeesage));
                    dispatch(generalActions.showValidationMessages());
                    return;
                }
            }
            if(validateAmountMessage.length > 0){
                dispatch(generalActions.changeValidation(validateAmountMessage));
                dispatch(generalActions.showValidationMessages());
                return;
            }

            const data = await fetch(`${generalReducer.ENDPOINT}/request/update-amounts`, {
                method:'PATCH',
                headers:{
                    'Content-Type' : 'application/json',
                    "Authorization": token
                },
                body: JSON.stringify({
                    uid: session.user.name.id,
                    requestId,
                    amount: amount,
                    shipmentFees: !requestPriceOptions.shipmentIncluded[idx] ? 0 : requestPriceOptions.shipmentFees[idx],
                    supplierId: session.user.name.id
                })
            });
            const response = await data.json();
            if(response.statusCode != 200){
                throw new Error(response.message);
            }
            dispatch(generalActions.sendRequest(!arabic ? response.message : response.messageInArabic));
            await sendEmail(clientEmail, "offer", "client", false, false, requestNum);
            await sendEmail(clientEmail, "offer", "client", true, false, requestNum);
            setTimeout(() => {
                dispatch(generalActions.emptyState());
                window.location.reload();
            }, 1500);
        }catch(err){
            dispatch(generalActions.changeValidation(err.message));
            dispatch(generalActions.showValidationMessages());
        }
    }

    const navigateToDetails = (requestId) => {
        if(!arabic){
            router.push(`/en/requests/my-requests/${requestId}`);
        }else{
            router.push(`/ar/requests/my-requests/${requestId}`);
        }
    }

    const moveToShipping = async (requestId, clientEmail, requestNum) => {
        try{
            dispatch(generalActions.emptyState());
            dispatch(generalActions.sendRequest(!arabic? 'Shipping..' : '..شحن'))
            let validateShipperNameMessage = validateAccountsInput(shipperDetails.shipperName, false, false, false, false, false, false, false, false, false, false, false, true);
            let validateTrackingNumberMessage = validateAccountsInput(shipperDetails.trackingNumber, false, false, false, false, false, false, false, false, false, false, false, false, true);
            if(arabic){
                validateShipperNameMessage = validateAccountsInputArabic(shipperDetails.shipperName, false, false, false, false, false, false, false, false, false, false, false, true);
                validateTrackingNumberMessage = validateAccountsInputArabic(shipperDetails.trackingNumber, false, false, false, false, false, false, false, false, false, false, false, false, true);
            }
            if(validateShipperNameMessage.length > 0){
                dispatch(generalActions.changeValidation((validateShipperNameMessage)))
            }
            if(validateTrackingNumberMessage.length > 0){
                dispatch(generalActions.changeValidation((validateTrackingNumberMessage)));
            }
            if (
               validateShipperNameMessage.length > 0 ||
               validateTrackingNumberMessage.length > 0
              ) {
                dispatch(generalActions.showValidationMessages());
                return;
              }
            const data = await fetch(`${generalReducer.ENDPOINT}/request/move-to-shipper`, {
                method:'PATCH',
                headers:{
                    'Content-Type' : 'application/json',
                    "Authorization": token
                },
                body: JSON.stringify({
                    uid: session.user.name.id,
                    requestId,
                    shipperName: shipperDetails.shipperName.toUpperCase(),
                    trackingNumber: shipperDetails.trackingNumber
                })
            });
            const response = await data.json();
            if(response.statusCode == 421 || response.statusCode == 404){
                let error
                error = new Error(response.message);
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
            dispatch(generalActions.sendRequest((!arabic ? response.message : response.messageInArabic)));
            setTimeout(() => {
                dispatch(generalActions.emptyState());
            }, 3000);
            await sendEmail(clientEmail, "shipping", "client", false, false, requestNum, shipperDetails.shipperName ,shipperDetails.trackingNumber);
            await sendEmail(clientEmail, "shipping", "client", true, false, requestNum, shipperDetails.shipperName ,shipperDetails.trackingNumber);
            window.location.reload();
        }catch(err){
            dispatch(generalActions.changeValidation(err.message));
            dispatch(generalActions.showValidationMessages());
        }
    }


    const complete = async (requestId, clientEmail, requestNum, trackingNumber)=>{
        try{
            dispatch(generalActions.emptyState());
            dispatch(generalActions.sendRequest(!arabic ? 'Delevering..' : '..توصيل'))
            const data = await fetch(`${generalReducer.ENDPOINT}/request/complete-request`, {
                method:'PATCH',
                headers:{
                    'Content-Type' : 'application/json',
                    "Authorization": token
                },
                body: JSON.stringify({
                    uid: session.user.name.id,
                    requestId,
                })
            });
            const response = await data.json();
            if(response.statusCode != 200){
                throw new Error(response.message);
            }
            dispatch(generalActions.sendRequest(!arabic ? response.message : response.messageInArabic));
            setTimeout(() => {
                dispatch(generalActions.emptyState());
            }, 3000);
            await sendEmail(clientEmail, "complete", "client", false, false, requestNum, null, trackingNumber);
            await sendEmail(clientEmail, "complete", "client", true, false, requestNum, null, trackingNumber);
            window.location.reload();
        }catch(err){
            dispatch(generalActions.changeValidation(err.message));
            dispatch(generalActions.showValidationMessages());
        }
    }
    

    const cancelRequestSupplier = async (requestId, clientEmail, requestNum, reason) => {
        try{
            dispatch(generalActions.emptyState());
            dispatch(generalActions.sendRequest(!arabic ? 'Canceling..' : '..الغاء'));
            // await sendEmail(clientEmail, "cancelSupplier", "client", false, false, requestNum, null, null,reason);
            // await sendEmail(clientEmail, "cancelSupplier", "client", true, false, requestNum,null,null, reason);
            const data = await fetch(`${generalReducer.ENDPOINT}/request/cancel-request-supplier`, {
                method:'PATCH',
                headers:{
                    'Content-Type' : 'application/json',
                    "Authorization": token
                },
                body: JSON.stringify({
                    uid: session.user.name.id,
                    requestId
                })
            });
            const response = await data.json();
            if(response.statusCode != 200){
                throw new Error(response.message);
            }
            dispatch(generalActions.sendRequest(!arabic ? response.message : response.messageInArabic));
            setTimeout(() => {
                dispatch(generalActions.emptyState());
            }, 3000);
            window.location.reload();
        }catch(err){
            dispatch(generalActions.changeValidation(err.message));
            dispatch(generalActions.showValidationMessages());
        }
    }

    const nextPage = async () => {
        try{
            let data;
            PREVIOUS_OFFSET += 6
            if(supplier){
                data = await fetch(`${generalReducer.ENDPOINT}/request/pending-requests/${PREVIOUS_OFFSET}/${session.user.name.pref}`, {
                    method:'POST',
                    headers:{
                        'Content-Type':'application/json'
                    },
                    body: JSON.stringify({
                        supplierCarsPref : session.user.name.carsPref.split(",")
                    })
                });
            }else{
                data = await fetch(`${generalReducer.ENDPOINT}/request/request-operations/${session.user.name.id}/${PREVIOUS_OFFSET}`);
            }
            const response = await data.json();
            if(response.statusCode != 200){
                throw new Error(response.message);
            }
            let remaining =  requests.remaining - response.requests.length ;
            if(remaining < 0) {
                remaining = 0;
            }
            dispatch(requestsActions.emptyRequest());
            const formattedRequests = formatRecordsAddress(response.requests);
            dispatch(requestsActions.addAllRequests(formattedRequests, response.length, remaining));
            OFFSET = 0;
        }catch(err){
            alert(err.message)
        }
    }
    
    const previousPage = async () => {
        try{
            let data;
            PREVIOUS_OFFSET -= 6
            if(supplier){
                data = await fetch(`${generalReducer.ENDPOINT}/request/pending-requests/${PREVIOUS_OFFSET}/${session.user.name.pref}`, {
                    method:'POST',
                    headers:{
                        'Content-Type':'application/json'
                    },
                    body: JSON.stringify({
                        supplierCarsPref : session.user.name.carsPref.split(",")
                    })
                });
            }else{
                data = await fetch(`${generalReducer.ENDPOINT}/request/request-operations/${session.user.name.id}/${PREVIOUS_OFFSET}`);
            }
            const response = await data.json();
            if(response.statusCode != 200){
                throw new Error(response.message);
            }
            dispatch(requestsActions.emptyRequest());
            const formattedRequests = formatRecordsAddress(response.requests);
            const remaining =  requests.remaining + requests.requests.length ;
            dispatch(requestsActions.addAllRequests(formattedRequests, response.length, remaining));
            // if( (response.requests.length + requests.remaining) % 2 != 0 ){
            //     dispatch(requestsActions.addAllRequests(formattedRequests, response.length, (response.requests.length + requests.remaining - 1)));
            // }else{
            //     dispatch(requestsActions.addAllRequests(formattedRequests, response.length, (response.requests.length + requests.remaining)));
            // }

        }catch(err){
            alert(err.message)
        }
    }

    const changeShipperInfo = (e) => {
        if(e.target.name == "shipperName"){
            setShipperDetails(prevState=>({
                ...prevState,
                shipperName: e.target.value
            }));
        }else if(e.target.name == "trackingNumber"){
            setShipperDetails(prevState=>({
                ...prevState,
                trackingNumber: e.target.value
            }));
        }
    }

    const toggleShippersList = (requestId) => {
        setShippers(prevState=>({
            ...prevState,
            showShippers: !prevState.showShippers,
            requestId: requestId,
            showShipBtn: !prevState.showShipBtn
        }))
    }

    const toggleCancelModal = (requestId, clientEmail, requestNum) => {
        const section = document.querySelector("#section");
        if(generalReducer.toggleModal){
            section.style.opacity = '1';
            setData({
                clientEmail:'',
                requestId: '',
                requestNum: ''
            })
            dispatch(generalActions.toggleModal());
            return
        }
        section.style.opacity = '0.09';
        setData({
            clientEmail,
            requestId,
            requestNum
        })
        dispatch(generalActions.toggleModal())
    }




    


    return requests.requests.length > 0 ?
            <Fragment>
            <Modal 
            close={()=>toggleCancelModal()} 
            arabic={arabic} 
            reasons={SUPPLIERS_CANCEL_REASONS} 
            confirmCancel={cancelRequestSupplier} 
            title={!arabic ? 'Confirm cancelation' : 'تأكيد االغاء الطلب'}
            data={data}                
            />
            <div className="pages-btns-container">
            {PREVIOUS_OFFSET >= 1 ?
            <button className={!arabic ? "prev-btn english" : "prev-btn"}  style={{fontSize:!arabic && '14px'}} children={!arabic ? "Previous Page" : "الصفحة السابقة"} onClick={previousPage} />
            : requests.remaining > requests.length ? <button className={!arabic ? "prev-btn english" : "prev-btn"}  style={{fontSize:!arabic && '14px'}} children={!arabic ? "Previous Page" :"الصفحة السابقة"} onClick={previousPage}/>
            :null}
            {requests.remaining >= 1 ?
            <button className={!arabic ? "next-btn english" : "next-btn"} style={{fontSize:!arabic && '14px'}} children={!arabic ? "Next Page" : "الصفحة التالية"} onClick={nextPage}/>
            : null
            }
        </div>
            <section className="all-requests-container" id="section"> 
            {requests.requests.map((request, idx)=>(
                <div className="all-requests-inner-container" key={request.requestNum}>
                    <div className="request-status">
                    <p className={!arabic ? "english" : ''} style={{color: '#856f00'}}>{request.model.modelNo}</p>
                    {!arabic ? 
                    <p
                    className="english"
                    style={{color: request.requestStatus == "0" ? "#46185F" 
                    : request.requestStatus == "1" ? "#297CA0" 
                    : request.requestStatus == "2" ? "#43AB92" 
                    : request.requestStatus == "3" ? "#730068" 
                    : request.requestStatus == "4" ? "#22EACA" 
                    : null}}
                    >{request.requestStatus == "0" ? "PENDING" 
                    : request.requestStatus == "1" ? "PAID" : request.requestStatus == "2" ? "SHIPPING" : request.requestStatus == "3" ? "COMPLETED" : request.requestStatus == "4" ? "CANCELED" : request.requestStatus == "5" ? "DELIVERY" :null}
                    </p> :<p
                    style={{color: request.requestStatus == "0" ? "#46185F"
                    : request.requestStatus == "1" ? "#297CA0"
                    : request.requestStatus == "2" ? "#43AB92" 
                    : request.requestStatus == "3" ? "#730068" 
                    : request.requestStatus == "4" ? "#22EACA"
                    : null}}
                    >{request.requestStatus == "0" ? "انتظار" 
                    : request.requestStatus == "1" ? "مدفوعة" : request.requestStatus == "2" ? "في الشحن" : request.requestStatus == "3" ? "مكتمل" : request.requestStatus == "4" ? "ملغية" : null}
                    </p> }
                    </div>
                    {supplier && !view &&
                        <div>
                        {!arabic ? 
                        <Fragment>
                        <div className="more-details-container">
                            <p className="english">
                                Part No/Name <span>{request.model.partNo}</span>
                            </p>
                            <p className="english">
                                Quantity <span>{request.quantity}</span>
                            </p>
                        </div>
                        </Fragment>
                        :<Fragment>
                        <div className="more-details-container">
                            <p>
                                <span>{request.model.partNo}</span> : رقم/اسم القطعة 
                            </p>
                            <p>
                                <span>{request.quantity}</span> : الكمية
                            </p>
                        </div>
                        </Fragment>
                        }
                        </div>
                    }
                    <Fragment>
                        <p className={!arabic ? "date-text english" : "date-text"}>
                            {!arabic ? 
                                <span>Created At {new Date(request.created_at).toLocaleDateString('en-US', {month:"short", year:'numeric', day:'numeric'})}</span>
                            :  <span> انشئ بتاريخ: {new Date(request.created_at).toLocaleDateString('ar-EG', {month:"short", year:'numeric', day:'numeric'})}</span>
                            }
                        </p>
                        {!arabic? 
                        <p className="request-number english">Request Number: {request.requestNum}</p>
                        :<p className="request-number"> {request.requestNum} رقم الطلب</p> 
                        }
                        {request.trackingNumber != null ? !arabic? 
                        <p className="request-number english" style={{color:'#856f00'}}>Tracking Number: {request.trackingNumber}</p>
                        :<p className="request-number" style={{color:'#856f00'}}> {request.trackingNumber} رقم التتبع</p> 
                        : null}
                    </Fragment>
                        
                    {!arabic ?  
                        <Fragment>
                            {supplier && 
                            <p className="client-text english">
                                Client: <span>{request.clients.name}</span>
                            </p>
                            }
                            <div className="more-details-container">
                                <p className="english" style={{color: '#00BDAA'}}>
                                    Country: <span>{request.address.country}</span>
                                </p>
                                <p className="english" style={{color:'#856f00'}}>
                                    To City: <span>{request.address.city}</span>
                                </p>
                            </div>
                            <div className="more-details-container english">
                                <p className="english" style={{color:'#400082'}}>
                                    Brand: <span>{request.brands.brandName}</span>
                                </p>
                                <p className="english" style={{color:'#E25822'}}>
                                    Field: <span>{request.field}</span>
                                </p>
                            </div>
                            <p className="description-text english">
                                    Description: <span >{request.description}</span>
                            </p>
                            {supplier && view && <p className="amount english" style={{color:'#400082'}}>
                                Amount: <span>{request.finalAmount != 0 ? `SR ${request.finalAmount}` : "Not Assigned"}</span>
                            </p> }
                            {!view && supplier && request.amounts != null && session && request.amounts.length > 0 && <Fragment>
                                {request.amounts.map(req=>(
                                    req.supplierId == session.user.name.id &&
                                        <Fragment>
                                        <div className="more-details-container" key={request.requestNum}>
                                            <p className="english" style={{color:'#E25822'}}>
                                                My Offer 
                                                <span> SR</span><span>{req.amount}</span>
                                            </p>
                                            <p className="english" style={{color:'#400082'}}>
                                                Shipment Fees 
                                                <span> SR</span><span>{req.shipmentFees}</span>
                                            </p>
                                            <p className="english" style={{color:'#856f00'}}>
                                                <strong>Total</strong><span> SR</span><span>{(parseFloat(req.amount) + parseFloat(req.shipmentFees)).toFixed(2)}</span>
                                            </p>
                                    </div>
                                    <Feedback />
                                    </Fragment>
                                ))}
                                </Fragment>
                            }
                        </Fragment>
                        : <Fragment>
                            {supplier && 
                            <p className="client-text">
                             العميل : <span>{request.clients.nameInArabic}</span> 
                            </p>
                            }
                            <div className="more-details-container">
                                <p style={{color: '#00BDAA'}}>
                                 الدولة : <span>{request.address.country}</span> 
                                </p>
                                <p style={{color:'#856f00'}}>
                                 الى مدينة :<span>{request.address.city}</span> 
                                </p>
                            </div>
                            <div className="more-details-container">
                                <p style={{color:'#400082'}}>
                                <span>الشركة:</span> 
                                <span>{request.brands.brandNameInArabic}</span>
                                </p>
                                <p style={{color:'#E25822'}}>
                                    <span>{request.field}</span> : نوع الطلب
                                </p>
                            </div>
                            <p className="description-text">
                                الوصف : <span >{request.description}</span>
                            </p>
                            {supplier && view && <p className="amount" style={{color:'#400082'}}>
                                السعر: <span>{request.finalAmount != 0 ? `ريال ${request.finalAmount}` : "لم يتم اختيار السعر"}</span> 
                            </p>}
                            {!view && supplier && request.amounts != null && session && request.amounts.length > 0 && <Fragment>
                                {request.amounts.map(req=>(
                                    req.supplierId == session.user.name.id &&
                                    <Fragment>
                                        <div className="more-details-container" key={request.requestNum}>
                                            <p style={{color:'#856f00'}}>
                                                <strong>المجموع</strong> <span>{(parseFloat(req.amount) + parseFloat(req.shipmentFees)).toFixed(2)}</span> <span>ر.س</span>
                                            </p>
                                            <p style={{color:'#400082'}}>
                                                <span> SR</span><span>{req.shipmentFees}</span>
                                                سعر الشحن 
                                            </p>
                                            <p style={{color:'#E25822'}}>
                                                <span> SR</span><span>{req.amount}</span>
                                                عرضي
                                            </p>
                                    </div>
                                    <Feedback arabic={arabic} />
                                    </Fragment>
                                    
                                ))}
                                </Fragment>
                            }
                        </Fragment>
                    }
                    {supplier && !view && !arabic ? <div>
                        <div>
                            <div className="shipment-option-container">
                                <input type="checkbox" id={idx} checked={requestPriceOptions.shipmentIncluded[idx] ? true : false} value="shipmentIncluded" name="shipment" onChange={(e)=>changePriceOptions(e, idx)} /> 
                                <label className="english" htmlFor={idx}>Shipment Fees Not Included</label>
                            </div>
                        </div>
                        <input name="price" placeholder="Offer Ex:SR100" type="number" step="0.1" onChange = {onChangeHandler}/>
                        <div>
                            {requestPriceOptions.shipmentIncluded[idx] && <input name="shipmentFees" placeholder="Shipment fees Ex:SR100" type="number" step="0.1" onChange={(e)=>changePrice(e, idx)} />  }
                        </div>
                        <button
                        disabled={generalReducer.status.sending ? true : false}
                        style={{backgroundColor: generalReducer.status.sending ? '#ccc' : ''}} 
                        className="submit-offer-btn english"
                        children={"Submit Offer"} 
                        onClick={()=>submitAmount(request.requestId, request.clients.email, request.requestNum, idx)}/>
                </div>
                : supplier && !view && arabic && <div>
                            <div className="shipment-option-container-ar">
                                <input type="checkbox" id={idx} checked={requestPriceOptions.shipmentIncluded[idx] ? true : false} value="shipmentIncluded" name="shipment" onChange={(e)=>changePriceOptions(e, idx)} /> 
                                <label className="label-text" htmlFor={idx}>رسوم الشحن غير متضمنة</label>
                            </div>
                            <input name="price" placeholder="العرض: 100 ريال" type="number" step="0.1" onChange = {onChangeHandler}/>
                            <div >
                                {requestPriceOptions.shipmentIncluded[idx] && <input name="shipmentFees" placeholder="رسوم الشحن 100 ريال" type="number" step="0.1" onChange={(e)=>changePrice(e, idx)} />  }
                            </div>
                            <button 
                            disabled={generalReducer.status.sending ? true : false}
                            style={{backgroundColor: generalReducer.status.sending ? '#ccc' : ''}}
                            className="submit-offer-btn"
                            children={"تقديم"} 
                            onClick={()=>submitAmount(request.requestId, request.clients.email, request.requestNum, idx)}/>
                        </div>
                    }
                    {supplier && view && <div className="shipping-name-container">
                    {request.shipperName != null && !arabic ? <p className="english">Shipping By {request.shipperName.toUpperCase()}</p>
                    :request.shipperName != null && arabic && <p >{request.shipperName.toUpperCase()} تشحن بواسطة</p>
                    }
                    {request.requestStatus == "1" && 
                    <Fragment>
                        <Feedback arabic={arabic}/>
                        <div className="request-action-container">
                        <button
                        disabled={generalReducer.status.sending ? true : false}
                        style={{backgroundColor: generalReducer.status.sending ? '#ccc' : ''}}
                        className={!arabic ? "shipping-btn english" : "shipping-btn" } 
                        children={shippers.showShippers ? !arabic ? 'Hide Shippers' : 'اخفاء' : !arabic ? "To Shipping?" : "الانتقال للشحن"} 
                        onClick={()=>toggleShippersList(request.requestId)}/> 
                        <button
                        disabled={generalReducer.status.sending ? true : false}
                        style={{backgroundColor: generalReducer.status.sending ? '#ccc' : ''}}
                        className={!arabic ? "shipping-cancel-btn english" : "shipping-cancel-btn" }
                        children={status.sending? status.text : !arabic ? "Cancel Order" : "الغي الطلب"} 
                        onClick={()=>toggleCancelModal(request.requestId, request.clients.email, request.requestNum)}/> 
                        </div>
                    </Fragment>
                    }
                    <div >
                        {request.requestStatus == "2" &&
                            <Fragment>
                                <Feedback arabic={arabic} /> 
                                <button
                                disabled={generalReducer.status.sending ? true : false}
                                style={{marginLeft:'3.5rem', marginTop:'1rem', backgroundColor: generalReducer.status.sending ? '#ccc' : ''}}
                                className={!arabic ? "submit-offer-btn english" : "submit-offer-btn" }
                                children={!arabic ? "Delivered?" :  "تم التوصيل؟"} 
                                onClick={()=>complete(request.requestId, request.clients.email, request.requestNum, request.trackingNumber)}/> 
                            </Fragment>
                        }
                    </div>
                <div>
                    {shippers.showShippers && shippers.requestId == request.requestId && 
                    <div>
                        <div>
                            <input name="shipperName" placeholder={!arabic ? "Shipper Name" : "شركة الشحن" } type="text" onChange={changeShipperInfo} />
                        </div>
                        <div>
                            <input name="trackingNumber" placeholder={!arabic ? "Tracking Number" : "رقم التتبع"} type="number" onChange={changeShipperInfo}/>
                        </div>
                    </div>
                    }
                    {shippers.showShippers && request.requestId == shippers.requestId && shippers.showShipBtn &&
                        <button
                        disabled={generalReducer.status.sending ? true : false}
                        style={{backgroundColor: generalReducer.status.sending ? '#ccc' : ''}}
                        className={!arabic ? "submit-offer-btn english" : "submit-offer-btn" }
                        children={!arabic ? "Ship Now" : "اشحن"} 
                        onClick={()=>moveToShipping(request.requestId, request.clients.email, request.requestNum)}/>
                    }
                </div>
                </div> 
                }
                {!supplier && !arabic ?
                <Fragment>
                    <div className="more-details-container">
                        <p className="english" style={{color:'#400082'}}>
                            Amount: <span>{request.finalAmount != 0 ? `SR ${request.finalAmount}` : "Not Assigned"}</span>
                        </p>
                        {request.shipperName != null &&
                        <p className="english">
                            Shipper: <span>{request.shipperName}</span>
                        </p> 
                        }
                    </div>
                    <Fragment>
                        <p onClick={()=>navigateToDetails(request.requestId)} className="details-text english"> Details  <BsArrowRight className="arrow" size={30}/> </p> 
                            {request.amounts != null &&  request.amounts.length > 0 && 
                            <Fragment>
                                <p className="offer english">*You have {request.amounts.length} offers</p>
                            </Fragment>
                        }
                    </Fragment>
                </Fragment>
                : !supplier && arabic && <Fragment>
                    <div className="more-details-container">
                        <p style={{color:'#400082'}}>
                            السعر: <span>{request.finalAmount != 0 ? `ريال ${request.finalAmount}` : "لم يتم اختيار السعر"}</span> 
                        </p>
                            {request.shipperName != null &&
                                <p style={{color: '#856f00'}}>
                                    <span>{request.shipperName}</span>شركة الشحن  
                                </p> 
                            }
                        </div>
                        <Fragment>
                        <p onClick={()=>navigateToDetails(request.requestId)} className="details-text"> <BsArrowLeft size={30} className="arrow-arabic"/> التفاصيل</p>
                            {request.amounts != null &&  request.amounts.length > 0 && 
                                <Fragment>
                                <p className="offer">لديك {request.amounts.length} من العروض *</p>
                            </Fragment>
                        }
                        </Fragment>
                </Fragment>
                }
                </div>
           ))} 
           </section>
           </Fragment> : !supplier ? <div>
                    {!arabic ?
                    <Fragment>
                        <p>No Order Has Been Placed !</p>
                        <div>
                            <button  children={"For Cars"} onClick={()=>router.push("/en/requests/cars")}/>
                            <button children={"For Vehicles"} onClick={()=>router.push("/en/requests/vehicles")}/>
                        </div>
                    </Fragment>:
                    <Fragment>
                        <p>لا يوجد طلبات مسجلة لديك</p>
                        <div>
                            <button  children={"للسيارات"} onClick={()=>router.push("/requests/cars")}/>
                            <button children={"للمركبات الكبيرة"} onClick={()=>router.push("/requests/vehicles")}/>
                        </div>
                    </Fragment>
                    }
           </div> : supplier && view ? <div className="no-request-text-container">
                {!arabic ? <p className="english">Sorry there is no request belongs to you ):</p> :
                <p>المعذرة، لايوجد طلب مسجل لديك</p>
            }
       </div> : supplier && <div className="no-request-text-container">
            {!arabic ?
                <p className="english">Sorry, There are no new added requests</p>:
                <p>المعذرة، لا يوجد طلبات مسجلة</p>
            }
   </div>
}


export default AllRequests;