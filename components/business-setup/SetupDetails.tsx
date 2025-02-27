"use client";
import React, { useState } from "react";
import Input from "../UI/Input";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import CustomPhoneInput from "../UI/CustomPhoneInput";
import Button from "../UI/Button";
import useBusinessSetup from "@/hooks/useBusinessDetail";
import { MdBusiness, MdPerson, MdInfo } from "react-icons/md";
import Link from "next/link";

function SetupDetails() {
  const {
    businessName,
    setBusinessName,
    userName,
    setUserName,
    phoneValue,
    setPhoneValue,
    defaultCountry,
    isButtonDisabled,
    isBusinessLoading,
    onSubmit,
  } = useBusinessSetup();

  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showTermsError, setShowTermsError] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!termsAccepted) {
      setShowTermsError(true);
      return;
    }

    setShowTermsError(false);
    onSubmit(e);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-6">
        <div className="relative">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <MdBusiness size={20} />
          </div>
          <Input
            type="text"
            id="business-name"
            placeholder="Business Name"
            cn="pl-10"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
          />
        </div>

        <div className="relative">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <MdPerson size={20} />
          </div>
          <Input
            id="your-name"
            placeholder="Your Name"
            cn="pl-10"
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
        </div>

        <div className="relative">
          <PhoneInput
            defaultCountry={defaultCountry}
            className="border border-gray-300 rounded-lg pl-4"
            value={phoneValue}
            onChange={setPhoneValue}
            limitMaxLength
            inputComponent={CustomPhoneInput}
            smartCaret
          />
          <p className="mt-1 text-xs text-gray-500">
            We'll use this to communicate with you about your business
          </p>
        </div>

        <div className="pt-2">
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                checked={termsAccepted}
                onChange={() => {
                  setTermsAccepted(!termsAccepted);
                  if (showTermsError) setShowTermsError(false);
                }}
                className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="terms" className="text-gray-600">
                I agree to the{" "}
                <Link href="/terms" className="text-primary hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-primary hover:underline">
                  Privacy Policy
                </Link>
              </label>
            </div>
          </div>
          {showTermsError && (
            <div className="mt-2 flex items-center text-red-500 text-sm">
              <MdInfo className="mr-1" />
              <span>Please accept the terms and conditions to continue</span>
            </div>
          )}
        </div>
      </div>

      <Button
        el="button"
        primary
        rounded
        disabled={isButtonDisabled}
        loading={isBusinessLoading}
        className="w-full py-4 text-lg font-medium"
      >
        Continue
      </Button>
    </form>
  );
}

export default SetupDetails;
