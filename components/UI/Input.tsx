import React, { ReactNode, ComponentPropsWithoutRef } from "react";

type Props = {
  id: string;
  children?: ReactNode;
} & ComponentPropsWithoutRef<"input">;

function Input({ type, placeholder, id, children, ...rest }: Props) {
  return (
    <>
      <label htmlFor={id} className="sr-only">
        {children}
      </label>
      <input
        id={id}
        type={type}
        className="border-2 border-formBorder px-4 py-3 md:py-3 w-full rounded-md focus:outline-none"
        placeholder={placeholder}
        {...rest} // Spread remaining props, like onChange
      />
    </>
  );
}

export default Input;
