import { useEffect, useState, Fragment } from "react";
import GridLayout from "../reusable/GridLayout";
import GridList from "../reusable/GridList";
import {
  AiOutlineUserAdd,
  AiOutlineUserDelete,
  AiOutlinePlus,
  AiOutlineCheck,
  AiOutlineClose,
} from "react-icons/ai";
import { BsHash } from "react-icons/bs";
import { FiUserX } from "react-icons/fi";
import Table from "../reusable/Table/Table";
import classes from "../reusable/reusable-style.module.css";
import { useRouter } from "next/router";
import MyChart from "../reusable/charts/Chart";
import { Bar, Line } from "react-chartjs-2";
import { useSelector } from "react-redux";
import {
  findStatisticsPerMonth,
  formatRecordsAddress,
} from "../../helper/functions";
import Spinner from "../reusable/Spinner/Spinner";

const HEADERS_SET_ONE = ["ID", "Name", "Name(AR)"];
const HEADERS_SET_TWO = ["ID", "From", "To City"];

const HomePage = ({moderator}) => {
  const router = useRouter();
  const generalReducer = useSelector((state) => state.generalReducer);
  const clients = useSelector((state) => state.clientsReducer);
  const suppliers = useSelector((state) => state.suppliersReducer);
  const requests = useSelector((state) => state.requestsReducer);
  const [isLoading, setIsLoading] = useState(true);
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

  useEffect(async () => {
    if (
      lastRecords.lastClients == null &&
      lastRecords.lastApprovedSuppliers == null &&
      lastRecords.lastUnapprovedSuppliers == null &&
      lastRecords.lastSubmittedRequests == null &&
      lastRecords.lastCompletedRequests == null &&
      lastRecords.lastCanceledRequests == null
    ) {
      await fetchLastRecords();
    }
  }, []);

  const goToDetails = (path) => {
    alert(moderator)
    if(moderator){
      router.push("/en/moderator/" + path);
      return;    
    }
    router.push("/en/admin/" + path);
  };

  return (
    <div className="ml-14 md:ml-0">
      {isLoading ? (
        <GridLayout>
          <Spinner />
        </GridLayout>
      ) : (
        <Fragment>
          {/** START THE CHART GRID */}

          <GridLayout>
            <MyChart
              Component={Line}
              label="requests"
              title="Numbers of requests per month"
              data={requestsData}
            />
          </GridLayout>

          {/** END THE CHART GRID */}

          {/** START THE FIRST GRID */}
          <GridLayout gridCols="grid-cols-3">
            {/** START THE FIRST LIST */}
            <GridList
              icon={<AiOutlineUserAdd size={25} color="white" />}
              title="Last 5 Registered clients"
              style="grid-list-gray-style"
              link={moderator ? "/en/moderator/clients" : "/en/admin/clients"}
              cardContainerSyle={classes.cardContainer}
            >
              <Table
               style={classes.tableContainer}
                headers={HEADERS_SET_ONE.map((header) => (
                  <th key={header}>{header}</th>
                ))}
              >
                {lastRecords.lastClients.map((list) => (
                  <tr
                    key={list.clientId}
                    className="border-b border-white"
                    onClick={() => goToDetails(`clients/${list.clientId}`)}
                  >
                    <td>{list.clientId}</td>
                    <td>{list.accounts.name.split(" ")[0]}</td>
                    <td>{list.accounts.nameInArabic.split(" ")[0]}</td>
                  </tr>
                ))}
              </Table>
            </GridList>
            {/** END THE FIRST LIST */}

            {/** START THE SECOND LIST */}
            <GridList
              icon={<AiOutlineUserDelete size={25} color="white" />}
              title="Last 5 Registered suppliers"
              style="grid-list-gray-style"
              link={moderator ? "/en/moderator/suppliers" :"/en/admin/suppliers"}
              cardContainerSyle={classes.cardContainer}
            >
              <Table
              style={classes.tableContainer}
                headers={HEADERS_SET_ONE.map((header) => (
                  <th key={header}>{header}</th>
                ))}
              >
                {lastRecords.lastApprovedSuppliers.map((list) => (
                  <tr
                    key={list.supplierId}
                    className="border-b border-white"
                    onClick={() => goToDetails(`suppliers/${list.supplierId}`)}
                  >
                    <td>{list.supplierId}</td>
                    <td>{list.accounts.name.split(" ")[0]}</td>
                    <td>{list.accounts.nameInArabic.split(" ")[0]}</td>
                  </tr>
                ))}
              </Table>
            </GridList>

            {/** END THE SECOND LIST */}

            {/** START THE THIRD LIST */}

            <GridList
              icon={<FiUserX size={25} color="white" />}
              title="Last 5 Unapproved suppliers"
              style="grid-list-gray-style"
              link={moderator ? "/en/moderator/suppliers" : "/en/admin/suppliers" }
              cardContainerSyle={classes.cardContainer}
            >
              <Table
                style={classes.tableContainer}
                headers={HEADERS_SET_ONE.map((header) => (
                  <th key={header}>{header}</th>
                ))}
              >
                {lastRecords.lastUnapprovedSuppliers.map((list) => (
                  <tr
                    key={list.supplierId}
                    className="border-b border-white"
                    onClick={() => goToDetails(`suppliers/${list.supplierId}`)}
                  >
                    <td>{list.supplierId}</td>
                    <td>{list.accounts.name.split(" ")[0]}</td>
                    <td>{list.accounts.nameInArabic.split(" ")[0]}</td>
                  </tr>
                ))}
              </Table>
            </GridList>

            {/** END THE THIRD LIST */}
          </GridLayout>

          {/** END THE FIRST GRID */}

          {/** START THE SECOND GRID */}

          <GridLayout gridCols="grid-cols-3">
            <GridList
              icon={<AiOutlinePlus size={25} color="white" />}
              title="Last 5 submitted requests"
              style="grid-list-gray-style"
              link={moderator ? "/en/moderator/requests" : "/en/admin/requests"}
              cardContainerSyle={classes.cardContainer}
            >
              <Table
              style={classes.tableContainer}
                headers={HEADERS_SET_TWO.map((header) => (
                  <th key={header}>{header}</th>
                ))}
              >
                {lastRecords.lastSubmittedRequests.map((list) => (
                  <tr
                    key={list.requestId}
                    className="border-b border-white"
                    onClick={() => goToDetails(`requests/${list.requestId}`)}
                  >
                    <td>{list.requestId}</td>
                    <td>{list.clients.name.split(" ")[0]}</td>
                    <td>{list.address.city}</td>
                  </tr>
                ))}
              </Table>
            </GridList>

            <GridList
              icon={<AiOutlineCheck size={25} color="white" />}
              title="Last 5 completed requests"
              style="grid-list-gray-style"
              link={moderator ? "/en/moderator/requests"  : "/en/admin/requests"}
              cardContainerSyle={classes.cardContainer}
            >
              <Table
                style={classes.tableContainer}
                headers={HEADERS_SET_TWO.map((header) => (
                  <th key={header}>{header}</th>
                ))}
              >
                {lastRecords.lastCompletedRequests.map((list) => (
                  <tr
                    key={list.requestId}
                    className="border-b border-white"
                    onClick={() => goToDetails(`requests/${list.id}`)}
                  >
                    <td>{list.requestId}</td>
                    <td>{list.clients.name.split(" ")[0]}</td>
                    <td>{list.address.city}</td>
                  </tr>
                ))}
              </Table>
            </GridList>
            <GridList
              icon={<AiOutlineClose size={25} color="white" />}
              title="Last 5 canceled requests"
              style="grid-list-gray-style"
              link={moderator ? "/en/moderator/clients":"/en/admin/clients"}
              cardContainerSyle={classes.cardContainer}
            >
              <Table
                style={classes.tableContainer}
                headers={HEADERS_SET_TWO.map((header) => (
                  <th key={header}>{header}</th>
                ))}
              >
                {lastRecords.lastCanceledRequests.map((list) => (
                  <tr
                    key={list.requestId}
                    className="border-b border-white"
                    onClick={() => goToDetails(`requests/${list.id}`)}
                  >
                    <td>{list.requestId}</td>
                    <td>{list.clients.name.split(" ")[0]}</td>
                    <td>{list.address.city}</td>
                  </tr>
                ))}
              </Table>
            </GridList>
          </GridLayout>

          {/** END THE SECOND GRID */}

          {/** START THE THIRD GRID */}

          <GridLayout gridCols="grid-cols-3">
            <GridList
              icon={<BsHash size={25} color="white" />}
              title="Total numbers of registered clients"
              style="grid-list-gray-style"
              link= {moderator ? "/en/admin/clients" : "/en/admin/clients"}
              children={clients.clients.length}
              titleStyle={classes.titleStyle}
              cardContainerSyle={classes.cardContainerRectangle}
            />
            <GridList
              icon={<BsHash size={25} color="white" />}
              title="Total numbers of registered suppliers"
              style="grid-list-gray-style"
              link= {moderator ? "/en/moderator/suppliers" : "/en/admin/suppliers"}
              children={suppliers.suppliers.length}
              titleStyle={classes.titleStyle}
              cardContainerSyle={classes.cardContainerRectangle}
            />
            <GridList
              icon={<BsHash size={25} color="white" />}
              title="Total numbers of submitted requests"
              style="grid-list-gray-style"
              link={moderator ? "/en/moderator/requests" : "/en/admin/requests"}
              children={requests.requests.length}
              titleStyle={classes.titleStyle}
              cardContainerSyle={classes.cardContainerRectangle}
            />
          </GridLayout>

          {/** START THE CHART GRID */}
          <GridLayout>
            <MyChart
              Component={Bar}
              label="suppliers"
              title="Numbers of registered suppliers per month"
              data={suppliersData}
              bgColor={generalReducer.BAR_COLORS}
              brdrColor={generalReducer.BAR_COLORS}
            />
          </GridLayout>
          {/** START THE CHART GRID */}
          <GridLayout>
            <MyChart
              Component={Bar}
              label="clients"
              title="Numbers of registered clients per month"
              data={clientsData}
              bgColor={generalReducer.BAR_COLORS}
              brdrColor={generalReducer.BAR_COLORS}
            />
          </GridLayout>

          {/** END THE CHART GRID */}

          {/** END THE THIRD GRID */}
        </Fragment>
      )}
    </div>
  );
};

export default HomePage;
