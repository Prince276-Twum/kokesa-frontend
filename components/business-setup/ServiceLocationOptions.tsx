import React, { useEffect, useState } from "react";
import { FaHome, FaBuilding } from "react-icons/fa";
import Button from "../UI/Button";
import { useSetupBusinessMutation } from "@/store/features/businessApiSetupSlice";
import { useRouter } from "next/navigation";
import { LocationOptions } from "@/utils/common-varialbles";
import {
  setBusinessDetail,
  setCurrentStep,
} from "@/store/features/businessSetupSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

const ServiceLocationOptions = () => {
  const [selectedOption, setSelectedOption] = useState<string | undefined>("");
  const [setupBusiness, { isLoading }] = useSetupBusinessMutation();
  const dispatch = useAppDispatch();
  const { businessInfo } = useAppSelector((store) => store.businessSetup);

  const router = useRouter();
  useEffect(() => {
    setSelectedOption(businessInfo.businessLocationOption);
  }, [businessInfo.businessLocationOption]);

  const handleContinue = () => {
    if (selectedOption) {
      setupBusiness({ currentStep: 3, serviceLocation: selectedOption })
        .unwrap()
        .then(() => {
          dispatch(
            setBusinessDetail({
              ...businessInfo,
              businessLocationOption: selectedOption,
            })
          );
          dispatch(setCurrentStep(4));
          router.push("address");
        });
    }
  };

  // Icons for each option
  const getIcon = (label: string) => {
    if (label.includes("Your Place") || label.includes("home")) {
      return <FaHome className="text-lg" />;
    } else if (label.includes("Business") || label.includes("Location")) {
      return <FaBuilding className="text-lg" />;
    } else {
      // For the "both" option
      return (
        <div className="flex">
          <FaHome className="text-lg" />
          <FaBuilding className="text-lg ml-1" />
        </div>
      );
    }
  };

  return (
    <div>
      <div className="flex flex-col gap-4">
        {LocationOptions.map((option, index) => {
          const isSelected = selectedOption === option.label;

          return (
            <div key={index} className="relative">
              <button
                className={`w-full relative transition-all duration-200 rounded-lg border ${
                  isSelected
                    ? "border-transparent bg-secondary-hover pl-8"
                    : "border-gray-200 bg-white hover:border-gray-300"
                } py-4 px-4 text-left`}
                onClick={() => setSelectedOption(option.label)}
              >
                {isSelected && (
                  <div className="absolute left-0 top-0 bottom-0 w-2 bg-primary rounded-l-lg"></div>
                )}
                <div className="flex items-center">
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-lg ${
                      isSelected ? "bg-white" : "bg-gray-100"
                    }`}
                  >
                    <span
                      className={isSelected ? "text-primary" : "text-gray-600"}
                    >
                      {getIcon(option.label)}
                    </span>
                  </div>
                  <div className="ml-3">
                    <h3 className="font-medium text-gray-900">
                      {option.label}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {option.description}
                    </p>
                  </div>
                </div>
              </button>
            </div>
          );
        })}
      </div>

      <div className="mt-6">
        <Button
          disabled={selectedOption === ""}
          el="button"
          primary
          rounded
          loading={isLoading}
          onClick={handleContinue}
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default ServiceLocationOptions;
