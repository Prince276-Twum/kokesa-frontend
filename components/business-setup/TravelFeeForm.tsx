import { useState } from "react";
import Input from "../UI/Input";
import Button from "../UI/Button";
import { useAppDispatch } from "@/store/hooks"; // Import the Redux hook
import { setCurrentStep } from "@/store/features/businessSetupSlice"; // Import the action

export default function TravelFeeForm() {
  const [travelOption, setTravelOption] = useState("free");
  const [fixedPrice, setFixedPrice] = useState("");
  const [distance, setDistance] = useState("");
  const dispatch = useAppDispatch();

  const handleContinue = () => {
    // Update the Redux state to move to the address form
    dispatch(setCurrentStep(5)); // Set the next step (address form)

    // You could also set additional data like travelOption, distance, and fixedPrice in the Redux store, if needed
    // Example:
    // dispatch(setTravelFeeDetails({ travelOption, distance, fixedPrice }));

    // Update the URL using history.pushState without reloading
    window.history.pushState({}, "", "/business-setup/address");
  };

  return (
    <div className="">
      <div className="p-4 border rounded-lg space-y-6 mb-8">
        <label className="block">How many kilometers can you travel?</label>
        <Input
          id="travel-distance"
          type="number"
          placeholder="Enter distance in km"
          value={distance}
          onChange={(e) => setDistance(e.target.value)}
          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="p-4 border rounded-lg space-y-4">
        <label className="block">Traveling Fee Options</label>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <input
              type="radio"
              id="free"
              value="free"
              checked={travelOption === "free"}
              onChange={() => setTravelOption("free")}
              className="w-4 h-4"
            />
            <label htmlFor="free" className="cursor-pointer">
              Free Travel
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="radio"
              id="fixed"
              value="fixed"
              checked={travelOption === "fixed"}
              onChange={() => setTravelOption("fixed")}
              className="w-4 h-4"
            />
            <label htmlFor="fixed" className="cursor-pointer">
              Fixed Fee
            </label>
          </div>
        </div>

        {travelOption === "fixed" && (
          <div>
            <label className="block mb-6">Enter Fixed Price</label>
            <Input
              id="travel-fee"
              type="number"
              placeholder="Enter price"
              value={fixedPrice}
              onChange={(e) => setFixedPrice(e.target.value)}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}
      </div>

      <Button
        el="button"
        primary
        className="w-full p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        onClick={handleContinue} // Call the handleContinue function
      >
        Continue
      </Button>
    </div>
  );
}
