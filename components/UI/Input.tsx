import React, { ReactNode, ComponentPropsWithoutRef } from "react";

type Props = {
  id: string;
  children?: ReactNode;
  cn?: string;
} & ComponentPropsWithoutRef<"input">;

function Input({ type, placeholder, id, children, cn, ...rest }: Props) {
  return (
    <>
      <label htmlFor={id} className="sr-only">
        {children}
      </label>
      <input
        id={id}
        type={type}
        className={` ${cn} border-2 border-neutral-formBorder px-4 py-3 md:py-3 w-full rounded-md focus:outline-none`}
        placeholder={placeholder}
        {...rest} // Spread remaining props, like onChange
      />
    </>
  );
}

export default Input;
