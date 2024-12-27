"use client";
import React, { ChangeEvent, useState } from "react";
import Button from "../UI/Button";
import { FcGoogle } from "react-icons/fc";
import Input from "../UI/Input";
import usePasswordValidation from "@/hooks/usePasswordValidation";
import Link from "next/link";

function RegisterForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const { feedbackMessages, isValid } = usePasswordValidation(password);

  // Handle input change for password field
  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setShowMessages(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(acceptTerms);
    if (isValid && email && acceptTerms) {
      console.log("Form submitted successfully", {
        email,
        password,
        acceptTerms,
      });
    } else {
      console.log("Password validation failed");
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <Input
            id="email"
            type="email"
            placeholder="Enter Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          >
            Email
          </Input>
        </div>
        <div className="mb-4">
          <Input
            id="password"
            type="password"
            placeholder="Enter Your Password"
            value={password}
            onChange={handlePasswordChange}
          >
            Password
          </Input>
        </div>

        {/* Real-Time Password Feedback */}
        {showMessages && (
          <div aria-live="polite" className="text-sm mb-4 space-y-1">
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

        {/* Checkbox */}

        <label className="flex items-center space-x-2 mb-4">
          <Input
            onChange={(e) => setAcceptTerms(e.target.checked)}
            className="accent-black w-4 h-4"
            type="checkbox"
            id="checkbox"
          />
          <span>I agree to the terms and conditions</span>
        </label>

        <Button type="submit" disabled={!isValid}>
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

      <p className="text-center text-neutral mt-3 text-sm">
        Already a registered user?
        <Link href="./login" className="text-primary ml-1 font-semibold">
          Sign In
        </Link>
      </p>
    </div>
  );
}

export default RegisterForm;
