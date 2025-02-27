import { useRouter } from "next/navigation";
import React, { useState } from "react";
import Button from "../UI/Button";
import { MdGroups, MdPerson, MdCheck } from "react-icons/md";

const TeamSizeSelector = () => {
  const [selectedSize, setSelectedSize] = useState("2-3");
  const router = useRouter();

  const options = [
    {
      id: "solo",
      label: "Just me for now",
      description: "You're operating as an individual professional",
      icon: <MdPerson />,
    },
    {
      id: "2-3",
      label: "2-3 staff members",
      description: "Small team of professionals",
      icon: <MdGroups />,
    },
    {
      id: "4-6",
      label: "4-6 staff members",
      description: "Medium-sized team",
      icon: <MdGroups />,
    },
    {
      id: "6plus",
      label: "More than 6 staff members",
      description: "Larger establishment with multiple staff",
      icon: <MdGroups />,
    },
  ];

  const handleContinue = () => {
    if (!selectedSize) {
      return;
    }
    router.push("services");
  };

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        {options.map((option) => (
          <label
            key={option.id}
            className={`block relative p-4 rounded-xl border-2 transition-colors cursor-pointer ${
              selectedSize === option.id
                ? "border-primary bg-primary/5"
                : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
            }`}
          >
            <input
              type="radio"
              name="teamSize"
              value={option.id}
              checked={selectedSize === option.id}
              onChange={() => setSelectedSize(option.id)}
              className="absolute opacity-0"
            />
            <div className="flex items-center">
              <div
                className={`flex-shrink-0 w-5 h-5 mr-3 rounded-full border flex items-center justify-center ${
                  selectedSize === option.id
                    ? "border-primary bg-primary"
                    : "border-gray-300"
                }`}
              >
                {selectedSize === option.id && (
                  <div className="w-2 h-2 rounded-full bg-white"></div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center">
                  <span className="font-medium text-gray-900">
                    {option.label}
                  </span>
                  <span
                    className={`ml-2 text-${
                      selectedSize === option.id ? "primary" : "gray-400"
                    }`}
                  >
                    {option.icon}
                  </span>
                </div>
                {option.description && (
                  <span className="block text-sm text-gray-600 mt-1">
                    {option.description}
                  </span>
                )}
              </div>
              {selectedSize === option.id && (
                <MdCheck className="text-primary text-xl ml-2" />
              )}
            </div>
          </label>
        ))}
      </div>

      <Button
        el="button"
        primary
        rounded
        onClick={handleContinue}
        className="w-full py-4 text-lg font-medium"
      >
        Continue
      </Button>
    </div>
  );
};

export default TeamSizeSelector;
