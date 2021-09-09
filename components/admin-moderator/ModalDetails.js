import Feedback from "../../components/reusable/Feedback";
import { Fragment, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import generalActions from "../../stores/actions/generalActions";

const ModalDetails = ({client ,supplier, brands, request ,info, title, update, remove, manageSupplier, acceptUpdate, rejectUpdate, setDatas}) => {
    const generalReducer = useSelector(state=>state.generalReducer);
    const [data, setData] = useState(info);
    const dispatch= useDispatch();

    const changeHandler = (e) => {
        setData(prevState=>({
            ...prevState,
            [e.target.name]: e.target.value,
            account:{
                ...prevState.account,
                [e.target.name]: e.target.value
            }
        }))
    }

    let createdAt;

    if(request){
       createdAt = new Date(data.created_at).toLocaleDateString('en-US', {
            year:'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    const closeModal = () => {
        const tableContainer = document.querySelector('.table-details-container');
        dispatch(generalActions.toggleModalDetails());
        dispatch(generalActions.emptyState());
        tableContainer.style.opacity = '1';
        setDatas(null)
    }

    return <div className={generalReducer.toggleModalDetails ? "modal-container-info show-in-table animate__bounceInDown" : "modal-container-info"}>
        <div className="header-modal-container">
            <h3 className="login-title english" style={{fontSize:'18px'}}>{title}</h3>
        </div>
        <form className="form-modal-details">
            {brands ?
                <Fragment>
                  <div className={"form-inner-container english"}>
                        <label className={"english"} style={{fontSize:'15px'}}>Brand Name</label>
                        <input type="text" name="brandName" value={data.brandName} onChange={(e)=>changeHandler(e)}/>
                    </div>
                    <div className={"form-inner-container english"}>
                        <label className={"english"} style={{fontSize:'15px'}}>Brand Name Arabic</label>
                        <input type="text" name="brandNameInArabic" value={data.brandNameInArabic} onChange={(e)=>changeHandler(e)}/>
                    </div>
                    <div className={"form-inner-container english"}>
                    <select onChange={(e)=>changeHandler(e)} style={{display:'flex', alignSelf:'center'}} name="field">
                        <option value="cars" selected={data.field == "cars" ? true : false}>Cars</option>
                        <option value="big vehicles" selected={data.field == "big vehicles" ? true : false}>Big Vehicles</option>
                    </select>
                    </div>
                </Fragment>
                : client ? <Fragment>
                    <div className={"form-inner-container english"}>
                        <label className={"english"} style={{fontSize:'15px'}}>Email</label>
                        <input type="email" name="email" value={data.account.email} onChange={(e)=>changeHandler(e)}/>
                    </div>
                    <div className={"form-inner-container english"}>
                        <label className={"english"} style={{fontSize:'15px'}}>Name</label>
                        <input type="text" name="name" value={data.account.name} onChange={(e)=>changeHandler(e)}/>
                    </div>
                    <div className={"form-inner-container english"}>
                        <label className={"english" } style={{fontSize:'15px'}}>Phone</label>
                        <input type="text" name="phone" value={data.account.phone} onChange={(e)=>changeHandler(e)} inputMode='tel'/>
                    </div>
                </Fragment>
                : supplier ? 
                    <Fragment>
                        <div className={"form-inner-container english"}>
                            <label className={"english"} style={{fontSize:'15px'}}>Email</label>
                            <input type="email" name="email" value={data.account.email} onChange={(e)=>changeHandler(e)}/>
                        </div>
                        <div className={"form-inner-container english"}>
                            <label className={"english"} style={{fontSize:'15px'}}>Name</label>
                            <input type="text" name="name" value={data.account.name} onChange={(e)=>changeHandler(e)}/>
                        </div>
                        <div className={"form-inner-container english"}>
                            <label className={"english" } style={{fontSize:'15px'}}>Phone</label>
                            <input type="text" name="phone" value={data.account.phone} onChange={(e)=>changeHandler(e)} inputMode='tel'/>
                        </div>
                        <div className={"form-inner-container english" }>
                            <label className="english"  style={{fontSize:'15px'}}>Company/Shop Name In English</label>
                            <input type="text" name="companyInEnglish" value={data.companyInEnglish} onChange={(e)=>changeHandler(e)}/>
                        </div>
                        <div className="form-inner-container english" >
                            <label className="english" style={{fontSize:'15px'}}>Comapny/Shop Name In Arabic</label>
                            <input type="text" name="companyInArabic" value={data.companyInArabic} onChange={(e)=>changeHandler(e)}/>
                        </div>
                        {/* <div className={!arabic ? "form-inner-container english" : "form-inner-container"}>
                            <label className={!arabic ? "english" : ''} style={{fontSize:'15px'}}>{!arabic ? 'Requests completed time' : 'عدد الطلبات المكتلمة'}</label>
                            <input type="text" name="completedRequests" disabled={true} value={data.cancelTimes} onChange={(e)=>changeHandler(e)}/>
                        </div> */}
                        <div className="form-inner-container english" >
                            <label className="english" style={{fontSize:'15px'}}>Requests cancelations time</label>
                            <input type="text" name="cancelationsTime" disabled={true} value={data.cancelTimes} onChange={(e)=>changeHandler(e)}/>
                        </div>
                    </Fragment>
                :<Fragment>
                <div>
                <h2 className="english" style={{color:data.requestStatus == "0" ? "#dc268a" 
                : data.requestStatus == "1" ? "#2563eb" 
                : data.requestStatus == "2" ? "#059669" 
                : data.requestStatus == "3" ? "#7c3aed" 
                : data.requestStatus == "4" ? "#db2777"  :null, textAlign:'center'}}>
                {data.requestStatus == "0" ? "PENDING" 
                    : data.requestStatus == "1" ? "SHIPPING" 
                    : data.requestStatus == "2" ? "CANCELED" 
                    : data.requestStatus == "3" ? "COMPLETED" 
                    : data.requestStatus == "4" ? "PAID" : null}</h2>
                </div>
                <form>
                    <div className={"form-inner-container english"}>
                        <label className={"english"} style={{fontSize:'15px'}}>Created At</label>
                        <input type="text" disabled={true} value={createdAt}/>
                    </div>
                    <div className={"form-inner-container english"}>
                        <label className={"english"} style={{fontSize:'15px'}}>Description</label>
                        <input type="text" disabled={true} value={data.description}/>
                    </div>
                    <div className={"form-inner-container english"}>
                        <label className={"english"} style={{fontSize:'15px'}}>Part Number</label>
                        <input type="text" disabled={true} value={data.model.partNo}/>
                    </div>
                    <div className={"form-inner-container english"}>
                        <label className={"english"} style={{fontSize:'15px'}}>Model Name</label>
                        <input type="text" disabled={true} value={data.model.modelNo}/>
                    </div>
                    <div className={"form-inner-container english"}>
                        <label className={"english"} style={{fontSize:'15px'}}>Model Year</label>
                        <input type="text" disabled={true} value={data.model.year != null ? data.model.year : "-"}/>
                    </div>
                    <div className={"form-inner-container english"}>
                        <label className={"english"} style={{fontSize:'15px'}}>Quantity</label>
                        <input type="text" disabled={true} value={data.quantity}/>
                    </div>
                    <div className={"form-inner-container english"}>
                        <label className={"english"} style={{fontSize:'15px'}}>Price</label>
                        <input type="text" disabled={true} value={"SR" + data.finalAmount}/>
                    </div>
                    <div className={"form-inner-container english"}>
                        <label className={"english"} style={{fontSize:'15px'}}>Field</label>
                        <input type="text" disabled={true} value={data.field}/>
                    </div>
                    <div className={"form-inner-container english"}>
                        <label className={"english"} style={{fontSize:'15px'}}>Brand</label>
                        <input type="text" disabled={true} value={data.brands.brandName}/>
                    </div>
                    <div className={"form-inner-container english"}>
                        <label className={"english"} style={{fontSize:'15px'}}>Owner</label>
                        <input type="text" disabled={true} value={data.clients.name}/>
                    </div>
                    <div className={"form-inner-container english"}>
                        <label className={"english"} style={{fontSize:'15px'}}>Phone</label>
                        <input type="text" disabled={true} value={data.clients.phone}/>
                    </div>
                    <div className={"form-inner-container english"}>
                        <label className={"english"} style={{fontSize:'15px'}}>Email</label>
                        <input type="text" disabled={true} value={data.clients.email}/>
                    </div>
                    <div className={"form-inner-container english"}>
                        <label className={"english"} style={{fontSize:'15px'}}>Supplier</label>
                        <input type="text" disabled={true} value={data.suppliers != null? data.suppliers.name : "NOT ASSIGNED YET" }/>
                    </div>
                    <div className={"form-inner-container english"}>
                        <label className={"english"} style={{fontSize:'15px'}}>Supplier Phone</label>
                        <input type="text" disabled={true} value={data.suppliers != null? data.suppliers.phone : "NOT ASSIGNED YET" }/>
                    </div>
                    <div className={"form-inner-container english"}>
                        <label className={"english"} style={{fontSize:'15px'}}>Shipper</label>
                        <input type="text" disabled={true} value={data.shipperName != null ? data.shipperName : "-"}/>
                    </div>
                    <div className={"form-inner-container english"}>
                        <label className={"english"} style={{fontSize:'15px'}}>Tracking Number</label>
                        <input type="text" disabled={true} value={data.trackingNumber != null ? data.trackingNumber : "-"}/>
                    </div>
                    <div className={"form-inner-container english"}>
                        <label className={"english"} style={{fontSize:'15px'}}>Country</label>
                        <input type="text" disabled={true} value={data.address.country}/>
                    </div>
                    <div className={"form-inner-container english"}>
                        <label className={"english"} style={{fontSize:'15px'}}>City</label>
                        <input type="text" disabled={true} value={data.address.city}/>
                    </div>
                </form>
                </Fragment>
            }
        </form>
            <div className="action-btns-container">
                {!request && 
                <button className="update english" onClick={()=>update(false, null, data)}>Update</button>
                }
                {client ? 
                    <button className="remove english" onClick={()=>remove(data)}>Remove</button>
                : supplier ? 
                    <Fragment>
                        {
                            data.updateRequest == 1 && 
                            <Fragment>
                            <button className="update english" onClick={()=>acceptUpdate(data)}>Accept Update</button>
                            <button className="remove english" onClick={()=>rejectUpdate(data)}>Reject Update</button>
                            </Fragment>
                        }
                        {data.verified == 1 ? 
                            <button className="remove english" onClick={()=>manageSupplier(data.supplierId, false, true, data.account.email)}>Suspend</button>
                        : data.verified == 2 ? 
                            <button className="update english" onClick={()=>manageSupplier(data.supplierId, true, false, data.account.email)}>Verify</button>
                        : null 
                        }
                    </Fragment>
                : null
                }

                <button className="close english" onClick={closeModal}>Close</button>
            </div>
    </div>
}

export default ModalDetails;