import db from "../config/firebase.config";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { NavLink } from "react-router-dom";

export default function GraphDetails() {
  const [graphData, setGraphs] = useState([]);

  let { graphId } = useParams();

  useEffect(() => {
    fetchGraphs();
  }, []);

  const fetchGraphs = async () => {
    const response = db.collection("professions").doc(graphId);
    const data = await response.get();
    console.log(data.data());
    setGraphs(...graphData, data.data());
    window.draw_tree(null, data.data());
  };

  function updateChartInDb() {
    const obj = window.tree_root;
    if (obj) {
      var objcopy = convertRoot(obj);
      db.collection("professions").doc(graphId).update(objcopy);
    }
  }

  //Convert root to database data
  function convertRoot(root1) {
    if (root1) {
      const converted = (({ name, type, children }) => ({
        name,
        type,
        children,
      }))(root1);

      removeKeys(converted, ["parent", "x", "x0", "y", "y0", "depth", "id"]);

      return converted;
    }
  }

  function removeKeys(obj, keys) {
    var index;
    for (var prop in obj) {
      // important check that this is objects own property
      // not from prototype prop inherited
      if (obj.hasOwnProperty(prop)) {
        switch (typeof obj[prop]) {
          case "string":
            index = keys.indexOf(prop);
            if (index > -1) {
              delete obj[prop];
            }
            break;
          case "object":
            if (parseInt(prop) > -1) {
              for (var prop2 in obj[prop]) {
                index = keys.indexOf(prop2);
                if (index > -1) {
                  delete obj[prop][prop2];
                } else {
                  removeKeys(obj[prop][prop2], keys);
                }
              }
            }
            index = keys.indexOf(prop);
            if (index > -1) {
              delete obj[prop];
            } else {
              removeKeys(obj[prop], keys);
            }
            break;
        }
      }
    }
  }

  return (
    <div>
      <NavLink to='/'>
        <button className="button info">wróć</button>
      </NavLink>
      <button id='submit' onClick={updateChartInDb}>
        zapisz
      </button>
      <div id='tree-container' />
    </div>
  );
}
