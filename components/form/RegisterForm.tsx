"use client";

import React, { ChangeEvent, useState } from "react";
import Button from "../UI/Button";
import { FcGoogle } from "react-icons/fc";
import Input from "../UI/Input";
import usePasswordValidation from "@/hooks/usePasswordValidation";
import useEmailValidation from "@/hooks/useEmailValidation";
import Link from "next/link";

function RegisterForm() {
  const { email, emailError, handleEmailChange, checkEmailValidity } =
    useEmailValidation();

  const [password, setPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [termsError, setTermsError] = useState<string | null>(null);
  const { feedbackMessages, isValid } = usePasswordValidation(password);

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setShowMessages(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptTerms) {
      setTermsError(
        "You must agree to the terms and conditions before submitting."
      );
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
      alert("Form submitted successfully!");
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} noValidate>
        {/* Email Input */}
        <div className="mb-4">
          <Input
            id="email"
            type="email"
            placeholder="Enter Your Email"
            value={email}
            onChange={(e) => handleEmailChange(e.target.value)}
            cn={emailError ? "border-red-500" : ""}
            aria-describedby="email-error"
          >
            Email
          </Input>
          {emailError && (
            <p id="email-error" className="text-red-500 text-sm mt-1">
              {emailError}
            </p>
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
          <div id="password-feedback" className="text-sm mb-4 space-y-1">
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
        <Button danger  rounded loading={true} type="submit">
          Create An Account
        </Button>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-2 mt-8">
        <div className="border-t border-gray-300 flex-1"></div>
        <p className="text-sm text-gray-600">OR signup with</p>
        <div className="border-t border-gray-300 flex-1"></div>
      </div>

      {/* Google Signup Button */}
      <div className="flex justify-center mt-6">
        <button className="flex items-center py-2 px-4 gap-4 justify-center shadow-md w-full max-w-sm">
          <FcGoogle size={24} />
          <p className="text-lg font-medium">Google Account</p>
        </button>
      </div>

      {/* Footer Link */}
      <p className="text-center text-neutral mt-3 text-sm">
        Already a registered user?
        <Link
          href="./login"
          className="text-primary ml-1 underline font-semibold"
        >
          Sign In
        </Link>
      </p>
    </div>
  );
}

export default RegisterForm;
