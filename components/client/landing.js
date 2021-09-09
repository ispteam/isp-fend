import {useState } from "react";
import { useSelector } from "react-redux";
import LandingAddRequestForm from "./LandingForm";
import Steps from "./Steps";
import {useRouter} from 'next/router';
const Landing = ({arabic, session}) => {
        const generalReducer = useSelector(state=>state.generalReducer);
        const router = useRouter();

        const [option, setOption] = useState(null);
        const [brands, setBrands] = useState([]);
        const [yearsList, setYearsList] = useState([]);
        const [suppliersEmails, setSuppliersEmail] = useState([]);

        const chooseOption = async (opt) => {
            try{  
                const headerContainer = document.querySelector(".header-container");
                const formContainer = document.querySelector(".form-landing-container");
                const nextStep = document.querySelector(".next-step-landing");
                const addressForm = document.querySelector(".address-landing-container");
                const nextStepButton = document.querySelector(".next-step-landing");
                const submitBtn = document.querySelector(".submit-step-landing");
                let registrationLandingForm= null;
                if(!session){
                    registrationLandingForm = document.querySelector('.registration-landing-form');
                    registrationLandingForm.style.display = "none";
                }
                addressForm.style.display = "none";
                nextStepButton.style.display = "none";
                submitBtn.style.display = "none";
                setOption(opt);
                let data, response;
                if(window.screen.width >= 735){
                    if(!session){
                        headerContainer.style.height = "220vh";
                    }else{
                        headerContainer.style.height = "145vh";
                    }
                }else{
                    if(!session){
                        headerContainer.style.height = "255vh";
                    }else{
                        headerContainer.style.height = "165vh";
                    }
                }
                formContainer.style.display = "grid";
                nextStep.style.display = "block";
                if(opt == "cars"){
                    const currentYear = new Date().getFullYear();
                    if(yearsList.length < 1){
                        for(let i= 1995; i<= currentYear; i++){
                            yearsList.push(i);
                        }
                    }
                    data = await fetch(`${generalReducer.ENDPOINT}/brand/brands-type/cars`);
                    const allSuppliersEmails = await fetch(`${generalReducer.ENDPOINT}/supplier/suppliers-emails/all`);
                    const responseEmails = await allSuppliersEmails.json();
                    setSuppliersEmail(suppliersEmails.concat(responseEmails.emails));
                }else{
                    data = await fetch(`${generalReducer.ENDPOINT}/brand/brands-type/big vehicles`);
                    const emailsData = await fetch(`${generalReducer.ENDPOINT}/supplier/suppliers-emails/vehicles`);
                    const responseEmails = await emailsData.json();
                    setSuppliersEmail(suppliersEmails.concat(responseEmails.emails));
                }
                response = await data.json();
                setBrands(response.brands.map(br=>({
                    key: br.brandId,
                    value: br.brandId,
                    text: br.brandName + "-" + br.brandNameInArabic
                })));
            }catch(err){
                console.log(err.message);
            }
        }



        



    return <section className="landing-section-container">
            <header className="header-container">
                <h1 className={!arabic ? ' animate__bounce english' : 'animate__bounce'}>{!arabic ? 'Order Now' : 'اطلب قطعتك الان' }</h1>
                <LandingAddRequestForm arabic={arabic} option={option} brands={brands} yearsList= {yearsList} chooseOption={chooseOption} session={session} suppliersEmails={suppliersEmails}/>      
            </header>
        <div style={{backgroundColor:'#ebebeb'}}>
            <div className="step-title-container animate__lightSpeedInLeft">
                <span style={{borderRight:'2px solid black', margin:"1rem"}}></span>
                <span className={!arabic ? "step-title-text-english" : "title step-title-text"}>{!arabic ? "What Are The Order Steps?" : "ماهي خطوات الطلب؟"}</span>
                <span style={{borderLeft: '2px solid black', margin:"1rem"}}></span>
            </div>
        </div>
        <Steps arabic={arabic}/>
        <div className="order-now-landing-container">
            <h1 style={{color:'#1d1d1d'}} className={!arabic ? ' animate__bounce english' : 'animate__bounce'}>{!arabic ? 'Order Now' : 'اطلب قطعتك الان' }</h1>
            <div className="btn-order-now-landing-container">
                <button onClick={!arabic ? ()=> router.push("/en/requests/cars") : ()=> router.push("/requests/cars")} className={!arabic ? 'english' : ''}>{!arabic ? 'Cars' : 'سيارات'}</button>
                <button onClick={!arabic ? ()=> router.push("/en/requests/vehicles") : ()=> router.push("/requests/vehicles")} className={!arabic ? 'english' : ''}>{!arabic ? 'Heavy vehicles' : 'مركبات ثقيلة'}</button>
            </div>
        </div>
    </section>
}

export default Landing;