import "./App.css";
import React, { useState, useEffect } from "react";
import GraphList from "./components/GraphList";
import GraphDetails from "./components/GraphDetails";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

function App() {
  return (
    <div className='App'>
      <header className='App-header'>
        <Router>
          <Switch>
            <Route exact path='/Graph/:graphId'>
              <GraphDetails />
            </Route>
            <Route path='/'>
              <GraphList />
            </Route>
          </Switch>
        </Router>
      </header>
    </div>
  );
}

export default App;
