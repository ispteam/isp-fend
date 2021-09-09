import { Fragment, useEffect, useRef} from "react";
import Table from "../reusable/Tables";
import { useDispatch, useSelector } from "react-redux";
import GridData from "../reusable/GridData";
import {sendEmail, validateAccountsInput} from "../../helper/functions";
import { useState } from "react";
import {BsHash} from "react-icons/bs";
import Td from "../reusable/Td";
import Button from "../reusable/Button";
import ModalDetails from "./ModalDetails";
import generalActions from "../../stores/actions/generalActions";
import brandsActions from "../../stores/actions/brandsActions";

const TABLE_BRANDS_HEADERS = ["Brand Name", "Brand Name(AR)", "Field", "Details"];

const BrandsDashboard = ({token, session}) => {
    const brands = useSelector((state) => state.brandsReducer);
  const [brandsOrder, setBrandsOrder] = useState([]);
  const generalReducer = useSelector((state) => state.generalReducer); 
  const dispatch = useDispatch();
  const [data, setData] = useState(null);
  const [filtering, setFiltering] = useState({
      order: false,
      cars:false,
      bigVehicles: false
  });

    const [searchedValue, setsearchedValue] = useState({
        showSearchedValue: false,
        value: {},
        idx:''
    });
    
    const brandNameRef = useRef();
    const brandNameArabicRef = useRef();
    const brandField = useRef();


 useEffect(()=>{
    setBrandsOrder(brands.brands);
 },[brands.brands])



  const submitHandler = async (newBrand, e, datas) => {
    try {
      e && e.preventDefault();
      dispatch(generalActions.emptyState());
      dispatch(generalActions.sendRequest(newBrand ? 'Adding..' : 'Updating..'));
      let data;
      let validateBrandNameMessage = null;
      let validateBrandNameArabicMessage = null;
      let validateBrandFieldMessage = null;
      if(newBrand){
        dispatch(generalActions.changeMood("profile"));
        validateBrandNameMessage = validateAccountsInput(brandNameRef.current.value,false,true,false,false,false);
        validateBrandNameArabicMessage = validateAccountsInput(brandNameArabicRef.current.value ,true,false,false,false,false);
        validateBrandFieldMessage = validateAccountsInput(brandField.current.value,false,true,false,false,false);
      }else{
        validateBrandNameMessage = validateAccountsInput(datas.brandName,false,true,false,false,false);
        validateBrandNameArabicMessage = validateAccountsInput(datas.brandNameInArabic ,true,false,false,false,false);
        validateBrandFieldMessage = validateAccountsInput(datas.field,false,true,false,false,false);
      }
      if (validateBrandNameMessage.length > 0) {
        dispatch(generalActions.changeValidation(validateBrandNameMessage));
      }
      if (validateBrandNameArabicMessage.length > 0) {  
        dispatch(generalActions.changeValidation(validateBrandNameArabicMessage));
      }
      if(validateBrandFieldMessage.length>0){
        dispatch(generalActions.changeValidation(validateBrandFieldMessage));
      }
      if (
        validateBrandNameMessage.length > 0 ||
        validateBrandNameArabicMessage.length > 0 ||
        validateBrandFieldMessage.length > 0
      ) {
        dispatch(generalActions.showValidationMessages());
        return;
      }
      if(newBrand){
        data = await fetch(`${generalReducer.ENDPOINT}/brand/brand-operations`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            },
            body: JSON.stringify({
                uid: session.user.name.id,
                brandName: brandNameRef.current.value.toUpperCase(),
                brandNameInArabic: brandNameArabicRef.current.value,
                field: brandField.current.value
            }),
        });
       }else{
           data = await fetch(`${generalReducer.ENDPOINT}/brand/brand-operations/${datas.brandId}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              "Authorization": token
            },
            body: JSON.stringify({
              uid: session.user.name.id,
              brandId: datas.brandId,  
              brandName: datas.brandName.toUpperCase(),
              brandNameInArabic: datas.brandNameInArabic,
            }),
          });
       }
      const response = await data.json();
      if (response.statusCode !== 200 && response.statusCode !== 201) {
        let fullResponse = response.message;
        for(const keys in response){
            if(keys=="validationMessage"){
                for(const key in response[keys]){
                    fullResponse= response[keys][key];
                }
            }
        }
        const error = new Error(fullResponse);
        throw error;
      }
      if(newBrand){
        dispatch(brandsActions.addNewBrand({
            brandId: response.brandId,
            brandName: brandNameRef.current.value.toUpperCase(),
            brandNameInArabic: brandNameArabicRef.current.value,
            field: brandField.current.value
        }));
      }else{
          dispatch(brandsActions.updatebrand(datas));
      }
      dispatch(generalActions.sendRequest(response.message));
      brandNameRef.current.value = "";
      brandNameArabicRef.current.value = "";
      setTimeout(()=>{
            dispatch(generalActions.emptyState());
      }, 3000)
    } catch (err) {
        dispatch(generalActions.changeValidation(err.message));
        dispatch(generalActions.showValidationMessages());
    }
  };

  const removeHandler = async (datas) => {
    try{
        dispatch(generalActions.emptyState());
        dispatch(generalActions.sendRequest('Removing..'));
        const data = await fetch(`${generalReducer.ENDPOINT}/brand/brand-operations/${datas.brandId}`, {
        method: "DELETE",
        headers:{
            "Content-Type": "application/json",
            "Authorization": token
        },
        body: JSON.stringify({
            uid: session.user.name,
            brandId: datas.brandId
        })
        });
        const response = await data.json();
        if (response.statusCode !== 200 && response.statusCode !== 201) {
        const error = new Error(response.message);
        throw error;
        }
        dispatch(brandsActions.removebrand(brandId));
        dispatch(generalActions.sendRequest(response.message));
        setTimeout(()=>{
            dispatch(generalActions.emptyState());
        }, 3000)
    } catch (err) {
        dispatch(generalActions.changeValidation(err.message));
        dispatch(generalActions.showValidationMessages());
    }
  }

  const searchRecord = (e) =>{
      const copy = [...brands.brands];
      const idx = copy.findIndex(brand=>brand.brandName.toUpperCase() == e.target.value.toUpperCase())
      const brand = copy.find(brand=>brand.brandName.toUpperCase()  == e.target.value.toUpperCase());
      if(e.target.value.trim() == "" && e.target.value.length <= 1){
        setsearchedValue(prevState=>({
          ...prevState,
          showSearchedValue: false,
          value: {}
        }));
      }
      if(!brand){
        setsearchedValue(prevState=>({
          ...prevState,
          showSearchedValue: !prevState.showSearchedValue,
          value: {}
        }));
      }
      setsearchedValue(prevState=>({
        ...prevState,
        showSearchedValue: !prevState.showSearchedValue,
        value: brand,
        idx:idx
      }))
  }


  const filterData = (e) => {
    if(e.target.name == "sort"){
      setFiltering(prevState=>({
        ...prevState,
        order: !prevState.order
      }));
      if(filtering.order){
        setBrandsOrder(brandsOrder.sort((id1, id2)=> id1.brandId < id2.brandId ? -1 : 1));
      }else{
        setBrandsOrder(brandsOrder.sort((id1, id2)=> id1.brandId > id2.brandId ? -1 : 1));
      }
    }else if(e.target.name == "cars"){
      setFiltering(prevState=>({
        ...prevState,
        cars: !prevState.cars,
        bigVehicles: false
      }));
      if(!filtering.cars){
        setBrandsOrder(brandsOrder.filter(br=> br.field == "cars"));
      }else{
        setBrandsOrder([...brands.brands]);
      }
    }else if(e.target.name == "bigVehicles"){
      setFiltering(prevState=>({
        ...prevState,
        bigVehicles: !prevState.bigVehicles,
        cars: false
      }));
      if(!filtering.bigVehicles){
        setBrandsOrder(brandsOrder.filter(br=> br.field == "big vehicles"));
      }else{
        setBrandsOrder([...brands.brands]);
      }
    }
  }

  const toggleModalDetails = (idx) => {
    const tableContainer = document.querySelector('.table-details-container');
      setData(null);
      setData(brandsOrder[idx]);
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
        title="Total numbers of brands"
        link="/en/admin/moderators"
        data={brands.brands.length}
        />
    </div>
    <form className= "form-add-brand-container">
        <input type="text" name="brandName" placeholder="Brand Name" className="english-input" ref={brandNameRef}/>
        <input type="text" name="brandNameInArabic" className="english-input"  placeholder="Brand Name Arabic" ref={brandNameArabicRef}/>
        <select name="field" placeholder="Select Field" ref={brandField} style={{display:'flex', alignSelf:'center'}}>
            <option selected disabled value=''>Select Field</option>
            <option value="cars">Cars</option>
            <option value="big vehicles">Big Vehicles</option>
        </select>
        <button onClick={(e)=>submitHandler(true, e)}>Add New Brand</button>
    </form>
    <br/>

    <div>
        <div className="sort-option-container">
           <div>
            <input type="checkbox" id="sort" name="sort" onChange={filterData}/>
            <label htmlFor="sort">DESC</label>
          </div>
           <div>
            <input type="checkbox" id="cars" name="cars" checked={filtering.cars ? true : false} onChange={filterData}/>
            <label htmlFor="cars">Cars</label>
          </div>
           <div>
            <input type="checkbox" id="bigVehicles" name="bigVehicles" checked={filtering.bigVehicles ? true : false} onChange={filterData}/>
            <label htmlFor="bigVehicles">Big Vehicles</label>
          </div>
        </div>
        <div className="search-input english">
            <input type="text" onChange={(e)=>searchRecord(e)} placeholder="Search By Name.." className="english-input"/>
        </div>
      </div>


    <br /> <br />
    {data !== null &&  <ModalDetails setDatas={setData} brands={true} info={data} remove={removeHandler} title={"Manage Brands"} update={submitHandler}/> }
    
    <Table
        headers={TABLE_BRANDS_HEADERS.map((header) => (
          <th key={header}>{header}</th>
        ))}
        details={true}
      >
        {!searchedValue.showSearchedValue ? brandsOrder.length > 0 && brandsOrder.sort().map((brand, idx) => {
          return (
            <Fragment key={brand.brandId}>
              <tr key={brand.brandId}>
                <Td key={brand.brandName} value={brand.brandName}/>
                <Td key={brand.brandNameInArabic} value={brand.brandNameInArabic} className={"font-arabic"}/>
                <Td key={brand.field} value={brand.field}/>
                <Td value= {<Button disabled={generalReducer.toggleModalDetails ? true : false} onClick={()=>toggleModalDetails(idx)}>Show</Button>} />
              </tr>
            </Fragment>
          );
        }) : searchedValue.value && <Fragment>
        <tr key={searchedValue.value.moderatorId}>
            <Td key={searchedValue.value.brandName} value={searchedValue.value.brandName}/>
            <Td key={searchedValue.value.brandNameInArabic} value={searchedValue.value.brandNameInArabic} className={"font-arabic"}/>
            <Td key={searchedValue.value.field} value={searchedValue.value.field}/>
        <Td value= {<Button disabled={generalReducer.toggleModalDetails ? true : false} onClick={()=>toggleModalDetails(searchedValue.idx)}>Show</Button>} />
      </tr>
        
      </Fragment>
      
    
          }
      </Table>



    </Fragment>
}


export default BrandsDashboard;