interface StepProgressProps {
  currentStep: number;
  steps: string[];
  title: string;
  subtitle: string;
  onBack?: () => void;
}

import React from "react";
import { FaArrowLeft } from "react-icons/fa6";

function StepProgress({
  currentStep,
  steps,
  title,
  subtitle,
  onBack,
}: StepProgressProps) {
  return (
    <div className="">
      <div className="mb-14">
        <div className="relative">
          <div className="flex relative  space-x-4 justify-center  mb-6">
            <button
              onClick={onBack}
              className="text-blue-600 "
              aria-label="Go back"
            >
              {currentStep > 0 && (
                <FaArrowLeft size={24} className="left-0 absolute" />
              )}
            </button>
            <h1 className="text-header font-semibold absolute  top-[-5] text-center ">
              {title}
            </h1>
          </div>
        </div>
      </div>

      <div className="flex justify-center mb-2">
        {steps.map((_, index) => (
          <div key={index} className="flex items-center">
            <div
              className={`w-8 h-2 rounded-full transition-colors duration-200 ${
                index <= currentStep ? "bg-blue-600" : "bg-gray-200"
              }`}
            />
            {index < steps.length - 1 && (
              <div className="w-4" /> 
            )}
          </div>
        ))}
      </div>

      <p className="mb-8 text-small">{subtitle}</p>
    </div>
  );
}

export default StepProgress;
