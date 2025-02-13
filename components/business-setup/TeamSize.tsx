import { useRouter } from "next/navigation";
import React, { useState } from "react";

const TeamSizeSelector = () => {
  const [selectedSize, setSelectedSize] = useState("2-3");
  const router = useRouter();

  const options = [
    { id: "solo", label: "Just me for now" },
    { id: "2-3", label: "2-3 staff members" },
    { id: "4-6", label: "4-6 staff members" },
    { id: "6plus", label: "More than 6 staff members" },
  ];

  const handleContinue = () => {
    if (!selectedSize) {
      return;
    }
    router.push("services");
  };

  return (
    <div>
      <div className="space-y-4">
        {options.map((option) => (
          <label
            key={option.id}
            className="flex items-center p-4 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50"
          >
            <input
              type="radio"
              name="teamSize"
              value={option.id}
              checked={selectedSize === option.id}
              onChange={() => setSelectedSize(option.id)}
              className="h-4 w-4 text-orange-500 border-gray-300 focus:ring-orange-500"
            />
            <span className="ml-3 text-gray-700">{option.label}</span>
          </label>
        ))}
      </div>

      {/* Continue button */}
      <button
        onClick={handleContinue}
        className="w-full bg-orange-500 text-white rounded-full py-4 px-6 mt-8 hover:bg-orange-600 transition-colors"
      >
        Continue
      </button>
    </div>
  );
};

export default TeamSizeSelector;
