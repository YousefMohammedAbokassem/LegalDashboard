import React from "react";
import { useEffect } from "react";
import { useState } from "react";

export default function Scroll() {
  const [scroll, setScroll] = useState(0);  
  useEffect(() => {
      const scrollLine = document.querySelector(".scroll") as HTMLDivElement;
    window.addEventListener("scroll", () => {
      let pageHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      let pageTop = document.documentElement.scrollTop;
      scrollLine.style.width = `${(pageTop / pageHeight) * 100}%`;
    });
  }, []);
  return (
    <div
      className={`${
        localStorage.getItem("i18nextLng") === "ar" ? "ar" : ""
      } scroll`}
    ></div>
  ); 
}
