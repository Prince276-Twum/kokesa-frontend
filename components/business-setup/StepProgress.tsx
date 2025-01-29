interface StepProgressProps {
  currentStep: number;
  steps: string[];
  title: string;
  subtitle: string;
  onBack?: () => void;
}

import React from "react";

function StepProgress({
  currentStep,
  steps,
  title,
  subtitle,
  onBack,
}: StepProgressProps) {
  return (
    <div className="p-4">
      <div className="flex items-center mb-6">
        <button
          onClick={onBack}
          className="text-blue-600 mr-4"
          aria-label="Go back"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="w-6 h-6"
          >
            <path
              d="M19 12H5M12 19l-7-7 7-7"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          </svg>
        </button>
        <h1 className="text-2xl font-semibold flex-1 text-center">{title}</h1>
      </div>

      {/* Progress dots */}
      <div className="flex justify-center mb-4">
        {steps.map((_, index) => (
          <div key={index} className="flex items-center">
            <div
              className={`w-8 h-2 rounded-full transition-colors duration-200 ${
                index <= currentStep ? "bg-blue-600" : "bg-gray-200"
              }`}
            />
            {index < steps.length - 1 && (
              <div className="w-4" /> // spacing between dots
            )}
          </div>
        ))}
      </div>

      {/* Subtitle */}
      <p className="text-gray-500 text-center">{subtitle}</p>
    </div>
  );
}

export default StepProgress;
