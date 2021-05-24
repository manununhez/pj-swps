import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import 'bootstrap/dist/css/bootstrap.min.css';

import Index from "./components/Index.js";
import Experiment from "./components/Tasks/Index.js";
import MemoTaskResult from "./components/MemoTaskResult";

ReactDOM.render(
  <BrowserRouter basename="/">
    <Switch>
      <Route path="/" exact render={props => <Index {...props} />} />
      <Route path="/memo-task-results" exact render={props => <MemoTaskResult {...props} />} />
      <Route path="/version/:version" exact render={props => <Experiment {...props} />} />
    </Switch>
  </BrowserRouter>,
  document.getElementById("root")
);
