import { Fragment, useEffect, useRef} from "react";
import Table from "components/reusable/Tables";
import { useDispatch, useSelector } from "react-redux";
import GridData from "components/reusable/GridData";
import {sendEmail, validateAccountsInput} from "helper/functions";
import { useState } from "react";
import {BsHash} from "react-icons/bs";
import {getSession} from 'next-auth/client';
import Td from "components/reusable/Td";
import Button from "components/reusable/Button";
import ModalDetails from "./ModalDetails";
import generalActions from "stores/actions/generalActions";


const TABLE_REQUESTS_HEADERS = ["Request No" ,"Part NO", "Model No" ,"To", "Qty", "Field", "Status", "Price" ,"Owner"];

const RequestsDashboard = () => {
    const generalReducer = useSelector(state=>state.generalReducer);
    const dispatch = useDispatch();
    const requests = useSelector((state) => state.requestsReducer);
    const [requestsOrder, setRequestOrder] = useState([]);
    const [filtering, setFiltering] = useState({
      order: false,
      canceled: false,
      completed: false,
      shipper: false,
      notCompleted: false,
      });

    const [data, setData] = useState(null);
  
    const [searchedValue, setsearchedValue] = useState({
      showSearchedValue: false,
      value: {},
      idx:''
    });
  
  useEffect(()=>{
    dispatch(generalActions.closeNavMenu());
      setRequestOrder(requests.requests);
  }, [requests.requests, requestsOrder])

  const searchRecord = (e) =>{
    const copy = [...requests.requests];
    const idx = copy.findIndex(request=>request.requestNum == e.target.value);
    const request = copy.find(request=>request.requestNum  == e.target.value);
    if(e.target.value.trim() == "" && e.target.value.length <= 1){
      setsearchedValue(prevState=>({
        ...prevState,
        showSearchedValue: false,
        value: {}
      }));
    }
    if(!request){
      setsearchedValue(prevState=>({
        ...prevState,
        showSearchedValue: !prevState.showSearchedValue,
        value: {}
      }));
    }
    setsearchedValue(prevState=>({
      ...prevState,
      showSearchedValue: !prevState.showSearchedValue,
      value: request,
      idx: idx
    }))
}


const filterData = (e) => {
  if(e.target.name == "sort"){
    setFiltering(prevState=>({
      ...prevState,
      order: !prevState.order
    }));
    if(filtering.order){
      setRequestOrder(requestsOrder.sort((id1, id2)=> id1.requestId < id2.requestId ? -1 : 1));
    }else{
      setRequestOrder(requestsOrder.sort((id1, id2)=> id1.requestId > id2.requestId ? -1 : 1));
    }
  }else if(e.target.name == "canceled"){
    setFiltering(prevState=>({
      ...prevState,
      canceled: !prevState.canceled,
      completed: false,
      shipper: false,
      notCompleted: false,
    }));
    if(!filtering.canceled){
      setRequestOrder(requestsOrder.filter(request=>request.requestStatus == 2));
    }else{
      setRequestOrder([...requests.requests]);
    }
  }else if(e.target.name == "completed"){
    setFiltering(prevState=>({
      ...prevState,
      completed: !prevState.completed,
      canceled: false,
      shipper: false,
      notCompleted: false
    }));
    if(!filtering.completed){
      setRequestOrder(requestsOrder.filter(request=>request.requestStatus == 3));
    }else{
      setRequestOrder([...requests.requests]);
    }
  }else if(e.target.name == "shipper"){
    setFiltering(prevState=>({
      ...prevState,
      shipper: !prevState.shipper,
      completed: false,
      canceled: false,
      notCompleted: false,
    }));
    if(!filtering.shipper){
      setRequestOrder(requestsOrder.filter(request=>request.requestStatus == 1));
    }else{
      setRequestOrder([...requests.requests]);
    }
  }else if(e.target.name == "notCompleted"){
   setFiltering(prevState=>({
      ...prevState,
      notCompleted: !prevState.notCompleted,
      completed: false,
      canceled: false,
      shipper: false,
      }));
      if(!filtering.notCompleted){
      setRequestOrder(requestsOrder.filter(request=>request.requestStatus == 0));
      }else{
      setRequestOrder([...requests.requests]);
      }
  }
}

const toggleModalDetails = (idx) => {
    const tableContainer = document.querySelector('.table-details-container');
    const showInTable = document.querySelector('.modal-container-info');
    setData(null);
    setData(requestsOrder[idx]);
    tableContainer.style.opacity = '0.2';
    dispatch(generalActions.toggleModalDetails());
    if(window.screen.width < 735){
        scrollTo({
        behavior:'smooth',
        top:'500'
        })
    }else{
        scrollTo({
        behavior:'smooth',
        top:'1000'
        })
    }
  }

    return <Fragment>

            <div className="grid-data-details-container">
                <GridData
                icon={<BsHash size={25} color="white" />}
                title="Total numbers of requests"
                link="/en/admin/requests"
                data={requests.requests.length}
                />
            </div>
            <br/> <br />

            <div>
                <div className="sort-option-container">
                <div>
                    <input type="checkbox" id="sort" name="sort" onChange={filterData}/>
                    <label htmlFor="sort">DESC</label>
                </div>
                <div>
                    <input type="checkbox" id="completed" name="completed" checked={filtering.completed ? true : false} onChange={filterData}/>
                    <label htmlFor="completed">Completed</label>
                </div>
                <div>
                    <input type="checkbox" id="shipper" name="shipper" checked={filtering.shipper ? true : false} onChange={filterData} />
                    <label htmlFor="shipper">Shipping</label>
                </div>
                <div>
                    <input type="checkbox" id="canceled" name="canceled" checked={filtering.canceled ? true : false} onChange={filterData} />
                    <label htmlFor="canceled">Canceled</label>
                </div>
                </div>
                <div className="search-input english">
                    <input type="text" maxLength="13" onChange={(e)=>searchRecord(e)} placeholder="Search By Request Number.." inputMode="numeric" className="english-input" />
                </div>
            </div>

            {data !== null &&  <ModalDetails request={true} info={data} setDatas={setData} title={"Request Details"}/> }

            <Table
        headers={TABLE_REQUESTS_HEADERS.map((header) => (
          <th key={header}>{header}</th>
        ))}
        details={true}
      >
        {!searchedValue.showSearchedValue ? requestsOrder.length > 0 && requestsOrder[0].model != null  && requestsOrder.sort().map((request, idx) => {
          return (
            <Fragment key={request.requestId}>
              <tr key={request.requestId}>
                <Td key={request.requestNum} value={request.requestNum}/>
                <Td key={request.model.partNo} value={request.model.partNo}/>
                <Td key={request.model.modelNo} value={request.model.modelNo}/>
                <Td key={request.address.city} value={request.address.city}/>
                <Td key={request.quantity} value={request.quantity}/>
                <Td key={request.field} value={request.field}/>
                <Td key={request.requestStatus} value={request.requestStatus == "0" ? "PENDING" 
                : request.requestStatus == "1" ? "PAID" : request.requestStatus == "2" ? "SHIPPING" : request.requestStatus == "3" ? "COMPLETED" : request.requestStatus == "4" ? "CANCELED" : null}/>
                <Td key={request.finalAmount} 
                value={"SR" + request.finalAmount}/>
                <Td key={request.clients.phone} 
                value={request.clients.name}/>
                <Td value= {<Button disabled={generalReducer.toggleModalDetails ? true : false} onClick={()=>toggleModalDetails(idx)}>Show</Button>} />
              </tr>
            </Fragment>
          );
        }) : searchedValue.value && <Fragment>
            <tr key={searchedValue.value.requestId}>
                <Td key={searchedValue.value.requestNum} value={searchedValue.value.requestNum}/>
                <Td key={searchedValue.value.model.partNo} value={searchedValue.value.model.partNo}/>
                <Td key={searchedValue.value.model.modelNo} value={searchedValue.value.model.modelNo}/>
                <Td key={searchedValue.value.address.city} value={searchedValue.value.address.city}/>
                <Td key={searchedValue.value.quantity} value={searchedValue.value.quantity}/>
                <Td key={searchedValue.value.field} value={searchedValue.value.field}/>
                <Td key={searchedValue.value.requestStatus} value={searchedValue.value.requestStatus == "0" ? "PENDING" 
                : searchedValue.value.requestStatus == "1" ? "PAID" : searchedValue.value.requestStatus == "2" ? "SHIPPING" : searchedValue.value.requestStatus == "3" ? "COMPLETED" : searchedValue.value.requestStatus == "4" ? "CANCELED" : null}/>
                <Td key={searchedValue.value.finalAmount} 
                value={"SR" + searchedValue.value.finalAmount}/>
                <Td key={searchedValue.value.clients.phone} 
                value={searchedValue.value.clients.name}/>
                <Td value= {<Button disabled={generalReducer.toggleModalDetails ? true : false} onClick={()=>toggleModalDetails(searchedValue.idx)}>Show</Button>} />
            </tr>
        
      </Fragment>
          }
      </Table>
    
    
    
    
    </Fragment>




}

export default RequestsDashboard