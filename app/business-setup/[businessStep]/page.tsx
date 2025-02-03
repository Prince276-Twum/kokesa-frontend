"use client";
import {
  BusinessCategory,
  SetupDetails,
  ServiceLocationOptions,
  StepProgress,
  BusinessAddress,
} from "@/components/business-setup/";
import { setCurrentStep } from "@/store/features/businessSetupSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { FaArrowLeft } from "react-icons/fa";

const stepContent = [
  {
    title: "About You & Your Business",
    subtitle: "Tell us about yourself and your business",
    path: "/business-setup/details",
  },
  // {
  //   title: "Confirm 6 Digit code",
  //   subtitle:
  //     "A 6 digit code was sent to +233 22 12 34 56, enter the code to continue. ",
  //   path: "/business-setup/location",
  // },
  {
    title: "What business do you do?",
    subtitle: "Provide your business details",
    path: "/business-setup/category",
  },

  {
    title: "Add Service Location",
    subtitle: "Where do you work?",
    path: "/business-setup/location",
  },

  {
    title: "Your Address",
    subtitle: "Add location for clients to find you",
    path: "/business-setup/address",
  },
  {
    title: "Set Your Working Hours",
    subtitle: "Define your business working hours",
    path: "/business-setup/hours",
  },
  {
    title: "Contact Information",
    subtitle: "Provide your contact details",
    path: "/business-setup/contact",
  },
];

function Page() {
  const { currentStep } = useAppSelector((store) => store.businessSetup);
  const dispatch = useAppDispatch();

  const handleNextStep = () => {
    const nextStep = currentStep + 1;
    // Update step in Redux
    dispatch(setCurrentStep(nextStep));

    // Update URL without reload using history API
    const newPath = stepContent[nextStep - 1]?.path;
    if (newPath) {
      window.history.pushState({}, "", newPath);
    }
  };

  const handlePrevStep = () => {
    const prevStep = currentStep - 1;
    if (currentStep == 1) {
      return;
    } else {
      // Update step in Redux
      dispatch(setCurrentStep(prevStep));
    }

    // Update URL without reload using history API
    const newPath = stepContent[prevStep - 1]?.path;
    if (newPath) {
      window.history.pushState({}, "", newPath);
    }
  };

  const { title, subtitle } = stepContent[currentStep - 1] || {};


  return (
    <main className=" relative md:pt-20">
      <div className="max-w-md mx-auto md:shadow-lg p-6 md:rounded-lg md:p-6">
        <div>
          <StepProgress
            currentStep={currentStep == 2 ? 0.5 : currentStep - 2}
            steps={[
              "Business Info",
              "Location",
              "Hours",
              "Contact",
              "Business Info",
              "Location",
              "Hours",
              "Contact",
            ]}
            title={title}
            subtitle={subtitle}
            onBack={handlePrevStep}
          />
          {currentStep === 1 && <SetupDetails />}
          {currentStep === 2 && <BusinessCategory />}
          {currentStep === 3 && <ServiceLocationOptions />}
          {currentStep === 4 && <BusinessAddress />}
          {currentStep === 5 && <div>Contact Information</div>}
          <div className="mt-4 flex justify-between">
            <button
              onClick={handlePrevStep}
              disabled={currentStep === 1}
              className="flex items-center gap-2"
            >
              <FaArrowLeft /> Back
            </button>
            <button
              onClick={handleNextStep}
              disabled={currentStep === stepContent.length}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Page;
