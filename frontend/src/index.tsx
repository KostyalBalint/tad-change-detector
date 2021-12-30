import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Diff } from "./routes/Diff";
import "bootstrap/dist/css/bootstrap.css";

var rootEl = document.getElementById("root");
ReactDOM.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="diff/:code" element={<Diff />} />
    </Routes>
  </BrowserRouter>,
  rootEl
);

// Are we in development mode?
if (module.hot) {
  // Whenever a new version of App.tsx is available
  module.hot.accept("./App", function () {
    // Require the new version and render it instead
    var NextApp = require("./App");
    ReactDOM.render(<NextApp />, rootEl);
  });
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
