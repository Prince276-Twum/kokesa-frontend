import React, { useState } from "react";
import axios from "axios";
import Button from "../UI/Button";

// Define types for address components and location
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
  const [suggestions, setSuggestions] = useState<Location[]>([]); // Use Location[] type here
  const [confirmLocation, setConfirmLocation] = useState<boolean>(false);

  const API_KEY = process.env.NEXT_PUBLIC_OPEN_CAGE_API_KEY;

  // Handle user input and fetch address suggestions from OpenCage
  const handleAddressChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const query = e.target.value;
    setAddress(query);

    if (query) {
      try {
        const response = await axios.get(
          `https://api.opencagedata.com/geocode/v1/json`,
          {
            params: {
              key: API_KEY,
              q: query,
              no_annotations: 1, // Don't include unnecessary annotations
              limit: 5, // Limit suggestions to 5 results
            },
          }
        );
        setSuggestions(response.data.results);
      } catch (error) {
        console.error("Error fetching address suggestions:", error);
      }
    } else {
      setSuggestions([]);
    }
  };

  // Handle selecting an address from the suggestions
  const handleSelectAddress = (selectedAddress: Location) => {
    setAddress(selectedAddress.formatted);
    setCity(selectedAddress.components.city || "");
    setState(selectedAddress.components.state || "");
    setCountry(selectedAddress.components.country || "");
    setPostalCode(selectedAddress.components.postcode || "");
    setLatitude(selectedAddress.geometry.lat);
    setLongitude(selectedAddress.geometry.lng);
    setSuggestions([]); // Clear suggestions after selection
  };

  // Handle 'Get Latitude and Longitude' button click using browser's geolocation
  const handleGetLocation = () => {
    setConfirmLocation(true); // Show the confirmation prompt
  };

  // Proceed with fetching the location after the user confirms
  const fetchLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setLatitude(latitude);
          setLongitude(longitude);

          try {
            // Reverse geocode the latitude and longitude using OpenCage API
            const response = await axios.get(
              `https://api.opencagedata.com/geocode/v1/json`,
              {
                params: {
                  key: API_KEY,
                  q: `${latitude},${longitude}`,
                  no_annotations: 1, // Don't include unnecessary annotations
                },
              }
            );

            if (response.data.results.length > 0) {
              const location = response.data.results[0];
              setAddress(location.formatted);
              setCity(location.components.city || "");
              setState(location.components.state || "");
              setCountry(location.components.country || "");
              setPostalCode(location.components.postcode || "");
            } else {
              alert("Could not retrieve address for the given coordinates.");
            }
          } catch (error) {
            console.error("Error reverse geocoding:", error);
            alert("Error fetching address from geolocation.");
          }
        },
        (error) => {
          console.error("Error getting location:", error);
          alert(
            "Unable to retrieve your location. Please ensure location services are enabled."
          );
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
    setConfirmLocation(false); // Hide the confirmation prompt
  };

  // Handle location confirmation
  const handleConfirmLocation = () => {
    fetchLocation(); // Proceed to fetch the location
  };

  return (
    <div className="space-y-4">
      {/* Address input */}
      <input
        type="text"
        name="address"
        placeholder="Start typing your address"
        value={address}
        onChange={handleAddressChange}
        className="w-full px-4 py-2 border border-gray-300 rounded-md"
      />

      {/* Display address suggestions */}
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

      {/* Editable address fields */}
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

      {/* Latitude and Longitude Display */}
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

      {/* Get Latitude and Longitude Button */}
      <button
        className="w-full bg-blue-500 text-white py-2 px-4 rounded-md mt-4"
        onClick={handleGetLocation}
      >
        Get My Address
      </button>

      <Button el="button" primary>
        continue
      </Button>

      {/* Location confirmation prompt */}
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
