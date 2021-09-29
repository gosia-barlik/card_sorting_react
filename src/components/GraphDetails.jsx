import db from "../config/firebase.config";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

export default function GraphDetails() {

  const [graphData, setGraphs] = useState([]);

  let { graphId } = useParams();

  useEffect(() => {
    fetchGraphs();
  }, []);

  const fetchGraphs = async () => {
    const response = db.collection("professions").doc(graphId);
    const data = await response.get();

    setGraphs(...graphData, data.data());
  };

  return (
    <ul>
      {JSON.stringify(graphData)}
    </ul>
  );
}
