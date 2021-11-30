import { StrictMode } from "react";
import ReactDOM from "react-dom";
import { WeatherApp } from "./WeatherApp.js";

import "./index.css";

// 元件回傳元件
function App() {
  return <WeatherApp />;
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
