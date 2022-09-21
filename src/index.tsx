import React from "react";
import ReactDOM from "react-dom/client";
import { Examples } from "./Examples";

const DEBUG = false;
const DebugWrapper = DEBUG ? React.StrictMode : React.Fragment;

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new TypeError("Unable to find root element");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <DebugWrapper>
    <Examples />
  </DebugWrapper>
);
