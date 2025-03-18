"use client";

import React from "react";
import Link from "next/link";
import KokesaLogo from "@/components/common/KokesaLogo";
import Button from "@/components/UI/Button";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { useActivationMutation } from "@/store/features/authApiSlice";
import { use, useEffect } from "react";

interface Props {
  params: Promise<{ uid: string; token: string }>;
}

function Page({ params }: Props) {
  const [activate, { isError, isSuccess, isLoading }] = useActivationMutation();
  const { uid, token } = use(params);

  useEffect(() => {
    activate({ uid, token });
  }, [uid, token, activate]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Status header */}
        <div
          className={`p-8 flex flex-col items-center justify-center ${
            isSuccess ? "bg-green-50" : "bg-primary-50"
          }`}
        >
          <div
            className={`p-4 rounded-full shadow-sm mb-4 ${
              isSuccess ? "bg-green-500" : "bg-white"
            }`}
          >
            {isLoading && (
              <div className="h-12 w-12 rounded-full border-4 border-primary-100 border-t-primary animate-spin"></div>
            )}
            {isSuccess && <CheckCircle className="text-white h-12 w-12" />}
            {isError && <XCircle className="text-red-500 h-12 w-12" />}
          </div>
          <h2
            className={`text-xl font-bold ${
              isSuccess ? "text-green-700" : "text-primary"
            }`}
          >
            {isLoading && "Verifying Email"}
            {isSuccess && "Email Verified Successfully!"}
            {isError && "Verification Failed"}
          </h2>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="bg-black inline-block p-2.5 rounded-lg shadow-sm">
              <KokesaLogo />
            </div>
          </div>

          <div className="text-center space-y-4 mb-8">
            <h1 className="text-2xl font-bold text-gray-900">
              {isLoading && "Email Verification"}
              {isSuccess && "Verification Successful"}
              {isError && "Verification Failed"}
            </h1>

            {isLoading && (
              <p className="text-gray-600 text-center">
                Please wait while we verify your email address...
              </p>
            )}

            {isSuccess && (
              <>
                <p className="text-gray-800 text-center font-medium">
                  Your email has been successfully verified! 🎉
                </p>
                <p className="text-gray-600 text-center mt-2">
                  You can now log in to complete your business setup and start
                  using all features of the platform.
                </p>
              </>
            )}

            {isError && (
              <p className="text-gray-600 text-center">
                This verification link has already been used or has expired.
                Please request a new verification link.
              </p>
            )}

            {isError && (
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-sm text-blue-800 mt-4">
                <p>
                  <span className="font-medium">Note:</span> If you didn't
                  verify your email, you can request a new verification link
                  from the login page.
                </p>
              </div>
            )}
          </div>

          <div className="space-y-4">
            {isSuccess && (
              <>
                <div className="bg-green-50 border border-green-100 rounded-lg p-4 text-sm text-green-800 mb-6">
                  <p className="flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                    <span className="font-medium">
                      Your account is now ready to use!
                    </span>
                  </p>
                </div>
                <Button
                  el="anchor"
                  href="/auth/login"
                  primary
                  rounded
                  className="w-full py-3 shadow-md hover:shadow-lg transition-all"
                >
                  Continue to Login
                </Button>
              </>
            )}

            {isError && (
              <>
                <Button
                  el="anchor"
                  href="/auth/resend-verification"
                  primary
                  rounded
                  className="w-full py-3"
                >
                  Request New Verification
                </Button>

                <Button
                  el="anchor"
                  href="/auth/login"
                  secondary
                  outline
                  rounded
                  className="w-full py-3"
                >
                  Back to Login
                </Button>
              </>
            )}

            {isLoading && (
              <Button
                el="button"
                secondary
                outline
                rounded
                disabled
                className="w-full py-3"
              >
                Verifying...
              </Button>
            )}
          </div>

          <div className="mt-6 text-center text-sm text-gray-500">
            <p>
              Need help?{" "}
              <Link href="/contact" className="text-primary hover:underline">
                Contact Support
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Page;
