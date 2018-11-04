import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reducers from "./reducer";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Promise from "redux-promise";
const createStoreWithMiddleware = applyMiddleware(Promise)(createStore);
ReactDOM.render(
  <Provider store={createStoreWithMiddleware(reducers)}>
    <BrowserRouter>
      <div>
        <Switch>
          <Route exact={true} path="/" component={App} />
          <Route path="/app" component={App} />
        </Switch>
      </div>
    </BrowserRouter>
  </Provider>,

  document.getElementById("root")
);
