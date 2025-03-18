import React, { FormEvent, useState } from "react";
import Input from "../UI/Input";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import CustomPhoneInput from "../UI/CustomPhoneInput";
import Button from "../UI/Button";
import useBusinessSetup from "@/hooks/useBusinessDetail";
import Link from "next/link";
import { toast } from "react-toastify";

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
    agreedToTerms,
    setAgreedToTerms,
  } = useBusinessSetup();

  const [termsError, setTermsError] = useState("");
  const [businessNameError, setBusinessNameError] = useState("");
  const [userNameError, setUserNameError] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const isFormValid =
    businessName.trim() && userName.trim() && phoneValue && agreedToTerms;
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate fields
    let isValid = true;

    if (!businessName.trim()) {
      setBusinessNameError("Business name is required");
      isValid = false;
    } else {
      setBusinessNameError("");
    }

    if (!userName.trim()) {
      setUserNameError("Your name is required");
      isValid = false;
    } else {
      setUserNameError("");
    }

    if (!phoneValue) {
      setPhoneError("Phone number is required");
      isValid = false;
    } else {
      setPhoneError("");
    }

    if (!agreedToTerms) {
      setTermsError("Please accept the terms and conditions to continue");
      toast.error("Please accept the terms and conditions to continue");
      isValid = false;
    } else {
      setTermsError("");
    }

    if (isValid) {
      onSubmit(e);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="w-full">
        <div className="mb-4">
          <Input
            type="text"
            id="business-name"
            placeholder="Business Name"
            cn={`w-full ${
              businessNameError
                ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                : ""
            }`}
            value={businessName}
            onChange={(e) => {
              setBusinessName(e.target.value);
              if (e.target.value.trim()) setBusinessNameError("");
            }}
          />
          {businessNameError && (
            <p className="mt-2 text-sm text-red-600 flex items-start">
              <span className="mr-1.5">⚠️</span> {businessNameError}
            </p>
          )}
        </div>

        <div className="mb-4">
          <Input
            id="your-name"
            placeholder="Your Name"
            cn={`w-full ${
              userNameError
                ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                : ""
            }`}
            type="text"
            value={userName}
            onChange={(e) => {
              setUserName(e.target.value);
              if (e.target.value.trim()) setUserNameError("");
            }}
          />
          {userNameError && (
            <p className="mt-2 text-sm text-red-600 flex items-start">
              <span className="mr-1.5">⚠️</span> {userNameError}
            </p>
          )}
        </div>

        <div className="relative w-full mb-5">
          <PhoneInput
            defaultCountry={defaultCountry}
            className={`border rounded-lg pl-3 ${
              phoneError ? "border-red-500" : "border-gray-300"
            }`}
            value={phoneValue}
            onChange={(value) => {
              setPhoneValue(value);
              if (value) setPhoneError("");
            }}
            limitMaxLength
            inputComponent={CustomPhoneInput}
            smartCaret
          />
          {phoneError && (
            <p className="mt-2 text-sm text-red-600 flex items-start">
              <span className="mr-1.5">⚠️</span> {phoneError}
            </p>
          )}
        </div>

        {/* Terms and Conditions Checkbox */}
        <div className="mb-6">
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <label className="flex items-start cursor-pointer">
              <input
                type="checkbox"
                className="mt-1 mr-3 h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary"
                checked={agreedToTerms}
                onChange={(e) => {
                  setAgreedToTerms(e.target.checked);
                  if (e.target.checked) setTermsError("");
                }}
              />
              <div>
                <span className="text-sm text-gray-700 font-medium">
                  I agree to the{" "}
                  <Link href="/terms" className="text-primary hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy"
                    className="text-primary hover:underline"
                  >
                    Privacy Policy
                  </Link>
                </span>
                <p className="text-xs text-gray-500 mt-1">
                  By checking this box, you consent to our use of your business
                  information in accordance with our policies.
                </p>
              </div>
            </label>
            {termsError && (
              <p className="mt-2 text-sm text-red-600 flex items-start">
                <span className="mr-1.5">⚠️</span> {termsError}
              </p>
            )}
          </div>
        </div>

        <Button
          el="button"
          primary
          rounded
          disabled={!isFormValid || isBusinessLoading}
          loading={isBusinessLoading}
          className={`w-full py-3 text-base font-medium shadow-sm transition-opacity ${
            !isFormValid ? "opacity-60 cursor-not-allowed" : ""
          }`}
        >
          Continue
        </Button>
      </form>
    </div>
  );
}

export default SetupDetails;
