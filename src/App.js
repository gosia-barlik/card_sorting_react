import "./App.css";
import React from "react";
import Header from "./components/common/Header.jsx";
import GraphList from "./components/GraphList";
import GraphDetails from "./components/GraphDetails";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import EditNodeModal from "./components/common/EditNodeModal";
import CreateNodeModal from "./components/common/CreateNodeModal";

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
      <CreateNodeModal />
    </div>
  );
}

export default App;
