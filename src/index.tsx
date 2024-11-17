import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import "bootstrap/dist/js/bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./css/all.min.css";
import "./css/index.scss";
import Container from "./Components/Container/Container";
import "./i18";
import { Provider } from "react-redux";
import store from "./store/store";
const container = document.getElementById("root") as HTMLDivElement;
const root = ReactDOM.createRoot(container);

function render() {
  root.render(
    <Provider store={store}>
      <Container />
    </Provider>
  );
}
render();
