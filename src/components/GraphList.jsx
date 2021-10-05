import db from "../config/firebase.config";
import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

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
          }
          reader.onerror = function (evt) {
              console.log("error reading file");
          }
      }
    });
  };

  return (
    <div style={{ marginLeft: "120px" }}>
      <div>
        Upload Files
        <br />
        <input type='file' id='files' multiple />
        <br />
        <br />
        <button id='send'>Upload</button>
        <p id='uploading'></p>
        <progress value='0' max='100' id='progress'></progress>
      </div>

      {graphs &&
        graphs.map((graph) => {
          return (
            <Card sx={{ minWidth: 275 }} style={{ margin: "20px" }}>
              <CardContent>
                <NavLink
                  to={`/Graph/${graph.id}`}
                  style={{ fontSize: "12px", color: "rgb(42, 41, 41)" }}>
                  <li key={graph.id}>{graph.name}</li>
                </NavLink>
              </CardContent>
            </Card>
          );
        })}
    </div>
  );
}
