import { useState } from "react";
import { NumericFormat } from "react-number-format";
import Input from "../UI/Input";
import Button from "../UI/Button";
import { useAddTravelInfoMutation } from "@/store/features/businessApiSetupSlice";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import useCurrencyInfo from "@/hooks/useCurrencyInfo";

export default function TravelFeeForm() {
  const [travelOption, setTravelOption] = useState("free");
  const [fixedPrice, setFixedPrice] = useState("");
  const [distance, setDistance] = useState("");
  const [addTravel] = useAddTravelInfoMutation();

  const { currencyCode, currencySymbol, countryCode } = useCurrencyInfo();

  console.log("Currency Code: ", currencyCode);
  console.log("Currency Symbol: ", currencySymbol);
  console.log("Country Code: ", countryCode);

  const router = useRouter();

  const handleContinue = () => {
    if ((travelOption !== "free" && !fixedPrice) || !distance) {
      toast.error("All fields are required");
      return;
    }

    const travelFee = travelOption === "free" ? 0 : fixedPrice;

    addTravel({ distance, travelFee, currencyCode }) // Include countryCode in API request
      .unwrap()
      .then(() => {
        router.push("team-size");
      })
      .catch(() => {});
  };

  return (
    <div>
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
            <label className="block mb-1">Enter Fixed Price</label>
            {/* Numeric format with dynamic currency symbol */}
            <NumericFormat
              id="travel-fixed-fee"
              value={fixedPrice}
              onValueChange={(values) => setFixedPrice(values.value)}
              thousandSeparator={true}
              prefix={`${currencyCode}  `}
              customInput={Input}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2"
            />
          </div>
        )}
      </div>

      <Button
        el="button"
        primary
        className="w-full p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        onClick={handleContinue}
      >
        Continue
      </Button>
    </div>
  );
}
