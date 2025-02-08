"use client";
import {
  BusinessCategory,
  SetupDetails,
  ServiceLocationOptions,
  StepProgress,
  BusinessAddress,
} from "@/components/business-setup/";
import TravelFeeForm from "@/components/business-setup/TravelFeeForm";
import { use } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/store/hooks";
import { options } from "@/utils/common-varialbles";

interface Props {
  params: Promise<{ businessStep: string }>;
}

const stepContentAll = [
  {
    title: "About You & Your Business",
    subtitle: "Tell us about yourself and your business",
    path: "/business-setup/details",
  },
  {
    title: "What business do you do?",
    subtitle: "Provide your business details",
    path: "/business-setup/category",
  },
  {
    title: "Add Service Location",
    subtitle: "Where do you work?",
    path: "/business-setup/location-option",
  },

  {
    title: "Travel to Client’s Location",
    subtitle: "Add location for clients to find you",
    path: "/business-setup/travel-fee",
  },
  {
    title: "Your Address",
    subtitle: "Add location for clients to find you",
    path: "/business-setup/address",
  },
  {
    title: "Service Details",
    subtitle: "Edit and add the details for this service",
    path: "/business-setup/services",
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

function Page({ params }: Props) {
  const { businessStep } = use(params);
  const { currentStep, businessLocationOption } = useAppSelector(
    (store) => store.businessSetup
  );
  const router = useRouter();
  const currentStepPath = businessStep || "details";

  let progressNumber = -1;

  let stepContent = stepContentAll;

  // Filter out the "Travel to Client’s Location" step if the condition is met
  if (businessLocationOption === options[1].label) {
    stepContent = stepContent.filter(
      (step) => step.title !== "Travel to Client’s Location"
    );
  }

  switch (currentStepPath) {
    case "details":
      progressNumber = -1;
      break;
    case "category":
      progressNumber = 0.5;
      break;
    case "location-option":
      progressNumber = 1;
      break;
    case "address":
      progressNumber = 1.5;
      break;
    case "travel-fee":
      progressNumber = 1.5;
      break;

    case "services":
      progressNumber = 2;
      break;
    case "hours":
      progressNumber = 2.5;
      break;
    case "contact":
      progressNumber = 3;
      break;
  }
  const renderStepContent = () => {
    switch (currentStepPath) {
      case "details":
        return <SetupDetails />;
      case "category":
        return <BusinessCategory />;
      case "location-option":
        return <ServiceLocationOptions />;
      case "address":
        return <BusinessAddress current_step={currentStep} />;
      case "services":
        return 2;
      case "hours":
        return 2;
      case "contact":
        return 2;
      case "travel-fee":
        return <TravelFeeForm />;
      default:
        return <SetupDetails />;
    }
  };

  const handlePrevStep = () => {
    const prevStep =
      stepContent.findIndex(
        (item) => item.path === `/business-setup/${currentStepPath}`
      ) - 1;
    if (prevStep >= 0) {
      const newPath = stepContent[prevStep]?.path;
      router.push(newPath);
    }
  };

  const currentStepDetails = stepContent.find(
    (item) => item.path === `/business-setup/${currentStepPath}`
  );

  const title = currentStepDetails?.title || "";
  const subtitle = currentStepDetails?.subtitle || "";
  return (
    <main className="relative md:pt-20">
      <div className="max-w-md mx-auto md:shadow-lg p-6 md:rounded-lg md:p-6">
        <div>
          <StepProgress
            currentStep={progressNumber}
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
          {renderStepContent()}
        </div>
      </div>
    </main>
  );
}

export default Page;
