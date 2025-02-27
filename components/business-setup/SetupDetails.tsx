import React from "react";
import Input from "../UI/Input";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import CustomPhoneInput from "../UI/CustomPhoneInput";
import Button from "../UI/Button";
import useBusinessSetup from "@/hooks/useBusinessDetail";

function SetupDetails() {
  const {
    businessName,
    setBusinessName,
    userName,
    setUserName,
    phoneValue,
    setPhoneValue,
    defaultCountry,
    isButtonDisabled,
    isBusinessLoading,
    onSubmit,
  } = useBusinessSetup();

  return (
    <div>
      <form onSubmit={onSubmit} className="w-full">
        <div className="mb-4">
          <Input
            type="text"
            id="business-name"
            placeholder="Business Name"
            cn="w-full"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <Input
            id="your-name"
            placeholder="Your Name"
            cn="w-full"
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
        </div>

        <div className="relative w-full mb-5">
          <PhoneInput
            defaultCountry={defaultCountry}
            className="border border-gray-300 rounded-lg pl-3"
            value={phoneValue}
            onChange={setPhoneValue}
            limitMaxLength
            inputComponent={CustomPhoneInput}
            smartCaret
          />
        </div>

        <Button
          el="button"
          primary
          rounded
          disabled={isButtonDisabled}
          loading={isBusinessLoading}
        >
          Continue
        </Button>
      </form>
    </div>
  );
}

export default SetupDetails;
