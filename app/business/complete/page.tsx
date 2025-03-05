"use client";
import React, { useEffect } from "react";
import Button from "@/components/UI/Button";
import { FiArrowRight } from "react-icons/fi";
import { redirect, useRouter } from "next/navigation";
import CompleteIlustration from "@/components/common/CompleteIlustration";
import { useAppSelector } from "@/store/hooks";

const BusinessSetupSuccess = ({}) => {
  const router = useRouter();
  const {
    businessInfo: { businessName, businessType },
    isSetupComplete,
  } = useAppSelector((store) => store.businessSetup);

  useEffect(() => {
    if (!isSetupComplete) {
      router.push("/business/onboarding/details");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="relative min-h-screen bg-white md:bg-gradient-to-b md:from-gray-50 md:to-gray-100 py-0 px-0 md:py-16 md:px-0">
      <div className="max-w-lg mx-auto bg-white border-0 shadow-none md:shadow-xl md:rounded-xl">
        <div className="p-4 md:p-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="w-48 h-48 md:w-64 md:h-64">
                <CompleteIlustration />
              </div>
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3 font-manrope">
              You're All Set!
            </h1>

            <h2 className="text-lg md:text-xl font-semibold text-orange-500 mb-3 font-manrope">
              {businessName}
            </h2>

            <div className="mb-4 md:mb-6">
              <span className="inline-block bg-orange-50 text-orange-500 px-4 py-1.5 rounded-full text-sm font-medium">
                {businessType}
              </span>
            </div>

            <p className="text-gray-500 text-sm md:text-base mb-6 md:mb-8 max-w-md mx-auto">
              We're excited to help you run your business. Your booking platform
              is ready to accept appointments and manage your schedule.
            </p>

            <div className="mb-6 md:mb-8 grid grid-cols-2 gap-3 md:gap-4 max-w-md mx-auto">
              <div className="bg-gray-50 p-3 md:p-4 rounded-lg">
                <div className="text-orange-500 font-semibold mb-1 text-base md:text-lg">
                  Manage Bookings
                </div>
                <p className="text-gray-500 text-xs md:text-sm">
                  Schedule and track all appointments
                </p>
              </div>
              <div className="bg-gray-50 p-3 md:p-4 rounded-lg">
                <div className="text-orange-500 font-semibold mb-1 text-base md:text-lg">
                  Client Management
                </div>
                <p className="text-gray-500 text-xs md:text-sm">
                  Organize your customer information
                </p>
              </div>
              <div className="bg-gray-50 p-3 md:p-4 rounded-lg">
                <div className="text-orange-500 font-semibold mb-1 text-base md:text-lg">
                  Mobile Access
                </div>
                <p className="text-gray-500 text-xs md:text-sm">
                  Run your business from anywhere
                </p>
              </div>
              <div className="bg-gray-50 p-3 md:p-4 rounded-lg">
                <div className="text-orange-500 font-semibold mb-1 text-base md:text-lg">
                  Analytics
                </div>
                <p className="text-gray-500 text-xs md:text-sm">
                  Track performance and growth
                </p>
              </div>
            </div>

            <Button
              el="button"
              primary
              rounded
              className="w-full py-3"
              onClick={() => redirect("dashboard")}
            >
              Continue to Dashboard
              <FiArrowRight className="ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default BusinessSetupSuccess;
