import React, { useState } from "react";
import { MdCheck, MdStar } from "react-icons/md";
import Button from "@/components/UI/Button";

interface OptionType {
  id: string;
  label: string;
  highlight: boolean;
  description?: string;
  icon?: React.ReactNode;
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

  // Enhanced options with descriptions and icons
  const options: OptionType[] = [
    {
      id: "engage",
      label: "Engage Clients",
      highlight: false,
      description: "Better client communication and engagement tools",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155"
          />
        </svg>
      ),
    },
    {
      id: "selling",
      label: "Selling Products",
      highlight: false,
      description: "Manage inventory and sell products efficiently",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
          />
        </svg>
      ),
    },
    {
      id: "track",
      label: "Track Business Statistics",
      highlight: true,
      description: "Analytics and insights to grow your business",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z"
          />
        </svg>
      ),
    },
    {
      id: "get-clients",
      label: "Get More Clients",
      highlight: true,
      description: "Marketing tools to attract new customers",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
          />
        </svg>
      ),
    },
    {
      id: "low-fees",
      label: "Low Processing Fees",
      highlight: false,
      description: "Save money with competitive transaction rates",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z"
          />
        </svg>
      ),
    },
    {
      id: "other",
      label: "Other Reasons",
      highlight: false,
      description: "Tell us what else you're looking for",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
          />
        </svg>
      ),
    },
  ];

  return (
    <div>
      <div className="">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {options.map((option) => (
            <button
              key={option.id}
              onClick={() => toggleOption(option.id)}
              className={`group flex items-start p-4 rounded-xl border transition-all duration-200 text-left relative overflow-hidden
                ${
                  selectedOptions.includes(option.id)
                    ? "border-primary bg-primary-50 text-primary-dark"
                    : "border-gray-200 hover:border-gray-300 text-gray-700 hover:bg-gray-50"
                }
                ${
                  option.highlight && !selectedOptions.includes(option.id)
                    ? "border-primary-100 bg-primary-50/30"
                    : ""
                }`}
              type="button"
            >
              {/* Selection indicator */}
              {selectedOptions.includes(option.id) && (
                <div className="absolute top-0 right-0 mt-1 mr-1">
                  <div className="bg-primary text-white p-1 rounded-full">
                    <MdCheck size={14} />
                  </div>
                </div>
              )}

              {/* Highlight indicator */}
              {option.highlight && !selectedOptions.includes(option.id) && (
                <div className="absolute top-0 right-0 mt-1 mr-1 text-primary-300">
                  <MdStar size={16} />
                </div>
              )}

              <div className="flex">
                {/* Icon */}
                <div
                  className={`flex-shrink-0 mr-3 p-2 rounded-lg ${
                    selectedOptions.includes(option.id)
                      ? "bg-primary-100 text-primary"
                      : "bg-gray-100 text-gray-500 group-hover:text-primary group-hover:bg-primary-50"
                  } transition-colors`}
                >
                  {option.icon}
                </div>

                {/* Content */}
                <div>
                  <div className="font-medium">{option.label}</div>
                  {option.description && (
                    <p
                      className={`text-sm mt-1 ${
                        selectedOptions.includes(option.id)
                          ? "text-primary-600/80"
                          : "text-gray-500"
                      }`}
                    >
                      {option.description}
                    </p>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="flex justify-center">
          <Button
            el="button"
            primary
            rounded
            disabled={selectedOptions.length === 0}
            className="px-8 py-3 min-w-[200px]"
          >
            Continue
          </Button>
        </div>
      </div>

      <div className="mt-4 text-center text-sm text-gray-500">
        <p>Your answers help us personalize your experience</p>
      </div>
    </div>
  );
};

export default BusinessHelp;
