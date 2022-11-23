import { Line } from "@ant-design/charts";
import { InboxOutlined } from "@ant-design/icons";
import { Upload, message } from "antd";
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
const { Dragger } = Upload;

export default function Home() {
  const [dataSource, setDataSource]: any = useState([]);
  const [firstBin, setFirstBin]: any = useState("");
  const [secondBin, setSecondBin]: any = useState("");
  const [image, setImage]: any = useState();
  const bins: any = [firstBin, secondBin];
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
                  Table of Bins
                </Typography>
                <Table size="small" aria-label="purchases">
                  <TableHead>
                    <TableRow>
                      <TableCell>Short Id</TableCell>
                      <TableCell>Unique Id</TableCell>
                      <TableCell>Bins</TableCell>
                      <TableCell>Account Holder</TableCell>
                      <TableCell>Amount</TableCell>
                      <TableCell align="right">Date</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {row.children.map((historyRow: any) => {
                      console.log(historyRow);

                      return (
                        <TableRow key={historyRow.UniqueId}>
                          <TableCell>{historyRow.ShortId}</TableCell>
                          <TableCell>{historyRow.UniqueId}</TableCell>
                          <TableCell component="th" scope="row">
                            {historyRow.Bin}
                          </TableCell>
                          <TableCell>{historyRow.AccountHolder}</TableCell>
                          <TableCell>
                            {historyRow.Credit} {historyRow.Currency}
                          </TableCell>
                          <TableCell align="center">
                            {historyRow.RequestTimestamp}
                          </TableCell>
                        </TableRow>
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

      fetch(`http://127.0.0.1:8000/uplaod`, requestOptions)
        .then((response) => response.json())
        .then(async (blob) => {
          setDataSource(blob);
          setRows(blob);
        })
        .catch((e) => console.log(e));
    } else {
      setDataSource([]);
      return message.error("File is not set");
    }
  }

  function analyizedDataUploadButton() {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var formdata = new FormData();
    formdata.append("file", image, image.name);
    // formdata.append("bin_find", bins);
    var requestOptions: any = {
      method: "POST",
      body: formdata,
      redirect: "follow",
    };

    fetch(`http://127.0.0.1:8000/analize`, requestOptions)
      .then((response) => response.json())
      .then(async (result: any) => {
        setDataSource(result);
      })
      .catch((e) => console.log(e));

    // return <Line {...config} />;
  }

  const handleImageUpload = ({ fileList }: any) => {
    if (fileList[0]) {
      setImage(fileList[0].originFileObj);
    }
  };

  // config = {
  //   data,
  //   height: 400,
  //   xField: "Code",
  //   yField: "Date",
  //   point: {
  //     size: 5,
  //     shape: "diamond",
  //   },
  // };
  return (
    <>
      <div className="main-container">
        <div className="container">
          <Dragger onChange={handleImageUpload}>
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
          <button className="btn" onClick={sendData}>
            Get Codes
          </button>
          {/* <button className="btn" onClick={analyizedDataUploadButton}>
            Get analize
          </button> */}
        </div>
      </div>
      <div className="table">
        <div className="table-container">
          <TableContainer component={Paper}>
            <Table aria-label="collapsible table">
              <TableHead>
                <TableRow>
                  <TableCell />
                  <TableCell>Code</TableCell>
                  <TableCell align="right">Resonse</TableCell>
                  <TableCell align="right">Count</TableCell>
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
