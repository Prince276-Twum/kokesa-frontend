import React from "react";
import Image from "next/image";
import Link from "next/link";
import RegisterForm from "@/components/form/RegisterForm";
import KokesaLogo from "@/components/common/KokesaLogo";

// Import image
import regImage from "@/public/reg.jpeg";

const RegistrationPage: React.FC = () => {
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
              Create your account
            </h1>
            <p className="mt-3 text-gray-500">
              Join thousands of users managing their business with Kokesa
            </p>
          </div>

          {/* Registration Form */}
          <RegisterForm />

          {/* Login Link */}
          <div className="text-center text-sm">
            <p className="text-gray-500">
              Already have an account?{" "}
              <Link
                href="/auth/login"
                className="font-medium text-primary hover:text-primary-light transition-colors"
              >
                Sign in
              </Link>
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
          <h2 className="text-3xl font-bold">
            Streamline your business operations
          </h2>
          <p className="mt-3 text-white/80">
            Join thousands of businesses that use Kokesa to increase efficiency
            and drive growth.
          </p>
        </div>
        <Image
          src={regImage}
          alt="Kokesa Platform"
          fill
          priority
          placeholder="blur"
          className="object-cover"
        />
      </div>
    </div>
  );
};

export default RegistrationPage;
