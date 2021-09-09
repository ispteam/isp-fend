import { Fragment, useEffect, useRef} from "react";
import Table from "../reusable/Tables";
import { useDispatch, useSelector } from "react-redux";
import GridData from "../reusable/GridData";
import {findStatisticsPerMonth, sendEmail, validateAccountsInput} from "../../helper/functions";
import {useState } from "react";
import {BsHash} from "react-icons/bs";
import {getSession} from 'next-auth/client';
import Td from "../reusable/Td";
import Button from "../reusable/Button";
import ModalDetails from "./ModalDetails";
import generalActions from "../../stores/actions/generalActions";
import MyChart from "../reusable/Chart";
import { Pie } from "react-chartjs-2";
import Feedback from "../reusable/Feedback";

const BG_COLORS =  [
    '#B21F00',
    '#C9DE00',
    '#2FDE00',
    '#00A6B4',
    '#6800B4'
  ];

const HOVER_COLORS = [
    '#501800',
    '#4B5000',
    '#175000',
    '#003350',
    '#35014F'
];

const TABLE_LOGS_HEADERS = ["Request NO","Phone" ,"Status", "Amount" ,"Date&Time", "Action"];

const LogsDashboard = ({logs, token, session}) => {
    const generalReducer = useSelector((state)=>state.generalReducer);
    const dispatch = useDispatch();
    const paidRequests = logs.filter(log=>log.status == "paid");
    const totalPaidRequests = paidRequests.length > 0 ? paidRequests.filter(log=>log.status == "paid").map(log=>parseFloat(log.requests.finalAmount)).reduce((accumulator, currentValue)=>accumulator + currentValue) : 0;
    const refundedRequests = logs.filter(log=>log.status == "refunded" && log.isRefund == "1");
    const totalRefundRequests = refundedRequests.length > 0 ? refundedRequests.map(log=>parseFloat(log.requests.finalAmount)).reduce((accumulator, currentValue)=>accumulator + currentValue) : 0;
    const paidRequestsData = findStatisticsPerMonth(logs.filter(log=>log.status == "paid"));
    const failedRequestsData = findStatisticsPerMonth(logs.filter(log=>log.status == "faild"));
    const [paymentsOrder, setPaymentOrder] = useState([]);
    const [searchedValue, setsearchedValue] = useState({
        showSearchedValue: false,
        value: {},
        idx: ''
    });

    const [filtering, setFiltering] = useState({
        paid: false,
        failed:false,
        refund: false
    });

      
      useEffect(()=>{
          setPaymentOrder(logs);
       },[logs]);

       
       const searchRecord = (e) =>{
        const copy = [...logs];
        const idx = copy.findIndex(log=>log.requests.requestNum == e.target.value);
        const log = copy.find(log=>log.requests.requestNum  == e.target.value);
        if(e.target.value.trim() == "" && e.target.value.length <= 1){
          setsearchedValue(prevState=>({
            ...prevState,
            showSearchedValue: false,
            value: {}
          }));
        }
        if(!log){
          setsearchedValue(prevState=>({
            ...prevState,
            showSearchedValue: !prevState.showSearchedValue,
            value: {},
            idx: idx
          }));
        }
        setsearchedValue(prevState=>({
          ...prevState,
          showSearchedValue: !prevState.showSearchedValue,
          value: log
        }))
    }
  
    const filterData = (e) => {
      if(e.target.name == "sort"){
        setFiltering(prevState=>({
          ...prevState,
          order: !prevState.order
        }));
        if(filtering.order){
          setPaymentOrder(paymentsOrder.sort((id1, id2)=> id1.paymentId > id2.paymentId ? -1 : 1));
        }else{
          setPaymentOrder(paymentsOrder.sort((id1, id2)=> id1.paymentId < id2.paymentId ? -1 : 1));
        }
      }else if(e.target.name == "paid"){
        setFiltering(prevState=>({
          ...prevState,
          paid: !prevState.paid,
          failed: false
        }));
        if(!filtering.paid){
          setPaymentOrder(paymentsOrder.filter(py=> py.status == "paid"));
        }else{
          setPaymentOrder([...logs]);
        }
      }else if(e.target.name == "failed"){
          setFiltering(prevState=>({
              ...prevState,
              paid: false,
              failed: !prevState.failed
            }));
        if(!filtering.failed){
          setPaymentOrder(paymentsOrder.filter(py=> py.status == "failed"));
        }else{
          setPaymentOrder([...logs]);
        }
      }else if(e.target.name == "refund"){
        setFiltering(prevState=>({
            ...prevState,
            paid: false,
            failed: false,
            refund: !prevState.refund
          }));
      if(!filtering.refund){
        setPaymentOrder(paymentsOrder.filter(py=> py.status == "refund"));
      }else{
        setPaymentOrder([...logs]);
      }
    }
    }

    const isRefund = async (paymentId, clientEmail, requestNum)=> {
      try{
        dispatch(generalActions.emptyState());
        dispatch(generalActions.sendRequest('Refunding..'))
        const data= await fetch(`${generalReducer.ENDPOINT}/payment/refund`, {
          method:'PATCH',
          headers: {
            'Content-Type': 'application/json',
            "Authorization": token
          },
          body:JSON.stringify({
            uid: session.user.name.id,
            paymentId
          })
        });
        const response = await data.json();
        if(response.statusCode != 200){
          throw new Error(response.message);
        }
      dispatch(generalActions.sendRequest(response.message));
      await sendEmail(clientEmail, "refund", "client", false, false, requestNum);
      await sendEmail(clientEmail, "refund", "client", true, false, requestNum);
      setTimeout(()=>{
            dispatch(generalActions.emptyState());
            window.location.reload();
      }, 1500)
      }catch(err){
        dispatch(generalActions.changeValidation(err.message));
        dispatch(generalActions.showValidationMessages());
    }














    }

    return <Fragment>

            <div className="grid-data-details-container">
                <GridData
                icon={<BsHash size={25} color="white" />}
                title="Total numbers of payments"
                link="/en/admin/requests"
                data={logs.length}
                />
            </div>

            <div className="grid-data-details-container">
                <GridData
                icon={<BsHash size={25} color="white" />}
                title="Total paid requests"
                link="/en/admin/logs"
                data={"SR"+totalPaidRequests}
                />
            </div>

            <div className="grid-data-details-container">
                <GridData
                icon={<BsHash size={25} color="white" />}
                title="Total refund requests"
                link="/en/admin/logs"
                data={"SR" + totalRefundRequests}
                />
            </div>

            <Table
        headers={TABLE_LOGS_HEADERS.map((header) => (
          <th key={header}>{header}</th>
        ))}
        details={true}
      >
        {!searchedValue.showSearchedValue ? paymentsOrder.length > 0 && paymentsOrder[0].requests != null && paymentsOrder.sort().map((payment, idx) => {
          return (
            <Fragment key={payment.paymentId}>
              <tr key={payment.paymentId}>
                <Td key={payment.requests.requestNum} value={payment.requests.requestNum}/>
                <Td key={payment.clients.phone} value={payment.clients.phone}/>
                <Td key={payment.status} value={payment.status.toUpperCase()}
                   style={{color: payment.status != 'paid' ? '#059669' : '#db2777'}} 
                />
                <Td key={payment.requests.finalAmount} value={"SR"+payment.requests.finalAmount}/>
                <Td key={payment.created_at} value={new Date(payment.created_at).toLocaleDateString('en-US', {year:'numeric', month:'short', day:'numeric', hour:'2-digit', minute:'2-digit'})}/>
                  {payment.status == "refund" ? 
                  <Fragment>
                    <Td key={payment.requests.finalAmount} value={<button
                       className="english"
                        disabled={generalReducer.status.sending ? true : false}
                        style={{backgroundColor: '#059669', border: '#059669', color:'white', padding:'0.3rem'}}
                    onClick={()=>isRefund(payment.paymentId, payment.clients.email, payment.requests.requestNum)}>{generalReducer.status.sending ? "Refunding.." : "Refund" }</button>}  />
                   </Fragment>
                  : <Td key={payment.requests.finalAmount  * (Math.random() * 100)} value="NULL"/>
                  }
              </tr>
            </Fragment>
          );
        }) : searchedValue.value && <Fragment>
        <tr key={searchedValue.value.paymentId}>
                <Td key={searchedValue.value.requests.requestNum} value={searchedValue.value.requests.requestNum}/>
                <Td key={searchedValue.value.clients.phone} value={searchedValue.value.clients.phone}/>
                <Td key={searchedValue.value.status} value={searchedValue.value.status.toUpperCase()}
                   style={{color: searchedValue.value.status != 'paid' ? '#059669' : '#db2777'}} 
                />
                <Td key={searchedValue.value.requests.finalAmount} value={"SR"+searchedValue.value.requests.finalAmount}/>
                <Td key={searchedValue.value.created_at} value={new Date(searchedValue.value.created_at).toLocaleDateString('en-US', {year:'numeric', month:'short', day:'numeric', hour:'2-digit', minute:'2-digit'})}/>
                  {searchedValue.value.status == "refund" ? 
                  <Td key={searchedValue.value.requests.finalAmount} value={<button
                    className="english"
                    disabled={generalReducer.status.sending ? true : false}
                    style={{backgroundColor: '#059669', border: '#059669', color:'white', padding:'0.3rem'}}
                   onClick={()=>isRefund(searchedValue.value.paymentId, searchedValue.value.clients.email, searchedValue.value.requests.requestNum)}>{generalReducer.status.sending ? "Refunding.." : "Refund" }</button>}  />
                  : <Td key={searchedValue.value.requests.finalAmount  * (Math.random() * 100)} value="NULL"/>
                  }
              </tr>
        
      </Fragment>
          }
      </Table>



            <div className="grid-data-details-container">
                <MyChart
                Component={Pie}
                label = "Succeed paid requests"
                title="Numbers of succeed requests payment per month"
                data={paidRequestsData}
                bgColor = {BG_COLORS}
                hoverColor = {HOVER_COLORS}
            />
            </div>

            <div className="grid-data-details-container">
                <MyChart
                Component={Pie}
                label = "Failed paid requests"
                title="Numbers of failure requests payment per month"
                data={failedRequestsData}
                bgColor = {BG_COLORS}
                hoverColor = {HOVER_COLORS}
            />
            </div>

            <div>
                <div className="sort-option-container">
                <div>
                    <input type="checkbox" id="sort" name="sort" onChange={filterData}/>
                    <label htmlFor="sort">ASC</label>
                </div>
                <div>
                    <input type="checkbox" id="paid" name="paid" checked={filtering.paid ? true : false} onChange={filterData}/>
                    <label htmlFor="paid">Paid</label>
                </div>
                <div>
                    <input type="checkbox" id="failed" name="failed" checked={filtering.failed ? true : false} onChange={filterData}/>
                    <label htmlFor="failed">Failed</label>
                </div>
                <div>
                    <input type="checkbox" id="refund" name="refund" checked={filtering.refund ? true : false} onChange={filterData} />
                    <label htmlFor="refund">Refund</label>
                </div>
                </div>
                <div className="search-input english">
                    <input type="text" maxLength="13" className="english-input" onChange={(e)=>searchRecord(e)} placeholder="Search By Request number" inputMode='numeric'/>
                </div>
            </div>

    </Fragment>


}


export default LogsDashboard;