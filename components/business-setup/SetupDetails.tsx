import React, { useEffect, useState } from "react";
import Input from "../UI/Input";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import CustomPhoneInput from "../UI/CustomPhoneInput";
import { Country } from "react-phone-number-input"; // This import is important
import Button from "../UI/Button";

function SetupDetails() {
  const [phoneValue, setPhoneValue] = useState<string>();
  const [defaultCountry, setDefaultCountry] = useState<Country | undefined>(
    "GH"
  );

  useEffect(() => {
    const fetchCountryCode = async () => {
      try {
        const response = await fetch("https://ipapi.co/json/");
        const data = await response.json();
        console.log(data.country_code);
        setDefaultCountry(data.country_code); // Set country code dynamically
      } catch {}
    };

    fetchCountryCode();
  }, []);

  return (
    <div>
      <div className="flex flex-col justify-center items-center mb-8">
        <h2 className="text-header">About You & Your Business</h2>
        <p>Tell us about yourself and your business</p>
      </div>
      <form className="w-full">
        <div className="mb-4">
          <Input
            type="text"
            id="business-name"
            placeholder="Business Name"
            cn="w-full"
          ></Input>
        </div>
        <div className="mb-4">
          <Input
            id="your name"
            placeholder="Your Name"
            cn="w-full"
            type="text"
          ></Input>
        </div>

        <div className="relative w-full mb-5 ">
          <PhoneInput
            defaultCountry={defaultCountry}
            className="border border-gray-300 rounded-lg pl-3 "
            value={phoneValue}
            onChange={setPhoneValue}
            limitMaxLength
            inputComponent={CustomPhoneInput}
            smartCaret
          />
        </div>

        <Button el="button" primary rounded>
          Continue
        </Button>
      </form>
    </div>
  );
}

export default SetupDetails;
