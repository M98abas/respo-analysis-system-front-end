// import { Line } from "@ant-design/charts";
// FaCcVisa
// RiMastercardLine
import { FaCcVisa } from "react-icons/fa";
import { RiMastercardLine } from "react-icons/ri";
import { CSVLink } from "react-csv";
import { InboxOutlined } from "@ant-design/icons";
import { Upload, message, Button } from "antd";
import moment from "moment";
import { useState } from "react";
import * as React from "react";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { Grid } from "@mui/material";
import Image from "next/image";
const { Dragger } = Upload;

export default function Home() {
  const lookingFor = ["AuthCode", "ConnectorTxID2", "ExtendedDescription"];
  const [dataSource, setDataSource]: any = useState([]);
  const [total, setTotal]: any = useState(0);
  const [sumationData, setSumationData]: any = useState([]);
  const [connectorData, setConnectorData]: any = useState([]);
  const [image, setImage]: any = useState();
  // const dateTime = moment(new Date()).format("YYYY/MM/DD");
  let state: any = {
    loading: false, // to keep track of when form submitted
    errors: null, // for displaying errors
    file: "", // the file type the user chooses to download
  };
  // let config: any;
  function createData(
    response_code: string,
    response_description: string,
    count: number,
    children: Array<Object>
  ) {
    return {
      response_code,
      response_description,
      count,
      children,
    };
  }

  function Row(props: { row: ReturnType<typeof createData> }) {
    const { row } = props;
    const [open, setOpen] = React.useState(false);

    return (
      <React.Fragment>
        <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
          <TableCell>
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setOpen(!open)}
            >
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
          <TableCell component="th" scope="row">
            {row.response_code}
          </TableCell>
          <TableCell align="right">{row.response_description}</TableCell>
          <TableCell align="right">{row.count}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 1 }}>
                <Typography variant="h6" gutterBottom component="div">
                  <Button>
                    <CSVLink
                      filename={"Expense_Table.csv"}
                      data={[...row.children]}
                      className="btn btn-primary"
                      onClick={() => {
                        message.success("The file is downloading");
                      }}
                    >
                      Export to CSV
                    </CSVLink>
                  </Button>
                </Typography>
                <Table size="medium" aria-label="purchases">
                  <TableHead>
                    <TableRow>
                      <TableCell align="center">Brand</TableCell>
                      <TableCell align="center">Count</TableCell>
                      <TableCell align="center">Unique Id</TableCell>
                      <TableCell align="center">Bins</TableCell>
                      <TableCell align="center">Last 4-Digit</TableCell>
                      <TableCell align="center">Account Holder</TableCell>
                      <TableCell align="center">Amount</TableCell>
                      <TableCell align="center">Date</TableCell>
                      <TableCell align="center">Connectoer</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {row.children.map((historyRow: any) => {
                      // console.log(historyRow.ConnectorDetails);

                      let connectorResult = historyRow.ConnectorDetails;

                      return (
                        <>
                          <TableRow key={historyRow.UniqueId}>
                            <TableCell align="center">
                              {historyRow.Brand == "VISA" ? (
                                <Image
                                  src={"/images/visa_icon.svg"}
                                  width="60"
                                  height="50"
                                  alt="Visa Icon"
                                />
                              ) : (
                                <Image
                                  src={"/images/mastercard_icon.svg"}
                                  width="60"
                                  height="50"
                                  alt="Mastercard"
                                />
                              )}
                            </TableCell>
                            <TableCell align="center">
                              {historyRow.count}
                            </TableCell>
                            <TableCell align="center">
                              {historyRow.UniqueId}
                            </TableCell>
                            <TableCell
                              align="center"
                              component="th"
                              scope="row"
                            >
                              {historyRow.Bin}
                            </TableCell>
                            <TableCell align="center">
                              {historyRow.AccountNumberLast4}
                            </TableCell>

                            <TableCell align="center">
                              {historyRow.AccountHolder}
                            </TableCell>
                            <TableCell align="center">
                              {historyRow.Credit} {historyRow.Currency}
                            </TableCell>
                            <TableCell align="center">
                              {moment(
                                new Date(historyRow.RequestTimestamp)
                              ).format("YYYY/MM/DD")}
                            </TableCell>
                            <TableCell align="left">
                              {Object.keys(connectorResult).length !== 0 ? (
                                <Grid
                                  container
                                  direction="column"
                                  justifyContent="center"
                                  alignItems="flex-start"
                                  textAlign="left"
                                >
                                  {Object.keys(connectorResult).map(
                                    (key: any) =>
                                      lookingFor.indexOf(key) >= 0 ? (
                                        <p>
                                          {key} &gt;&gt; {connectorResult[key]}
                                        </p>
                                      ) : (
                                        <></>
                                      )
                                  )}
                                </Grid>
                              ) : (
                                <p>No Data Availabe</p>
                              )}
                            </TableCell>
                          </TableRow>
                        </>
                      );
                    })}
                  </TableBody>
                </Table>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </React.Fragment>
    );
  }

  function RowTwo(props: { row: ReturnType<typeof createData> }) {
    const { row }: any = props;
    return (
      <React.Fragment>
        <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
          <TableCell align="left">
            {Number.isInteger(row.clearingInstituteName)
              ? "Total"
              : row.clearingInstituteName}
          </TableCell>
          <TableCell align="center">{row.sumation}</TableCell>
        </TableRow>
      </React.Fragment>
    );
  }
  function RowConnector(props: { row: ReturnType<typeof createData> }) {
    const { row }: any = props;
    return (
      <React.Fragment>
        <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
          <TableCell align="center">{row.clearingInstituteName}</TableCell>
          <TableCell align="center">{row.ReturnCode}</TableCell>
          <TableCell align="left">{row.ExtendedDescription}</TableCell>
          <TableCell align="center">{row.count}</TableCell>
        </TableRow>
      </React.Fragment>
    );
  }

  const [rows, setRows] = useState([]);

  function sendData() {
    if (image && dataSource.length == 0) {
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      var formdata = new FormData();
      formdata.append("file", image, image.name);
      var requestOptions: any = {
        method: "POST",
        body: formdata,
        redirect: "follow",
      };
      console.log("Loading...");

      fetch(`https://fastapi-b7h7.onrender.com/uplaod`, requestOptions)
        .then((response) => response.json())
        .then(async (result: any) => {
          console.log(JSON.parse(result.connector));

          setSumationData(JSON.parse(result.sumation));
          setConnectorData(JSON.parse(result.connector));
          setDataSource(JSON.parse(result.df));
          setRows(JSON.parse(result.df));
        })
        .catch((e) => console.log(e));
    } else {
      setDataSource([]);
      return message.error("File is not set");
    }
  }

  function analyizedDataUploadButton() {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/blob");

    var formdata = new FormData();
    formdata.append("file", image, image.name);
    // formdata.append("bin_find", bins);
    var requestOptions: any = {
      method: "POST",
      body: formdata,
      redirect: "follow",
    };

    fetch(`https://fastapi-b7h7.onrender.com/analize`, requestOptions)
      .then((response) => response.blob())
          
      .then(async (blob: any) => {
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link: any = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `sample.${state.file}.csv`); // 3. Append to html page
        document.body.appendChild(link); // 4. Force download
        link.click(); // 5. Clean up and remove the link
        link.parentNode.removeChild(link);
      })
      .catch((e) => console.log(e));

    // return <Line {...config} />;
  }

  const handleImageUpload = ({ fileList }: any) => {
    if (fileList[0]) {
      setImage(fileList[0].originFileObj);
    }
  };

  return (
    <>
      <div className="main-container">
        <div className="container">
          <Dragger onChange={handleImageUpload}>
            <Upload action={"https://fastapi-b7h7.onrender.com/uplaod"} />
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">
              Click or drag file to this area to upload
            </p>
            <p className="ant-upload-hint">
              Support for a single or bulk upload. Strictly prohibit from
              uploading company data or other band files
            </p>
          </Dragger>
        </div>
        <div className="flexed-items">
          <button className="btn btn-primary" onClick={sendData}>
            Get Codes
          </button>
          <button
            className="btn btn-primary"
            onClick={analyizedDataUploadButton}
          >
            Get analize
          </button>
          <button>
            <CSVLink
              filename={"Expense_Table.csv"}
              data={[...connectorData, ...sumationData]}
              className="btn btn-primary"
              onClick={() => {
                message.success("The file is downloading");
              }}
            >
              Export to CSV
            </CSVLink>
          </button>
        </div>
      </div>
      <div className="table">
        <div className="result-table">
          <div className="table-1">
            <Typography variant="h6" gutterBottom component="div">
              Sumation Of all Transaction{" "}
              <Button>
                <CSVLink
                  filename={"Expense_Table.csv"}
                  data={[...sumationData]}
                  className="btn btn-primary"
                  onClick={() => {
                    message.success("The file is downloading");
                  }}
                >
                  Export to CSV
                </CSVLink>
              </Button>
            </Typography>
            <TableContainer component={Paper}>
              <Table aria-label="collapsible table">
                <TableHead>
                  <TableRow>
                    <TableCell align="left">Description</TableCell>
                    <TableCell align="right">Count</TableCell>
                  </TableRow>
                </TableHead>

                
                <TableBody>
                  {sumationData.map((row: any) => (
                    <RowTwo key={row.key} row={row} />
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>

          <br />
          <div className="table-2">
            <Typography variant="h6" gutterBottom component="div">
              Response Data Sumation{" "}
              <Button>
                <CSVLink
                  filename={"Expense_Table.csv"}
                  data={[...connectorData]}
                  className="btn btn-primary"
                  onClick={() => {
                    message.success("The file is downloading");
                  }}
                >
                  Export to CSV
                </CSVLink>
              </Button>
            </Typography>
            <TableContainer component={Paper}>
              <Table aria-label="collapsible table">
                <TableHead>
                  <TableRow>
                    <TableCell align="center">Institute Name</TableCell>
                    <TableCell align="center">Return Code</TableCell>
                    <TableCell align="center">Extended Description</TableCell>
                    <TableCell align="center">Count</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {connectorData.map((row: any) => (
                    <RowConnector key={row.key} row={row} />
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </div>
        <div className="table-container">
          <TableContainer component={Paper}>
            <Table aria-label="collapsible table">
              <TableHead>
                <TableRow>
                  <TableCell />
                  <TableCell>Code</TableCell>
                  <TableCell align="center">Resonse</TableCell>
                  <TableCell align="center">Count</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row: any) => (
                  <Row key={row.key} row={row} />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
    </>
  );
}
