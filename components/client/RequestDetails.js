import Spinner from "components/reusable/Spinner/Spinner";
import { getSession } from "next-auth/client";
import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import generalActions from "stores/actions/generalActions";
import Payment from "./Payment/PaymentForm";

const RequestDetails = ({client, request, token, arabic}) => {
    const dispatch= useDispatch();
    const [session, setSession] = useState(); // To get the session values after login.
    const generalReducer = useSelector((state)=>state.generalReducer);
    const [payment, setPayment] = useState({
        amount:'',
        requestInformation:{},
        show:false
    });
    useEffect(async()=>{
        const session = await getSession();
        setSession(session)
    },[]);

    if(!request){
        return <Spinner/>
    }


    const cancelRequest = async () => {
        try{
            dispatch(generalActions.emptyState());
            dispatch(generalActions.sendRequest(!arabic ? "Canceling.." : "..الغاء"))
            const data = await fetch(`${generalReducer.ENDPOINT}/request/cancel-request`, {
            method: "PATCH",
            headers:{
                "Content-Type": "application/json",
                "Authorization": token
            },
            body: JSON.stringify({
                uid: session.user.name.id,
                requestId: request.requestId
            })
            });
            const response = await data.json();
            if (response.statusCode !== 200 && response.statusCode !== 201) {
            const error = new Error(response.message);
            throw error;
            }
            dispatch(generalActions.sendRequest(!arabic ? response.message : response.messageInArabic))

            if(request.suppliers != null){
                await sendEmail(request.suppliers.email, "cancelShipping", "supplier", false, false, request.requestNum);
            }

            setTimeout(()=>{
                dispatch(generalActions.emptyState());
                window.location.reload();
            }, 3000)
        } catch (err) {
            dispatch(generalActions.changeValidation(err.message));
            dispatch(generalActions.showValidationMessages());
        }
    }

    const selectBestPrice = async (requestId, supplierId, supplierEmail, clientEmail, requestNum ,finalAmount) => {
        setPayment(prevState=>({
            ...prevState,
            amount: finalAmount,
            requestInformation: {
                requestId,
                supplierId,
                supplierEmail,
                clientEmail,
                requestNum,
                finalAmount,
            },
            show: !prevState.show
        }));
    }

    const rejectOffer = async (requestId, supplierId, supplierEmail,requestNum ) =>{
        try{
            const offersContainer = document.querySelector("#offersContainer");
            const offer = document.querySelector("#offer-" + supplierId);
            dispatch(generalActions.emptyState());
            dispatch(generalActions.sendRequest(!arabic ? "Rejecting.." : "..رفض"))
        const data = await fetch(`${generalReducer.ENDPOINT}/request/reject-offer`, {
            method: 'PATCH',
            headers:{
                'Content-Type':'application/json',
                "Authorization": token
            },
            body: JSON.stringify({
                uid: session.user.name.id,
                requestId,
                supplierId
            })
        })
        const response = await data.json();
        if(response.statusCode !== 200){
            const error = new Error(response.message);
            error.statusCode = response.statusCode;
        }
        offersContainer.removeChild(offer);
        dispatch(generalActions.sendRequest(!arabic ? response.message : response.messageInArabic))
        await sendEmail(supplierEmail, "rejectOffer", "supplier", false, false, requestNum);
        }catch(err){
            dispatch(generalActions.changeValidation(err.message));
            dispatch(generalActions.showValidationMessages());
        }
    }

    return <Fragment>
            <div>
                <h3 className={!arabic ? "english" : "font-arabic" } style={{color:request.requestStatus == "0" ? "#dc268a" 
                : request.requestStatus == "1" ? "#2563eb" 
                : request.requestStatus == "2" ? "#059669" 
                : request.requestStatus == "3" ? "#7c3aed" 
                : request.requestStatus == "4" ? "#db2777"  :null, textAlign:'center', fontSize:'20px'}}>
                {request.requestStatus == "0" ? "PENDING" 
                    : request.requestStatus == "1" ? "SHIPPING" 
                    : request.requestStatus == "2" ? "CANCELED" 
                    : request.requestStatus == "3" ? "COMPLETED" 
                    : request.requestStatus == "4" ? "PAID" : null}</h3>
            </div>

            {client && request.requestStatus != "3" &&
            <div className="canel-request-btn-container">
                <button  onClick={cancelRequest} disabled={generalReducer.status.sending ? true : false} 
                className={!arabic ? "english" : "font-arabic"}
                >
                {generalReducer.status.sending ? generalReducer.status.text : !arabic ? "Cancel Request" : 
                "الغاء الطلب"}</button>
            </div>
            }

            {client && request.amounts != null && request.requestStatus != "1" && request.requestStatus != "2" && request.requestStatus != "3" &&
        request.amounts.length > 0 &&
            <section className="offers-container" id="offersContainer">
                {request.amounts.map(amount=>(
                    <div className="main-offer-container"  id={"offer-"+amount.supplierId} key={amount.supplierId}>
                        <div className="main-offer-info-container">
                        {!arabic ? 
                            <p className="english">supplier</p> : 
                            <p className="font-arabic">الموّرد</p>
                            }
                            {!arabic ? 
                        <p className="english">{amount.companyName}</p>
                        : <p className="font-Arabic">{amount.companyNameInArabic}</p>
                            }
                        </div>
                            <p className={!arabic ? "english" : "font-arabic"} style={{textAlign:'center', color: "#db2777"}} >{!arabic ? "Bill Details" : <span className="font-Arabic">تفاصيل الفاتورة</span>}</p>
                            <div>
                                {!arabic ?
                                <Fragment>
                                    <p className="english"> <strong>----------------------</strong> </p>
                                    <p className="english" style={{color:"#400082", textAlign:'center'}}>The offer <span >{amount.amount}</span> SR</p>
                                    <p className="english" style={{color:"#db2777", textAlign:'center'}}>Shipment Fees <span >{amount.shipmentFees}</span> SR</p>
                                    <p className="english"> <strong>----------------------</strong> </p>
                                    <p className="english" style={{color:"#2563eb", textAlign:'center'}}>
                                        <strong>Total</strong> <span >{(parseFloat(amount.amount) + parseFloat(amount.shipmentFees))}</span> SR
                                    </p> 
                                </Fragment>
                                : <Fragment>
                                    <p className="english"> <strong>----------------------</strong> </p>
                                    <p className="font-arabic" style={{color:"#400082"}}>العرض {amount.amount} ريال </p>
                                    <p className="font-arabic" style={{color:"#db2777"}}>رسوم الشحن {amount.amount} ريال </p>
                                    <p className="font-arabic"> <strong>----------------------</strong> </p>
                                    <p className="font-arabic" style={{color:"#2563eb", textAlign:'center'}}>المجموع {(parseFloat(amount.amount) + parseFloat(amount.shipmentFees)).toFixed(2)} ريال </p>
                                </Fragment>}
                            </div>
                        <div>
                            <button 
                            className={!arabic ? "accept-btn english" : "accept-btn"}
                            onClick={()=>selectBestPrice(request.requestId, amount.supplierId, amount.email, request.clients.email, request.requestNum ,(parseFloat(amount.amount) + parseFloat(amount.shipmentFees)))}
                            disabled={generalReducer.status.sending ? true : false} >{generalReducer.status.sending ? generalReducer.status.text : !arabic ? "Select This Offer" : "اختر هذا العرض"}</button>
                        </div>
                        <div>
                            <button
                            className={!arabic ? "reject-btn english" : "reject-btn"}
                            onClick={()=>rejectOffer(request.requestId, amount.supplierId, amount.email, request.requestNum)} 
                            disabled={generalReducer.status.sending ? true : false} >{generalReducer.status.sending ? status.text : !arabic ?  "Reject Offer" : "ارفض العرض"}</button>
                        </div>
                    </div>
                ))}
            </section>
       }

       <Payment arabic={arabic} amount={payment.amount} show={payment.show} close={selectBestPrice} requestInformation={payment.requestInformation} />
    </Fragment>
}


export default RequestDetails;