// import { Line } from "@ant-design/charts";
// FaCcVisa
// RiMastercardLine
// import { FaCcVisa } from "react-icons/fa";
// import { RiMastercardLine } from "react-icons/ri";
import { CSVLink } from "react-csv";
import { InboxOutlined } from "@ant-design/icons";
import { Upload, message, Button } from "antd";
import { useState } from "react";
import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Head from "next/head";
const { Dragger } = Upload;

export default function Home() {
  const [dataSource, setDataSource]: any = useState([]);

   const [image, setImage]: any = useState();

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

  function RowConnector(props: { row: ReturnType<typeof createData> }) {
    const { row }: any = props;
    return (
      <React.Fragment>
        <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
          <TableCell align="center">{row.SHORT_ID}</TableCell>
          <TableCell align="center">{row.UNIQUE_ID}</TableCell>
          <TableCell align="left">{row.AUTHH}</TableCell>
          <TableCell align="center">{row.LAST_4}</TableCell>
          <TableCell align="center">{row.BIN}</TableCell>
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

      fetch(`http://127.0.0.1:8000/reducing`, requestOptions)
        .then((response) => response.json())
        .then(async (result: any) => {
        console.log(JSON.parse(result.df));
          setRows(JSON.parse(result.df));
        })
        .catch((e) => console.log(e));
    } else {
      setDataSource([]);
      return message.error("File is not set");
    }
  }

  const handleImageUpload = ({ fileList }: any) => {
    if (fileList[0]) {
      setImage(fileList[0].originFileObj);
    }
  };

  return (
    <>
      <Head>
        <link rel="shortcut icon" href="/favicon.ico" />
      </Head>
      <div className="main-container">
        <div className="container">
          <Dragger onChange={handleImageUpload}>
            <Upload action={"http://127.0.0.1:8000/uplaod"} />
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
        </div>
      </div>
      <div className="table">
        <div className="result-table">
          <br />
          <div className="table-2">
            <Typography variant="h6" gutterBottom component="div">
              Response Data Sumation{" "}
              <Button>
                <CSVLink
                  filename={"ConnectorDetailReport.csv"}
                  data={[...rows]}
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
                    <TableCell align="center">SHORT_ID</TableCell>
                    <TableCell align="center">UNIQUE_ID</TableCell>
                    <TableCell align="center">AUTHH</TableCell>
                    <TableCell align="center">LAST_4</TableCell>
                    <TableCell align="center">Bin</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row: any) => (
                    <RowConnector key={row.key} row={row} />
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </div>
      </div>
    </>
  );
}
