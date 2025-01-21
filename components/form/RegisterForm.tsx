"use client";

import useEmailValidation from "@/hooks/useEmailValidation";
import usePasswordValidation from "@/hooks/usePasswordValidation";
import { useRegisterMutation } from "@/store/features/authApiSlice";
import { useRouter } from "next/navigation";
import React, { ChangeEvent, useState } from "react";
import GoogleSignUp from "../common/GoogleSignUp";
import Button from "../UI/Button";
import Input from "../UI/Input";

interface FieldErrors {
  data: { email: []; password: [] };
  email?: string[];
  password?: string[];
  non_field_errors?: string[];
}

interface RegisterError {
  isLoading: boolean;
  isError: boolean;
  error?: FieldErrors;
}

function RegisterForm() {
  const router = useRouter();
  const [register, { isLoading, error, isError }] =
    useRegisterMutation<RegisterError>();
  const { email, emailError, handleEmailChange, checkEmailValidity } =
    useEmailValidation();
  const [showEmailError, setShowEmailError] = useState(false);
  const [showPasswordError, setShowPasswordError] = useState(false);

  const [password, setPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [termsError, setTermsError] = useState<string | null>(null);
  const { feedbackMessages, isValid } = usePasswordValidation(password);

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setShowMessages(true);
    setShowPasswordError(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowEmailError(true);
    setShowPasswordError(true);
    if (!acceptTerms) {
      setTermsError("You must agree to the terms and conditions.");
    } else {
      setTermsError(null); // Clear any previous errors
    }

    if (!isValid) {
      setShowMessages(true);
    }
    if (!checkEmailValidity()) {
      return;
    }
    if (acceptTerms && isValid) {
      register({ email, password })
        .unwrap()
        .then(() => router.push("/redirectemail"))
        .catch(() => {});
    }
  };
  return (
    <div className="w-full max-w-md mx-auto ">
      <form onSubmit={handleSubmit} noValidate>
        {/* Email Input */}
        <div className="mb-4">
          <Input
            id="email"
            type="email"
            placeholder="Enter Your Email"
            value={email}
            onChange={(e) => {
              setShowEmailError(false);
              handleEmailChange(e.target.value);
            }}
            cn={emailError ? "border-red-500" : ""}
            aria-describedby="email-error"
          >
            Email
          </Input>
          {showEmailError && (
            <>
              {isError &&
                error?.data?.email?.map((error, index) => (
                  <p
                    key={index}
                    className="text-red-500 text-sm md:text-base mt-1"
                  >
                    {error}
                  </p>
                ))}
              {emailError && (
                <p
                  id="email-error"
                  className="text-red-500 text-sm md:text-base mt-1"
                >
                  {emailError}
                </p>
              )}
            </>
          )}
        </div>

        {/* Password Input */}
        <div className="mb-4">
          <Input
            id="password"
            type="password"
            placeholder="Enter Your Password"
            value={password}
            onChange={handlePasswordChange}
            aria-describedby="password-feedback"
            cn={showMessages ? (isValid ? "" : "border-red-500") : ""}
          >
            Password
          </Input>
        </div>

        {/* Real-Time Password Feedback */}
        {showMessages && (
          <>
            {showPasswordError && (
              <>
                {isError &&
                  error?.data?.password?.map((error, index) => (
                    <p
                      key={index}
                      className="text-red-500 text-sm md:text-basemt-1"
                    >
                      {error}
                    </p>
                  ))}
              </>
            )}
            <div
              id="password-feedback"
              className="text-sm md:text-base mb-4 space-y-1"
            >
              {feedbackMessages.map((item, index) => (
                <p
                  key={index}
                  className={`transition duration-200 ${
                    item.condition ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {item.message}
                </p>
              ))}
            </div>
          </>
        )}

        {/* Terms and Conditions Checkbox */}
        <div className=" mb-4">
          <label htmlFor="terms" className="flex items-center space-x-2">
            <input
              id="terms"
              type="checkbox"
              checked={acceptTerms}
              onChange={(e) => {
                setAcceptTerms(e.target.checked);
                setTermsError(null);
              }}
              className="accent-black w-4 h-4"
            />
            <span>I agree to the terms and conditions</span>
          </label>
          {termsError && (
            <p className="text-red-500 text-sm mt-1">{termsError}</p>
          )}
        </div>

        {/* Submit Button */}
        <Button el="button" primary rounded loading={isLoading} type="submit">
          Create An Account
        </Button>
      </form>

      <GoogleSignUp />
    </div>
  );
}

export default RegisterForm;
