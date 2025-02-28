"use client";

import React, { useState, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { useRegisterMutation } from "@/store/features/authApiSlice";
import useEmailValidation from "@/hooks/useEmailValidation";
import usePasswordValidation from "@/hooks/usePasswordValidation";
import Input from "../UI/Input";
import Button from "../UI/Button";
import {
  MdVisibility,
  MdVisibilityOff,
  MdEmail,
  MdLock,
  MdCheckCircle,
} from "react-icons/md";
import { FcGoogle } from "react-icons/fc";
import { continueWithGoogleAuth } from "@/utils/continue-with-googleauth";

interface FieldErrors {
  data: { email: []; password: [] };
  email?: string[];
  password?: string[];
  non_field_errors?: string[];
}

interface RegisterError {
  isLoading: boolean;
  isError: boolean;
  error?: { data: FieldErrors };
}

const RegisterForm: React.FC = () => {
  const router = useRouter();
  const [register, { isLoading, error, isError }] =
    useRegisterMutation<RegisterError>();

  const { email, emailError, handleEmailChange, checkEmailValidity } =
    useEmailValidation();
  const [password, setPassword] = useState("");
  const { feedbackMessages, isValid } = usePasswordValidation(password);

  const [showPassword, setShowPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [termsError, setTermsError] = useState<string | null>(null);
  const [showMessages, setShowMessages] = useState(false);
  const [showErrors, setShowErrors] = useState(false);

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setShowMessages(true);
  };

  // Validate all fields at once
  const validateForm = (): boolean => {
    let isFormValid = true;

    // Force email validation check
    const isEmailValid = checkEmailValidity();
    if (!isEmailValid) {
      isFormValid = false;
    }

    // Check password validity
    if (!isValid) {
      isFormValid = false;
    }

    // Check terms acceptance
    if (!acceptTerms) {
      setTermsError("Please accept the terms and conditions to continue");
      isFormValid = false;
    }

    // Show all validation errors at once
    setShowErrors(true);
    setShowMessages(true);

    return isFormValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    if (!validateForm()) {
      return;
    }

    register({ email, password })
      .unwrap()
      .then(() => router.push("/redirectemail"))
      .catch(() => {});
  };

  return (
    <div className="mt-10">
      {/* Social Sign-up Button */}
      <div className="mb-8">
        <button
          onClick={continueWithGoogleAuth}
          type="button"
          className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white border border-gray-300 rounded-xl shadow-sm text-gray-700 hover:bg-gray-50 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          aria-label="Continue with Google"
        >
          <FcGoogle size={20} />
          <span className="font-medium">Continue with Google</span>
        </button>
      </div>

      {/* Divider */}
      <div className="relative mb-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200"></div>
        </div>
        <div className="relative flex justify-center">
          <span className="px-4 bg-white text-sm text-gray-500">
            or continue with email
          </span>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        {/* Email field */}
        <div>
          <div className="relative">
            <Input
              id="email"
              leftIcon={<MdEmail size={22} />}
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                handleEmailChange(e.target.value);
              }}
              cn={`pl-10 py-3 rounded-xl shadow-sm ${
                emailError && showErrors
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                  : ""
              }`}
            />
          </div>
          {emailError && showErrors && (
            <p className="mt-2 text-sm text-red-600 flex items-start">
              <span className="mr-1.5">⚠️</span> {emailError}
            </p>
          )}
          {isError && error?.data?.email && showErrors && (
            <p className="mt-2 text-sm text-red-600 flex items-start">
              <span className="mr-1.5">⚠️</span> {error.data.email[0]}
            </p>
          )}
        </div>

        {/* Password field */}
        <div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Create password"
              value={password}
              leftIcon={<MdLock size={20} />}
              onChange={handlePasswordChange}
              cn={`pl-10 pr-10 py-3 rounded-xl shadow-sm ${
                !isValid && showErrors
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                  : ""
              }`}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <MdVisibilityOff size={20} />
              ) : (
                <MdVisibility size={20} />
              )}
            </button>
          </div>

          {/* Password requirements - always visible after typing starts or on submit */}
          {(showMessages || showErrors) && (
            <div className="mt-3 grid grid-cols-1 gap-2">
              {feedbackMessages.map((msg, index) => (
                <div
                  key={index}
                  className={`text-xs flex items-start ${
                    msg.condition ? "text-green-600" : "text-gray-500"
                  }`}
                >
                  {msg.condition ? (
                    <MdCheckCircle className="h-4 w-4 mr-1.5 flex-shrink-0" />
                  ) : (
                    <span className="h-4 w-4 mr-1.5 flex items-center justify-center flex-shrink-0">
                      •
                    </span>
                  )}
                  <span>{msg.message}</span>
                </div>
              ))}
            </div>
          )}

          {isError && error?.data?.password && showErrors && (
            <p className="mt-2 text-sm text-red-600 flex items-start">
              <span className="mr-1.5">⚠️</span> {error.data.password[0]}
            </p>
          )}
        </div>

        {/* Terms & Conditions */}
        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              id="terms"
              type="checkbox"
              className="h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary"
              checked={acceptTerms}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setAcceptTerms(e.target.checked);
                if (e.target.checked) setTermsError(null);
              }}
            />
          </div>
          <div className="ml-3 text-sm">
            <label htmlFor="terms" className="text-gray-600">
              I agree to the{" "}
              <a
                href="/terms"
                className="text-primary font-medium hover:underline"
              >
                Terms of Service
              </a>{" "}
              and{" "}
              <a
                href="/privacy"
                className="text-primary font-medium hover:underline"
              >
                Privacy Policy
              </a>
            </label>
            {termsError && showErrors && (
              <p className="mt-1 text-sm text-red-600">{termsError}</p>
            )}
          </div>
        </div>

        {/* Submit button */}
        <div>
          <Button
            el="button"
            type="submit"
            primary
            rounded
            loading={isLoading}
            className="w-full py-3 text-base font-medium shadow-sm rounded-xl"
          >
            Create Account
          </Button>
        </div>
      </form>

      {/* Additional Info */}
      <p className="mt-6 text-xs text-center text-gray-500">
        By creating an account, you agree to receive updates and special offers.
      </p>
    </div>
  );
};

export default RegisterForm;
