import db from "../config/firebase.config";
import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

export default function GraphList() {
  const [graphs, setGraphs] = useState([]);

  useEffect(() => {
    fetchGraphs();
  }, []);

  const fetchGraphs = async () => {
    const response = db.collection("professions");
    const data = await response.get();

    const graphsResponse = [];
    data.docs.forEach((item) => {
      graphsResponse.push({ id: item.id, data: item.data() });
    });

    setGraphs(...graphs, graphsResponse);
  };

  return (
    <div style={{marginLeft: '120px'}}>
      {graphs &&
        graphs.map((graph) => {
          return (
            <Card sx={{ minWidth: 275 }} style={{margin: '20px'}}>
               <CardContent>
                 <NavLink to={`/Graph/${graph.id}`} style={{fontSize: '12px', color:'rgb(42, 41, 41)'}}>
                  <li key={graph.id}>{graph.id}</li>
                 </NavLink>
              </CardContent>
            </Card>
          );
        })}
    </div>
  );
}
