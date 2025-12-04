import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";   // <-- 你必须确保这个文件存在
import "antd/dist/reset.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
