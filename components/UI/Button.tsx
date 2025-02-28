import React, { ComponentPropsWithoutRef, ReactNode } from "react";
import Link from "next/link";
import classnames from "classnames";

type ButtonVariation =
  | {
      primary?: true;
      danger?: never;
      success?: never;
      secondary?: never;
      warning?: never;
    }
  | {
      danger?: true;
      primary?: never;
      success?: never;
      secondary?: never;
      warning?: never;
    }
  | {
      success?: true;
      primary?: never;
      danger?: never;
      secondary?: never;
      warning?: never;
    }
  | {
      secondary?: true;
      primary?: never;
      danger?: never;
      success?: never;
      warning?: never;
    }
  | {
      warning?: true;
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
    `disabled:cursor-not-allowed disabled:opacity-50 px-4 py-2 text-base md:px-6 md:py-2 md:text-lg w-full flex justify-center items-center gap-2 transition-all duration-300 ${className}`,
    {
      "cursor-not-allowed": loading,

      // Primary button
      "bg-primary text-white hover:bg-primary-light": primary && !outline,

      // Secondary button
      "bg-gray-500 text-white hover:bg-gray-600": secondary && !outline,

      // Success button
      "bg-green-500 text-white hover:bg-green-600": success && !outline,

      // Danger button
      "bg-red-500 text-white hover:bg-red-600": danger && !outline,

      // Warning button
      "bg-yellow-400 text-white hover:bg-yellow-500": warning && !outline,

      // Rounded styles
      "rounded-[80px]": rounded,
      "rounded-full": rounded && primary,

      // Outline styles
      "bg-white border-2": outline,

      // Outline - Primary
      "border-primary text-primary hover:bg-primary hover:text-white":
        outline && primary,

      // Outline - Secondary
      "border-gray-500 text-gray-900 hover:bg-gray-500 hover:text-white":
        outline && secondary,

      // Outline - Success
      "border-green-500 text-green-500 hover:bg-green-500 hover:text-white":
        outline && success,

      // Outline - Warning
      "border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-white":
        outline && warning,

      // Outline - Danger
      "border-red-500 text-red-500 hover:bg-red-500 hover:text-white":
        outline && danger,
    }
  );

  const { href, el } = rest;

  const LoadingSpinner: React.FC<{ className?: string }> = ({ className }) => (
    <div className={`inline-block ${className}`} data-testid="loading-spinner">
      <div className="relative w-4 h-4">
        <div className="absolute top-0 left-0 w-full h-full rounded-full border-2 opacity-20"></div>
        <div className="absolute top-0 left-0 w-full h-full rounded-full border-t-2 border-l-2 animate-spin"></div>
      </div>
    </div>
  );

  if (el === "anchor") {
    return (
      <Link href={href} className={classes}>
        {loading ? <LoadingSpinner /> : children}
      </Link>
    );
  }

  const { type } = rest;

  return (
    <button
      type={type}
      {...rest}
      disabled={loading || rest.disabled}
      className={classes}
    >
      {loading ? <LoadingSpinner /> : children}
    </button>
  );
}

export default Button;
