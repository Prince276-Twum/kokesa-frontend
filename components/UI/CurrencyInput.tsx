import React, { useState, useRef, useEffect } from "react";
import { NumericFormat } from "react-number-format";

type CurrencyInputProps = {
  id: string;
  value: number | string;
  onChange: (value: number) => void;
  placeholder?: string;
  currencySymbol: string;
  disabled?: boolean;
  error?: string;
  className?: string;
  required?: boolean;
};

const CurrencyInput: React.FC<CurrencyInputProps> = ({
  id,
  value,
  onChange,
  placeholder = "0.00",
  currencySymbol,
  disabled = false,
  error,
  className = "",
  required = false,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(!!value);
  const inputRef = useRef<HTMLInputElement>(null);

  // Update hasValue when value prop changes
  useEffect(() => {
    setHasValue(!!value);
  }, [value]);

  const handleValueChange = (values: any) => {
    const numericValue = Number(values.value);
    onChange(numericValue);
    setHasValue(!!values.value);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  return (
    <div className="relative">
      <div
        className={`relative w-full rounded-lg border 
        ${error ? "border-red-400" : "border-gray-300"} 
        ${disabled ? "bg-gray-50" : "bg-transparent"} 
        ${isFocused ? "border-gray-600 ring-1 ring-gray-400" : ""} 
        hover:border-gray-400 transition-all duration-200 ${className}`}
      >
        {/* Currency symbol - positioned as absolute with good spacing */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
          {currencySymbol}
        </div>

        {/* The actual input field with generous left padding to avoid currency overlap */}
        <NumericFormat
          id={id}
          getInputRef={inputRef}
          value={value}
          thousandSeparator
          onValueChange={handleValueChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={disabled}
          placeholder=""
          className={`peer w-full rounded-lg border-none bg-transparent py-2 pl-12 pr-4 text-gray-900 focus:outline-none
          ${disabled ? "text-gray-500" : ""}`}
          required={required}
          allowLeadingZeros={false}
          allowNegative={false}
          decimalScale={2}
        />

        {/* Floating label - starts in the middle but moves up when focused or has value */}
        <label
          htmlFor={id}
          className={`absolute bg-white px-1 text-sm transition-all duration-200
          ${error ? "text-red-500" : "text-gray-500"}
          ${
            isFocused || hasValue
              ? "-top-2.5 left-3 text-sm text-gray-700"
              : "top-1/2 -translate-y-1/2 left-12 text-gray-400 text-base"
          }
          peer-focus:-top-2.5 peer-focus:left-3 peer-focus:text-sm peer-focus:text-gray-700
          z-10 pointer-events-none`}
        >
          {placeholder}
        </label>
      </div>

      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default CurrencyInput;
