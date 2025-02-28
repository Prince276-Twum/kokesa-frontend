import React, { ReactNode, ComponentPropsWithoutRef } from "react";

type Props = {
  id: string;
  children?: ReactNode;
  cn?: string;
  inputType?: string;
  error?: string;
  leftIcon?: React.ReactElement;
  rightIcon?: React.ReactElement;
  iconClickable?: boolean;
  onIconClick?: () => void;
} & ComponentPropsWithoutRef<"input">;

function Input({
  type = "text",
  placeholder,
  id,
  cn,
  error,
  leftIcon,
  rightIcon,
  iconClickable = false,
  onIconClick,
  ...rest
}: Props) {
  const hasLeftIcon = !!leftIcon;
  const hasRightIcon = !!rightIcon;

  return (
    <div className="relative w-full">
      <div className="relative">
        {hasLeftIcon && (
          <div
            className={`absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 ${
              iconClickable ? "cursor-pointer hover:text-gray-600" : ""
            }`}
            onClick={iconClickable ? onIconClick : undefined}
          >
            {leftIcon}
          </div>
        )}

        <input
          type={type}
          id={id}
          className={`peer block w-full rounded-lg border ${
            error ? "border-red-400" : "border-gray-300"
          } bg-transparent text-sm text-gray-900 transition-all duration-200 
          focus:border-gray-600 focus:outline-none focus:ring-1 focus:ring-gray-400 
          hover:border-gray-400 
          ${hasLeftIcon ? "pl-10" : "px-4"} 
          ${hasRightIcon ? "pr-10" : "px-4"} 
          pt-3 pb-2 ${cn}`}
          {...rest}
          placeholder=""
        />

        {hasRightIcon && (
          <div
            className={`absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 ${
              iconClickable ? "cursor-pointer hover:text-gray-600" : ""
            }`}
            onClick={iconClickable ? onIconClick : undefined}
          >
            {rightIcon}
          </div>
        )}

        <label
          htmlFor={id}
          className={`absolute left-3 -top-2.5 bg-white px-1 text-sm ${
            error ? "text-red-500" : "text-gray-500"
          } transition-all peer-placeholder-shown:top-2 
          ${
            hasLeftIcon
              ? "peer-placeholder-shown:left-10"
              : "peer-placeholder-shown:left-3"
          } 
          peer-placeholder-shown:text-gray-400 
          peer-placeholder-shown:text-base peer-focus:-top-2.5 peer-focus:left-3 peer-focus:text-sm 
          peer-focus:text-gray-700 z-10`}
        >
          {placeholder}
        </label>
      </div>

      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

export default Input;
