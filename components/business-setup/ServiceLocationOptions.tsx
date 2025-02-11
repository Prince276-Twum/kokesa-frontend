import React, { useState } from "react";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import Button from "../UI/Button";
import { useSetupBusinessMutation } from "@/store/features/businessApiSetupSlice";
import { useRouter } from "next/navigation";
import { LocationOptions } from "@/utils/common-varialbles";
import {
  setBusinsessLocationOption,
  setCurrentStep,
} from "@/store/features/businessSetupSlice";
import { useAppDispatch } from "@/store/hooks";

const ServiceLocationOptions = () => {
  const [selectedOption, setSelectedOption] = useState("");
  const [setupBusiness, { isLoading }] = useSetupBusinessMutation();
  const dispatch = useAppDispatch();

  const router = useRouter();

  const handleContinue = () => {
    if (selectedOption) {
      setupBusiness({ currentStep: 3, serviceLocation: selectedOption })
        .unwrap()
        .then(() => {
          dispatch(setBusinsessLocationOption(selectedOption));
          dispatch(setCurrentStep(4));
          router.push("address");
        });
    }
  };

  return (
    <div>
      <div className="flex flex-col gap-4">
        {LocationOptions.map((option, index) => (
          <div key={index}>
            <button
              className={`border text-left rounded-md   p-4 w-full ${
                selectedOption === option.label
                  ? "border-blue-500  bg-black  text-white"
                  : "border-black text-body"
              }`}
              onClick={() => setSelectedOption(option.label)}
            >
              {option.label}
            </button>
            <div className="flex items-center gap-2 text-muted">
              <AiOutlineExclamationCircle />
              <span>{option.description}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <Button
          disabled={selectedOption == "" ? true : false}
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
