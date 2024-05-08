import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
import * as XLSX from "xlsx";
import FileSaver from 'file-saver';


const Table = ({ data }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>User Id</th>
          <th>Title</th>
          <th>Body</th>
        </tr>
      </thead>
      <tbody>
        {data.map((record, index) => (
          <tr key={index}>
            <td>{record.id}</td>
            <td>{record.userId}</td>
            <td>{record.title}</td>
            <td>{record.body}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};



function App() {
  const [data, setData] = useState([]);
  const url = "https://jsonplaceholder.typicode.com/posts";

  useEffect(() => {
    axios.get(url).then((json) => setData(json.data));
  }, []);
console.log(data);


const exportToCSV=()=>{
  const fileType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = ".xlsx";
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
  const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  const excelData = new Blob([excelBuffer], { type: fileType });
  FileSaver.saveAs(excelData, "userPost" + fileExtension);
}

  return (
    <div className="App">
      <h1>Users Post Table</h1>
      <button style={{
        padding: "10px",
        fontSize: "16px",
        margin: "10px",
        backgroundColor: "green",
      }} onClick={exportToCSV}
      >Download Users</button>
      <Table data={data} /> 
    </div>
  );
}

export default App;
