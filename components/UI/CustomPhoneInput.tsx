import "react-phone-number-input/style.css";
import React from "react";

interface CustomPhoneInputProps {
  value: string;
  onChange: (value: string) => void;
}

const CustomPhoneInput = React.forwardRef<
  HTMLInputElement,
  CustomPhoneInputProps
>(({ value, onChange, ...props }, ref) => {
  return (
    <div className="relative w-full">
      <input
        id="phone-number"
        {...props}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        ref={ref}
        placeholder=""
        className={`peer block w-full rounded-lg border border-gray-300 bg-transparent px-4 pt-3 pb-2 text-sm text-gray-900 focus:border-gray-600 focus:outline-none focus:ring-1 focus:ring-gray-400`}
      />
      <label
        htmlFor="phone-number"
        className="absolute left-3 -top-2.5 bg-white px-1 text-sm text-gray-500 transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-gray-700"
      >
        Your Phone Number
      </label>
    </div>
  );
});

CustomPhoneInput.displayName = "CustomPhoneInput";

export default CustomPhoneInput;
