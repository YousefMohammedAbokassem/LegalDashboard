import React from "react";
type labelType = {
  HtmlFor: string;
  ClassName: string;
  Name: string;
  Id: string;
  Type: string;
  Info: string;
  setValue: (e: string) => void;
};
export default function Lable({
  HtmlFor,
  setValue,
  ClassName,
  Name,
  Id,
  Type,
  Info,
}: labelType) {
  return (
    <label htmlFor={HtmlFor} className="d-flex flex-column mt-2">
      {Info}
      <input
        className="mt-1"
        type={Type}
        name={Name}
        id={Id}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setValue(e.target.value)
        }
      />
    </label>
  );
}
