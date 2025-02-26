import React, { ReactNode, ComponentPropsWithoutRef } from "react";

type Props = {
  id: string;
  children?: ReactNode;
  cn?: string;
  inputType?: string;
  error?: string;
} & ComponentPropsWithoutRef<"input">;

function Input({ type = "text", placeholder, id, cn, error, ...rest }: Props) {
  return (
    <div className="relative w-full">
      <input
        type={type}
        id={id}
        className={`peer block w-full rounded-lg border ${
          error ? "border-red-400" : "border-gray-300"
        } bg-transparent px-4 pt-3 pb-2 text-sm text-gray-900 transition-all duration-200 
        focus:border-gray-600 focus:outline-none focus:ring-1 focus:ring-gray-400 
        hover:border-gray-400 ${cn}`}
        {...rest}
        placeholder=""
      />
      <label
        htmlFor={id}
        className={`absolute left-3 -top-2.5 bg-white px-1 text-sm ${
          error ? "text-red-500" : "text-gray-500"
        } transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-gray-400 
        peer-placeholder-shown:text-base peer-focus:-top-2.5 peer-focus:text-sm 
        peer-focus:text-gray-700`}
      >
        {placeholder}
      </label>

      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

export default Input;
