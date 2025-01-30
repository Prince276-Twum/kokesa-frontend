"use client";
import {
  BusinessCategory,
  SetupDetails,
  SetupLocation,
  StepProgress,
} from "@/components/business-setup/";
import { setCurrentStep } from "@/store/features/businessSetupSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useRouter } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa";

const stepContent = [
  {
    title: "About You & Your Business",
    subtitle: "Tell us about yourself and your business",
  },
  {
    title: "Tell us about your business",
    subtitle: "Provide your business details",
  },
  {
    title: "Business Location",
    subtitle: "Set your business location",
  },
  {
    title: "Set Your Working Hours",
    subtitle: "Define your business working hours",
  },
  {
    title: "Contact Information",
    subtitle: "Provide your contact details",
  },
];

function Page() {
  const { currentStep } = useAppSelector((store) => store.businessSetup);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleNextStep = () => {
    dispatch(setCurrentStep(currentStep + 1)); // Use Redux to manage step
  };

  const handlePrevStep = () => {
    if (currentStep === 2) {
      dispatch(setCurrentStep(currentStep - 1)); // Use Redux to manage step
      router.push("/business-setup/detail");
    }
  };

  const { title, subtitle } = stepContent[currentStep - 1] || {};

  let content;
  if (currentStep === 1) {
    content = <SetupDetails />;
  } else {
    content = (
      <div>
        <StepProgress
          currentStep={currentStep}
          steps={["Business Info", "Location", "Hours", "Contact"]}
          title={title}
          subtitle={subtitle}
          onBack={handlePrevStep}
        />
        {currentStep === 1 && <SetupDetails />}
        {currentStep === 2 && <BusinessCategory />}
        {currentStep === 3 && <SetupLocation />}
        {currentStep === 4 && <div>Set Working Hours</div>}
        {currentStep === 5 && <div>Contact Information</div>}
        <div className="mt-4">
          <button onClick={handlePrevStep} disabled={currentStep === 1}>
            <FaArrowLeft /> Back
          </button>
          <button onClick={handleNextStep}>Next</button>
        </div>
      </div>
    );
  }

  return (
    <main className="p-6 md:pt-20">
      <div className="max-w-md mx-auto  md:shadow-lg md:rounded-lg md:p-6">
        {content}
      </div>
    </main>
  );
}

export default Page;
