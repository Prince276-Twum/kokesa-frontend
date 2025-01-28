"use client";
import { SetupDetails, SetupLocation } from "@/components/business-setup/";
import { useAppSelector } from "@/store/hooks";
import { useState } from "react";

function Page() {
  const { currentStep } = useAppSelector((store) => store.businessSetup);
  const [steps, setSteps] = useState(currentStep);

  const handleNextStep = () => {
    setSteps((prev) => prev + 1);
  };

  const handlePrevStep = () => {
    setSteps((prev) => prev - 1);
  };

  return (
    <main className="">
      <div className="max-w-md mx-auto p-6 md:shadow-lg md:rounded-lg md:p-6">
        <div>
          {steps === 1 && <SetupDetails />}
          {steps === 2 && <SetupLocation />}

          <button onClick={handleNextStep}>Next</button>
          <button onClick={handlePrevStep}>Back</button>
        </div>
      </div>
    </main>
  );
}

export default Page;
