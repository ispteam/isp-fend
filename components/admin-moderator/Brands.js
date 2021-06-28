import { Fragment, useEffect, useRef} from "react";
import Table from "../reusable/Table/Table";
import classes from "../reusable/reusable-style.module.css";
import { useDispatch, useSelector } from "react-redux";
import GridLayout from "../reusable/GridLayout";
import GridList from "../reusable/GridList";
import {validateAccountsInput,} from "../../helper/functions";
import { Menu, Dropdown, Modal, Form, Button as BBT} from "semantic-ui-react";
import { useState } from "react";
import Input from "../reusable/Input/input";
import Button from "../reusable/Button/Button";
import {BsHash} from "react-icons/bs";
import SearchInput from "../reusable/Input/SearchInput";
import Td from "../reusable/Table/Td";
import brandsActions from "../../stores/actions/brandsActions";
import { getSession } from "next-auth/client";

const TABLE_BRANDS_HEADERS = ["ID", "Brand Name", "Brand Name(AR)"];

const BrandsDashboard = ({token}) => {

      /**
     * ======================
     * NOTE: IF THERE IS NO COMMENT IN ANY FUNCTION, OR ANY THING RELATED THAT IS MEAN IT WAS EXPLAINED IN THE SUPPLIERS COMPONENT
     * ======================
     */

  const brands = useSelector((state) => state.brandsReducer);
  const [brandsOrder, setBrandsOrder] = useState([]);
  const [session, setSession] = useState();
  const generalReducer = useSelector((state) => state.generalReducer); 
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const [filtering, setFiltering] = useState({
      order: false,
  });
  const [status, setStatus] = useState({
      sending: false,
      succeed:false,
      manage:null,
      text: "",
      show: false,
    });
    const [editMood, setEditMood] = useState(null);
    const [validation, setValidation] = useState({
        values: [],
    });
    const [searchedValue, setsearchedValue] = useState({
        showSearchedValue: false,
        value: {}
    });
    
    const brandNameRef = useRef();
    const brandNameArabicRef = useRef();

useEffect(async()=>{
  const session = await getSession();
  setSession(session);
},[])

 useEffect(()=>{
    setBrandsOrder(brands.brands);
 },[brands.brands])


 const switchToEditable = (brandId) => {
    const brand = brands.brands.find(
      (brand) => brand.brandId == brandId
    );
    if (!brand) {
      setShow(false);
    }
    setEditMood(brand);
    setShow(true);
  };

  const changeHandler = (e) => {
    setEditMood((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const changeValidationState = (value) => {
    if(typeof(value) != "string"){
        setValidation((prevState) => ({
            ...prevState,
              values: value
          }));
    }
    setValidation((prevState) => ({
      ...prevState,
        values: prevState.values.concat(value)
    }));
  };

  const emptyState = () => {
    setValidation({
        values: [],
    });
    setStatus(prevState=>({
        ...prevState,
        sending: false,
        succeed:false,
        text:"",
        show: false
    }));
  };

  const submitHandler = async (newBrand) => {
    try {
      emptyState();
      setStatus(prevState=>({
          ...prevState,
          sending:true,
          text: "sending..."
      }));
      let data;
      const validateBrandNameMessage = validateAccountsInput(editMood.brandName || brandNameRef.current.value ,false,true,false,false,false);
      const validateBrandNameArabicMessage = validateAccountsInput(editMood.brandNameInArabic || brandNameArabicRef.current.value,true,false,false,false,false);
      if (validateBrandNameMessage.length > 0) {
        changeValidationState(validateBrandNameMessage);
      }
      if (validateBrandNameArabicMessage.length > 0) {  
        changeValidationState(validateBrandNameArabicMessage);
      }
    
      if (
        validateBrandNameMessage.length > 0 ||
        validateBrandNameArabicMessage.length > 0 
      ) {
        setStatus(prevState=>({
            ...prevState,
            sending: false,
            text:"",
            show: true
        }));
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
                brandName: brandNameRef.current.value,
                brandNameInArabic: brandNameArabicRef.current.value,
            }),
        });
       }else{
           data = await fetch(`${generalReducer.ENDPOINT}/brand/brand-operations/${editMood.brandId}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              "Authorization": token
            },
            body: JSON.stringify({
              uid: session.user.name.id,
              brandId: editMood.brandId,  
              brandName: editMood.brandName,
              brandNameInArabic: editMood.brandNameInArabic,
            }),
          });
       }
      const response = await data.json();
      if (response.statusCode !== 200 && response.statusCode !== 201) {
        let fullResponse;
        for(const keys in response){
            if(keys=="message"){
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
            ...editMood,
            brandId: response.brandId
        }));
      }else{
          dispatch(brandsActions.updatebrand(editMood));
      }
      changeValidationState(response.message);
      setStatus(prevState=>({
        ...prevState,
        show:true,
        sending:false,
        succeed:true,
        text:"" 
      }));
      brandNameRef.current.value = "";
      brandNameArabicRef.current.value = "";
      setTimeout(()=>{
            emptyState();
      }, 3000)
    } catch (err) {
        changeValidationState(err.message)
        setStatus(prevState=>({
            ...prevState,
            sending:false,
            text:"",
            show: true,
        }));
    }
  };

  const removeHandler = async (brandId) => {
    try{
        emptyState();
        setEditMood(brandId);
        setStatus(prevState=>({
            ...prevState,
            sending:true,
            text: "deleting..."
        }))
        const data = await fetch(`${generalReducer.ENDPOINT}/brand/brand-operations/${brandId}`, {
        method: "DELETE",
        headers:{
            "Content-Type": "application/json",
            "Authorization": token
        },
        body: JSON.stringify({
            uid: session.user.name,
            brandId: brandId
        })
        });
        const response = await data.json();
        if (response.statusCode !== 200 && response.statusCode !== 201) {
        const error = new Error(response.message);
        throw error;
        }
        dispatch(brandsActions.removebrand(brandId));
        changeValidationState(response.message);
        setStatus(prevState=>({
            ...prevState,
            show:true,
            sending:false,
            succeed:true,
            text:"" 
        }))
        setTimeout(()=>{
            emptyState();
        }, 3000)
    } catch (err) {
        changeValidationState(err.message)
        setStatus(prevState=>({
            ...prevState,
            show: true,
        }));
    }
  }


  const cancelEditMood = () =>{
    setShow(false);
    setEditMood(null);
  }


  const searchRecord = (e) =>{
      const copy = [...brands.brands];
      const brand = copy.find(brand=>brand.brandName  == e.target.value);
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
        value: brand
      }))
  }


  const filterData = () => {
    setFiltering(prevState=>({
      ...prevState,
      order: !prevState.order
    }));
    if(filtering.order){
      setBrandsOrder(brandsOrder.sort((id1, id2)=> id1.brandId < id2.brandId ? -1 : 1));
    }else{
      setBrandsOrder(brandsOrder.sort((id1, id2)=> id1.brandId > id2.brandId ? -1 : 1));
    }
  }








  return (
    <GridLayout>

    <Modal
    size={'tiny'}
    open= {status.show}
    onClose={() => setStatus(prevState=>({...prevState, show:false}))}>
        <Modal.Header>Information!</Modal.Header>
        <Modal.Content>
            <ol>
                {!status.succeed ? validation.values.map(value=>(
                    <li key={value} className="text-red-600 p-4 text-xl md:text-lg">{value}</li>
                ))
                : validation.values.map(value=>(
                    <li key={value} className="text-green-600 text-xl p-4">{value}</li>
                ))
                }
           </ol>
        </Modal.Content>
    </Modal>



    <div className="ml-12 md:ml-96 md:mb-28">
        <GridList
        icon={<BsHash size={25} color="white" />}
        title="Total numbers of registered brands"
        style="grid-list-gray-style"
        link="/en/admin/brands"
        children={brands.brands.length}
        titleStyle={classes.titleStyle}
        cardContainerSyle={classes.cardContainerRectangleDetails}
        />
    </div>

    <Form className="absolute top-5 left-16 mb-14 md:relative md:w-1/2 md:ml-40 md:mb-16">
        <Form.Field>
        <label>Brand Name English</label>
        <input placeholder='Brand Name English' name="brandName" onChange={(e)=>changeHandler(e)} ref={brandNameRef} />
        </Form.Field>
        <Form.Field>
        <label>Brand Name Arabic</label>
        <input placeholder='Brand Name Arabic' name="brandNameInArabic" onChange={(e)=>changeHandler(e)} ref={brandNameArabicRef} />
        </Form.Field>
        <BBT disabled={status.sending ? true : false} positive onClick={()=>submitHandler(true)}>{status.sending ? status.text : "Add brand"}</BBT>
    </Form>

    <div className="flex flex-row justify-between items-center md:justify-evenly">
    <div className="flex flex-row items-center pb-6">
    <Input type="checkbox" id="sort" onChange={filterData}/>
      <label htmlFor="sort" className="font-Raleway text-xl ml-3 md:text-lg">DESC</label>
    </div>
    <div className="w-4/5 md:w-1/3">
      <SearchInput type="text" maxLength="13" onChange={(e)=>searchRecord(e)} icon="search" placeholder="Search By brand name.."/>
    </div>
  </div>

    <Table
        headers={TABLE_BRANDS_HEADERS.map((header) => (
          <th key={header}>{header}</th>
        ))}
        style={show ? classes.brandTable : classes.brandTable}
      >
        {!searchedValue.showSearchedValue ? brandsOrder.map((brand) => {
          return (
            <Fragment>
              <tr key={brand.brandId}>
                <Td key={brand.brandId} value={brand.brandId}/>
                <Td key={brand.brandName} value={brand.brandName}/>
                <Td key={brand.brandNameInArabic} value={brand.brandNameInArabic}/>
                <Td className={classes.tdAction} value={<Menu.Menu position="right">
                    <Dropdown item text="actions" disabled ={status.sending && editMood.brandId == brand.brandId ? true : false}>
                        <Dropdown.Menu>
                        <Dropdown.Item
                            onClick={() => switchToEditable(brand.brandId)}
                        >
                            Edit
                        </Dropdown.Item>
                        <Dropdown.Item 
                        onClick={()=>removeHandler(brand.brandId)} 
                        >Remove</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                    </Menu.Menu>}/>
              </tr>
              {show && editMood.brandId == brand.brandId && (
                <Fragment>
                  <tr key={brand.brandId}>
                    <Td value={<Input type="text" value={editMood.brandName} required name="brandName" minLength="2" maxLength="30" 
                      onChange={(e) => changeHandler(e)}/>}/>
                    <Td value={<Input type="text" value={editMood.brandNameInArabic} minLength="2" maxLength="30" required name="brandNameInArabic" 
                    onChange={(e) => changeHandler(e)}/>}/>
                    <Td value={<Button disabled = {status.sending && editMood.brandId == brand.brandId ? true : false } 
                    text={status.sending && editMood.brandId == brand.brandId ? status.text : "Update" } submit={true} onClick={()=>submitHandler(false)}/>}/>
                    <Td value={<Button disabled = {status.sending && editMood.brandId == brand.brandId ? true : false } text="Cancel" cancel={true} 
                    onClick={cancelEditMood}
                    />}/>
                  </tr>
                </Fragment>
              )}
            </Fragment>
          );
        }) : searchedValue.value && <Fragment>
        <tr key={searchedValue.value.brandId}>
        <td>{searchedValue.value.brandId}</td>
        <Td value={searchedValue.value.brandName}/>
        <Td value={searchedValue.value.brandNameInArabic}/>
        <Td className={classes.tdAction} value={<Menu.Menu position="right">
        <Dropdown item text="actions" disabled ={status.sending && editMood.brandId == searchedValue.value.brandId ? true : false}>
            <Dropdown.Menu>
            <Dropdown.Item
                onClick={() => switchToEditable(searchedValue.value.brandId)}
            >
                Edit
            </Dropdown.Item>
            <Dropdown.Item 
            onClick={()=>removeHandler(brand.brandId)} 
            >Remove</Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
        </Menu.Menu>}/>
      </tr>
      {show &&  searchedValue.value.brandId == editMood.brandId && (
        <Fragment>
        <tr key={searchedValue.value.brandId}>
        <Td value={<Input type="text" value={editMood.brandName} required name="brandName" minLength="2" maxLength="30" 
        onChange={(e) => changeHandler(e)}/>}/>
        <Td value={<Input type="text" value={editMood.brandNameInArabic} minLength="2" maxLength="30" required name="brandNameInArabic" 
        onChange={(e) => changeHandler(e)}/>}/>
        <Td value={<Button disabled = {status.sending && editMood.brandId == searchedValue.value.brandId ? true : false } 
        text={status.sending && editMood.brandId == searchedValue.value.brandId ? status.text : "Update" } submit={true} onClick={()=>submitHandler(false)}/>}/>
        <Td value={<Button disabled = {status.sending && editMood.brandId == searchedValue.value.brandId ? true : false } text="Cancel" cancel={true} 
        onClick={cancelEditMood}
        />}/>
      </tr>
      </Fragment>
      ) }
        
      </Fragment>
      
    
          }
      </Table>
      
      
    </GridLayout>
  );
};

export default BrandsDashboard;
