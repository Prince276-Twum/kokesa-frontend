import React, { useState } from "react";
import { Calendar, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import FloatingSelect from "../UI/FloatingSelect";
import Button from "../UI/Button";
import { setAdditionalInformation } from "@/store/features/businessSetupSlice";
import { useAddAdditionalInformationMutation } from "@/store/features/businessApiSetupSlice";

// Define a more strict type for the option
type LiveDateOption = {
  value: string;
  label: string;
};

const generateLiveDateOptions = (): LiveDateOption[] => {
  return [
    {
      value: "now",
      label: "Activate Immediately",
    },
    {
      value: "2",
      label: "In 2 Days",
    },
    {
      value: "3",
      label: "In 3 Days",
    },
    {
      value: "4",
      label: "In 4 Days",
    },
    {
      value: "5",
      label: "In 5 Days",
    },
    {
      value: "6",
      label: "In 6 Days",
    },
    {
      value: "7",
      label: "In 7 Days",
    },
  ];
};

function ProfileLaunch() {
  const router = useRouter();
  const dispatch = useDispatch();

  const [selectedLiveDate, setSelectedLiveDate] =
    useState<LiveDateOption | null>(null);
  const [isReadyToLaunch, setIsReadyToLaunch] = useState(false);

  const handleDateChange = (selectedOption: LiveDateOption | null) => {
    setSelectedLiveDate(selectedOption);
    setIsReadyToLaunch(!!selectedOption);
  };
  const [addAdditionalInfo] = useAddAdditionalInformationMutation();
  const calculateLiveDate = (): Date | null => {
    if (!selectedLiveDate) return null;

    const today = new Date();

    switch (selectedLiveDate.value) {
      case "now":
        return today;
      default:
        const futureDate = new Date(today);
        futureDate.setDate(today.getDate() + parseInt(selectedLiveDate.value));
        return futureDate;
    }
  };

  const formatLiveDate = (date: Date | null): string => {
    if (!date) return "";

    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return date.toLocaleDateString(undefined, options);
  };

  const handleLaunchProfile = () => {
    if (!selectedLiveDate) return;

    const calculatedDate = calculateLiveDate();
    const formattedDate = calculatedDate ? calculatedDate.toISOString() : "";

    const currentDate = new Date();
    const isLaunched =
      selectedLiveDate.value === "now" ||
      (calculatedDate && calculatedDate <= currentDate);

    dispatch(
      setAdditionalInformation({
        activationDate: formattedDate,
        activationOption: selectedLiveDate.value,
        isLaunched: isLaunched || undefined,
      })
    );

    console.log("Dispatched to Redux:", {
      activation_date: formattedDate,
      activation_option: selectedLiveDate.value,
      is_launched: isLaunched,
    });

    addAdditionalInfo({
      isLaunched: isLaunched,
      activationDate: formattedDate,
      activationOption: selectedLiveDate.value,
    })
      .unwrap()
      .then(() => {
        router.push("/business/complete");
      })
      .catch(() => {});
  };

  return (
    <div className="w-full max-w-md space-y-4">
      <div className="text-center mb-4">
        <h2 className="text-xl font-bold text-gray-800 mb-2">Profile Launch</h2>
        <p className="text-sm text-gray-600">
          Choose when you want to activate your business profile
        </p>
      </div>

      <div className="relative">
        <FloatingSelect
          id="live-date-select"
          placeholder="Select Activation Date"
          options={generateLiveDateOptions()}
          value={selectedLiveDate}
          onChange={handleDateChange}
          isClearable
          isSearchable={false}
        />
      </div>

      {selectedLiveDate && (
        <div className="flex items-center space-x-2 mt-2">
          <div className="bg-primary/10 p-2 rounded-lg">
            <Calendar className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-sm text-gray-600 font-medium">
              Profile Activation Date
            </p>
            <p className="text-sm text-gray-900">
              {formatLiveDate(calculateLiveDate())}
            </p>
          </div>
        </div>
      )}

      <div className="mt-4">
        <Button
          el="button"
          primary
          disabled={!isReadyToLaunch}
          onClick={handleLaunchProfile}
          rounded
        >
          <Check className="mr-2 w-5 h-5" />
          Launch My Business Profile
        </Button>
      </div>
    </div>
  );
}

export default ProfileLaunch;
