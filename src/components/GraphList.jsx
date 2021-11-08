import db from "../config/firebase.config";
import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";

export default function GraphList() {
  const [graphs, setGraphs] = useState([]);
  const [count, setCount] = useState(0);

  useEffect(() => {
    fetchGraphs();
  }, []);

  const fetchGraphs = async () => {
    const response = db.collection("professions");
    const data = await response.get();

    const graphsResponse = [];
    data.docs.forEach((item) => {
      graphsResponse.push({
        id: item.id,
        name: item.data().name,
        data: item.data(),
      });
    });
    console.log(graphs);
    console.log(graphsResponse);

    setGraphs(graphsResponse);
  };

  const showSelectedFile = (e) => {
    var span = document.getElementById("file-selected");
    var label = document.getElementById("file-label");
    span.innerHTML = document.getElementById("files").files[0].name;
    label.innerHTML = "";
  };

  const hideSelectedFile = (e) => {
    var span = document.getElementById("file-selected");
    var label = document.getElementById("file-label");
    span.innerHTML = "";
    label.innerHTML = "Select file";
  }
 
  const uploadFiles = async () => {
    var file = document.getElementById("files").files[0];

    if (file) {
      setCount(count + 1);
      console.log(count);
      var reader = new FileReader();
      reader.readAsText(file, "UTF-8");
      reader.onload = function (evt) {
        db.collection("professions").add(JSON.parse(evt.target.result));
      };
      reader.onerror = function (evt) {
        console.log("error reading file");
      };
    }
    fetchGraphs();
    hideSelectedFile();
  };

  const deleteFile = async (id) => {
    db.collection("professions").doc(id).delete().then(()=>fetchGraphs());
  };

  return (
    <Container
      maxWidth='m'
      style={{ display: "flex", flexDirection: "column" }}>
      <div style={{ marginLeft: "20%" }}>
        <Typography
          style={{
            textAlign: "left",
            padding: "20px 0 0 20px",
            fontWeight: "600",
          }}>
          Documents:
        </Typography>
      </div>
      <div style={{ marginLeft: "20%", display: "flex" }}>
        {graphs && graphs.length>0 &&
          graphs.map((graph) => {
            return (
              <Card
                sx={{ minWidth: 275 }}
                style={{ margin: "20px", height: "150px" }}
                key={graph.id}>
                <CardContent>
                  <NavLink
                    to={`/Graph/${graph.id}`}
                    style={{
                      fontSize: "12px",
                      color: "rgb(42, 41, 41)",
                      marginBottom: "5px",
                    }}>
                    <li style={{ listStyle: "none" }} key={graph.id}>
                      name: <strong> {graph.name} </strong>
                    </li>
                  </NavLink>
                  <div
                    style={{
                      margin: "70px 15px 0 15px",
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}>
                    <NavLink
                      to={`/Graph/${graph.id}`}
                      style={{ fontSize: "12px", color: "rgb(52, 51, 51)" }}>
                      EDIT
                    </NavLink>
                    <br></br>
                    <button
                      id='delete'
                      onClick={() => deleteFile(`${graph.id}`)}
                      style={{ fontSize: "12px", color: "rgb(42, 41, 41)" }}>
                      DELETE
                    </button>
                  </div>
                </CardContent>
              </Card>
            );
          })}

        <Card
          sx={{ minWidth: 275 }}
          style={{ margin: "20px", height: "150px", fontSize: "12px" }}>
          <CardContent style={{}}>
            <strong>Upload Files</strong>
            <br />
            <input
              type='file'
              id='files'
              className='hidden'
              onChange={(e) => showSelectedFile(e)}
            />
            <span id='file-selected'></span>
            <label htmlFor='files' id='file-label'>
              Select file
            </label>
            <br />
            <button id='send' onClick={() => uploadFiles()}>
              Upload
            </button>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}
