import db from "../config/firebase.config";
import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";

export default function GraphList() {
  const [graphs, setGraphs] = useState([]);
  const [labelVisible, setLabelVisible] = useState(true);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [graphId, setGraphId] = useState(0);
  // const [count, setCount] = useState(0);

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
    setGraphs(graphsResponse);
  };

  const showSelectedFile = (e) => {
    var span = document.getElementById("file-selected");
    span.innerHTML = document.getElementById("files").files[0].name;
    setLabelVisible(false);
  };

  const hideSelectedFile = (e) => {
    var span = document.getElementById("file-selected");
    span.innerHTML = "";
    setLabelVisible(true);
  };

  const uploadFiles = async () => {
    var file = document.getElementById("files").files[0];

    if (file) {
      // setCount(count + 1);
      // console.log(count);
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
    db.collection("professions")
      .doc(id)
      .delete()
      .then(() => fetchGraphs());
      handleCloseDialog();  
      console.log("deleted file", id)
  };

  const handleOpenDialog = (id) => {
    setOpenDialog(true);
    setGraphId(id)
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <Container
      maxWidth='m'
      style={{ display: "flex", flexDirection: "column", marginLeft: "15%",  marginRight: "15%" }}>
      <div style={{ marginTop:"24px" }}>
        <Typography
          style={{
            textAlign: "center",
            fontWeight: "600",
          }}>
          Documents:
        </Typography>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent:"center"}}>
        {graphs &&
          graphs.length > 0 &&
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
                      onClick={()=>handleOpenDialog(`${graph.id}`)}
                      style={{ fontSize: "12px", color: "rgb(42, 41, 41)" }}>
                      DELETE
                    </button>
                    <Dialog
                      open={openDialog}
                      onClose={handleCloseDialog}
                      aria-labelledby='alert-dialog-title'
                      aria-describedby='alert-dialog-description'>
                      <DialogTitle id='alert-dialog-title'>
                        {"Delete?"}
                      </DialogTitle>
                      <DialogContent>
                        <DialogContentText id='alert-dialog-description'>
                          Are you sure you want to permanently delete this file?
                        </DialogContentText>
                      </DialogContent>
                      <DialogActions>
                        <Button onClick={handleCloseDialog}>Cancel</Button>
                        <Button  onClick={() => deleteFile(graphId)} autoFocus>
                          Delete
                        </Button>
                      </DialogActions>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            );
          })}
      </div>

      <div style={{display:"flex", justifyContent:"center", marginTop: "24px" }}>
      <Card
          sx={{ width: 275 }}
          style={{ margin: "20px", height: "150px", fontSize: "12px" }}>
          <CardContent style={{ display: "flex", flexDirection: "column" }}>
            <strong>Upload Files</strong>
            <br />
            <input
              type='file'
              id='files'
              className='hidden'
              onChange={(e) => showSelectedFile(e)}
            />
            <span id='file-selected'></span>
            <label
              htmlFor='files'
              id='file-label'
              className={`${labelVisible ? "" : "hidden"}`}>
              Select file
            </label>
            <button
              id='send'
              className={`${labelVisible ? "hidden" : ""}`}
              onClick={() => uploadFiles()}>
              Upload
            </button>
          </CardContent>
        </Card>
        </div>
    </Container>
  );
}
