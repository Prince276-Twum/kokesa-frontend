import React from "react";

interface Props {
  type: string;
  placeholder: string;
}

function Input({ type, placeholder }: Props) {
  return (
    <div>
      <label htmlFor=""></label>
      <input type="" />
    </div>
  );
}

export default Input;
