import { Fragment, useEffect} from "react";
import {useRouter} from 'next/router';
import Table from "../reusable/Table/Table";
import classes from "../reusable/reusable-style.module.css";
import { useSelector } from "react-redux";
import GridLayout from "../reusable/GridLayout";
import GridList from "../reusable/GridList";
import { useState } from "react";
import Input from "../reusable/Input/input";
import {BsHash} from "react-icons/bs";
import SearchInput from "../reusable/Input/SearchInput";
import Td from "../reusable/Table/Td";

const TABLE_REQUESTS_HEADERS = ["ID", "Part NO", "Model No" ,"To", "Qty", "Field", "Status", "Price" ,"Owner"];

const RequestsDashboard = ({token, moderator}) => {
  const router = useRouter();
  const requests = useSelector((state) => state.requestsReducer);
  const [requestsOrder, setRequestOrder] = useState([]);
  const [filtering, setFiltering] = useState({
    order: false,
    canceled: false,
    completed: false,
    shipper: false,
    notCompleted: false,
    });

  const [searchedValue, setsearchedValue] = useState({
    showSearchedValue: false,
    value: {}
  });

useEffect(()=>{
    setRequestOrder(requests.requests);
}, [requests.requests])


const navigateToDetails = (requestId) => {
  if(moderator){
    router.push(`/en/moderator/requests/${requestId}`)
    return;
  }
  router.push(`/en/admin/requests/${requestId}`)
}


const searchRecord = (e) =>{
      const copy = [...requests.requests];
      const request = copy.find(request=>request.model.partNo  == e.target.value.toUpperCase());
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
        value: request
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



  return (
    <GridLayout>


    <div className="ml-12 md:ml-96 md:mb-28">
        <GridList
        icon={<BsHash size={25} color="white" />}
        title="Total numbers of registered requests"
        style="grid-list-gray-style"
        link="/en/admin/requests"
        children={requests.requests.length}
        titleStyle={classes.titleStyle}
        cardContainerSyle={classes.cardContainerRectangleDetails}
        />
    </div>

    <div className="flex flex-col md:justify-evenly">
    <div className="self-center">
      <SearchInput type="text" maxLength="13" onChange={(e)=>searchRecord(e)} icon="search" placeholder="Search By Part Number.."/>
    </div>
    <div className="flex flex-row justify-evenly md:justify-evenly pb-6 mt-7">
       <div className="flex flex-row items-center pb-6 ml-5 md:ml-0">
        <Input type="checkbox" id="sort" name="sort" onChange={filterData}/>
        <label htmlFor="sort" className="font-Raleway text-xl ml-3 md:text-lg">DESC</label>
      </div>
       <div className="flex flex-row items-center pb-6 ml-5 md:ml-0">
        <Input type="checkbox" id="completed" name="completed" checked={filtering.completed ? true : false} onChange={filterData}/>
        <label htmlFor="completed" className="font-Raleway text-xl ml-3 md:text-lg">Completed</label>
      </div>
       <div className="flex flex-row items-center pb-6 ml-5 md:ml-0">
        <Input type="checkbox" id="Not completed" name="notCompleted" checked={filtering.notCompleted ? true : false} onChange={filterData}/>
        <label htmlFor="Not completed" className="font-Raleway text-xl ml-3 md:text-lg">Not completed</label>
      </div>
       <div className="flex flex-row items-center pb-6 ml-5 md:ml-0">
        <Input type="checkbox" id="shipper" name="shipper" checked={filtering.shipper ? true : false} onChange={filterData} />
        <label htmlFor="shipper" className="font-Raleway text-xl ml-3 md:text-lg">Shipping</label>
      </div>
       <div className="flex flex-row items-center pb-6 ml-5 md:ml-0">
        <Input type="checkbox" id="canceled" name="canceled" checked={filtering.canceled ? true : false} onChange={filterData} />
        <label htmlFor="canceled" className="font-Raleway text-xl ml-3 md:text-lg">Canceled</label>
      </div>
    </div>
  </div>

    <Table
        headers={TABLE_REQUESTS_HEADERS.map((header) => (
          <th key={header}>{header}</th>
        ))}
        style={classes.detailsTable}
      >
        {!searchedValue.showSearchedValue ? requestsOrder.sort().map((request) => {
          return (
            <Fragment>
              <tr key={request.requestId}>
                <Td key={request.requestId} value={request.requestId}/>
                <Td value={request.model.partNo} onClick={()=>navigateToDetails(request.requestId)}/>
                <Td value={request.model.modelNo} onClick={()=>navigateToDetails(request.requestId)}/>
                <Td value={request.address.city}/>
                <Td value={request.quantity}/>
                <Td value={request.field}/>
                <Td value={request.requestStatus == "0" ? "PENDING" 
                : request.requestStatus == "1" ? "SHIPPING" : request.requestStatus == "2" ? "CANCELED" : request.requestStatus == "3" ? "COMPLETED" : null}/>
                <Td key={request.finalAmount} value={"SR" + request.finalAmount}/>
                <Td key={request.clients.phone} value={request.clients.name}/>
              </tr>
            </Fragment>
          );
        }) : searchedValue.value && <Fragment>
        <tr key={searchedValue.value.requestId}>
        <Td  value={searchedValue.value.requestId}/>
        <Td  value={searchedValue.value.model.partNo} onClick={()=>navigateToDetails(searchedValue.value.requestId)}/>
        <Td  value={searchedValue.value.model.modelNo} onClick={()=>navigateToDetails(searchedValue.value.requestId)}/>
        <Td  value={searchedValue.value.address.city}/>
        <Td  value={searchedValue.value.quantity}/>
        <Td value={searchedValue.value.field}/>
        <Td value={searchedValue.value.requestStatus == "0" ? "PENDING" 
        : searchedValue.value.requestStatus == "1" ? "SHIPPING" : searchedValue.value.requestStatus == "2" ? "CANCELED" : searchedValue.value.requestStatus == "3" ? "COMPLETED" : null}/>
        <Td  value={"SR" + searchedValue.value.finalAmount}/>
        <Td value={searchedValue.value.clients.phone}/>
      </tr>

        
      </Fragment>
      
    
          }
      </Table>
      
      
    </GridLayout>
  );
};

export default RequestsDashboard;
