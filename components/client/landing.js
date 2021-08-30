import { useEffect, useState } from "react";
import Link from 'next/link'
const Landing = ({arabic}) => {
    const [headerIcon, setHeaderIcon] = useState([
            {
                imgPath: '/imgs/wheel.svg',
                imgDesc: 'كفرات',
                imgDescEn: 'Wheels'
            },
            {
                imgPath: '/imgs/battery.svg',
                imgDesc: 'بطاريات',
                imgDescEn: 'Batteries'
            },
            {
                imgPath:'/imgs/shock.svg',
                imgDesc:'ممتص صدمات',
                imgDescEn: 'Shocks Absorber'
            },
            {
                imgPath:'/imgs/fender.svg',
                imgDesc:'رفرف',
                imgDescEn:'Fenders'
            },
            {
                imgPath:'/imgs/engine.svg',
                imgDesc:'محركات',
                imgDescEn:'Engines'
            },
            {
                imgPath:'/imgs/spark.svg',
                imgDesc:'بواجي',
                imgDescEn: 'Spark Plug'
            }
        ]);
        const [steps, setSteps] = useState([
            {
                step:'اكتب طلبك',
                stepEn: 'Write your request',
                icon: '/imgs/form.svg'
            },
            {
                step:'راقب العروض',
                stepEn: 'Observe offers',
                icon: '/imgs/observe.svg'
            },
            {
                step:'اختر العرض',
                stepEn: 'Choose an offer',
                icon: '/imgs/select.svg'
            },
            {
                step:'تم التأكيد',
                stepEn: 'Confirm an offer',
                icon: '/imgs/check.svg'
            },
            {
                step:'في الشحن',
                stepEn: 'In shipping',
                icon: '/imgs/shipment.svg'
            },
            {
                step:'استلم طلبك',
                stepEn: 'Take request',
                icon: '/imgs/take.svg'
            }
        ])



    return <section>
        <header className="header">
            {headerIcon.map(header=>(
            <div key={header.imgPath}>
                <div className="img-container">
                    <img src={header.imgPath} alt={header.imgDesc} width="65" height="65"/>
                </div>
                {!arabic ? <h1 className="img-text english">{header.imgDescEn}</h1> : <h1 className="img-text">{header.imgDesc}</h1> }
            </div>
        )) 
        }
        </header>
        {!arabic ? <h3 className="title english" style={{fontSize: !arabic && '25px'}}>And many spare parts</h3> : <h3 className="title">والعديد من قطع الغيار</h3>}
        
        <div className="step-title-container">
            <span style={{borderRight:'2px solid black', margin:"1rem"}}></span>
            <span className={!arabic ? "title english step-title-text" : "title step-title-text"}>{!arabic ? "What Are The Order Steps?" : "ماهي خطوات الطلب؟"}</span>
            <span style={{borderLeft: '2px solid black', margin:"1rem"}}></span>
        </div>
        <hr style={{marginRight:"2rem", marginLeft:"2rem", marginTop:"6rem"}}/>
        <section className="steps">
            {steps.map(step=>(
                <div key={step.stepEn}>
                    <h3 className={!arabic ? "step-title english" : "step-title" }>{!arabic? step.stepEn : step.step}</h3>
                    <div className="step-img-container">
                        <img src={step.icon} width="100"/>
                    </div>
            </div>
            ))}
        </section>
    </section>
}

export default Landing;