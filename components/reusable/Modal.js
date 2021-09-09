import { useState } from "react";
import Feedback from "./Feedback";
import {AiOutlineClose, AiOutlineUpload} from 'react-icons/ai';
import { useDispatch, useSelector } from "react-redux";


const Modal = ({arabic, reasons, confirmCancel, data, title, close}) => {
    const [reason, setReason] = useState('');
    const generalReducer = useSelector(state=>state.generalReducer);
    const dispatch = useDispatch();
    const onChangeReason = (e) => {
        setReason(e.target.value);
    }

    return <div className={!generalReducer.toggleModal ? "modal-container-info" : "modal-container-info show"}>
        <div className="header-modal-container">
             <AiOutlineClose size={27} color={"#FE346E"} className="close-icon" onClick={close}/> 
            <h3 className={!arabic ? "login-title english" : "login-title"} style={{fontSize:!arabic && '18px'}}>{title}</h3>
        </div>
        <hr/>
        <ol className="reason-container">
            {reasons.map(reason=>(
                <li key={reason}>
                    <input id={reason} type='radio' name="cancel" value={reason} onChange={onChangeReason}/>
                    <label htmlFor={reason}>{reason}</label>
                </li>
            ))
            }
        </ol>
        <p className="warning-text">{!arabic ? 'Many cancelations may affect your account' : 'الغاء الطلبات الكثيرة قد يؤثر على حسابك'}</p>
        <button onClick={()=>confirmCancel(data.requestId, data.clientEmail, data.requestNum, reason)} 
        disabled={reason.length == 0 ? true : generalReducer.status.succeed ? true : false}
        style={{backgroundColor: reason.length == 0 ? '#d1d5db' : '', outline: 'none'}}
        className={!arabic ? "english" : "" }>{!arabic ? "Confirm Cancelation" : "تأكيد الالغاء"}</button>

        <Feedback arabic={arabic}/>    
    </div>
}


export default Modal;