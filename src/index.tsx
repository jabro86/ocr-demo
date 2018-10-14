import "semantic-ui-css/semantic.min.css";

import * as React from "react";
import * as ReactDOM from "react-dom";

import { Router } from "@reach/router";

import App from "./App";
import registerServiceWorker from "./registerServiceWorker";
import Server from "./Server";

ReactDOM.render(
  <Router>
    <App path="/" />
    <Server path="server" />
  </Router>,
  document.getElementById("root") as HTMLElement
);
registerServiceWorker();
