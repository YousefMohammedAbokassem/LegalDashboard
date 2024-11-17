import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { stateRedux } from "../../types";

export default function Option() {
  const language = useSelector((state: stateRedux) => state.language.language);
  const [t] = useTranslation();

  const hide = () => {
    const Option = document.querySelector(".option") as HTMLDivElement;
    const iconOption = document.querySelector(".iconOption") as HTMLElement;
    Option.classList.toggle("showOption");
    iconOption.classList.toggle("fa-spin");
  };

  const changeColor = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    const target = e.target as HTMLSpanElement;
    const colorBody: string | undefined = target.dataset.colorbody;
    const colorBoxes = target.dataset.colorboxes;
    const textColor = target.dataset.textcolor;
    const spansTheme = document.querySelectorAll(".themes span");

    localStorage.setItem("colorbody", colorBody || "");
    localStorage.setItem("colorboxes", colorBoxes || "");

    spansTheme.forEach((span) => {
      span.classList.remove("active");
    });

    target.classList.add("active");

    document.documentElement.style.setProperty(
      "--clr-secondary",
      `${colorBody}`
    );
    document.documentElement.style.setProperty(
      "--clr-primary",
      `${colorBoxes}`
    );
    document.documentElement.style.setProperty("--text-color", `${textColor}`);
  };

  const changeColorProduct = (
    e: React.MouseEvent<HTMLSpanElement, MouseEvent>
  ) => {
    const target = e.target as HTMLSpanElement;
    const colorProduct: string | undefined = target.dataset.colorproduct;

    if (colorProduct) {
      const spansTheme = document.querySelectorAll(".colorProduct div span");

      localStorage.setItem("colorproduct", colorProduct);

      spansTheme.forEach((span) => {
        span.classList.remove("active");
      });

      target.classList.add("active");

      document.documentElement.style.setProperty(
        "--clr-product",
        `${colorProduct}`
      );
    } else {
      console.error("No colorproduct data attribute found on target element.");
    }
  };

  const resetOptions = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const spansTheme = document.querySelectorAll(
      ".option span"
    ) as NodeListOf<HTMLSpanElement>;;

    spansTheme.forEach((span) => {
      span.classList.remove("active");
    });

    localStorage.removeItem("colorproduct");
    localStorage.removeItem("colorbody");
    localStorage.removeItem("colorboxes");

    document.documentElement.style.setProperty("--clr-product", "");
    document.documentElement.style.setProperty("--clr-secondary", "");
    document.documentElement.style.setProperty("--clr-primary", "");
    document.documentElement.style.setProperty("--text-color", "");
  };

  useEffect(() => {
    const colorBody: string | null = localStorage.getItem("colorbody");
    const colorProduct: string | null = localStorage.getItem("colorproduct");
    const spansTheme = document.querySelectorAll(
      ".themes span"
    ) as NodeListOf<HTMLSpanElement>;
    const colorProductSpans = document.querySelectorAll(
      ".colorProduct span"
    ) as NodeListOf<HTMLSpanElement>;

    if (colorBody !== null) {
      spansTheme.forEach((span): void => {
        if (colorBody === span.dataset.colorbody) {
          span.click();
        }
      });
    }

    if (colorProduct !== null) {
      colorProductSpans.forEach((span): void => {
        if (colorProduct === span.dataset.colorproduct) {
          span.click();
        }
      });
    }
  }, []);

  return (
    <div className={`${language === "ar" ? "ar" : ""} option`}>
      <span
        className={`${language === "ar" ? "ar" : ""} position-absolute`}
        onClick={hide}
      >
        <i className="fa fa-gear p-2 iconOption"></i>
      </span>
      <h6>{t("themeColor")}</h6>
      <div className="themes">
        <span
          className="resetSpan"
          data-colorbody="#f4f4f4"
          data-colorboxes="#fff"
          data-textcolor="#111"
          onClick={changeColor}
        ></span>
        <span
          data-colorbody="#1e1611"
          data-colorboxes="#29221d"
          data-textcolor="#fff"
          onClick={changeColor}
        ></span>
      </div>
      <div className="colorProduct d-flex flex-column align-items-center justify-content-center">
        <h6 className="position-absolute">{t("SubColor")}</h6>
        <div className="d-flex justify-content-center align-items-center gap-2 ">
          <span
            className="resetSpan"
            data-colorproduct="#863eff"
            onClick={changeColorProduct}
          ></span>
          <span data-colorproduct="#fe6c00" onClick={changeColorProduct}></span>
          <span data-colorproduct="#e91e63" onClick={changeColorProduct}></span>
          <span data-colorproduct="#005ff5" onClick={changeColorProduct}></span>
        </div>
      </div>
      <button
        className="mt-3 border-0 text-white mainColorBg py-2 px-1 resetBtn"
        onClick={resetOptions}
      >
        {t("resetOption")}
      </button>
    </div>
  );
}
