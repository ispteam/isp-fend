import { useRouter } from "next/router";
import { Fragment, useState } from "react";

const OffersModal = ({arabic, request, show, close, reasons, showReasons, confirmCancelation, data}) => {

    const router = useRouter();
    
    const selectBestPrice = async (requestId, supplierId, supplierEmail, clientEmail, requestNum ,finalAmount) => {
       localStorage.setItem("requestData", JSON.stringify({
           requestId,
           supplierId,
           supplierEmail,
           clientEmail,
           requestNum,
           finalAmount
       }));
       if(!arabic){
           router.push("en/requests/payment");
       }else{
           router.push("/requests/payment");
       }
    }

    const rejectOffer = async (requestId, supplierId, supplierEmail,requestNum ) =>{
        try{
            const offersContainer = document.querySelector("#offersContainer");
            const offer = document.querySelector("#offer-" + supplierId);
            emptyState();
            setStatus(prevState=>({
                ...prevState,
                sending:true,
                text: !arabic ? "rejecting..." : "...رفض"
            }))
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
        changeValidationState(response.message);
        setStatus(prevState=>({
            ...prevState,
            show:true,
            sending:false,
            succeed:true,
            text:"" 
        }))
        await sendEmail(supplierEmail, "rejectOffer", "supplier", false, false, requestNum);
        }catch(err){
            changeValidationState(err.message)
            setStatus(prevState=>({
                ...prevState,
                show: true,
                sending:false,
                text:""
            }));
        }
    }

    const [reason, setReason] = useState(null);

    const onChangeReason = (e) => {
        setReason(e.target.value);
    }


    return <div className="offers-container animate__backInDown">
        <button onClick={close} className={!arabic ? "clsoe-offers-btn english" : "clsoe-offers-btn" }>{!arabic ? "Close" : "اغلق"}</button>
        {!showReasons ? 
            <table className="offers-table">
                <tbody>
                    <tr>
                        {!arabic ?
                        <Fragment>
                            <th className="english">Supplier</th>
                            <th className="english">Offer</th>
                            <th className="english">Shipment Fees</th>
                            <th className="english">Total</th>
                        </Fragment>
                        : <Fragment>
                            <th>عملية</th>
                            <th>المجموع</th>
                            <th>رسوم الشحن</th>
                            <th>العرض</th>
                            <th>المورد</th>
                        </Fragment>
                        }
                        
                    </tr>
                    {!arabic ? 
                    request.amounts.map((offer, idx)=>(
                        <tr id={"offer"+offer.supplierId} key={idx}>
                            <td>{offer.companyName}</td>
                            <td>{offer.amount}</td>
                            <td>{offer.shipmentFees}</td>
                            <td>{(parseFloat(offer.amount) + parseFloat(offer.shipmentFees))}</td>
                            <td>
                                <div>
                                    <button onClick={()=>selectBestPrice(request.requestId, offer.supplierId, offer.email, request.clients.email, request.requestNum, (parseFloat(offer.amount) + parseFloat(offer.shipmentFees)))} className="btn-select-offer english">Select</button>
                                    <button onClick={()=>rejectOffer(request.requestId, offer.supplierId, offer.email, request.requestNum)} className="btn-reject-offer english">Reject</button>
                                </div>
                            </td>
                        </tr>
                    ))
                    : request.amounts.map((offer, idx)=>(
                        <tr id={"offer"+offer.supplierId} key={idx}>
                            <td>
                                <div>
                                    <button onClick={()=>selectBestPrice(request.requestId, offer.supplierId, offer.email, request.clients.email, request.requestNum, (parseFloat(offer.amount) + parseFloat(offer.shipmentFees)))} className="btn-select-offer">اختر</button>
                                    <button onClick={()=>rejectOffer(request.requestId, offer.supplierId, offer.email, request.requestNum)} className="btn-reject-offer">ارفض</button>
                                </div>
                            </td>
                            <td>{(parseFloat(offer.amount) + parseFloat(offer.shipmentFees))}</td>
                            <td>{offer.shipmentFees}</td>
                            <td>{offer.amount}</td>
                            <td>{offer.companyNameInArabic}</td>
                        </tr>
                    ))
                    }
                    
                </tbody>
            </table>
            : <Fragment>
                {reasons.map(reason=>(
                    <div className="reason-container" key={reason}>
                        <label className={!arabic ? "english" : ''} htmlFor={reason}>{reason}</label>
                        <input type="radio" id={reason} value={reason} name="reason" onChange={onChangeReason}/>
                    </div>
                ))}
                <p className={!arabic ? "warning-cancelation-text english" : "warning-cancelation-text"}>{!arabic ? "Too many cancelations will affect your account" : "الالغاءات الكثيرة سوف تؤثر على حسابك"}</p>
                <hr className="hr" />
                <div className="confinm-cancel-btn-container">
                    <button style={{backgroundColor: reason == null ? "#ccc" : "", borderColor:reason == null ? '#ccc' : ''}} disabled={reason == null ? true : false} className={!arabic ? "english" : ""}
                    onClick={()=>confirmCancelation(data.requestId, data.clients.email, data.requestNum, reason)}
                    >{!arabic ? "Confirm" : "تأكيد"}</button>
                </div>
            </Fragment> 
        }
    </div>
}


export default OffersModal;