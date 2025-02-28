import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import Input from "../UI/Input";
import Button from "../UI/Button";
import { useAddTravelInfoMutation } from "@/store/features/businessApiSetupSlice";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import useCurrencyInfo from "@/hooks/useCurrencyInfo";
import { MdInfo } from "react-icons/md";
import "leaflet/dist/leaflet.css";
import Select from "react-select";

// Ensure Leaflet is imported correctly
import * as L from "leaflet";
import { useAppSelector } from "@/store/hooks";

// Unique identifier to prevent map container conflicts
const generateUniqueId = () => `map-${Math.random().toString(36).substr(2, 9)}`;

type TravelFeeOption = "fixed" | "varies" | "free" | "starts_at";

const priceTypeOptions = [
  { value: "fixed", label: "Fixed" },
  { value: "varies", label: "Varies" },
  { value: "free", label: "Free" },
  { value: "starts_at", label: "Starts at" },
];

const TravelFeeForm: React.FC = () => {
  const [travelOption, setTravelOption] = useState<TravelFeeOption>("free");
  const [feeAmount, setFeeAmount] = useState("");
  const [travelPolicy, setTravelPolicy] = useState("");
  const [distance, setDistance] = useState("15");
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const { businessAddress } = useAppSelector((store) => store.businessSetup);
  const mapContainerId = useMemo(() => generateUniqueId(), []);

  const mapRef = useRef<L.Map | null>(null);
  const circleRef = useRef<L.Circle | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const isMapInitializedRef = useRef(false);
  const [addTravel, { isLoading }] = useAddTravelInfoMutation();
  const { currencyCode, currencySymbol } = useCurrencyInfo();
  const router = useRouter();

  const cleanupMap = useCallback(() => {
    try {
      if (mapRef.current) {
        if (circleRef.current) {
          mapRef.current.removeLayer(circleRef.current);
          circleRef.current = null;
        }

        if (markerRef.current) {
          mapRef.current.removeLayer(markerRef.current);
          markerRef.current = null;
        }

        mapRef.current.remove();
        mapRef.current = null;
      }

      isMapInitializedRef.current = false;
    } catch (error) {
      console.error("Error during map cleanup:", error);
    }
  }, []);

  if (locationError) {
    toast.error(locationError);
  }
  // Memoized location detection
  const detectLocation = useCallback(() => {
    setLocationError(null);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
          toast.success("Location detected successfully");
        },
        (error) => {
          console.error("Error getting location:", error);
          let errorMessage = "Could not detect your location";
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = "Location permission denied";
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = "Location information is unavailable";
              break;
            case error.TIMEOUT:
              errorMessage = "Location request timed out";
              break;
          }
          setLocationError(errorMessage);
          toast.error(errorMessage);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );
    } else {
      const errorMessage = "Geolocation is not supported by this browser";
      setLocationError(errorMessage);
      toast.error(errorMessage);
    }
  }, []);

  // Load saved address or detect location
  useEffect(() => {
    if (businessAddress) {
      try {
        if (businessAddress.latitude && businessAddress.longitude) {
          setLatitude(businessAddress.latitude);
          setLongitude(businessAddress.longitude);
          return;
        }
      } catch (error) {
        console.error("Error parsing saved address:", error);
      }
    }

    detectLocation();
  }, [detectLocation, businessAddress]);

  // Initialize map when coordinates are available
  useEffect(() => {
    // Prevent multiple initializations
    if (isMapInitializedRef.current) return;

    // Cleanup any existing map first
    cleanupMap();

    // Check for required conditions
    if (!latitude || !longitude) return;

    const mapContainer = document.getElementById(mapContainerId);
    if (!mapContainer) return;

    try {
      // Create new map
      const map = L.map(mapContainer, {
        center: [latitude, longitude],
        zoom: 11,
        zoomControl: true,
        attributionControl: true,
      });
      mapRef.current = map;

      // Add tile layer
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
        minZoom: 3,
      }).addTo(map);

      // Add marker for business location
      const marker = L.marker([latitude, longitude], {
        icon: L.divIcon({
          className: "custom-marker",
          html: `<div class="flex items-center justify-center w-6 h-6 bg-primary rounded-full border-2 border-white shadow-md">
                  <div class="w-2 h-2 bg-white rounded-full"></div>
                </div>`,
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        }),
      }).addTo(map);
      markerRef.current = marker;

      // Draw circle for travel radius
      const distanceValue = parseFloat(distance) || 15;
      const radiusInMeters = distanceValue * 1000; // Convert km to meters

      const circle = L.circle([latitude, longitude], {
        color: "#EB5017",
        fillColor: "#EB5017",
        fillOpacity: 0.1,
        radius: radiusInMeters,
      }).addTo(map);
      circleRef.current = circle;

      // Fit map to circle
      map.fitBounds(circle.getBounds());

      // Mark map as initialized
      isMapInitializedRef.current = true;

      // Add error handling for map interactions
      map.on("error", (e) => {
        console.error("Leaflet map error:", e);
      });
    } catch (error) {
      console.error("Error initializing map:", error);
      toast.error("Could not initialize map");
    }

    // Cleanup function
    return () => {
      cleanupMap();
    };
  }, [latitude, longitude, distance, mapContainerId, cleanupMap]);

  // Update map circle when distance changes
  useEffect(() => {
    if (!isMapInitializedRef.current || !mapRef.current) return;

    try {
      // Remove existing circle if it exists
      if (circleRef.current) {
        mapRef.current.removeLayer(circleRef.current);
      }

      // Create new circle
      const distanceValue = parseFloat(distance) || 15;
      const radiusInMeters = distanceValue * 1000; // Convert km to meters

      const circle = L.circle([latitude || 0, longitude || 0], {
        color: "#EB5017",
        fillColor: "#EB5017",
        fillOpacity: 0.1,
        radius: radiusInMeters,
      }).addTo(mapRef.current);

      circleRef.current = circle;

      // Fit map to new circle
      mapRef.current.fitBounds(circle.getBounds());
    } catch (error) {
      console.error("Error updating map circle:", error);
    }
  }, [distance, latitude, longitude]);

  // Handle travel option selection
  const handleOptionSelect = (option: any) => {
    if (option) {
      setTravelOption(option.value as TravelFeeOption);

      // Clear fee amount when selecting free
      if (option.value === "free") {
        setFeeAmount("");
      }
    }
  };

  // Handle distance change
  const handleDistanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow only numeric input, including decimal points
    const numericValue = value.replace(/[^0-9.]/g, "");
    setDistance(numericValue);
  };

  // Validate form and check if the button should be disabled
  const isSubmitDisabled = useMemo(() => {
    // Basic location check
    if (!latitude || !longitude) {
      return true;
    }

    // Validate distance (ensure it's a positive number)
    const parsedDistance = parseFloat(distance);
    if (isNaN(parsedDistance) || parsedDistance <= 0) {
      return true;
    }

    // Validate fee amount for options that need it
    if (
      (travelOption === "fixed" || travelOption === "starts_at") &&
      (!feeAmount || parseFloat(feeAmount) <= 0)
    ) {
      return true;
    }

    return false;
  }, [latitude, longitude, distance, travelOption, feeAmount]);

  // Continue handler
  const handleContinue = useCallback(() => {
    let travelFee = 0;

    // Calculate fee based on option
    if (travelOption === "fixed" || travelOption === "starts_at") {
      travelFee = parseFloat(feeAmount) || 0;
    }

    // Prepare data structure for API
    const feeData = {
      feeType: travelOption,
      feeAmount: travelFee,
      distance: parseFloat(distance),
      travelPolicy: travelPolicy || null,
    };

    addTravel({
      distance,
      travelFee,
      currencyCode,
      latitude,
      longitude,
      feeStructure: JSON.stringify(feeData),
    })
      .unwrap()
      .then(() => {
        router.push("team-size");
      })
      .catch((error) => {
        console.error("Travel info submission error:", error);
        toast.error("There was an error saving your travel information");
      });
  }, [
    travelOption,
    feeAmount,
    distance,
    travelPolicy,
    latitude,
    longitude,
    currencyCode,
    addTravel,
    router,
  ]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupMap();
    };
  }, [cleanupMap]);

  // Custom styles for React Select
  const selectStyles = {
    control: (provided: any) => ({
      ...provided,
      border: "1px solid #e5e7eb",
      borderRadius: "0.375rem",
      boxShadow: "none",
      padding: "2px 0",
      "&:hover": {
        borderColor: "#d1d5db",
      },
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isSelected ? "#f3f4f6" : "white",
      color: "#1a1a1a",
      padding: "8px 12px",
      "&:hover": {
        backgroundColor: "#f9fafb",
      },
    }),
    menu: (provided: any) => ({
      ...provided,
      borderRadius: "0.375rem",
      boxShadow:
        "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      zIndex: 9999,
    }),
    menuPortal: (provided: any) => ({
      ...provided,
      zIndex: 9999,
    }),
    singleValue: (provided: any) => ({
      ...provided,
      color: "#1a1a1a",
      fontWeight: 500,
    }),
    valueContainer: (provided: any) => ({
      ...provided,
      padding: "2px 12px",
    }),
    indicatorSeparator: () => ({
      display: "none",
    }),
    dropdownIndicator: (provided: any) => ({
      ...provided,
      color: "#9ca3af",
    }),
  };

  return (
    <div className="">
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Price Type Dropdown using React Select */}
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1 uppercase">
            Price type
          </label>
          <Select
            options={priceTypeOptions}
            value={priceTypeOptions.find(
              (option) => option.value === travelOption
            )}
            onChange={handleOptionSelect}
            styles={selectStyles}
            isSearchable={false}
            className="react-select-container"
            classNamePrefix="react-select"
            menuPortalTarget={document.body}
            menuPosition="fixed"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1 uppercase">
            Travel fee
          </label>
          <div
            className={`flex items-center border border-gray-300 rounded px-3 py-2 ${
              travelOption === "free" || travelOption === "varies"
                ? "bg-gray-50"
                : "bg-white"
            }`}
          >
            <span className="text-gray-500 mr-1">{currencySymbol}</span>
            <input
              type="text"
              value={travelOption === "free" ? "0" : feeAmount}
              onChange={(e) =>
                setFeeAmount(e.target.value.replace(/[^0-9.]/g, ""))
              }
              placeholder="0"
              disabled={travelOption === "free" || travelOption === "varies"}
              className="bg-transparent border-none w-full focus:outline-none text-gray-800"
            />
          </div>
        </div>
      </div>

      {/* Distance Field */}
      <div className="mb-6">
        <div className="relative">
          <Input
            id="travel-distance"
            type="text"
            placeholder="Maximum travel distance"
            value={distance}
            onChange={handleDistanceChange}
            cn="pr-12"
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-gray-100 px-2 py-1 rounded text-sm font-medium text-gray-600">
            km
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div
        id={mapContainerId}
        className="w-full h-64 rounded-lg overflow-hidden bg-gray-100 relative mb-6"
      >
        {(!latitude || !longitude) && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-80 z-10">
            <div className="text-center p-4">
              <MdInfo className="text-yellow-500 text-4xl mx-auto mb-2" />
              <p className="text-gray-700 font-medium">
                Detecting your location...
              </p>
              <button
                onClick={detectLocation}
                className="mt-3 px-4 py-2 bg-primary text-white rounded-lg text-sm hover:bg-primary-dark transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Travel Policy */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-1">
          <label className="text-sm text-gray-700">
            Travel & Fee Policy (optional)
          </label>
          <div className="text-gray-400 rounded-full h-6 w-6 flex items-center justify-center border border-gray-300">
            ?
          </div>
        </div>
        <textarea
          value={travelPolicy}
          onChange={(e) => setTravelPolicy(e.target.value)}
          placeholder="Explain your travel fee policy to clients"
          className="w-full px-3 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
          rows={3}
        />
      </div>

      {/* Continue Button */}
      <Button
        el="button"
        primary
        rounded
        loading={isLoading}
        onClick={handleContinue}
        disabled={isSubmitDisabled}
      >
        Continue
      </Button>
    </div>
  );
};

export default React.memo(TravelFeeForm);
