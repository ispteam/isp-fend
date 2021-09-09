import { validateCreditCard, validateCreditCardArabic } from "helper/functions";

const { useRouter } = require("next/router");
const { useState, useEffect, Fragment } = require("react")

const PaymentInformation = ({arabic, status}) => {
    const [requestData, setRequestData] = useState();
    const router = useRouter();

    const [cardInfo, setCardInfo] = useState({
        "source[name]": "",
        "source[number]":"",
        "source[month]":"",
        "source[year]":"",
        "source[cvc]":""
    });

    const [validation, setValidation] = useState({
        values: [],
        showValidation: false,
    });

    const changeHandler = (e) => {
        setCardInfo(prevState=>({
            ...prevState,
            [e.target.name]: e.target.value
        }))
    }

    const changeValidationState = (value) => {
        setValidation(prevState=>({
            ...prevState,
            values: prevState.values.concat(value)
        }));
    }

    const submitHandler = (e) => {

        setValidation({
            values:[],
            showValidation:false
        });
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
            changeValidationState(validateCardName);
        }
        if(validateCardNumber.length > 0){
            changeValidationState(validateCardNumber);
        }
        if(validateCardYear.length > 0){
            changeValidationState(validateCardYear);
        }
        if(validateCardMonth.length > 0){
            changeValidationState(validateCardMonth);
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
                e.preventDefault();
                window.scrollTo({
                    behavior:'smooth',
                    top:400
                })
                setValidation(prevState=>({
                    ...prevState,
                    showValidation: true
                }))
                return;
            }
    }

    useEffect(()=>{
        const requestData = localStorage.getItem("requestData");
        const transformedRequest = JSON.parse(requestData);
        if(!transformedRequest){
            router.back();
        }else{
            setRequestData(transformedRequest)
        }
    }, []);

    return requestData ? <div className="payment-container">
            <form className="form-payment-container" acceptCharset="UTF-8" action="https://api.moyasar.com/v1/payments.html" method="POST" onSubmit={submitHandler}>
                <input type="hidden" name="callback_url" value={!arabic ? "http://localhost:3000/en/requests/bill" : "http://localhost:3000/requests/bill"}/>
                <input type="hidden" name="publishable_api_key" value="pk_test_s6wLrTQTjSqeThAgeko7546cJaVypsLicDScrt7P" />
                <input type="hidden" name="source[type]" value="creditcard" />
                <input type="hidden" name="amount" value={parseInt(requestData.finalAmount + 1000)} />
                <div className="input-form-inner-container">
                    <label style={{color:'black'}} className={!arabic ? 'english' : ''}>{!arabic ? "Card's holder" : 'الاسم على البطاقة'}</label>
                    <input className='english-input' type="text" name="source[name]" onChange={changeHandler} value={cardInfo["source[name]"]}/>
                </div>
                <div className="input-form-inner-container">
                    <label style={{color:'black'}} className={!arabic ? 'english' : ''}>{!arabic? "Crad Number" : "رقم البطاقة"}</label>
                    <input className='english-input' type="number" inputMode="numeric" name="source[number]" onChange={changeHandler} value={cardInfo["source[number]"]}/>
                </div>
                <div className="input-form-inner-container">
                    <label style={{color:'black'}} className={!arabic ? 'english' : ''}>{!arabic? "Expiration Month" : "شهر الانتهاء"}</label>
                    <input className='english-input' type="number" inputMode="numeric" name="source[month]" onChange={changeHandler} value={cardInfo["source[month]"]}/>
                </div>
                <div className="input-form-inner-container">
                    <label style={{color:'black'}} className={!arabic ? 'english' : ''}>{!arabic? "Expiration Year" : "سنة الانتهاء"}</label>
                    <input className='english-input' type="number" inputMode="numeric" name="source[year]" onChange={changeHandler} value={cardInfo["source[year]"]}/>
                </div>
                <div className="input-form-inner-container">
                    <label style={{color:'black'}} className={!arabic ? 'english' : ''}>{!arabic? "CVC" : "رمز الامان"}</label>
                    <input className='english-input' type="number" inputMode="numeric" maxLength={3} name="source[cvc]" onChange={changeHandler} value={cardInfo["source[cvc]"]}/>
                </div>
                <button type="submit" className={!arabic ? "pay-btn english" : "payment-btn"}>{!arabic ? "PAY " + requestData.finalAmount :  requestData.finalAmount + " ادفع"}</button>
            </form>
            {validation.showValidation && validation.values.length > 0 && <
                div className="validation-payment-container">
                    {validation.values.map(val=>(
                        <p key={val} className={!arabic ? "validation-text english" : "validation-text"}>{val}</p>
                    ))}
                </div>
            }
    </div> : <p>{!arabic? "Wait.." : "انتظر"}</p>
}

export default PaymentInformation