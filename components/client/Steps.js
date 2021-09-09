import { Fragment } from "react";

const Steps = ({arabic}) => {
    return <Fragment>
            <section className="steps-landing-contiainer">
            <div className="step-right">
                <p className={!arabic ? "step-title english" : "step-title" }>{!arabic? 'Order' : 'اطلب'}</p>
                <img src={"/imgs/form.svg"} alt="form" className="step-icon-right animate__jackInTheBox" />
            </div>
            <hr className="hr-landing-steps" />
            <div className="step-left">
                <p className={!arabic ? "step-title english" : "step-title" }>{!arabic? 'Watch offers' : 'شاهد العروض'}</p>
                <img src={"/imgs/observe.svg"} alt="form" className="step-icon-left animate__jackInTheBox" />
            </div>
            <hr className="hr-landing-steps" />
            <div className="step-right">
                <p className={!arabic ? "step-title english" : "step-title" }>{!arabic? 'Select' : 'اختر'}</p>
                <img src={"/imgs/select.svg"} alt="form" className="step-icon-right animate__jackInTheBox" />
            </div>
            <hr className="hr-landing-steps" />
            <div className="step-left">
                <p className={!arabic ? "step-title english" : "step-title" }>{!arabic? 'Confirm' : 'اختر'}</p>
                <img src={"/imgs/confirm.svg"} alt="form" className="step-icon-left animate__jackInTheBox" />
            </div>
            <hr className="hr-landing-steps" />
            <div className="step-right">
                <p className={!arabic ? "step-title english" : "step-title" }>{!arabic? 'In shipping' : 'في الشحن'}</p>
                <img src={"/imgs/shipment.svg"} alt="form" className="step-icon-right animate__jackInTheBox" />
            </div>
            <hr className="hr-landing-steps" />
            <div className="step-left">
                <p className={!arabic ? "step-title english" : "step-title" }>{!arabic? 'Take it' : 'استلمها'}</p>
                <img src={"/imgs/take.svg"} alt="form" className="step-icon-left animate__jackInTheBox" />
            </div>
            <hr className="hr-landing-steps" />
        </section>
    </Fragment>
}

export default Steps;