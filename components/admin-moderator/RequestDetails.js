import GridLayout from "../reusable/GridLayout";
import Spinner from "../reusable/Spinner/Spinner";
import classes from '../reusable/reusable-style.module.css';
import {Table} from 'semantic-ui-react';

const RequestInformation = ({request, token}) => {

    if(!request){
        return <GridLayout>
            <Spinner/>
        </GridLayout>
    }

    const createdAt = new Date(request.created_at).toLocaleDateString('en-US', {
        year:'numeric',
        month: 'short',
        day: 'numeric'
    });


    
    

return <div className="ml-14 mb-36">
        <div className={request.requestStatus == "0" ? "request-status-style text-red-600" 
        : request.requestStatus == "1" ? "request-status-style text-blue-600" 
        : request.requestStatus == "2" ? "request-status-style text-pink-600" 
        : request.requestStatus == "3" ? "request-status-style text-green-600" 
        : null}>
            <h1>{request.requestStatus == "0" ? "PENDING" 
            : request.requestStatus == "1" ? "SHIPPING" 
            : request.requestStatus == "2" ? "CANCELED" 
            : request.requestStatus == "3" ? "COMPLETED" 
            : null}</h1>
        </div>
    <GridLayout>
        <div className="w-full mt-10 ml-5 md:ml-0">
        <Table color={'green'} className={classes.tableContainerInformation}>
        <Table.Header>
            <Table.Row>
                <Table.HeaderCell className={classes.theader}>ID</Table.HeaderCell>
                <Table.Cell textAlign='center'>{request.requestId}</Table.Cell>
            </Table.Row>
            <Table.Row>
                <Table.HeaderCell className={classes.theader}>Created At</Table.HeaderCell>
                <Table.Cell textAlign='center'>{createdAt}</Table.Cell>
            </Table.Row>
            <Table.Row>
                <Table.HeaderCell className={classes.theader}>Description</Table.HeaderCell>
                <Table.Cell textAlign='center'>{request.description}</Table.Cell>
            </Table.Row>
            <Table.Row>
                <Table.HeaderCell className={classes.theader}>Owner</Table.HeaderCell>
                <Table.Cell textAlign='center'>{request.clients.name}</Table.Cell>
            </Table.Row>
            <Table.Row>
                <Table.HeaderCell className={classes.theader}>Phone Number</Table.HeaderCell>
                <Table.Cell textAlign='center'>{request.clients.phone}</Table.Cell>
            </Table.Row>
            <Table.Row>
                <Table.HeaderCell className={classes.theader}>Email</Table.HeaderCell>
                <Table.Cell textAlign='center'>{request.clients.email}</Table.Cell>
            </Table.Row>
            <Table.Row>
                <Table.HeaderCell className={classes.theader}>In Charge Supplier</Table.HeaderCell>
                <Table.Cell textAlign='center'>{request.suppliers != null? request.suppliers.name : "NOT ASSIGNED YET"}</Table.Cell>
            </Table.Row>
            <Table.Row>
                <Table.HeaderCell className={classes.theader}>Supplier Phone Number</Table.HeaderCell>
                <Table.Cell textAlign='center'>{request.suppliers != null? request.suppliers.phone : "NOT ASSIGNED YET"}</Table.Cell>
            </Table.Row>
            <Table.Row>
                <Table.HeaderCell className={classes.theader}>Supplier Email</Table.HeaderCell>
                <Table.Cell textAlign='center'>{request.suppliers != null? request.suppliers.email : "NOT ASSIGNED YET"}</Table.Cell>
            </Table.Row>
            <Table.Row>
                <Table.HeaderCell className={classes.theader}>Part Number</Table.HeaderCell>
                <Table.Cell textAlign='center'>{request.model.partNo}</Table.Cell>
            </Table.Row>
            <Table.Row>
                <Table.HeaderCell className={classes.theader}>Model Number</Table.HeaderCell>
                <Table.Cell textAlign='center'>{request.model.modelNo}</Table.Cell>
            </Table.Row>
            <Table.Row>
                <Table.HeaderCell className={classes.theader}>Country</Table.HeaderCell>
                <Table.Cell textAlign='center'>{request.address.country}</Table.Cell>
            </Table.Row>
            <Table.Row>
                <Table.HeaderCell className={classes.theader}>To City</Table.HeaderCell>
                <Table.Cell textAlign='center'>{request.address.city}</Table.Cell>
            </Table.Row>
            <Table.Row>
                <Table.HeaderCell className={classes.theader}>Quantity</Table.HeaderCell>
                <Table.Cell textAlign='center'>{request.quantity}</Table.Cell>
            </Table.Row>
            <Table.Row>
                <Table.HeaderCell className={classes.theader}>Price</Table.HeaderCell>
                <Table.Cell textAlign='center'>{"SR" + request.finalAmount}</Table.Cell>
            </Table.Row>
            <Table.Row>
                <Table.HeaderCell className={classes.theader}>Field</Table.HeaderCell>
                <Table.Cell textAlign='center'>{request.field}</Table.Cell>
            </Table.Row>
            <Table.Row>
                <Table.HeaderCell className={classes.theader}>Brand</Table.HeaderCell>
                <Table.Cell textAlign='center'>{request.brands.brandName}</Table.Cell>
            </Table.Row>
        </Table.Header>

        </Table>
        
        </div>

    </GridLayout>
    
    </div>
}


export default RequestInformation;