import { useState, useRef } from "react";
import Select from "react-select";
const FloatingSelect = ({
  options,
  value,
  onChange,
  placeholder,
  id,
  error,
}: any) => {
  const [isFocused, setIsFocused] = useState(false);
  const selectRef = useRef(null);

  // Custom styles for React Select
  const selectStyles = {
    control: (provided: any, state: any) => ({
      ...provided,
      border: `1px solid ${
        error ? "#f56565" : state.isFocused ? "#6B7280" : "#e5e7eb"
      }`,
      borderRadius: "0.375rem",
      boxShadow: "none",
      padding: "2px 0",
      minHeight: "42px",
      "&:hover": {
        borderColor: "#d1d5db",
      },
      backgroundColor: "transparent",
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isSelected ? "#f3f4f6" : "white",
      color: "#1a1a1a",
      padding: "8px 12px",
      "&:hover": {
        backgroundColor: "#f9fafb",
      },
    }),
    menu: (provided: any) => ({
      ...provided,
      borderRadius: "0.375rem",
      boxShadow:
        "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      zIndex: 9999,
    }),
    menuPortal: (provided: any) => ({
      ...provided,
      zIndex: 9999,
    }),
    singleValue: (provided: any) => ({
      ...provided,
      color: "#1a1a1a",
      fontWeight: 500,
    }),
    valueContainer: (provided: any) => ({
      ...provided,
      padding: "2px 12px",
    }),
    indicatorSeparator: () => ({
      display: "none",
    }),
    dropdownIndicator: (provided: any) => ({
      ...provided,
      color: "#9ca3af",
    }),
    placeholder: (provided: any) => ({
      ...provided,
      color: "#9ca3af",
    }),
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  return (
    <div className="relative w-full">
      <Select
        id={id}
        ref={selectRef}
        options={options}
        value={value}
        onChange={onChange}
        styles={selectStyles}
        isSearchable={false}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder=""
        className="peer"
        classNamePrefix="react-select"
        menuPortalTarget={document.body}
        menuPosition="fixed"
      />
      <label
        htmlFor={id}
        className={`absolute left-3 bg-white px-1 text-sm transition-all
          ${error ? "text-red-500" : "text-gray-500"}
          ${
            isFocused || value
              ? "-top-2.5 text-sm text-gray-700"
              : "top-2 text-gray-400 text-base"
          }
          z-10`}
      >
        {placeholder}
      </label>

      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default FloatingSelect;
