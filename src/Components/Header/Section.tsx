import React from "react";
type section = {
  value: string;
};

export default function Section({ value }: section) {
  return <span className="section  mx-md-2 d-md-inline d-none">{value}</span>;
}
