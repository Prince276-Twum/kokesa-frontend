import React from "react";
import Button from "../UI/Button";
import { FcGoogle } from "react-icons/fc";

function RegisterForm() {
  return (
    <>
      <form>
        {/* Email Input */}
        <div className="rounded-md mb-4">
          <label htmlFor="email" className="sr-only">
            Email
          </label>
          <input
            id="email"
            className="border-2 border-formBorder px-4 py-2 w-full rounded-md focus:outline-none"
            type="email"
            placeholder="Enter Your Email"
          />
        </div>

        {/* Password Input */}
        <div className="rounded-md mb-6">
          <label htmlFor="password" className="sr-only">
            Password
          </label>
          <input
            id="password"
            className="border-2 border-formBorder px-4 py-2 w-full rounded-md focus:outline-none"
            type="password"
            placeholder="Enter Your Password"
          />
        </div>

        {/* Checkbox */}
        <label className="flex items-center space-x-2 mb-6">
          <input type="checkbox" className="w-4 h-4" />
          <span>Click me to check the box</span>
        </label>

        {/* Submit Button */}
        <Button type="submit">Create An Account</Button>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-2 mt-8">
        <div className="border-t border-formBorder flex-1"></div>
        <p className="text-sm text-gray-600">OR signup with</p>
        <div className="border-t border-formBorder flex-1"></div>
      </div>

      {/* Google Signup Button */}
      <div className="flex justify-center mt-8">
        <button className="flex items-center py-2 px-4 gap-4 justify-center shadow-md w-full max-w-sm">
          <FcGoogle size={24} />
          <p className="text-lg font-medium">Google Account</p>
        </button>
      </div>
    </>
  );
}

export default RegisterForm;
