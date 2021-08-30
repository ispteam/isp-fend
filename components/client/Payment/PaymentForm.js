import { useState } from 'react';
import {Modal, Input, Button, Feed} from 'semantic-ui-react';
import classes from 'components/client/Payment/payment-style.module.css';
import {BsCreditCard, BsFillPersonCheckFill} from 'react-icons/bs';
import {MdDateRange} from 'react-icons/md';
import {CgPassword} from 'react-icons/cg';
import {FaTimes} from 'react-icons/fa';
import { validateCreditCard, validateCreditCardArabic } from 'helper/functions';
import { useDispatch } from 'react-redux';
import generalActions from 'stores/actions/generalActions';
import Feedback from 'components/reusable/Feedback';

const Payment = ({show, arabic, amount, close, requestInformation}) => {
    const dispatch = useDispatch();
    const [cardInfo, setCardInfo] = useState({
        "source[name]": "",
        "source[number]":"",
        "source[month]":"",
        "source[year]":"",
        "source[cvc]":""
    });


    const changeHandler = (e) => {
        setCardInfo(prevState=>({
            ...prevState,
            [e.target.name]: e.target.value
        }))
    }


    const submitHandler = (e) => {
        let validateCardName = validateCreditCard(cardInfo['source[name]'], true);
        let validateCardNumber = validateCreditCard(cardInfo['source[number]'], false, true);
        let validateCardYear = validateCreditCard(cardInfo['source[year]'], false, false, true);
        let validateCardMonth = validateCreditCard(cardInfo['source[month]'], false, false, false, true);
        let validateCVC = validateCreditCard(cardInfo['source[cvc]'], false, false, false, false, true);

        if(arabic){
            validateCardName = validateCreditCardArabic(cardInfo['source[name]'], true);
            validateCardNumber = validateCreditCardArabic(cardInfo['source[number]'], false, true);
            validateCardYear = validateCreditCardArabic(cardInfo['source[year]'], false, false, true);
            validateCardMonth = validateCreditCardArabic(cardInfo['source[month]'], false, false, false, true);
            validateCVC = validateCreditCardArabic(cardInfo['source[cvc]'], false, false, false, false, true);
        }

        if(validateCardName.length > 0){
            dispatch(generalActions.changeValidation(validateCardName));
        }
        if(validateCardNumber.length > 0){
            dispatch(generalActions.changeValidation(validateCardNumber));
        }
        if(validateCardYear.length > 0){
            dispatch(generalActions.changeValidation(validateCardYear));
        }
        if(validateCardMonth.length > 0){
            dispatch(generalActions.changeValidation(validateCardMonth));
        }
        if(validateCVC.length > 0){
            changeValidationState(validateCVC);
        }

        if(validateCardName.length > 0 ||
            validateCardNumber.length > 0 ||
            validateCardYear.length > 0 ||
            validateCardMonth.length > 0 ||
            validateCVC.length > 0
            ){
                dispatch(generalActions.showValidationMessages());
                return;
            }
        localStorage.setItem("requestInformation", JSON.stringify(requestInformation));
    }

    

    return <div>
    <Modal
    className={classes.modalContainer}
    size={'tiny'}
    open= {show}>
        <Modal.Header>{!arabic ? 'Payment Info' : 'بيانات الدفع'}</Modal.Header>
        <FaTimes size={20} color={"#b1b1b1"} className={classes.iconClose} onClick={close}/>
        <Modal.Content>
            <h3 className="text-blue-600 font-Raleway text-2xl ml-6">SR{amount}</h3>
            <form accept-charset="UTF-8" action="https://api.moyasar.com/v1/payments.html" method="POST" className={classes.formContainer} onSubmit={submitHandler}>
                <input type="hidden" name="callback_url" value={!arabic ? "http://localhost:3000/en/payment" : "http://localhost:3000/ar/payment"}/>
                <input type="hidden" name="publishable_api_key" value="pk_test_s6wLrTQTjSqeThAgeko7546cJaVypsLicDScrt7P" />
                <input type="hidden" name="source[type]" value="creditcard" />
                <input type="hidden" name="amount" value="1000" />
                <div>
                    <Input type="text" name="source[name]" placeholder={!arabic? "Crad's Holder" : "الاسم على البطاقة"} onChange={changeHandler} value={cardInfo['source[name]']}/>
                    <BsFillPersonCheckFill size={20} color={"#b1b1b1"} className={classes.icon} />
                </div>
                <div>
                    <Input type="number" name="source[number]" placeholder={!arabic? "Crad Number" : "رقم البطاقة"} onChange={changeHandler} value={cardInfo['source[number]']}/>
                    <BsCreditCard size={20} color={"#b1b1b1"} className={classes.icon} />
                </div>
                <div>
                    <Input type="number" name="source[month]" placeholder={!arabic? "Expiration Month" : "الشهر"} onChange={changeHandler} value={cardInfo['source[month]']}/>
                    <MdDateRange size={20} color={"#b1b1b1"} className={classes.icon} />
                </div>
                <div>
                    <Input type="number" name="source[year]" placeholder={!arabic? "Expiration Year" : "السنة"} onChange={changeHandler} value={cardInfo['source[year]']}/>
                    <MdDateRange size={20} color={"#b1b1b1"} className={classes.icon} />
                </div>
                <div>
                    <Input type="text" name="source[cvc]" placeholder={!arabic? "CVC" : "رقم الامان"} onChange={changeHandler} value={cardInfo['source[cvc]']}/>
                    <CgPassword size={20} color={"#b1b1b1"} className={classes.icon}/>
                </div>
                <Button type="submit" positive className={classes.btn} children={!arabic ? "PAY" : <p className="font-Arabic">اتم الشراء</p>}/>
            </form>
            <Feedback/>
        </Modal.Content>
    </Modal>
    </div>
}

export default Payment