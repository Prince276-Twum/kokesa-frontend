import React, { useState, useEffect } from "react";
import {
  useGeocodeQuery,
  useReverseGeocodeQuery,
} from "@/store/proxy-apis/proxy-api";
import Button from "../UI/Button";
import { toast } from "react-toastify";

interface AddressComponent {
  city?: string;
  state?: string;
  country?: string;
  postcode?: string;
}

interface Location {
  formatted: string;
  components: AddressComponent;
  geometry: {
    lat: number;
    lng: number;
  };
}

const AddressInput = () => {
  const [address, setAddress] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [state, setState] = useState<string>("");
  const [country, setCountry] = useState<string>("");
  const [postalCode, setPostalCode] = useState<string>("");
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [suggestions, setSuggestions] = useState<Location[]>([]);
  const [confirmLocation, setConfirmLocation] = useState<boolean>(false);

  const {
    data: geocodeData,
    isLoading: isGeocodeLoading,
    isError: isGeocodeError,
  } = useGeocodeQuery(address, { skip: address.length < 2 }); // Skip query if address length is less than 3

  const {
    data: reverseGeocodeData,
    isLoading: isReverseGeocodeLoading,
    isError: isReverseGeocodeError,
  } = useReverseGeocodeQuery(
    { latitude, longitude },
    { skip: !latitude || !longitude }
  );

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
    setCity(selectedAddress.components.city || "");
    setState(selectedAddress.components.state || "");
    setCountry(selectedAddress.components.country || "");
    setPostalCode(selectedAddress.components.postcode || "");
    setLatitude(selectedAddress.geometry.lat);
    setLongitude(selectedAddress.geometry.lng);
    setSuggestions([]);
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
        (error) => {
          console.error("Error getting location:", error);
          alert("Unable to retrieve your location.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
    setConfirmLocation(false);
  };

  const handleConfirmLocation = () => {
    fetchLocation();
  };

  useEffect(() => {
    if (reverseGeocodeData && reverseGeocodeData.results.length > 0) {
      const result = reverseGeocodeData.results[0];
      setCity(result.components.city || "");
      setState(result.components.state || "");
      setCountry(result.components.country || "");
      setPostalCode(result.components.postcode || "");
      setAddress(result.formatted || "");
    }
  }, [reverseGeocodeData]);

  if (isReverseGeocodeLoading) {
    return <p>is Loading</p>;
  }

  if (isReverseGeocodeError) {
    toast.error("something went wrong");
  }

  return (
    <div className="space-y-4">
      <input
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

      {/* {isGeocodeError && address && (
        <div className="mt-2 text-red-500">
          Failed to load address suggestions.
        </div>
      )} */}

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
        <input
          type="text"
          name="city"
          value={city}
          placeholder="City"
          onChange={(e) => setCity(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md"
        />
        <input
          type="text"
          name="state"
          value={state}
          placeholder="State/Region"
          onChange={(e) => setState(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md"
        />
        <input
          type="text"
          name="country"
          value={country}
          placeholder="Country"
          onChange={(e) => setCountry(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md"
        />
        <input
          type="text"
          name="postalCode"
          value={postalCode}
          placeholder="Postal Code"
          onChange={(e) => setPostalCode(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md"
        />
      </div>

      <div className="space-y-2 mt-4">
        <input
          type="number"
          name="latitude"
          value={latitude ?? ""}
          onChange={(e) => setLatitude(parseFloat(e.target.value))}
          placeholder="Latitude"
          className="w-full px-4 py-2 border border-gray-300 rounded-md"
        />
        <input
          type="number"
          name="longitude"
          value={longitude ?? ""}
          onChange={(e) => setLongitude(parseFloat(e.target.value))}
          placeholder="Longitude"
          className="w-full px-4 py-2 border border-gray-300 rounded-md"
        />
      </div>

      <button
        className="w-full bg-blue-500 text-white py-2 px-4 rounded-md mt-4"
        onClick={handleGetLocation}
      >
        Get My Address
      </button>

      <Button el="button" primary>
        continue
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

export default AddressInput;
