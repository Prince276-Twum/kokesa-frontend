import React from "react";
import Input from "../UI/Input";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import CustomPhoneInput from "../UI/CustomPhoneInput";
import Button from "../UI/Button";
import useBusinessSetup from "@/hooks/useBusinessDetail";
import { MdBusiness, MdPerson } from "react-icons/md";

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
            leftIcon={<MdBusiness size={20} />}
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
            leftIcon={<MdPerson size={20} />}
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

      <style jsx global>{`
        .PhoneInput {
          display: flex;
          align-items: center;
        }

        .PhoneInputCountry {
          position: relative;
          align-self: stretch;
          display: flex;
          align-items: center;
          margin-right: 0.5rem;
          padding: 0 0.5rem;
          border-right: 1px solid #e5e7eb;
        }

        .custom-phone-input input {
          flex: 1;
          min-width: 0;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          padding: 0.75rem 1rem;
          font-size: 0.875rem;
          transition: all 0.2s;
        }

        .custom-phone-input input:focus {
          border-color: #6b7280;
          outline: none;
          box-shadow: 0 0 0 1px #6b7280;
        }

        .custom-phone-input input:hover {
          border-color: #d1d5db;
        }
      `}</style>
    </div>
  );
}

export default SetupDetails;
