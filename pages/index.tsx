import { InboxOutlined } from "@ant-design/icons";
import {  Upload } from "antd";
import { useState } from "react";

const { Dragger } = Upload;

export default function Home() {
  const [image, setImage]: any = useState();
  let state:any = {
    loading: false, // to keep track of when form submitted
    errors: null, // for displaying errors
    file: '', // the file type the user chooses to download
  }
  function sendData() {
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
      .then((response) => response.blob())
      .then(async (blob) => {
        console.log(blob);
        // 2. Create blob link to download
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link: any = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `sample.${state.file}.csv`); // 3. Append to html page
        document.body.appendChild(link); // 4. Force download
        link.click(); // 5. Clean up and remove the link
        link.parentNode.removeChild(link);
        // router
      })
      .catch((e) => console.log(e));
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
        <button onClick={sendData}>Upload</button>
      </div>
    </>
  );
}
