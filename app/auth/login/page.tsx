import React from "react";
import Image from "next/image";
import LoginForm from "@/components/form/LoginForm";
import KokesaLogo from "@/components/common/KokesaLogo";
import type { Metadata } from "next";
import alarmImg from "@/public/loginalarm.png";

export const metadata: Metadata = {
  title: "Kokesa | Sign In",
  description:
    "Log in to your Kokesa account to manage bookings and access your dashboard.",
};

function LoginPage() {
  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Panel - Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          <div className="flex justify-center">
            <div className="bg-black p-2.5 rounded-lg shadow-lg">
              <KokesaLogo />
            </div>
          </div>

          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Welcome back
            </h1>
            <p className="mt-3 text-gray-500">
              Sign in to your account to continue
            </p>
          </div>

          {/* Login Form */}
          <LoginForm />

          {/* Registration Link */}
          <div className="text-center text-sm">
            <p className="text-gray-500">
              Don't have an account?{" "}
              <a
                href="/auth/registration"
                className="font-medium text-primary hover:text-primary-light transition-colors"
              >
                Create account
              </a>
            </p>
          </div>

          {/* Footer */}
          <div className="pt-6 text-center text-xs text-gray-400">
            <p>© {new Date().getFullYear()} Kokesa. All rights reserved.</p>
          </div>
        </div>
      </div>

      {/* Right Panel - Image */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-black/10 z-10"></div>
        <div className="absolute left-10 bottom-10 text-white z-20 max-w-md">
          <h2 className="text-3xl font-bold">Manage your business with ease</h2>
          <p className="mt-3 text-white/80">
            Access your dashboard, track appointments, and grow your business
            all in one place.
          </p>
        </div>
        <Image
          src={alarmImg}
          alt="Kokesa Platform"
          fill
          priority
          className="object-cover"
        />
      </div>
    </div>
  );
}

export default LoginPage;
