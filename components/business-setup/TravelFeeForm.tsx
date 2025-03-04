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
import { NumericFormat } from "react-number-format";
import FloatingTextarea from "../UI/FloatingTextArea";
import FloatingSelect from "../UI/FloatingSelect";
import * as L from "leaflet";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setTravelFeeAndDistance } from "@/store/features/businessSetupSlice";

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
  const { travelFeeAndDistance } = useAppSelector(
    (store) => store.businessSetup
  );
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (travelFeeAndDistance) {
      setDistance(travelFeeAndDistance?.distance?.toString() || "15");
      setFeeAmount(travelFeeAndDistance.travelFee?.toString() || "");
      setTravelOption(
        (travelFeeAndDistance.feeType as TravelFeeOption) || "free"
      );
      setTravelPolicy(travelFeeAndDistance.travelPolicy || "");
    }
  }, [travelFeeAndDistance]);

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

  useEffect(() => {
    if (isMapInitializedRef.current) return;

    cleanupMap();

    if (!latitude || !longitude) return;

    const mapContainer = document.getElementById(mapContainerId);
    if (!mapContainer) return;

    try {
      const map = L.map(mapContainer, {
        center: [latitude, longitude],
        zoom: 11,
        zoomControl: true,
        attributionControl: true,
      });
      mapRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
        minZoom: 3,
      }).addTo(map);

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

      const distanceValue = parseFloat(distance) || 15;
      const radiusInMeters = distanceValue * 1000;

      const circle = L.circle([latitude, longitude], {
        color: "#EB5017",
        fillColor: "#EB5017",
        fillOpacity: 0.1,
        radius: radiusInMeters,
      }).addTo(map);
      circleRef.current = circle;

      map.fitBounds(circle.getBounds());

      isMapInitializedRef.current = true;

      map.on("error", (e) => {
        console.error("Leaflet map error:", e);
      });
    } catch (error) {
      console.error("Error initializing map:", error);
      toast.error("Could not initialize map");
    }

    return () => {
      cleanupMap();
    };
  }, [latitude, longitude, distance, mapContainerId, cleanupMap]);

  useEffect(() => {
    if (!isMapInitializedRef.current || !mapRef.current) return;

    try {
      if (circleRef.current) {
        mapRef.current.removeLayer(circleRef.current);
      }

      const distanceValue = parseFloat(distance) || 15;
      const radiusInMeters = distanceValue * 1000;

      const circle = L.circle([latitude || 0, longitude || 0], {
        color: "#EB5017",
        fillColor: "#EB5017",
        fillOpacity: 0.1,
        radius: radiusInMeters,
      }).addTo(mapRef.current);

      circleRef.current = circle;

      mapRef.current.fitBounds(circle.getBounds());
    } catch (error) {
      console.error("Error updating map circle:", error);
    }
  }, [distance, latitude, longitude]);

  const handleOptionSelect = (option: any) => {
    if (option) {
      setTravelOption(option.value as TravelFeeOption);

      if (option.value === "free") {
        setFeeAmount("");
      }
    }
  };

  const handleDistanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numericValue = value.replace(/[^0-9.]/g, "");
    setDistance(numericValue);
  };

  const handleFeeAmountChange = (values: any) => {
    const { value } = values;
    setFeeAmount(value);
  };

  const isSubmitDisabled = useMemo(() => {
    if (!latitude || !longitude) {
      return true;
    }

    const parsedDistance = parseFloat(distance);
    if (isNaN(parsedDistance) || parsedDistance <= 0) {
      return true;
    }

    if (
      (travelOption === "fixed" || travelOption === "starts_at") &&
      (!feeAmount || parseFloat(feeAmount) <= 0)
    ) {
      return true;
    }

    return false;
  }, [latitude, longitude, distance, travelOption, feeAmount]);

  const handleContinue = useCallback(() => {
    let travelFee = 0;

    if (travelOption === "fixed" || travelOption === "starts_at") {
      travelFee = parseFloat(feeAmount) || 0;
    }

    const feeData = {
      feeType: travelOption,
      travelFee: travelFee,
      distance: parseFloat(distance),
      travelPolicy: travelPolicy || "",
      currencyCode,
    };

    addTravel(feeData)
      .unwrap()
      .then(() => {
        router.push("team-size");
        dispatch(setTravelFeeAndDistance(feeData));
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
    currencyCode,
    addTravel,
    dispatch,
    router,
  ]);

  useEffect(() => {
    return () => {
      cleanupMap();
    };
  }, [cleanupMap]);

  const KmIcon = () => <span className="text-gray-600 font-medium">km</span>;

  return (
    <div className="">
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <FloatingSelect
            id="price-type"
            options={priceTypeOptions}
            value={priceTypeOptions.find(
              (option) => option.value === travelOption
            )}
            onChange={handleOptionSelect}
            placeholder="Price type"
          />
        </div>

        <div>
          <NumericFormat
            id="fee-amount"
            value={
              travelOption === "free"
                ? "0"
                : travelOption == "varies"
                ? ""
                : feeAmount
            }
            onValueChange={handleFeeAmountChange}
            thousandSeparator={true}
            decimalScale={2}
            prefix={`${currencySymbol} `}
            placeholder="Travel fee"
            customInput={Input}
            disabled={travelOption === "free" || travelOption === "varies"}
            cn={
              travelOption === "free" || travelOption === "varies"
                ? "bg-gray-100 text-gray-400 opacity-70 blur-[0.5px] cursor-not-allowed"
                : ""
            }
            allowNegative={false}
          />
        </div>
      </div>

      <div className="mb-6">
        <Input
          id="travel-distance"
          value={distance}
          onChange={handleDistanceChange}
          placeholder="Maximum travel distance"
          rightIcon={<KmIcon />}
        />
      </div>

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

      <div className="mb-6">
        <FloatingTextarea
          id="travel-policy"
          value={travelPolicy}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            setTravelPolicy(e.target.value)
          }
          placeholder="Travel & Fee Policy (optional)"
          rows={3}
        />
      </div>

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
