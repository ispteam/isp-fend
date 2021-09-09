import { useEffect, useState, Fragment } from "react";
import GridLayout from "../../components/reusable/GridLayout";
import GridData from "../../components/reusable/GridData";
import {
  AiOutlineUserAdd,
  AiOutlineUserDelete,
  AiOutlinePlus,
  AiOutlineCheck,
  AiOutlineClose,
} from "react-icons/ai";
import { BsHash } from "react-icons/bs";
import { FiUserX } from "react-icons/fi";
import Table from "../../components/reusable/Tables";
import { useRouter } from "next/router";
import MyChart from "../../components/reusable/Chart";
import { Bar, Line } from "react-chartjs-2";
import { useDispatch, useSelector } from "react-redux";
import {
  findStatisticsPerMonth,
  formatRecordsAddress,
} from "../../helper/functions";
import Spinner from "../../components/reusable/Spinner/Spinner";
import generalActions from "../../stores/actions/generalActions";

const HEADERS_SET_ONE = ["ID", "Name"];
const HEADERS_SET_TWO = ["ID", "From", "To City"];

const HomePage = ({moderator}) => {

      /**
     * ======================
     * NOTE: IF THERE IS NO COMMENT IN ANY FUNCTION, OR ANY THING RELATED THAT IS MEAN IT WAS EXPLAINED IN THE SUPPLIERS COMPONENT
     * ======================
     */
  const router = useRouter();
  const dispatch = useDispatch();
  const generalReducer = useSelector((state) => state.generalReducer);
  const clients = useSelector((state) => state.clientsReducer);
  const suppliers = useSelector((state) => state.suppliersReducer);
  const requests = useSelector((state) => state.requestsReducer);
  const [isLoading, setIsLoading] = useState(true);

  //To initiate last records state 
  const [lastRecords, setLastRecords] = useState({
    lastClients: null,
    lastApprovedSuppliers: null,
    lastUnapprovedSuppliers: null,
    lastSubmittedRequests: null,
    lastCompletedRequests: null,
    lastCanceledRequests: null,
  });

  const requestsData = findStatisticsPerMonth(requests.requests);
  const suppliersData = findStatisticsPerMonth(suppliers.suppliers);
  const clientsData = findStatisticsPerMonth(clients.clients);

  //To fetch the last records function
  const fetchLastRecords = async () => {
    try {
      setIsLoading(true);
      const data = await fetch(
        `${generalReducer.ENDPOINT}/moderator/last-five-records`
      );
      const response = await data.json();
      if (response.statusCode !== 200 && response.status !== 201) {
        const error = new Error();
        error.message = "Can't fetch data";
      }
      let submittedRequests = response.submittedRequests;
      let completedRequests = response.completedRequests;
      let canceledRequests = response.canceledRequests;

      if (submittedRequests.length > 0) {
        submittedRequests = formatRecordsAddress(response.submittedRequests);
      }
      if (completedRequests.length > 0) {
        completedRequests = formatRecordsAddress(response.completedRequests);
      }
      if (canceledRequests.length > 0) {
        canceledRequests = formatRecordsAddress(response.canceledRequests);
      }

      setLastRecords({
        lastClients: response.clients,
        lastApprovedSuppliers: response.approvedSuppliers,
        lastUnapprovedSuppliers: response.unApprovedSuppliers,
        lastCompletedRequests: completedRequests,
        lastSubmittedRequests: submittedRequests,
        lastCanceledRequests: canceledRequests,
      });
      setIsLoading(false);
    } catch (err) {
      alert(err.message);
    }
  };

  //To store the last records in the state after the component rendered
  useEffect(() => {
    //Check if the last records are empty, so we fetch their information
    dispatch(generalActions.closeNavMenu());
    if (
      lastRecords.lastClients == null &&
      lastRecords.lastApprovedSuppliers == null &&
      lastRecords.lastUnapprovedSuppliers == null &&
      lastRecords.lastSubmittedRequests == null &&
      lastRecords.lastCompletedRequests == null &&
      lastRecords.lastCanceledRequests == null
    ) {
      fetchLastRecords();
    }
  }, []);

//   const goToDetails = (path) => {
//     if(moderator){
//       router.push("/en/moderator/" + path);
//       return;    
//     }
//     router.push("/en/admin/" + path);
//   }; 

  return (
    <div>
      {isLoading ? (
          <Spinner />
      ) : (
        <div className="home-admin-container">
          {/** START THE CHART GRID */}

          <GridLayout chart={
            <MyChart
              Component={Line}
              label="requests"
              title="Numbers of requests per month"
              data={requestsData}
            />
          } />

          {/** END THE CHART GRID */}

          {/** START THE FIRST GRID */}
          <GridLayout>
            {/** START THE FIRST LIST */}
            <GridData
              icon={<AiOutlineUserAdd size={25} color="#ffd523" />}
              title="Last 5 Registered clients"
              link={moderator ? "/en/moderator/clients" : "/en/admin/clients"}
            >
              <Table
                headers={HEADERS_SET_ONE.map((header) => (
                  <th key={header}>{header}</th>
                ))}
              >
                {lastRecords.lastClients.map((list) => (
                  <tr
                    key={list.clientId}
                    onClick={() => goToDetails(`clients/${list.clientId}`)}
                  >
                    <td>{list.clientId}</td>
                    <td>{list.account.name.split(" ")[0]}</td>
                  </tr>
                ))}
              </Table>
            </GridData>
            {/** END THE FIRST LIST */}

            {/** START THE SECOND LIST */}
            <GridData
              icon={<AiOutlineUserDelete size={25} color="#ffd523" />}
              title="Last 5 Registered suppliers"
              link={moderator ? "/en/moderator/suppliers" :"/en/admin/suppliers"}
            >
              <Table
                headers={HEADERS_SET_ONE.map((header) => (
                  <th key={header}>{header}</th>
                ))}
              >
                {lastRecords.lastApprovedSuppliers.map((list) => (
                  <tr
                    key={list.supplierId}
                    onClick={() => goToDetails(`suppliers/${list.supplierId}`)}
                  >
                    <td>{list.supplierId}</td>
                    <td>{list.companyInEnglish.split(" ")[0]}</td>
                  </tr>
                ))}
              </Table>
            </GridData>

            {/** END THE SECOND LIST */}

            {/** START THE THIRD LIST */}

            <GridData
              icon={<FiUserX size={25} color="#ffd523" />}
              title="Last 5 Unapproved suppliers"
              link={moderator ? "/en/moderator/suppliers" : "/en/admin/suppliers" }
            >
              <Table
                headers={HEADERS_SET_ONE.map((header) => (
                  <th key={header}>{header}</th>
                ))}
              >
                {lastRecords.lastUnapprovedSuppliers.map((list) => (
                  <tr
                    key={list.supplierId}
                    onClick={() => goToDetails(`suppliers/${list.supplierId}`)}
                  >
                    <td>{list.supplierId}</td>
                    <td>{list.companyInEnglish.split(" ")[0]}</td>
                  </tr>
                ))}
              </Table>
            </GridData>

            {/** END THE THIRD LIST */}
          </GridLayout>

          {/** END THE FIRST GRID */}

          {/** START THE SECOND GRID */}

          <GridLayout>
            <GridData
              icon={<AiOutlinePlus size={25} color="#ffd523" />}
              title="Last 5 submitted requests"
              link={moderator ? "/en/moderator/requests" : "/en/admin/requests"}
            >
              <Table
                headers={HEADERS_SET_TWO.map((header) => (
                  <th key={header}>{header}</th>
                ))}
              >
                {lastRecords.lastSubmittedRequests.map((list) => (
                  <tr
                    key={list.requestId}
                    onClick={() => goToDetails(`requests/${list.requestId}`)}
                  >
                    <td>{list.requestId}</td>
                    <td>{list.clients.name.split(" ")[0]}</td>
                    <td>{list.address.city}</td>
                  </tr>
                ))}
              </Table>
            </GridData>

            <GridData
              icon={<AiOutlineCheck size={25} color="#ffd523" />}
              title="Last 5 completed requests"
              link={moderator ? "/en/moderator/requests"  : "/en/admin/requests"}
            >
              <Table
                headers={HEADERS_SET_TWO.map((header) => (
                  <th key={header}>{header}</th>
                ))}
              >
                {lastRecords.lastCompletedRequests.map((list) => (
                  <tr
                    key={list.requestId}
                    onClick={() => goToDetails(`requests/${list.id}`)}
                  >
                    <td>{list.requestId}</td>
                    <td>{list.clients.name.split(" ")[0]}</td>
                    <td>{list.address.city}</td>
                  </tr>
                ))}
              </Table>
            </GridData>
            <GridData
              icon={<AiOutlineClose size={25} color="#ffd523" />}
              title="Last 5 canceled requests"
              link={moderator ? "/en/moderator/clients":"/en/admin/clients"}
            >
              <Table
                headers={HEADERS_SET_TWO.map((header) => (
                  <th key={header}>{header}</th>
                ))}
              >
                {lastRecords.lastCanceledRequests.map((list) => (
                  <tr
                    key={list.requestId}
                    onClick={() => goToDetails(`requests/${list.id}`)}
                  >
                    <td>{list.requestId}</td>
                    <td>{list.clients.name.split(" ")[0]}</td>
                    <td>{list.address.city}</td>
                  </tr>
                ))}
              </Table>
            </GridData>
          </GridLayout>

          {/** END THE SECOND GRID */}

          {/** START THE THIRD GRID */}

          <GridLayout>
            <GridData
              icon={<BsHash size={25} color="#ffd523" />}
              title="Total numbers of registered clients"
              link= {moderator ? "/en/admin/clients" : "/en/admin/clients"}
              data={clients.clients.length}
            />
            <GridData
              icon={<BsHash size={25} color="#ffd523" />}
              title="Total numbers of registered suppliers"
              link= {moderator ? "/en/moderator/suppliers" : "/en/admin/suppliers"}
              data={suppliers.suppliers.length}
            />
            <GridData
              icon={<BsHash size={25} color="#ffd523" />}
              title="Total numbers of submitted requests"
              link={moderator ? "/en/moderator/requests" : "/en/admin/requests"}
              data={requests.requests.length}
            />
          </GridLayout>

          {/** START THE CHART GRID */}
          <GridLayout chart={
              <MyChart
              Component={Bar}
              label="suppliers"
              title="Numbers of registered suppliers per month"
              data={suppliersData}
              bgColor={generalReducer.BAR_COLORS}
              brdrColor={generalReducer.BAR_COLORS}
            />
          } />
          {/** START THE CHART GRID */}
          <GridLayout chart={
            <MyChart
              Component={Bar}
              label="clients"
              title="Numbers of registered clients per month"
              data={clientsData}
              bgColor={generalReducer.BAR_COLORS}
              brdrColor={generalReducer.BAR_COLORS}
            />
          }/>

          {/** END THE CHART GRID */}

          {/** END THE THIRD GRID */}
        </div>
      )}
    </div>
  );
};

export default HomePage;
