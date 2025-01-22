import React, { ComponentPropsWithoutRef, ReactNode } from "react";
import Link from "next/link";
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

type CommonProps = {
  children: ReactNode;
  className?: string;
  rounded?: boolean;
  outline?: boolean;
  loading?: boolean;
} & ButtonVariation;

type ButtonProps = {
  el: "button";
  href?: string;
} & ComponentPropsWithoutRef<"button"> &
  CommonProps;

type AnchorProps = {
  el: "anchor";
  href: string;
} & ComponentPropsWithoutRef<"a"> &
  CommonProps;

type Props = ButtonProps | AnchorProps;

function Button({
  children,
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
      " px-4 py-2 text-base md:px-6 md:py-3 md:text-lg w-full flex justify-center items-center gap-2",
    {
      "opacity-80 cursor-not-allowed": loading,
      "bg-primary-base text-white": primary,
      "bg-gray-500 text-white": secondary,
      "bg-green-500 text-white": success,
      "bg-red-500 text-white": danger,
      "bg-yellow-400 text-white": warning,
      "rounded-lg": rounded,
      "rounded-full": rounded && primary, // Example custom rule
      "bg-white": outline,
      "text-blue-500": outline && primary,
      "text-gray-900": outline && secondary,
      "text-green-500": outline && success,
      "text-yellow-400": outline && warning,
      "text-red-500": outline && danger,
    }
  );

  const { href, el } = rest;

  if (el === "anchor") {
    return (
      <Link href={href} className={classes}>
        {loading ? (
          <GoSync data-testid="spinner" className="animate-spin" />
        ) : (
          children
        )}
      </Link>
    );
  }

  const { type } = rest;

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
