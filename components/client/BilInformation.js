import {BsCheckCircle} from 'react-icons/bs';
import {AiOutlineClose} from 'react-icons/ai';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { sendEmail } from 'helper/functions';
import { useRouter } from 'next/router';

const BilInformation =({arabic, session, status, token}) => {

    const generalReducer = useSelector((state)=>state.generalReducer);
    const router = useRouter();
    let requestInformation;

     
    useEffect(()=>{
        requestInformation = JSON.parse(localStorage.getItem("requestData"));
        if(session && requestInformation){
            addPaymentInformation();
        }
    }, [session])

    const addPaymentInformation = async () => {
            let data = await fetch(`${generalReducer.ENDPOINT}/payment/payment-operations`, {
                method:'POST',
                headers:{
                    'Content-Type' : 'application/json',
                    "Authorization": token
                },
                body: JSON.stringify({
                    uid: session.user.name.id,
                    requestId: requestInformation.requestId,
                    status: status
                })
            });
            const response = await data.json();
            if(response.statusCode != 201){
                return;
            }else if(status != "paid"){
                return;
            }
            data = await fetch(`${generalReducer.ENDPOINT}/request/select-best-price`, {
                method: "PATCH",
                headers:{
                    "Content-Type": "application/json",
                    "Authorization": token
                },
                body: JSON.stringify({
                    uid: session.user.name.id,
                    supplierId: requestInformation.supplierId,
                    requestId: requestInformation.requestId,
                    finalAmount: requestInformation.finalAmount
                })
            });
            if(!arabic){
                await sendEmail(requestInformation.clientEmail, "paid", "client", false, false, requestInformation.requestNum);
            }else{
                await sendEmail(requestInformation.clientEmail, "paid", "client", true, false, requestInformation.requestNum);
            }
            await sendEmail(requestInformation.supplierEmail, "paid", "supplier", false, false, requestInformation.requestNum);
            localStorage.removeItem("requestData");
    }
    
    let Text = <p className="succeed-payment english">PAYMENT IS SUCCEED</p> ;
    
    if(arabic){
        Text = <p className="succeed-payment">تم الدفع بنجاح</p>
    }
    if(status != "paid"){
        Text = <p className="invalid-payment english">PAYMENT IS INVALID</p> ;
    }else if(status != "paid" && arabic){
        Text = <p className="invalid-payment">عذرا، عملية الدفع لم تتم بنجاح</p> ;
    }


    return <div className="bill-container">
    <div className="bill-inner-container">
        {Text}
    </div>
    <div className="icon-bill">
        {status != "paid" ? <AiOutlineClose size={50} color={"#ff274b"} className="icon-bill animate__rubberBand" /> : <BsCheckCircle size={50} color={"#059669"} className="icon-bill animate__rubberBand" /> }
    </div>
    <button onClick={()=>router.push(!arabic ? "/en/" : "/")} className={!arabic ? "back-site-btn english" : "back-site-btn"}>{!arabic ? "Back to site" : "العودة للموقع" }</button>  
    </div>
}

export default BilInformation