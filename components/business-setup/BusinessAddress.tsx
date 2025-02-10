import React, { useState, useEffect } from "react";
import {
  useGeocodeQuery,
  useReverseGeocodeQuery,
} from "@/store/proxy-apis/proxy-api";
import Button from "../UI/Button";
import { toast } from "react-toastify";
import { useAddBusinessAddressMutation } from "@/store/features/businessApiSetupSlice";
import Input from "../UI/Input";
import { useRouter } from "next/navigation";
import { setCurrentStep } from "@/store/features/businessSetupSlice";
import { useAppDispatch } from "@/store/hooks";

interface AddressComponent {
  city?: string;
  state?: string;
  country?: string;
  postcode?: string;
  town?: string;
  village?: string;
  _normalized_city?: string;
}

interface Location {
  formatted: string;
  components: AddressComponent;
  geometry: {
    lat: number;
    lng: number;
  };
}

const BusinessAddress = ({ current_step }: { current_step: number }) => {
  const [address, setAddress] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [state, setState] = useState<string>("");
  const [country, setCountry] = useState<string>("");
  const [postalCode, setPostalCode] = useState<string>("");
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [suggestions, setSuggestions] = useState<Location[]>([]);
  const [confirmLocation, setConfirmLocation] = useState<boolean>(false);
  const [addAddress, { isLoading }] = useAddBusinessAddressMutation();
  const [useReverseGeocode, setUseReverseGeocode] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();
  // Load saved address from localStorage on mount
  useEffect(() => {
    const savedAddress = localStorage.getItem("businessAddress");
    if (savedAddress) {
      const parsedAddress = JSON.parse(savedAddress);
      setAddress(parsedAddress.address || "");
      setCity(parsedAddress.city || "");
      setState(parsedAddress.state || "");
      setCountry(parsedAddress.country || "");
      setPostalCode(parsedAddress.postalCode || "");
      setLatitude(parsedAddress.latitude || null);
      setLongitude(parsedAddress.longitude || null);
    }
  }, []);

  const {
    data: geocodeData,
    isLoading: isGeocodeLoading,
    isError: isGeocodeError,
  } = useGeocodeQuery(address, { skip: address.length < 2 });

  const {
    data: reverseGeocodeData,
    isLoading: isReverseGeocodeLoading,
    isError: isReverseGeocodeError,
  } = useReverseGeocodeQuery(
    { latitude, longitude },
    { skip: !useReverseGeocode }
  );

  console.log(useReverseGeocode);

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setAddress(query);

    if (query) {
      setSuggestions([]);
      if (!isGeocodeLoading && !isGeocodeError && geocodeData) {
        setSuggestions(geocodeData.results);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleSelectAddress = (selectedAddress: Location) => {
    setAddress(selectedAddress.formatted);
    setCity(
      selectedAddress.components.city ||
        selectedAddress.components.town ||
        selectedAddress.components.village ||
        selectedAddress.components._normalized_city ||
        ""
    );
    setState(selectedAddress.components.state || "");
    setCountry(selectedAddress.components.country || "");
    setPostalCode(selectedAddress.components.postcode || "");
    setLatitude(selectedAddress.geometry.lat);
    setLongitude(selectedAddress.geometry.lng);
    setSuggestions([]);
    console.log(selectedAddress);
  };

  const handleGetLocation = () => {
    setConfirmLocation(true);
  };

  const fetchLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setLatitude(latitude);
          setLongitude(longitude);
        },
        () => {
          alert("Unable to retrieve your location.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
    setUseReverseGeocode(true);
    setConfirmLocation(false);
  };

  const handleConfirmLocation = () => {
    fetchLocation();
  };

  const handleContinue = () => {
    if (
      !address.trim() ||
      !city.trim() ||
      !state.trim() ||
      !country.trim() ||
      !postalCode.trim()
    ) {
      toast.error("Please fill in all the required fields.");
      return;
    }

    // Save data in localStorage
    const businessAddress = {
      address,
      city,
      state,
      country,
      postalCode,
      latitude,
      longitude,
    };
    localStorage.setItem("businessAddress", JSON.stringify(businessAddress));

    addAddress(businessAddress)
      .unwrap()
      .then(() => {
        dispatch(setCurrentStep(current_step + 1));
        router.push("/business-setup/services");
      })
      .catch(() => {
        toast.error("Please fill in all the required fields.");
      });
  };

  useEffect(() => {
    if (
      reverseGeocodeData &&
      reverseGeocodeData.results.length > 0 &&
      useReverseGeocode
    ) {
      const result = reverseGeocodeData.results[0];
      setCity(
        result.components.city ||
          result.components.town ||
          result.components._normalized_city ||
          ""
      );
      setState(result.components.state || "");
      setCountry(result.components.country || "");
      setPostalCode(result.components.postcode || "");
      setAddress(result.formatted || "");
    }
    setUseReverseGeocode(false);
  }, [reverseGeocodeData, useReverseGeocode]);

  if (isReverseGeocodeLoading) {
    return <p>is Loading</p>;
  }

  if (isReverseGeocodeError && useReverseGeocode) {
    toast.error("Something went wrong.");
  }

  return (
    <div className="space-y-4">
      <Input
        id="text-address"
        type="text"
        name="address"
        placeholder="Start typing your address"
        value={address}
        onChange={handleAddressChange}
        className="w-full px-4 py-2 border border-gray-300 rounded-md"
      />

      {isGeocodeLoading && address && (
        <div className="mt-2 text-gray-500">Loading address suggestions...</div>
      )}

      {suggestions.length > 0 && (
        <div className="mt-2 border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="cursor-pointer p-2 hover:bg-gray-200"
              onClick={() => handleSelectAddress(suggestion)}
            >
              {suggestion.formatted}
            </div>
          ))}
        </div>
      )}

      <div className="space-y-4 mt-4">
        <Input
          id="text-city"
          type="text"
          name="city"
          value={city}
          placeholder="Town/City"
          onChange={(e) => setCity(e.target.value)}
        />

        <Input
          id="address-state"
          type="text"
          name="state"
          value={state}
          placeholder="State/Region"
          onChange={(e) => setState(e.target.value)}
        />
        <Input
          id="address-contry"
          type="text"
          name="country"
          value={country}
          placeholder="Country"
          onChange={(e) => setCountry(e.target.value)}
        />
        <Input
          id="address-postcode"
          type="text"
          name="postalCode"
          value={postalCode}
          placeholder="Postal Code"
          onChange={(e) => setPostalCode(e.target.value)}
        />
      </div>

      <div className="space-y-2 mt-4">
        <div className="mb-4">
          <Input
            id="address-latitude"
            type="number"
            name="latitude"
            value={latitude ?? ""}
            onChange={(e) => setLatitude(parseFloat(e.target.value))}
            placeholder="Latitude"
          />
        </div>
        <div className="mt-4">
          <Input
            id="address-longitude"
            type="number"
            name="longitude"
            value={longitude ?? ""}
            onChange={(e) => setLongitude(parseFloat(e.target.value))}
            placeholder="Longitude"
          />
        </div>
      </div>

      <button
        className="w-full bg-blue-500 text-white py-2 px-4 rounded-md mt-4"
        onClick={handleGetLocation}
      >
        Get My Address
      </button>

      <Button el="button" loading={isLoading} primary onClick={handleContinue}>
        Continue
      </Button>

      {confirmLocation && (
        <div className="mt-4 text-center p-4 border border-gray-300 rounded-md shadow-md">
          <p>
            Are you at your business location? If not, use the search to enter
            the address manually.
          </p>
          <Button primary el="button" onClick={handleConfirmLocation}>
            Yes, Confirm Location
          </Button>
          <button
            className="bg-red-500 text-white py-2 px-4 rounded-md mt-2"
            onClick={() => setConfirmLocation(false)}
          >
            No, Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default BusinessAddress;
