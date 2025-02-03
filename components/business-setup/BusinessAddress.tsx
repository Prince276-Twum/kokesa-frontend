import React, { ChangeEvent, useState } from "react";
import Button from "../UI/Button";
// import { ArrowLeft, ArrowRight } from "lucide-react";

const AddressInput = () => {
  const [address, setAddress] = useState("");

  const handleAddressChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAddress(e.target.value);
  };

  return (
    <div>
      <div className="flex justify-between items-center">
        <button className="text-gray-600 hover:text-gray-800">
          {/* <ArrowLeft size={20} /> */}
        </button>
        <input
          type="text"
          placeholder="Enter Address"
          value={address}
          onChange={handleAddressChange}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button className="text-gray-600 hover:text-gray-800">
          {/* <ArrowRight size={20} /> */}
        </button>
      </div>
      <div className="mt-2">
        <h3 className="text-gray-700 font-medium">Suggested Address</h3>
        <ul className="space-y-2 mt-2">
          <li>Gentag Ghana Pk Way</li>
          <li>Gentag Ghana Pk Way</li>
          <li>Gentag Ghana Pk Way</li>
          <li>Gentag Ghana Pk Way</li>
          <li>Gentag Ghana Pk Way</li>
          <li>Gentag Ghana Pk Way</li>
          <li>Gentag Ghana Pk Way</li>
        </ul>
      </div>
      <Button
        el="button"
        primary
        rounded
        className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md mt-4"
      >
        Setup Manually
      </Button>
    </div>
  );
};

export default AddressInput;
