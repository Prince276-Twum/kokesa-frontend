"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import logo from "@/public/Vector.png";
import Button from "@/components/UI/Button";

function RedirectEmailPage() {
  const [waitTime, setWaitTime] = useState(0);

  useEffect(() => {
    const storedWaitTime = localStorage.getItem("waitTime");
    if (storedWaitTime) {
      setWaitTime(Number(storedWaitTime));
    }
  }, []);

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

  const handleResendEmail = async () => {
    const theWaitTime = 30;
    setWaitTime(theWaitTime);

    localStorage.setItem("waitTime", theWaitTime.toString());

    try {
      const response = await fetch("/api/resend-verification-email", {
        method: "POST",
      });
      if (response.ok) {
        alert("Verification email sent!");
      } else {
        alert("Failed to resend email. Please try again later.");
      }
    } catch (error) {
      console.error("Error resending email:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <main className="flex justify-center items-center p-4 bg-white mt-20">
      <div className="bg-white rounded-md shadow-lg max-w-[450px] w-full px-6 py-8">
        <div className="flex justify-center mb-6">
          <div className="bg-black p-2 rounded-md">
            <Image src={logo} alt="kokesa logo" />
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-3xl font-bold mb-6">Verify Your Email</h2>
          <p className="mb-6 text-lg leading-6 text-neutral-gray">
            We’ve sent a verification email to your address. Please check your
            inbox and follow the link to verify your account.
          </p>

          <div className="mb-4">
            <Button
              el="button"
              primary
              rounded
              onClick={handleResendEmail}
              disabled={waitTime > 0}
              className={`${
                waitTime > 0
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-[#0B0A0A] cursor-pointer"
              } transition-colors duration-200`}
            >
              {waitTime > 0 ? `Wait ${formatTime(waitTime)}` : "Resend Email"}
            </Button>
          </div>

          <Button el="anchor" href="/auth/login" primary rounded>
            Go to Login
          </Button>
        </div>
      </div>
    </main>
  );
}

export default RedirectEmailPage;
