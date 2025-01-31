"use client";

import { useState } from "react";
import OtpInput from "react-otp-input";
import Button from "../UI/Button";

const ConfirmNumber: React.FC = () => {
  const [otp, setOtp] = useState<string>("");

  return (
    <div className="w-full max-w-md bg-white mt-8">
      {/* OTP Input */}
      <div className="mt-6 flex justify-center mb-20">
        <OtpInput
          value={otp}
          onChange={setOtp}
          numInputs={6}
          inputType="tel"
          renderSeparator={<span className="ml-4"></span>}
          inputStyle={{
            width: "40px", // Explicit width
            height: "60px", // Explicit height
            fontSize: "24px", // Bigger text
            borderRadius: "8px", // Rounded corners
            border: "2px solid #ccc",
            textAlign: "center",
          }}
          renderInput={(props) => (
            <input
              {...props}
              className=" border   border-gray-300 rounded text-xl text-center focus:border-blue-500 focus:outline-none"
            />
          )}
        />
      </div>

      {/* Resend Code */}
      <p className="mt-4 text-center text-sm">
        Didn’t get a code?{" "}
        <span className="text-blue-600 font-medium cursor-pointer hover:underline">
          Resend Code
        </span>
      </p>

      {/* Confirm Button */}
      <Button
        el="button"
        primary
        rounded
        className="w-full mt-6  disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={otp.length !== 6}
      >
        Confirm Code
      </Button>
    </div>
  );
};

export default ConfirmNumber;
