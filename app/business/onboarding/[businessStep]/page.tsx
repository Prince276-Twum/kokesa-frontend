"use client";
import {
  BusinessCategory,
  SetupDetails,
  ServiceLocationOptions,
  BusinessAddress,
  BusinessServices,
  BusinessWorkingHours,
  BusinessGoals,
} from "@/components/business-setup/";
import TravelFeeForm from "@/components/business-setup/TravelFeeForm";
import { use } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/store/hooks";
import { LocationOptions } from "@/utils/common-varialbles";
import TeamSize from "@/components/business-setup/TeamSize";
import { IoArrowBack } from "react-icons/io5";
import { motion } from "framer-motion";

interface Props {
  params: Promise<{ businessStep: string }>;
}

const stepContentAll = [
  {
    title: "About You & Your Business",
    subtitle: "Tell us about yourself and your business",
    path: "/business/onboarding/details",
    icon: "👋",
  },
  {
    title: "What business do you do?",
    subtitle: "Provide your business details",
    path: "/business/onboarding/category",
    icon: "💼",
  },
  {
    title: "Add Service Location",
    subtitle: "Where do you work?",
    path: "/business/onboarding/location-option",
    icon: "📍",
  },
  {
    title: "Your Address",
    subtitle: "Add location for clients to find you",
    path: "/business/onboarding/address",
    icon: "🏠",
  },
  {
    title: "Travel to Client's Location",
    subtitle: "Add location for clients to find you",
    path: "/business/onboarding/travel-fee",
    icon: "🚗",
  },
  {
    title: "What's your team size?",
    subtitle: "Select the number of team/s available",
    path: "/business/onboarding/team-size",
    icon: "👥",
  },
  {
    title: "Service Details",
    subtitle: "Edit and add the details for this service",
    path: "/business/onboarding/services",
    icon: "🛠️",
  },
  {
    title: "Service Details",
    subtitle: "Edit and add the details for this service",
    path: "/business/onboarding/add-service",
    icon: "➕",
  },
  {
    title: "Set Your Working Hours",
    subtitle: "Define your business working hours",
    path: "/business/onboarding/hours",
    icon: "🕒",
  },
  {
    title: "How can our app help your business?",
    subtitle: "Select one or more",
    path: "/business/onboarding/business-goals",
    icon: "🎯",
  },
];

function Page({ params }: Props) {
  const { businessStep } = use(params);
  const {
    currentStep,
    businessInfo: { businessLocationOption },
  } = useAppSelector((store) => store.businessSetup);
  const router = useRouter();
  const currentStepPath = businessStep || "details";

  let stepContent = stepContentAll;

  if (businessLocationOption === LocationOptions[1].label) {
    stepContent = stepContent.filter((step) => {
      return step.title !== "Travel to Client's Location";
    });
  }

  // Calculate progress percentage for the ProgressBar
  const calculateProgressPercentage = (): number => {
    let stepIndex = stepContent.findIndex(
      (item) => item.path === `/business/onboarding/${currentStepPath}`
    );

    if (stepIndex === -1) stepIndex = 0;

    // Convert to percentage (add 1 because steps are 0-indexed)
    const percentage = Math.floor(((stepIndex + 1) / stepContent.length) * 100);
    return Math.min(percentage, 100); // Cap at 100%
  };

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
        return <BusinessServices addServices={false} />;
      case "add-service":
        return <BusinessServices addServices={true} />;
      case "hours":
        return <BusinessWorkingHours />;
      case "travel-fee":
        return <TravelFeeForm />;
      case "business-goals":
        return <BusinessGoals />;
      default:
        return <SetupDetails />;
    }
  };

  const handlePrevStep = () => {
    const prevStep =
      stepContent.findIndex(
        (item) => item.path === `/business/onboarding/${currentStepPath}`
      ) - 1;
    if (prevStep >= 0) {
      const newPath = stepContent[prevStep]?.path;

      if (newPath == "/business/onboarding/add-service") {
        router.push("/business/onboarding/services");
      } else {
        router.push(newPath);
      }
    }
  };

  const currentStepDetails = stepContent.find(
    (item) => item.path === `/business/onboarding/${currentStepPath}`
  );

  const title = currentStepDetails?.title || "";
  const subtitle = currentStepDetails?.subtitle || "";
  const icon = currentStepDetails?.icon || "";

  // Check if we're on the first step
  const isFirstStep =
    stepContent.findIndex(
      (item) => item.path === `/business/onboarding/${currentStepPath}`
    ) === 0;

  return (
    <main className="relative min-h-screen bg-white md:bg-gradient-to-b md:from-gray-50 md:to-gray-100 py-0 px-0 md:py-16 md:px-0">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-lg mx-auto bg-white border-0 shadow-none md:shadow-xl md:rounded-xl "
      >
        <div className="relative">
          {/* Progress indicator */}
          <div className="h-1.5 w-full bg-gray-100">
            <div
              className="h-full bg-gradient-to-r from-orange-400 to-orange-600 transition-all duration-500 ease-out"
              style={{ width: `${calculateProgressPercentage()}%` }}
            ></div>
          </div>

          {/* Step indicator chips */}
          <div className="flex justify-between px-4 md:px-8 -mt-2.5">
            {[0, 25, 50, 75, 100].map((step, index) => (
              <div
                key={step}
                className={`h-4 w-4 md:h-5 md:w-5 rounded-full border-2 border-white ${
                  calculateProgressPercentage() >= step
                    ? "bg-orange-500"
                    : "bg-gray-200"
                } ${index === 0 ? "ml-0.5" : ""} ${
                  index === 4 ? "mr-0.5" : ""
                } transition-all duration-300`}
              ></div>
            ))}
          </div>
        </div>

        <div className="p-4 md:p-8">
          {/* Title section with icon */}
          <div className="mb-8">
            {!isFirstStep && (
              <button
                onClick={handlePrevStep}
                className="flex items-center text-gray-500 hover:text-orange-500 mb-4 md:mb-6 transition-colors group"
              >
                <IoArrowBack className="text-sm md:text-base mr-1.5 md:mr-1.5 group-hover:-translate-x-0.5 transition-transform" />
                <span className="text-xs md:text-sm font-medium">Back</span>
              </button>
            )}

            <div className="flex items-start">
              <div className="inline-flex shrink-0 mr-3 bg-orange-50 text-orange-500 p-2.5 md:p-3 rounded-md">
                <span className="text-lg md:text-xl">{icon}</span>
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-gray-800 leading-tight">
                  {title}
                </h1>
                <p className="text-xs md:text-sm text-gray-500 mt-1 leading-snug">
                  {subtitle}
                </p>
              </div>
            </div>
          </div>

          {/* Form content */}
          <motion.div
            key={currentStepPath}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            className="mt-3 md:mt-4"
          >
            {renderStepContent()}
          </motion.div>

          {/* Step indicator text */}
          <div className="mt-6 md:mt-8 pt-4 md:pt-6 border-t border-gray-50 md:border-gray-100 flex justify-between items-center">
            <div className="text-xs text-gray-400 font-medium">
              Step{" "}
              {stepContent.findIndex(
                (item) =>
                  item.path === `/business/onboarding/${currentStepPath}`
              ) + 1}{" "}
              of {stepContent.length}
            </div>
            <div className="text-xs text-gray-400">
              {Math.floor(calculateProgressPercentage())}% Complete
            </div>
          </div>
        </div>
      </motion.div>
    </main>
  );
}

export default Page;
