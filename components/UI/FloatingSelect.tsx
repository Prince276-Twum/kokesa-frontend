import React, { useState, useRef } from "react";
import Select, { StylesConfig, GroupBase, OptionsOrGroups } from "react-select";

// Define prop types for FloatingSelect
interface FloatingSelectProps<
  Option,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>
> {
  options: OptionsOrGroups<Option, Group>;
  value: Option | null;
  onChange: (newValue: Option | null) => void;
  placeholder?: string;
  id: string;
  error?: string;
  styles?: StylesConfig<Option, IsMulti, Group>;
  maxMenuHeight?: number;
  isClearable?: boolean;
  isSearchable?: boolean;
  isDisabled?: boolean;
}

// Custom floating label Select component with improved styling
function FloatingSelect<
  Option = unknown,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>
>({
  options,
  value,
  onChange,
  placeholder,
  isDisabled,
  id,
  error,
  styles: propStyles,
  maxMenuHeight = 300,
  isClearable = false,
  isSearchable = false,
}: FloatingSelectProps<Option, IsMulti, Group>) {
  const [isFocused, setIsFocused] = useState(false);
  const selectRef = useRef(null);

  // Default select styles
  const defaultStyles: StylesConfig<Option, IsMulti, Group> = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: "white",
      borderColor: error ? "#f56565" : state.isFocused ? "#6B7280" : "#e5e7eb",
      borderRadius: "0.5rem",
      boxShadow: "none",
      minHeight: "42px",
      "&:hover": {
        borderColor: "#d1d5db",
      },
      padding: "2px 0",
      transition: "all 0.2s ease",
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "#9ca3af",
      opacity: 0, // Hide the placeholder as we'll use our custom floating label
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "#1f2937",
    }),
    menu: (provided) => ({
      ...provided,
      borderRadius: "0.5rem",
      boxShadow:
        "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      zIndex: 9999,
    }),
    menuPortal: (provided) => ({
      ...provided,
      zIndex: 9999,
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? "#FFECE5" : "white",
      color: state.isFocused ? "#EB5017" : "#1f2937",
      cursor: "pointer",
      "&:hover": {
        backgroundColor: "#FFECE5",
      },
    }),
    valueContainer: (provided) => ({
      ...provided,
      padding: "8px 12px",
    }),
    indicatorSeparator: () => ({
      display: "none",
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      color: "#9ca3af",
    }),
    // Fix Select component appearance
    input: (provided) => ({
      ...provided,
      margin: "0",
      padding: "0",
    }),
  };

  // Merge default styles with prop styles if provided
  const mergedStyles = propStyles
    ? { ...defaultStyles, ...propStyles }
    : defaultStyles;

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
        onChange={onChange as any}
        styles={mergedStyles}
        isSearchable={isSearchable}
        isClearable={isClearable}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder=""
        className="peer"
        classNamePrefix="react-select"
        menuPortalTarget={document.body}
        menuPosition="fixed"
        maxMenuHeight={maxMenuHeight}
        isDisabled={isDisabled}
      />
      <label
        htmlFor={id}
        className={`absolute bg-white px-1 text-sm transition-all
        ${error ? "text-red-500" : "text-gray-500"}
        ${
          isFocused || value
            ? "-top-2.5 left-3 text-sm text-gray-700 z-10"
            : "top-1/2 -translate-y-1/2 left-3.5 text-gray-400 text-base z-0"
        }
        pointer-events-none`}
      >
        {placeholder}
      </label>

      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

export default FloatingSelect;
