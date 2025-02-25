import React, { useState } from "react";

interface OptionType {
  id: string;
  label: string;
  highlight: boolean;
}

const BusinessHelp: React.FC = () => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const toggleOption = (option: string): void => {
    if (selectedOptions.includes(option)) {
      setSelectedOptions(selectedOptions.filter((item) => item !== option));
    } else {
      setSelectedOptions([...selectedOptions, option]);
    }
  };

  const options: OptionType[] = [
    { id: "engage", label: "Engage Clients", highlight: false },
    { id: "selling", label: "Selling Products", highlight: false },
    { id: "track", label: "Track business statistics", highlight: true },
    { id: "other", label: "Other", highlight: false },
    { id: "get-clients", label: "Get more clients", highlight: true },
    { id: "low-fees", label: "Low Fees applied", highlight: false },
  ];

  return (
    <div className="flex items-center justify-center">
      <div className="bg-white rounded-lg ">
        <div className="grid grid-cols-2 gap-3 mb-8">
          {options.map((option) => (
            <button
              key={option.id}
              onClick={() => toggleOption(option.id)}
              className={`py-3 px-4 rounded border text-left transition-colors
                ${
                  selectedOptions.includes(option.id)
                    ? "border-orange-500 bg-orange-50 text-orange-700"
                    : "border-gray-300 hover:border-gray-400"
                }
                ${
                  option.highlight && !selectedOptions.includes(option.id)
                    ? "bg-orange-50 border-orange-200"
                    : ""
                }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        <button className="w-full py-4 bg-orange-500 text-white rounded-full font-medium hover:bg-orange-600 transition-colors">
          Continue
        </button>
      </div>
    </div>
  );
};

export default BusinessHelp;
