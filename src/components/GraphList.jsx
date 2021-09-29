import db from "../config/firebase.config";
import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";

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
    <ul>
      {graphs &&
        graphs.map((graph) => {
          return (
            <NavLink to={`/Graph/${graph.id}`}>
              <li key={graph.id}>{graph.id}</li>
            </NavLink>
          );
        })}
    </ul>
  );
}
