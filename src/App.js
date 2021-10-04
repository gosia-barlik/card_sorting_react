import "./App.css";
import React, { useState, useEffect } from "react";
import Header from "./components/common/Header.jsx";
import GraphList from "./components/GraphList";
import GraphDetails from "./components/GraphDetails";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import EditNodeModal from "./components/common/EditNodeModal";
import CreateNodeModal from "./components/common/CreateNodeModal";
import ControlledRadioButtonsGroup from "./components/common/RadioButtons"

function App() {
  return (
    <div className='App'>
      <Router>
        <Header />
        <header className='App-header'>
          <Switch>
            <Route exact path='/Graph/:graphId'>
              <GraphDetails />
            </Route>
            <Route path='/'>
              <GraphList />
            </Route>
          </Switch>
        </header>
      </Router>
      <EditNodeModal />
      {/* <ControlledRadioButtonsGroup /> */}
      <CreateNodeModal />
    </div>
  );
}

export default App;
