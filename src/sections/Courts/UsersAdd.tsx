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

  // States for form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [address, setAddress] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [birthPlace, setBirthPlace] = useState("");
  const [nationalNumber, setNationalNumber] = useState("");
  const [gender, setGender] = useState("");
  const [phone, setPhone] = useState("");
  const [avatar, setAvatar] = useState<File | string | Blob>("");

  const addEdit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      setAddCancel(true);
      setShowTableForm(true);

      const rest = await axios.put(`http://localhost:5000/todo/${idEdit}`, {
        completed: false,
        image: avatar,
      });

      fetchTodos();
    } catch (error) {
      console.log("something went wrong", error);
    }
  };

  const addTodo = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      const formData: FormData = new FormData();
      formData.append("image", avatar);
      setProgress(true);

      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}admin/socialMedia/create`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
          onUploadProgress: function (event: AxiosProgressEvent) {
            let progressValue = Math.round(
              (event.loaded / (event.total || 1)) * 100
            );
            setProgressV(progressValue);
          },
        }
      );

      setAddCancel(true);
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

  const removePopover = () => {
    setShowTableForm(true);
    setAddCancel(true);
    console.log("first");
  };

  const [imageFile, setImageFile] = useState<File[]>([]);

  const handleImageChange = async (files: FileList) => {
    const selectedImage: File = files[0];
    const reader: FileReader = new FileReader();
    const imgForm = document.querySelector(".imgForm") as HTMLImageElement;
    if (selectedImage) {
      reader.onload = function (e) {
        const srcResult = reader.result;
        if (typeof srcResult === "string") {
          imgForm.src = srcResult;
        }
      };
      reader.readAsDataURL(selectedImage);
    }
    setImgSpan(true);
    setAvatar(selectedImage);
    setImageFile([selectedImage]);
  };

  const onDragOver = (event: React.DragEvent): void => {
    event.preventDefault();
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
    <div className="position-fixed popoverAdd">
      <div className="popoverRemove" onClick={removePopover}></div>
      <form
        className="pb-5 py-3 form w-50 mx-auto fontChangeSmall d-flex flex-column justify-content-center align-items-center"
        onSubmit={bool ? addTodo : addEdit}
      >
        <label htmlFor="drag" className="position-relative labelImage">
          <img
            alt={"no Image"}
            src={``}
            className={`mb-2 imgForm ${imgSpan ? "d-block" : "d-none"}`}
          />
          <span
            className={`spanForm ${imgSpan ? "d-none" : "d-grid"} fs-5 spanDrag`}
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
            onDragOver={onDragOver}
            onDrop={onDrop}
            onDragLeave={onDragLeave}
            id="drag"
            required={imageFile.length ? false : true}
          />
        </label>

        {/* Form Fields */}
        <input
          className="w-100 p-2 mb-3"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t("Full Name")}
          required
        />
        <input
          className="w-100 p-2 mb-3"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t("Email")}
          required
        />
        <input
          className="w-100 p-2 mb-3"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={t("Password")}
          required
        />
        <input
          className="w-100 p-2 mb-3"
          type="password"
          value={passwordConfirmation}
          onChange={(e) => setPasswordConfirmation(e.target.value)}
          placeholder={t("Confirm Password")}
          required
        />
        <input
          className="w-100 p-2 mb-3"
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder={t("Address")}
          required
        />
        <input
          className="w-100 p-2 mb-3"
          type="date"
          value={birthdate}
          onChange={(e) => setBirthdate(e.target.value)}
          placeholder={t("Birthdate")}
          required
        />
        <input
          className="w-100 p-2 mb-3"
          type="text"
          value={birthPlace}
          onChange={(e) => setBirthPlace(e.target.value)}
          placeholder={t("Birth Place")}
          required
        />
        <input
          className="w-100 p-2 mb-3"
          type="text"
          value={nationalNumber}
          onChange={(e) => setNationalNumber(e.target.value)}
          placeholder={t("National Number")}
          required
        />
        <select
          className="w-100 p-2 mb-3"
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          required
        >
          <option value="">{t("Select Gender")}</option>
          <option value="male">{t("Male")}</option>
          <option value="female">{t("Female")}</option>
        </select>
        <input
          className="w-100 p-2 mb-3"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder={t("Phone")}
          required
        />

        {bool ? (
          <>
            {progress ? (
              <div className="d-flex justify-content-center align-items-center gap-2 w-100">
                <LinearProgressWithLabel value={progressV} color="primary" />
              </div>
            ) : (
              <input
                className="changeWidth btnForDelete text-white p-3"
                type="submit"
                value={`${t("add")}`}
                // disabled={disabledBool}
              />
            )}
          </>
        ) : (
          <input
            className="changeWidth btnForEdit w-50 border-0 text-white py-2"
            type="submit"
            value={t("Edit")}
            style={{ background: "blue" }}
            // disabled={disabledBool}
          />
        )}
      </form>
    </div>
  );
}
