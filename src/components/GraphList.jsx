import db from "../config/firebase.config";
import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";

export default function GraphList() {
  const [graphs, setGraphs] = useState([]);

  useEffect(() => {
    fetchGraphs();
  }, []);

  useEffect(() => {
    uploadFiles();
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

    setGraphs(...graphs, graphsResponse);
  };

  const uploadFiles = () => {
    // var files = [];
    // document.getElementById("files").addEventListener("change", function (e) {
    //   files = e.target.files;
    // });
    document.getElementById("send").addEventListener("click", function () {
      var file = document.getElementById("files").files[0];
      if (file) {
        var reader = new FileReader();
        reader.readAsText(file, "UTF-8");
        reader.onload = function (evt) {
          console.log(JSON.parse(evt.target.result));
          db.collection("professions").add(JSON.parse(evt.target.result));
        };
        reader.onerror = function (evt) {
          console.log("error reading file");
        };
      }
    });
  };

  const deleteFile = (id) => {
    console.log(id);
    db.collection("professions").doc(id).delete()
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
        {graphs &&
          graphs.map((graph) => {
            return (
              <Card
                sx={{ minWidth: 275 }}
                style={{ margin: "20px", height: "150px" }}>
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
                      onClick={()=> deleteFile(`${graph.id}`)}
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
            <input type='file' id='files' class='hidden' />
            <label for='files'>Select file</label>
            <br />
            <button id='send'>Upload</button>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}
