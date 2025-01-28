import React, { ReactNode, ComponentPropsWithoutRef } from "react";

type Props = {
  id: string;
  children?: ReactNode;
  cn?: string;
  inputType?: string;
} & ComponentPropsWithoutRef<"input">;

function Input({ type = "text", placeholder, id, cn, ...rest }: Props) {
  return (
    <div className="relative w-full ">
      <input
        type={type}
        id={id}
        className={`peer block w-full rounded-lg border border-gray-300 bg-transparent px-4 pt-3 pb-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500  ${cn}`}
        {...rest}
        placeholder=""
      />
      <label
        htmlFor={id}
        className="absolute left-3 -top-2.5 bg-white px-1 text-sm text-gray-500 transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-blue-500"
      >
        {placeholder}
      </label>
    </div>
  );
}

export default Input;
