import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./components/App/App";
import { LightboxContextProvider } from "./context/LightboxContext";

ReactDOM.render(
  <LightboxContextProvider>
    <App />
  </LightboxContextProvider>,
  document.getElementById("root")
);
