import React, { ComponentPropsWithoutRef, ReactNode } from "react";
import { GoSync } from "react-icons/go";

import classnames from "classnames";
type ButtonVariation =
  | {
      primary: true;
      danger?: never;
      success?: never;
      secondary?: never;
      warning?: never;
    }
  | {
      danger: true;
      primary?: never;
      success?: never;
      secondary?: never;
      warning?: never;
    }
  | {
      success: true;
      primary?: never;
      danger?: never;
      secondary?: never;
      warning?: never;
    }
  | {
      secondary: true;
      primary?: never;
      danger?: never;
      success?: never;
      warning?: never;
    }
  | {
      warning: true;
      primary?: never;
      danger?: never;
      success?: never;
      secondary?: never;
    };

type Props = {
  children: ReactNode;
  className?: string;
  rounded?: boolean;
  outline?: boolean;
  loading?: boolean;
  type?: "button" | "submit" | "reset";
} & ComponentPropsWithoutRef<"button"> &
  ButtonVariation;
function Button({
  children,
  type,
  loading,
  className,
  primary,
  secondary,
  success,
  danger,
  warning,
  rounded,
  outline,
  ...rest
}: Props) {
  const classes = classnames(
    className +
      "px-4 py-2 text-base md:px-6 md:py-3 md:text-lg  w-full flex justify-center items-center gap-2",
    {
      "opacity-80": loading,
      "bg-primary-base text-white": primary,
      "bg-gray-500  text-white": secondary,
      "bg-green-500 text-white": success,
      "bg-red-500 text-white": danger,
      "bg-yellow-400 text-white": warning,
      "rounded-lg text-white": rounded,
      "rounded-ful text-whitel": primary,
      "bg-white": outline,
      "text-blue-500": outline && primary,
      "text-gray-900": outline && secondary,
      "text-green-500": outline && success,
      "text-yellow-400": outline && warning,
      "text-red-500 ": outline && danger,
    }
  );
  return (
    <button type={type} {...rest} className={classes}>
      {loading ? (
        <GoSync data-testid="spinner" className="animate-spin" />
      ) : (
        children
      )}
    </button>
  );
}

export default Button;
