import React, { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import Section from "./Section";
// import { Language, changeLanguage } from "../Container/Container";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { stateRedux } from "../../types";
import {
  faLanguage,
  faRightToBracket,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { changeLanguage } from "../../store/slices/language/languageSlice";
import { logoutUser } from "../../store/slices/auth/authSlice";

export default function Header() {
  const [lanList, setLanList] = useState<Boolean>(false);
  const showList = (): void => {
    if (!lanList) {
      setLanList(!lanList);
      setTimeout(() => {
        const ulLan = document.querySelector(".ulLan") as HTMLUListElement;
        ulLan.classList.toggle("showListItem");
      });
    } else {
      const ulLan = document.querySelector(".ulLan") as HTMLUListElement;
      ulLan.classList.toggle("showListItem");
      setTimeout((): void => {
        setLanList(!lanList);
      }, 500);
    }
  };
  const [t] = useTranslation();
  const language = useSelector((state: stateRedux) => state.language.language);
  const dispatch = useDispatch();
  const change = (lan: string) => {
    dispatch(changeLanguage(lan));
    showList();
  };
  const navigate = useNavigate();
  const [progressLog, setProgressLop] = useState<Boolean>(false);
  const logOut = async () => {
    setProgressLop(true);
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}admin/logout`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      // setIsloggedIn(false);
      dispatch(logoutUser());
      navigate("/");
      setProgressLop(false);
    } catch (error) {
      setProgressLop(false);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        dispatch(logoutUser());
        navigate("/");
      }
    }
  };
  return (
    <header className="bg-boxes position-fixed top-0 d-flex align-items-center justify-content-between container-fluid px-2 px-md-4 py-3">
      <div className="logoAndSec d-flex justify-content-between align-items-center ">
        <Section value={t("dashboard")} />
        {progressLog ? (
          <div className="div logOut mx-2">
            {t("logOut")}
            <span
              className="spinner-border spinner-border-sm mx-2"
              role="status"
              aria-hidden="true"
            ></span>
          </div>
        ) : (
          <div className="div logOut mx-2" onClick={logOut}>
            {t("logOut")}
            <FontAwesomeIcon icon={faRightToBracket} className="mx-2" />
          </div>
        )}
      </div>
      <div className="d-flex justify-content-center align-items-center">
        <div className="mx-3">
          <ul className="list-unstyled mb-0 p-0">
            <li className="position-relative">
              <button
                className="btn border-0 px-2 py-1 btn fontChangeSmall "
                onClick={showList}
              >
                <FontAwesomeIcon icon={faLanguage} />
                {/* <i className="fa fa-language"></i> */}
              </button>
              {lanList ? (
                <ul className="list-unstyled mb-0 position-absolute ulLan p-0">
                  <li
                    className={`${
                      language == "ar" ? "ar" : ""
                    } py-2 listItemLan`}
                    onClick={() => change("en")}
                  >
                    {t("English")}
                  </li>
                  <li
                    className={`${
                      language == "ar" ? "ar" : ""
                    } py-2 listItemLan`}
                    onClick={() => change("ar")}
                  >
                    {t("Arabic")}
                  </li>
                  <li
                    className={`${
                      language == "ar" ? "ar" : ""
                    } py-2 listItemLan`}
                    onClick={() => change("fr")}
                  >
                    {t("French")}
                  </li>
                  <li
                    className={`${
                      language == "ar" ? "ar" : ""
                    } py-2 listItemLan`}
                    onClick={() => change("sp")}
                  >
                    {t("Spanish")}
                  </li>
                </ul>
              ) : (
                ""
              )}
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}
