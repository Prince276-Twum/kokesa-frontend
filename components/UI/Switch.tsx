import React from "react";

const Switch = ({ checked, onCheckedChange, className }) => {
  return (
    <div className={`relative inline-flex items-center ${className}`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={onCheckedChange}
        className="sr-only"
      />
      <div
        className={`w-10 h-6 rounded-full transition-colors duration-300 ease-in-out ${
          checked ? "bg-blue-500" : "bg-gray-300"
        }`}
      >
        <span
          className={`absolute left-0 w-6 h-6 bg-white rounded-full shadow transition-transform duration-300 ease-in-out ${
            checked ? "translate-x-full" : ""
          }`}
        />
      </div>
    </div>
  );
};

export default Switch;
