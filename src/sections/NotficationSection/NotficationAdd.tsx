import { faCloudArrowUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import axios, { AxiosProgressEvent, isAxiosError } from "axios";
import { useDispatch } from "react-redux";
import LinearProgressWithLabel from "../../Components/LinearProgressWithLabel/LinearProgressWithLabel";
import { logoutUser } from "../../store/slices/auth/authSlice";
import { NavigateFunction } from "react-router-dom";
type socialType = {
  setShowTableForm: (e: Boolean) => void;
  setAddCancel: (e: Boolean) => void;
  fetchTodos: () => Promise<void>;
  bool: Boolean;
  imgSpan: Boolean;
  setImgSpan: (value: Boolean) => void;
  idEdit: number;
  language: string;
  navigate: NavigateFunction;
};
export default function LayersAdd({
  setAddCancel,
  setShowTableForm,
  fetchTodos,
  bool,
  imgSpan,
  setImgSpan,
  idEdit,
  language,
  navigate,
}: socialType) {
  const [disabledBool, setDisabledBool] = useState<Boolean>(false);
  const [progress, setProgress] = useState(false);
  const [progressV, setProgressV] = useState(0);
  const [t] = useTranslation();
  const dispatch = useDispatch();
  const addEdit = async (e: React.FormEvent) => {
    try {
      // stop submit refresh
      e.preventDefault();
      // show add button
      setAddCancel(true);
      // show table hide form
      setShowTableForm(true);
      // remove the text from all inputs after added

      const rest = await axios.put(`http://localhost:5000/todo/${idEdit}`, {
        completed: false,
        // warning change this to the id that will come from api //////////////////////
        image: image,
        // arabic: arabicName.trim(""),
        // english: englishName.trim(""),
        // order: orderName,
      });
      // refresh api to show the new

      fetchTodos();
    } catch (error) {
      console.log("something went wrong", error);
    }
  };
  const addTodo = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      const formData: FormData = new FormData();
      formData.append("image", image);
      setProgress(true);
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}admin/socialMedia/create`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
          onUploadProgress: function (event: AxiosProgressEvent) {
            // console.log(event);
            // if (event.lengthComputable) {
            // حساب نسبة التقدم
            let progressValue = Math.round(
              (event.loaded / (event.total || 1)) * 100
            );
            setProgressV(progressValue);
          },
        }
      );
      // show table hide form
      // show cancel button
      setAddCancel(true);
      //
      setShowTableForm(true);
      setProgress(false);

      fetchTodos();
    } catch (error) {
      console.error("Error adding todo:", error);
      if (isAxiosError(error) && error.response?.status === 401) {
        dispatch(logoutUser());
        navigate("/");
      }
    }
  };
  // remover drawer (popover)
  const removePopover = () => {
    setShowTableForm(true);
    setAddCancel(true);
    console.log("first");
  };
  //
  const [image, setImage] = useState<File | string | Blob>("");
  const [imageFile, setImageFile] = useState<File[]>([]);

  const handleImageChange = async (files: FileList) => {
    // the file in input that we uploaded it
    const selectedImage: File = files[0];
    const reader: FileReader = new FileReader();
    const imgForm = document.querySelector(".imgForm") as HTMLImageElement;
    if (selectedImage) {
      reader.onload = function (e) {
        const srcResult = reader.result;
        if (typeof srcResult === "string") {
          imgForm.src = srcResult; // تحديث src لـ imgForm بقيمة الصورة المحملة
        }
      };
      reader.readAsDataURL(selectedImage);
    }
    setImgSpan(true);
    setImage(selectedImage);
    setImageFile([selectedImage]);
  };
  const onDragOver = (event: React.DragEvent): void => {
    event.preventDefault();
    // const spanDrag = document.querySelector(".spanDrag");
    const spanDrag = document.querySelector(".spanDrag") as HTMLSpanElement;
    spanDrag.style.cssText = "background:#7a7a7a3b !important;";
  };
  const onDragLeave = (event: React.DragEvent): void => {
    const spanDrag = document.querySelector(".spanDrag") as HTMLSpanElement;
    event.preventDefault();
    spanDrag.style.cssText = "";
  };
  const onDrop = (event: React.DragEvent): void => {
    event.preventDefault();
    const files: FileList = event.dataTransfer.files;
    handleImageChange(files);
  };
  return (
    <div className=" position-fixed popoverAdd">
      <div className="popoverRemove" onClick={removePopover}></div>
      <form
        className=" pb-5 py-3 form fontChangeSmall d-flex flex-column justify-content-center align-items-center "
        onSubmit={bool ? addTodo : addEdit}
      >
        <label htmlFor="drag" className="position-relative labelImage">
          <img
            alt={"no Image"}
            src={``}
            className={`mb-2 imgForm ${imgSpan ? "d-block" : "d-none"}`}
            // onClick={clickInputFile}
          />
          <span
            className={`spanForm ${
              imgSpan ? "d-none" : "d-grid"
            } fs-5 spanDrag`}
            // onClick={clickInputFile}
          >
            <FontAwesomeIcon
              icon={faCloudArrowUp}
              style={{ color: "var(--clr-product)" }}
              size="4x"
            />
          </span>
          <input
            className={`${language === "ar" ? "ar" : ""} inputUse`}
            type="file"
            accept="image/*"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              const target = event.target as HTMLInputElement;
              if (target.files) {
                handleImageChange(target.files);
              }
            }}
            // onDrag={(event)}
            onDragOver={onDragOver}
            onDrop={onDrop}
            onDragLeave={onDragLeave}
            id="drag"
            required={imageFile.length ? false : true}
          />
        </label>
        {bool ? (
          <>
            {progress ? (
              <div className="d-flex justify-content-center align-items-center gap-2 w-100">
                <LinearProgressWithLabel
                  value={progressV}
                  color="primary"
                  // className="w-100"
                />
                {/* <span className="text-white">{progress}%</span> */}
              </div>
            ) : (
              <input
                className="changeWidth btnForDelete text-white p-3"
                type="submit"
                value={`${t("add")}`}
                disabled={disabledBool === true ? true : false}
              />
            )}
          </>
        ) : (
          <input
            className="changeWidth btnForEdit w-50 border-0 text-white py-2"
            type="submit"
            value={t("Edit")}
            style={{ background: "blue" }}
            disabled={disabledBool === true ? true : false}
          />
        )}
      </form>
    </div>
  );
}
