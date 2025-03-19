"use client";

import React, { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-toastify";
import { useLoginMutation } from "@/store/features/authApiSlice";
import { setAuth } from "@/store/features/authSlice";
import { useAppDispatch } from "@/store/hooks";
import useEmailValidation from "@/hooks/useEmailValidation";
import Button from "../UI/Button";
import Input from "../UI/Input";
import { MdVisibility, MdVisibilityOff, MdEmail, MdLock } from "react-icons/md";
import { FcGoogle } from "react-icons/fc";
import { continueWithGoogleAuth } from "@/utils/continue-with-googleauth";

function LoginForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { email, emailError, handleEmailChange, checkEmailValidity } =
    useEmailValidation();
  const [password, setPassword] = useState("");
  const [isPasswordEmpty, setIsPasswordEmpty] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [login, { isLoading }] = useLoginMutation();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const isEmailValid = checkEmailValidity();
    const isPasswordValid = password !== "";

    if (isEmailValid && isPasswordValid) {
      login({ email, password })
        .unwrap()
        .then(() => {
          dispatch(setAuth());
          router.replace("/business/dashboard");
        })
        .catch(() => {
          toast.error("Invalid credentials. Please try again.");
        });
    } else {
      // Update error states
      if (!isEmailValid) checkEmailValidity(); // Re-run to trigger email error display
      if (!isPasswordValid) setIsPasswordEmpty(true);
    }
  };

  return (
    <div className="mt-10">
      {/* Social Login Button */}
      <div className="mb-8">
        <button
          onClick={continueWithGoogleAuth}
          type="button"
          className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white border border-gray-300 rounded-xl shadow-sm text-gray-700 hover:bg-gray-50 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
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
            or sign in with email
          </span>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        {/* Email field */}
        <div>
          <div className="relative">
            <Input
              leftIcon={<MdEmail className="h-5 w-5 text-gray-400" />}
              id="email"
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                handleEmailChange(e.target.value);
              }}
              cn={`pl-10 py-3 rounded-xl shadow-sm ${
                emailError
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                  : ""
              }`}
              aria-describedby="email-error"
            />
          </div>
          {emailError && (
            <p
              id="email-error"
              className="mt-2 text-sm text-red-600 flex items-start"
            >
              <span className="mr-1.5">⚠️</span> {emailError}
            </p>
          )}
        </div>

        {/* Password field */}
        <div>
          <div className="relative">
            <Input
              leftIcon={<MdLock className="h-5 w-5 text-gray-400" />}
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setPassword(e.target.value);
                setIsPasswordEmpty(false);
              }}
              cn={`pl-10 pr-10 py-3 rounded-xl shadow-sm ${
                isPasswordEmpty
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                  : ""
              }`}
              aria-describedby="password-error"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
            >
              {showPassword ? (
                <MdVisibilityOff size={20} />
              ) : (
                <MdVisibility size={20} />
              )}
            </button>
          </div>
          {isPasswordEmpty && (
            <p
              id="password-error"
              className="mt-2 text-sm text-red-600 flex items-start"
            >
              <span className="mr-1.5">⚠️</span> Please enter your password
            </p>
          )}
        </div>

        {/* Forgot Password Link */}
        <div className="flex justify-end">
          <Link
            href="/forgot-password"
            className="text-sm font-medium text-primary hover:text-primary-light transition-colors"
          >
            Forgot password?
          </Link>
        </div>

        {/* Submit button */}
        <div className="pt-2">
          <Button
            el="button"
            type="submit"
            primary
            rounded
            loading={isLoading}
            disabled={isLoading}
            className="w-full py-3 text-base font-medium shadow-sm rounded-xl"
          >
            Sign In
          </Button>
        </div>
      </form>
    </div>
  );
}

export default LoginForm;
