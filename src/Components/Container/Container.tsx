import React, { createContext, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { dir } from "i18next";
import { useTranslation } from "react-i18next";
import Header from "../Header/Header";
import Nav from "../Nav/Nav";
import { useEffect } from "react";
import Users from "../../pages/Users/Users";
import Layers from "../../pages/Layers/Layers";
import Login from "../Login/Login";
import Option from "../Option/Option";
import Scroll from "../../Scroll";
import Page404 from "../../pages/Page404/Page404";
import { useSelector, useDispatch } from "react-redux";
import { stateRedux } from "../../types";
import MyCircle from "../../MyCircle";
// export const Language = createContext();
// token: localStorage.getItem("access_token") || null,
// authenticate: localStorage.getItem("authenticate") || false,
export const goUp = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};
export default function Container() {
  const [t, i18n] = useTranslation();
  const language = useSelector((state: stateRedux) => state.language.language);
  const isAuth = useSelector((state: stateRedux) => state.auth.authenticate);
  const dispatch = useDispatch();
  useEffect(() => {
    document.documentElement.dir = `${dir(language)}`;
  }, [language]);
  useEffect(() => {
    const myButton = document.querySelector(".myButton") as HTMLButtonElement;
    window.addEventListener("scroll", () => {
      if (window.scrollY > 300) {
        myButton.style.cssText =
          "pointer-events: auto; bottom: 50px; opacity: 1;";
      } else {
        myButton.style.cssText =
          "pointer-events: none; bottom: 20px; opacity: 0;";
      }
    });
  }, []);
  return (
    <BrowserRouter>
      <Option />
      <MyCircle />

      {/* <button onClick={change}>{t("dash")}</button> */}
      <i
        className={`${
          language === "ar" ? "ar" : ""
        } fas fa-caret-square-up myButton`}
        onClick={goUp}
      ></i>
      {isAuth ? (
        <div>
          {/*  */}
          <Scroll />
          {/* <Login /> */}
          <Header />
          <div className="d-flex NavAndSec">
            <Nav />
            <div
              className={`flex-grow-1 p-2 routes ${
                language === "ar" ? "ar" : ""
              }`}
            >
              <Routes>
                {/* if the user already signed in go to home page */}
                <Route path="/login" element={<Navigate to="/user" />} />
                <Route path="/" element={<Navigate to="/user" />} />
                <Route path="/user" element={<Users />} />
                <Route path="/layers" element={<Layers />} />
                <Route path="*" element={<Page404 />} />
              </Routes>
            </div>
          </div>
        </div>
      ) : (
        <Routes>
          <Route path="/" element={<Navigate to="/user" />} />
          <Route path="login" element={<Login />} />
          <Route path="*" element={<Page404 />} />
        </Routes>
      )}
    </BrowserRouter>
  );
}
