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
import {
  setBusinessAddress,
  setCurrentStep,
  setDefaultCurrency,
} from "@/store/features/businessSetupSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { LocationOptions } from "@/utils/common-varialbles";
import { capitalizeFirstLetterOfEachWord } from "@/utils/capitalized-words";
import { MdLocationOn, MdClose, MdSearch, MdMyLocation } from "react-icons/md";

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
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [confirmLocation, setConfirmLocation] = useState<boolean>(false);
  const [addAddress, { isLoading }] = useAddBusinessAddressMutation();
  const [useReverseGeocode, setUseReverseGeocode] = useState(false);
  const [isUserTyping, setIsUserTyping] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const {
    businessAddress,
    businessInfo: { businessLocationOption },
  } = useAppSelector((store) => store.businessSetup);

  useEffect(() => {
    console.log(businessAddress);
    setAddress(businessAddress.address || "");
    setCity(businessAddress.city || "");
    setState(businessAddress.state || "");
    setCountry(businessAddress.country || "");
    setPostalCode(businessAddress.postalCode || "");
    setLatitude(businessAddress.latitude || null);
    setLongitude(businessAddress.longitude || null);
  }, [businessAddress]);

  const { data: geocodeData, isLoading: isGeocodeLoading } = useGeocodeQuery(
    address,
    { skip: address.length < 2 }
  );

  const {
    data: reverseGeocodeData,
    isLoading: isReverseGeocodeLoading,
    isError: isReverseGeocodeError,
  } = useReverseGeocodeQuery(
    { latitude, longitude },
    { skip: !longitude || !latitude }
  );

  useEffect(() => {
    if (geocodeData && geocodeData.results && address.length >= 2) {
      setSuggestions(geocodeData.results);
      if (isUserTyping) {
        setShowSuggestions(true);
      }
    }
  }, [geocodeData, address, isUserTyping]);

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setAddress(query);
    setIsUserTyping(true);

    if (query.length >= 2) {
      setShowSuggestions(true);

      if (geocodeData && geocodeData.results) {
        setSuggestions(geocodeData.results);
      }
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleAddressFocus = () => {
    setIsUserTyping(true);
    if (address.length >= 2 && suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleAddressBlur = () => {
    setTimeout(() => {
      setIsUserTyping(false);
    }, 200);
  };

  const handleSelectAddress = (selectedAddress: Location) => {
    setShowSuggestions(false);
    setSuggestions([]);
    setIsUserTyping(false);

    setTimeout(() => {
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
    }, 0);
  };

  const handleUseCurrentLocation = () => {
    setShowSuggestions(false);
    setSuggestions([]);
    setIsUserTyping(false);
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
          console.error("Geolocation error:", error);
          toast.error("Unable to retrieve your location.");
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      toast.error("Geolocation is not supported by your browser.");
    }
    setConfirmLocation(false);
  };

  const handleConfirmLocation = () => {
    setUseReverseGeocode(true);
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

    const capitalizedAddress = capitalizeFirstLetterOfEachWord(address);
    const capitalizedCity = capitalizeFirstLetterOfEachWord(city);
    const capitalizedState = capitalizeFirstLetterOfEachWord(state);
    const capitalizedCountry = capitalizeFirstLetterOfEachWord(country);

    const businessAddress = {
      address: capitalizedAddress,
      city: capitalizedCity,
      state: capitalizedState,
      country: capitalizedCountry.trim(),
      postalCode: postalCode.toUpperCase().trim(),
      latitude,
      longitude,
    };

    dispatch(setBusinessAddress(businessAddress));

    addAddress(businessAddress)
      .unwrap()
      .then((response) => {
        dispatch(setDefaultCurrency(response.default_currency));
        console.log(response.defaultCurrency);
        dispatch(setCurrentStep(current_step + 1));

        if (
          businessLocationOption === LocationOptions[0].label ||
          businessLocationOption === LocationOptions[2].label
        ) {
          router.push("travel-fee");
        } else {
          router.push("team-size");
        }
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
  }, [reverseGeocodeData, useReverseGeocode]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const element = event.target as HTMLElement;
      if (!element.closest("#address-container")) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isReverseGeocodeError && useReverseGeocode) {
      toast.error("Something went wrong with location lookup.");
    }
  }, [isReverseGeocodeError, useReverseGeocode]);

  return (
    <div className="space-y-6">
      {isReverseGeocodeLoading ? (
        <div className="py-12 text-center text-gray-600">
          <div className="flex justify-center mb-3">
            <svg
              className="animate-spin h-8 w-8 text-primary"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
          Loading your location data...
        </div>
      ) : (
        <>
          <div id="address-container" className="relative">
            <div className="relative">
              <Input
                id="text-address"
                type="text"
                name="address"
                placeholder="Start typing your address"
                value={address}
                onChange={handleAddressChange}
                onFocus={handleAddressFocus}
                onBlur={handleAddressBlur}
                cn="pr-10"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                <MdSearch size={20} />
              </div>
            </div>

            {showSuggestions && (
              <div className="absolute z-40 left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {isGeocodeLoading ? (
                  <div className="p-4 text-center text-gray-500 flex items-center justify-center">
                    <svg
                      className="animate-spin h-5 w-5 mr-2 text-primary"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Searching addresses...
                  </div>
                ) : suggestions.length > 0 ? (
                  suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      className="w-full text-left flex items-start p-3 hover:bg-gray-50 border-b border-gray-100 transition-colors"
                      onClick={() => handleSelectAddress(suggestion)}
                      type="button"
                    >
                      <MdLocationOn
                        className="text-primary mt-1 mr-2 flex-shrink-0"
                        size={18}
                      />
                      <span className="text-gray-900">
                        {suggestion.formatted}
                      </span>
                    </button>
                  ))
                ) : address.length >= 2 ? (
                  <div className="p-4 text-center text-gray-500">
                    No addresses found
                  </div>
                ) : null}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              id="address-country"
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
              onChange={(e) => setPostalCode(e.target.value.toUpperCase())}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              id="address-latitude"
              type="number"
              name="latitude"
              value={latitude ?? ""}
              onChange={(e) => setLatitude(parseFloat(e.target.value))}
              placeholder="Latitude"
            />

            <Input
              id="address-longitude"
              type="number"
              name="longitude"
              value={longitude ?? ""}
              onChange={(e) => setLongitude(parseFloat(e.target.value))}
              placeholder="Longitude"
            />
          </div>

          <button
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
            onClick={handleUseCurrentLocation}
            type="button"
          >
            <MdMyLocation className="text-primary" />
            <span>Use Current Location</span>
          </button>

          <div className="mt-6">
            <Button
              el="button"
              loading={isLoading}
              primary
              rounded
              onClick={handleContinue}
            >
              Continue
            </Button>
          </div>
        </>
      )}

      {confirmLocation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Confirm Location
              </h3>
              <button
                onClick={() => setConfirmLocation(false)}
                className="text-gray-500 hover:text-gray-700"
                type="button"
              >
                <MdClose size={24} />
              </button>
            </div>

            <p className="text-gray-600 mb-6">
              Are you at your business location? We'll use your current GPS
              coordinates to find your address.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <Button
                el="button"
                primary
                rounded
                onClick={handleConfirmLocation}
              >
                Yes, Use My Location
              </Button>
              <button
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                onClick={() => setConfirmLocation(false)}
                type="button"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BusinessAddress;
