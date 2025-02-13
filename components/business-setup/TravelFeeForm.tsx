import { useState, useEffect } from "react";
import { NumericFormat } from "react-number-format";
import Input from "../UI/Input";
import Button from "../UI/Button";
import { useAddTravelInfoMutation } from "@/store/features/businessApiSetupSlice";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import countries from "world-countries";
import currencySymbolMap from "currency-symbol-map";

export default function TravelFeeForm() {
  const [travelOption, setTravelOption] = useState("free");
  const [fixedPrice, setFixedPrice] = useState("");
  const [distance, setDistance] = useState("");
  const [currencySymbol, setCurrencySymbol] = useState("$"); // Default currency symbol
  const [countryCode, setCountryCode] = useState<string | undefined>(); // State for country code
  const [addTravel] = useAddTravelInfoMutation();

  const router = useRouter();

  // Function to get currency symbol and country code
  const getCountryInfo = (countryName: string) => {
    const country = countries.find((c) => c.name.common === countryName);

    if (!country) return { currencySymbol: "$", code: undefined };

    const currencyCode = Object.keys(country.currencies)[0]; // Get currency code
    return {
      currencySymbol: currencySymbolMap(currencyCode) || "$", // Get symbol
      code: country.cca2, // Get country code (e.g., "US", "GH", "NG")
    };
  };

  useEffect(() => {
    const savedAddress = localStorage.getItem("businessAddress");
    if (savedAddress) {
      const parsedAddress = JSON.parse(savedAddress);

      const { currencySymbol, code } = getCountryInfo(parsedAddress.country);
      setCurrencySymbol(currencySymbol);
      setCountryCode(code); // Set country code
    }
  }, []);

  const handleContinue = () => {
    if ((travelOption !== "free" && !fixedPrice) || !distance) {
      toast.error("All fields are required");
      return;
    }

    const travelFee = travelOption === "free" ? 0 : fixedPrice;

    addTravel({ distance, travelFee, countryCode }) // Include countryCode in API request
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
              prefix={`${currencySymbol}  `}
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
