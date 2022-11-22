import { Line } from "@ant-design/charts";
import { InboxOutlined } from "@ant-design/icons";
import { Upload, Table, message } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";

const { Dragger } = Upload;

export default function Home() {
  const [dataSource, setDataSource]: any = useState([]);
  const [data, setData]: any = useState([]);
  const [firstBin, setFirstBin]: any = useState("");
  const [secondBin, setSecondBin]: any = useState("");
  const [image, setImage]: any = useState();
  const bins: any = [firstBin, secondBin];
  const dateTime = moment(new Date()).format("YYYY/MM/DD");
  let state: any = {
    loading: false, // to keep track of when form submitted
    errors: null, // for displaying errors
    file: "", // the file type the user chooses to download
  };
  let config: any;

  const columns = [
    {
      title: "Bin",
      dataIndex: "Bin",
      key: "Bin",
    },
    {
      title: "response_code",
      dataIndex: "response_code",
      key: "response_code",
    },

    {
      title: "response_description",
      dataIndex: "response_description",
      key: "response_description",
    },
    {
      title: "Count",
      dataIndex: "count",
      key: "Count",
    },
    {
      title: "children",
      dataIndex: "children",
      children: (data: any) => [
        {
          title: "Bin",

          dataIndex: "children.Bin",
        },
      ],
      // key:"children",
    },
  ];
  //   useEffect(()=>{
  // sendData
  //   },[data])
  function sendData() {
    if (image) {
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
        })
        .catch((e) => console.log(e));
    } else {
      return message.error("Image is not set");
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

  config = {
    data,
    height: 400,
    xField: "Code",
    yField: "Date",
    point: {
      size: 5,
      shape: "diamond",
    },
  };

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
        {/* <div className="flexed-items input-items">
          <div className="items">
            <p>First Bin</p>
            <input type="text" onChange={(e) => setFirstBin(e.target.value)} />
          </div>
          <div className="items">
            <p>Second Bin</p>
            <input type="text" onChange={(e) => setSecondBin(e.target.value)} />
          </div>
        </div> */}
      </div>
      <div className="table">
        <div className="table-container">
          <Table dataSource={dataSource} columns={columns} bordered />
        </div>
      </div>
    </>
  );
}
