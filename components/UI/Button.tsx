import React, { ReactNode } from "react";
interface Props {
  children: ReactNode;
  type: "submit" | "reset" | "button";
}

function Button({ children, type }: Props) {
  return (
    <button
      type={type}
      className="px-4 py-2 text-base md:px-6 md:py-3 md:text-lg rounded-lg bg-black w-full text-white"
    >
      {children}
    </button>
  );
}

export default Button;
