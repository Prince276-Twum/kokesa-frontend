"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import KokesaLogo from "@/components/common/KokesaLogo";
import Button from "@/components/UI/Button";
import { MdEmail } from "react-icons/md";
import { toast } from "react-toastify";

function RedirectEmailPage() {
  const [waitTime, setWaitTime] = useState(0);
  const [sending, setSending] = useState(false);

  // Initialize wait time from localStorage
  useEffect(() => {
    const storedWaitTime = localStorage.getItem("waitTime");
    if (storedWaitTime) {
      setWaitTime(Number(storedWaitTime));
    }
  }, []);

  // Countdown timer effect
  useEffect(() => {
    let countdown: NodeJS.Timeout;
    if (waitTime > 0) {
      countdown = setInterval(() => {
        setWaitTime((prev) => {
          const newWaitTime = prev - 1;
          localStorage.setItem("waitTime", newWaitTime.toString());
          return newWaitTime;
        });
      }, 1000);
    }
    return () => clearInterval(countdown);
  }, [waitTime]);

  // Handle resend email
  const handleResendEmail = async () => {
    const theWaitTime = 60;
    setSending(true);

    try {
      const response = await fetch("/api/resend-verification-email", {
        method: "POST",
      });

      if (response.ok) {
        toast.success("Verification email sent successfully!");
        setWaitTime(theWaitTime);
        localStorage.setItem("waitTime", theWaitTime.toString());
      } else {
        toast.error("Failed to resend email. Please try again later.");
      }
    } catch (error) {
      console.error("Error resending email:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSending(false);
    }
  };

  // Format time for display
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Email verification illustration/header */}
        <div className="bg-primary-50 p-8 flex flex-col items-center justify-center">
          <div className="bg-white p-4 rounded-full shadow-sm mb-4">
            <MdEmail className="text-primary h-12 w-12" />
          </div>
          <h2 className="text-primary text-xl font-bold">Check Your Email</h2>
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
              Verify Your Email
            </h1>
            <p className="text-gray-600 text-center">
              We've sent a verification email to your inbox. Please check and
              click the link to activate your account.
            </p>

            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-sm text-blue-800 mt-4">
              <p>
                <span className="font-medium">Tip:</span> If you don't see the
                email, check your spam folder or try resending.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <Button
              el="button"
              primary
              rounded
              onClick={handleResendEmail}
              disabled={waitTime > 0 || sending}
              loading={sending}
              className="w-full py-3"
            >
              {waitTime > 0
                ? `Resend available in ${formatTime(waitTime)}`
                : "Resend Verification Email"}
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

export default RedirectEmailPage;
