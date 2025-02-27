import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { NumericFormat } from "react-number-format";
import Input from "../UI/Input";
import Button from "../UI/Button";
import { useAddTravelInfoMutation } from "@/store/features/businessApiSetupSlice";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import useCurrencyInfo from "@/hooks/useCurrencyInfo";
import { MdMyLocation, MdInfo, MdAttachMoney, MdNearMe } from "react-icons/md";
import { FaMapMarkerAlt } from "react-icons/fa";
import "leaflet/dist/leaflet.css";

// Ensure Leaflet is imported correctly
import * as L from "leaflet";

// Unique identifier to prevent map container conflicts
const generateUniqueId = () => `map-${Math.random().toString(36).substr(2, 9)}`;

const TravelFeeForm: React.FC = () => {
  const [travelOption, setTravelOption] = useState("free");
  const [fixedPrice, setFixedPrice] = useState("");
  const [distance, setDistance] = useState("50");
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  // Use a unique ID for the map container
  const mapContainerId = useMemo(() => generateUniqueId(), []);

  // Refs for managing map lifecycle
  const mapRef = useRef<L.Map | null>(null);
  const circleRef = useRef<L.Circle | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const isMapInitializedRef = useRef(false);

  const [addTravel, { isLoading }] = useAddTravelInfoMutation();
  const { currencyCode, currencySymbol } = useCurrencyInfo();
  const router = useRouter();

  // Safe cleanup function to remove existing map elements
  const cleanupMap = useCallback(() => {
    try {
      // Ensure we don't try to remove layers from a destroyed map
      if (mapRef.current) {
        // Remove circle
        if (circleRef.current) {
          mapRef.current.removeLayer(circleRef.current);
          circleRef.current = null;
        }

        // Remove marker
        if (markerRef.current) {
          mapRef.current.removeLayer(markerRef.current);
          markerRef.current = null;
        }

        // Remove map
        mapRef.current.remove();
        mapRef.current = null;
      }

      // Reset initialization flag
      isMapInitializedRef.current = false;
    } catch (error) {
      console.error("Error during map cleanup:", error);
    }
  }, []);

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
    const savedAddress = localStorage.getItem("businessAddress");
    if (savedAddress) {
      try {
        const parsedAddress = JSON.parse(savedAddress);
        if (parsedAddress.latitude && parsedAddress.longitude) {
          setLatitude(parsedAddress.latitude);
          setLongitude(parsedAddress.longitude);
          return;
        }
      } catch (error) {
        console.error("Error parsing saved address:", error);
      }
    }

    // Fall back to detecting location if no saved address
    detectLocation();
  }, [detectLocation]);

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
      const distanceValue = parseFloat(distance) || 50;
      const circle = L.circle([latitude, longitude], {
        color: "#EB5017",
        fillColor: "#EB5017",
        fillOpacity: 0.1,
        radius: distanceValue * 1000, // Convert km to meters
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
      const distanceValue = parseFloat(distance) || 50;
      const circle = L.circle([latitude || 0, longitude || 0], {
        color: "#EB5017",
        fillColor: "#EB5017",
        fillOpacity: 0.1,
        radius: distanceValue * 1000, // Convert km to meters
      }).addTo(mapRef.current);

      circleRef.current = circle;

      // Fit map to new circle
      mapRef.current.fitBounds(circle.getBounds());
    } catch (error) {
      console.error("Error updating map circle:", error);
    }
  }, [distance, latitude, longitude]);

  // Handle distance change to allow any numeric input
  const handleDistanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Allow only numeric input, including decimal points
    const numericValue = value.replace(/[^0-9.]/g, "");

    setDistance(numericValue);
  };

  // Continue handler with basic validation
  const handleContinue = useCallback(() => {
    // Validate location
    if (!latitude || !longitude) {
      toast.error(
        locationError ||
          "Location not set. Please check your location settings."
      );
      return;
    }

    // Validate distance (ensure it's a positive number)
    const parsedDistance = parseFloat(distance);
    if (isNaN(parsedDistance) || parsedDistance <= 0) {
      toast.error("Please enter a valid travel distance");
      return;
    }

    // Validate fixed price for fixed travel option
    if (travelOption === "fixed" && !fixedPrice) {
      toast.error("Please enter a fixed travel fee");
      return;
    }

    const travelFee = travelOption === "free" ? 0 : parseFloat(fixedPrice);

    addTravel({
      distance,
      travelFee,
      currencyCode,
      latitude,
      longitude,
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
    fixedPrice,
    distance,
    latitude,
    longitude,
    currencyCode,
    addTravel,
    router,
    locationError,
  ]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupMap();
    };
  }, [cleanupMap]);

  return (
    <div className="space-y-6">
      {/* Map Section */}
      <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
        <div className="bg-primary-50 p-4 border-b border-primary-100">
          <div className="flex items-center">
            <div className="rounded-full bg-primary-100 p-2 mr-3">
              <FaMapMarkerAlt className="text-primary h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Service Area
              </h3>
              <p className="text-sm text-gray-600">
                Define your travel radius to clients
              </p>
            </div>
          </div>
        </div>

        {/* Map Container with improved height */}
        <div id={mapContainerId} className="w-full h-72 bg-gray-100 relative">
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

        <div className="p-5 space-y-5">
          {/* Location status with improved styling */}
          <div
            className={`flex items-start p-3 rounded-lg ${
              latitude && longitude
                ? "bg-green-50 text-green-800"
                : "bg-yellow-50 text-yellow-800"
            }`}
          >
            <MdMyLocation
              className={`mt-0.5 mr-2 flex-shrink-0 ${
                latitude && longitude ? "text-green-500" : "text-yellow-500"
              }`}
              size={18}
            />
            <p className="text-sm">
              {latitude && longitude
                ? "Your business location has been detected and is shown on the map"
                : locationError ||
                  "We're having trouble detecting your location. Please check your location permissions."}
            </p>
          </div>

          {/* Distance Input with better styling */}
          <div>
            <label
              htmlFor="travel-distance"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Maximum Travel Distance
            </label>
            <div className="relative">
              <Input
                id="travel-distance"
                type="text"
                placeholder="Enter distance"
                value={distance}
                onChange={handleDistanceChange}
                cn="pr-12"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-gray-100 px-2 py-1 rounded text-sm font-medium text-gray-600">
                km
              </div>
            </div>
            <p className="mt-2 text-xs text-gray-500 flex items-center">
              <MdInfo className="mr-1" />
              This will define how far you're willing to travel for appointments
            </p>
          </div>
        </div>
      </div>

      {/* Fee Section with improved design */}
      <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
        <div className="bg-primary-50 p-4 border-b border-primary-100">
          <div className="flex items-center">
            <div className="rounded-full bg-primary-100 p-2 mr-3">
              <MdAttachMoney className="text-primary h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Travel Fee
              </h3>
              <p className="text-sm text-gray-600">
                Set your travel pricing policy
              </p>
            </div>
          </div>
        </div>

        <div className="p-5 space-y-4">
          {/* Travel Fee Options with improved cards */}
          <div className="grid grid-cols-1 gap-3">
            <div
              className={`flex items-start p-4 rounded-xl border-2 ${
                travelOption === "free"
                  ? "border-primary bg-primary-50"
                  : "border-gray-200 hover:border-gray-300"
              } transition-colors cursor-pointer`}
              onClick={() => setTravelOption("free")}
            >
              <div className="mt-0.5">
                <input
                  type="radio"
                  id="free"
                  value="free"
                  checked={travelOption === "free"}
                  onChange={() => setTravelOption("free")}
                  className="h-4 w-4 text-primary border-gray-300 focus:ring-primary"
                />
              </div>
              <label htmlFor="free" className="ml-3 cursor-pointer flex-1">
                <span className="font-medium text-gray-900 block">
                  Free Travel
                </span>
                <p className="text-sm text-gray-600 mt-1">
                  You won't charge clients for your travel time or expenses
                </p>
              </label>
            </div>

            <div
              className={`flex items-start p-4 rounded-xl border-2 ${
                travelOption === "fixed"
                  ? "border-primary bg-primary-50"
                  : "border-gray-200 hover:border-gray-300"
              } transition-colors cursor-pointer`}
              onClick={() => setTravelOption("fixed")}
            >
              <div className="mt-0.5">
                <input
                  type="radio"
                  id="fixed"
                  value="fixed"
                  checked={travelOption === "fixed"}
                  onChange={() => setTravelOption("fixed")}
                  className="h-4 w-4 text-primary border-gray-300 focus:ring-primary"
                />
              </div>
              <label htmlFor="fixed" className="ml-3 cursor-pointer flex-1">
                <span className="font-medium text-gray-900 block">
                  Fixed Fee
                </span>
                <p className="text-sm text-gray-600 mt-1">
                  Charge a consistent flat rate for travel to any client
                  location
                </p>
              </label>
            </div>
          </div>

          {/* Fixed Price Input with smooth transition */}
          <div
            className={`transition-all duration-300 overflow-hidden ${
              travelOption === "fixed"
                ? "max-h-40 opacity-100"
                : "max-h-0 opacity-0"
            }`}
          >
            {travelOption === "fixed" && (
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 mt-3">
                <label
                  htmlFor="travel-fixed-fee"
                  className="block mb-2 text-sm font-medium text-gray-700"
                >
                  Fixed Travel Fee Amount
                </label>
                <NumericFormat
                  id="travel-fixed-fee"
                  value={fixedPrice}
                  onValueChange={(values) => setFixedPrice(values.value)}
                  thousandSeparator={true}
                  prefix={`${currencyCode} `}
                  placeholder={`${currencySymbol} 0.00`}
                  customInput={Input}
                />
                <p className="mt-2 text-xs text-gray-500">
                  This amount will be added to every booking when you travel to
                  a client
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Continue Button - Improved */}
      <Button
        el="button"
        primary
        rounded
        loading={isLoading}
        onClick={handleContinue}
        disabled={!latitude || !longitude}
        className="w-full py-3.5 text-base font-medium shadow-sm mt-4"
      >
        <MdNearMe className="mr-2" />
        Continue
      </Button>
    </div>
  );
};

export default React.memo(TravelFeeForm);
