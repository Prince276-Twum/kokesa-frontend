"use client";
import {
  BusinessCategory,
  SetupDetails,
  ServiceLocationOptions,
  StepProgress,
  BusinessAddress,
  BusinessServices,
} from "@/components/business-setup/";
import TravelFeeForm from "@/components/business-setup/TravelFeeForm";
import { use } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/store/hooks";
import { LocationOptions } from "@/utils/common-varialbles";
import TeamSize from "@/components/business-setup/TeamSize";

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
    title: "Your Address",
    subtitle: "Add location for clients to find you",
    path: "/business-setup/address",
  },
  {
    title: "Travel to Client’s Location",
    subtitle: "Add location for clients to find you",
    path: "/business-setup/travel-fee",
  },

  {
    title: "What’s your team size?",
    subtitle: "Select the number of team/s available",
    path: "/business-setup/team-size",
  },
  {
    title: "Service Details",
    subtitle: "Edit and add the details for this service",
    path: "/business-setup/services",
  },

  {
    title: "Service Details",
    subtitle: "Edit and add the details for this service",
    path: "/business-setup/add-service",
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

  if (businessLocationOption == LocationOptions[1].label) {
    stepContent = stepContent.filter((step) => {
      return step.title !== "Travel to Client’s Location";
    });
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
    case "team-size":
      progressNumber = 2;
    case "services":
      progressNumber = 2.5;
      break;
    case "add-service":
      progressNumber = 2.5;
      break;
    case "hours":
      progressNumber = 3;
      break;
    case "contact":
      progressNumber = 3.5;
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
      case "team-size":
        return <TeamSize />;
      case "services":
        return <BusinessServices />;
      case "add-service":
        return <BusinessServices addService={businessStep} />;
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
