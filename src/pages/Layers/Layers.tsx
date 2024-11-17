import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { NavigateFunction, useNavigate } from "react-router-dom";
import LayersAdd from "../../sections/LayersSection/LayersAdd";
import LayersProducts from "../../sections/LayersSection/LayersTable/LayersProducts";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../store/slices/auth/authSlice";
import { useSelector } from "react-redux";
import { stateRedux } from "../../types";
export default function Layers() {
  // show image or span
  const [imgSpan, setImgSpan] = useState<Boolean>(false);
  // to show loading when fetch
  const [loading, setLoading] = useState<Boolean>(true);
  // to show Table or Form when click on add or edit button
  const [showTableForm, setShowTableForm] = useState<Boolean>(true);
  // show add button or cancel
  const [addCancel, setAddCancel] = useState<Boolean>(true);
  // to show add button on submit or edit button
  const [bool, setBool] = useState(true);

  // id when edit to send it to submit function
  const [idEdit, setIdEdit] = useState(0);
  // from container contains which language we use
  const language = useSelector((state: stateRedux) => state.language.language);
  // to translate
  const [t] = useTranslation();
  // ***** to fetch *****//
  // save api info in it
  const [todos, setTodos] = useState([]);
  // fetch data
  const navigate: NavigateFunction = useNavigate();
  // fetch data
  const dispatch = useDispatch();
  const fetchTodos = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}admin/socialMedia`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      setTodos(response.data.designs);
      // hide loading after fetch
      setLoading(false);
    } catch (error) {
      console.error("Error fetching todos:", error);
      // hide loading after fetch
      setLoading(false);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        dispatch(logoutUser());

        navigate("/");
      }
    }
  };
  useEffect(() => {
    fetchTodos();
  }, []);

  const ShowAddForm = () => {
    // to show add button on submit
    setBool(true);
    // to show span image circle
    setImgSpan(false);
    // show Form hide table
    setShowTableForm(false);
    // show cancel button
    setAddCancel(false);
  };
  // Cancel form and show table
  const Cancel = () => {
    // show table hide form
    setShowTableForm(true);
    // show add button
    setAddCancel(true);
  };

  return (
    <>
      <div className="head radius-5 position-relative fontChangeSmall bg-boxes p-2 p-md-3 d-flex align-items-center justify-content-between">
        <h6 className="mb-0 fontChangeSmall">{t("Best selling")}</h6>
        <div className="info d-flex align-items-center justify-content-between gap-2">
          {/*  */}
          {addCancel ? (
            <button
              className="px-2 px-md-3 py-1 radius-8"
              onClick={ShowAddForm}
            >
              {t("add")}
            </button>
          ) : (
            <button
              className="px-2 px-md-3 py-1 radius-8 bg-danger text-white"
              onClick={Cancel}
            >
              {t("cancel")}
            </button>
          )}
        </div>
      </div>
      {/* if true show table false show form */}
      {showTableForm ? (
        ""
      ) : (
        <LayersAdd
          setAddCancel={setAddCancel}
          setShowTableForm={setShowTableForm}
          fetchTodos={fetchTodos}
          bool={bool}
          imgSpan={imgSpan}
          setImgSpan={setImgSpan}
          idEdit={idEdit}
          language={language}
          navigate={navigate}
        />
      )}
      <LayersProducts
        loading={loading}
        todos={todos}
        setTodos={setTodos}
        navigate={navigate}
        fetchTodos={fetchTodos}
        language={language}
      />
    </>
  );
}
