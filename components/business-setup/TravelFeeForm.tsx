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
import { MdMyLocation } from "react-icons/md";
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
          html: `<div style="background-color: #EB5017; width: 16px; height: 16px; border-radius: 50%;"></div>`,
          iconSize: [16, 16],
          iconAnchor: [8, 8],
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
      <div className="rounded-lg overflow-hidden bg-white shadow-md border border-gray-200">
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <h3 className="text-lg font-medium text-gray-900">Travel Distance</h3>
          <p className="text-sm text-gray-500">
            How far can you travel to provide your services?
          </p>
        </div>

        {/* Map Container with unique ID */}
        <div id={mapContainerId} className="w-full h-64 bg-gray-100"></div>

        <div className="p-4 space-y-4">
          <div className="flex items-center">
            <MdMyLocation className="text-primary mr-2" />
            <p className="text-sm text-gray-600">
              {latitude && longitude
                ? "Your business location is shown on the map"
                : locationError || "We couldn't detect your location"}
            </p>
          </div>

          <div className="flex flex-col space-y-2">
            <label
              htmlFor="travel-distance"
              className="text-sm font-medium text-gray-700"
            >
              Maximum Travel Distance (km)
            </label>
            <div className="relative mt-">
              <div className="mt-4">
                <Input
                  id="travel-distance"
                  type="text"
                  placeholder="Enter distance in km"
                  value={distance}
                  onChange={handleDistanceChange}
                />
              </div>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                km
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-lg overflow-hidden bg-white shadow-md border border-gray-200">
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <h3 className="text-lg font-medium text-gray-900">Travel Fee</h3>
          <p className="text-sm text-gray-500">
            Do you charge for traveling to the client's location?
          </p>
        </div>

        <div className="p-4 space-y-4">
          <div className="space-y-2">
            <div className="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer">
              <input
                type="radio"
                id="free"
                value="free"
                checked={travelOption === "free"}
                onChange={() => setTravelOption("free")}
                className="h-4 w-4 text-primary border-gray-300 focus:ring-primary"
              />
              <label htmlFor="free" className="ml-3 cursor-pointer flex-1">
                <span className="font-medium text-gray-900">Free Travel</span>
                <p className="text-sm text-gray-500">
                  No additional charge for travel
                </p>
              </label>
            </div>

            <div className="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer">
              <input
                type="radio"
                id="fixed"
                value="fixed"
                checked={travelOption === "fixed"}
                onChange={() => setTravelOption("fixed")}
                className="h-4 w-4 text-primary border-gray-300 focus:ring-primary"
              />
              <label htmlFor="fixed" className="ml-3 cursor-pointer flex-1">
                <span className="font-medium text-gray-900">Fixed Fee</span>
                <p className="text-sm text-gray-500">
                  Charge a flat rate per visit
                </p>
              </label>
            </div>
          </div>

          {travelOption === "fixed" && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <label
                htmlFor="travel-fixed-fee"
                className="block mb-2 text-sm font-medium text-gray-700"
              >
                Fixed Travel Fee
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
            </div>
          )}
        </div>
      </div>

      <Button
        el="button"
        primary
        rounded
        loading={isLoading}
        onClick={handleContinue}
        disabled={!latitude || !longitude}
      >
        Continue
      </Button>
    </div>
  );
};

export default React.memo(TravelFeeForm);
