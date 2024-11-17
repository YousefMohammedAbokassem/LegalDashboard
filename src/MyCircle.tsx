import React, { useEffect } from "react";

export default function MyCircle() {
  const moveCircle = (e: MouseEvent) => {
    document.documentElement.style.setProperty("--top", `${e.pageY}px`);
    document.documentElement.style.setProperty("--left", `${e.pageX}px`);
  };

  useEffect(() => {
    window.addEventListener("mousemove", (e) => moveCircle(e));

    return () => {
      window.removeEventListener("mousemove", (e) => moveCircle(e));
    };
  }, []);

  return <span className="d-block position-absolute myCircle"></span>;
}
