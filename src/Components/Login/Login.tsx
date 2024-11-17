import React, { useEffect, useState } from "react";
import Lable from "./Lable";
import axios from "axios";
import Design from "../../Design";
import { useCookies } from "react-cookie";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightToBracket } from "@fortawesome/free-solid-svg-icons";
import { useSelector, useDispatch } from "react-redux";
import { logIn } from "../../store/slices/auth/authSlice";
export default function Login() {
  const [userName, setUserName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [progressLog, setprogressLog] = useState<Boolean>(false);

  const [t] = useTranslation();
  const [_, setCookies] = useCookies(["access_token"]);
  const dispatch = useDispatch();
  const submit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    setprogressLog(true);
    try {
      e.preventDefault();
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}admin/login`,
        {
          user_name: userName,
          password: password,
        }
      );
      dispatch(logIn());
      localStorage.setItem("access_token", res.data.token);
      setprogressLog(false);
    } catch (error) {
      console.log(error);
      setprogressLog(false);
    }
  };
  useEffect(() => {
    document.title = t("logIn");
  }, []);
  return (
    <div className="logImage d-flex justify-content-center align-items-center">
      <Design />
      <div className="logIn  gap-2 gap-md-3 gap-lg-5  d-flex align-items-center">
        {/* d-none d-md-block */}
        <div className="info px-1 px-md-4 d-none d-md-block ">
          <span className="topSpan">
            <FontAwesomeIcon icon={faRightToBracket} />
          </span>
          <h2>{t("Welcome")}</h2>
          <hr />
          <p>{t("welcomeToTheDashboard")}</p>
        </div>
        <div className="log">
          <h3 className="mx-auto">{t("signIn")}</h3>
          <form
            // action="/src/Components/Container/Container.js"
            method="post"
            onSubmit={submit}
          >
            <Lable
              HtmlFor="user"
              ClassName="d-flex"
              Name="userName"
              Id="user"
              Type="text"
              Info={t("userName")}
              setValue={setUserName}
            />
            <Lable
              HtmlFor="password"
              ClassName="d-flex"
              Name="password"
              Id="password"
              Type="password"
              Info={t("password")}
              setValue={setPassword}
            />
            {progressLog ? (
              <p
                className="spinner-border spinner-border-sm mainColorText mt-3 "
                role="status"
                aria-hidden="true"
              ></p>
            ) : (
              <input
                className="mt-3 text-white"
                type="submit"
                value={t("submit")}
                name="submit"
              />
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
