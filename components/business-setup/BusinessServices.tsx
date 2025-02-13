import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { FaTimes, FaPlus, FaChevronRight } from "react-icons/fa";
import Input from "../UI/Input";
import { StylesConfig } from "react-select";
import { SingleValue } from "react-select";

import Select from "react-select";

// Define type for service options
interface ServiceDurationOption {
  value: number;
  label: string;
}

interface ServiceOption {
  value: string;
  label: string;
}

interface GroupedServiceOption {
  label: string; // The group label
  options: ServiceOption[]; // The list of services under this group
}

interface ServiceDetails {
  name: string;
  type: ServiceOption | null; // Allow null for clearing
  groupLabel: string; // The group label for the selected service
  duration: { hours: number; minutes: number }; // Service duration
  price: string;
}

interface Props {
  addService?: string;
}

// Sample serviceType data (You would have this in a separate file, e.g., `service-type-data.ts`)
const serviceType: GroupedServiceOption[] = [
  {
    label: "Barber",
    options: [
      { value: "trimming", label: "Trimming" },
      { value: "shaving", label: "Shaving" },
    ],
  },
  {
    label: "Nail Salon",
    options: [
      { value: "manicure", label: "Manicure" },
      { value: "pedicure", label: "Pedicure" },
    ],
  },
];

const BusinessServices = ({ addService }: Props) => {
  const [services, setServices] = useState<ServiceDetails[]>([]);
  const router = useRouter();
  const [serviceDetails, setServiceDetails] = useState<ServiceDetails>({
    name: "",
    type: null, // Initialize as null
    groupLabel: "", // Empty label when no selection
    duration: { hours: 0, minutes: 40 }, // Default duration
    price: "",
  });

  const serviceDurationHours = [
    { value: 0, label: "0 hours" },
    { value: 1, label: "1 hour" },
    { value: 2, label: "2 hours" },
    { value: 3, label: "3 hours" },
    { value: 4, label: "4 hours" },
    { value: 5, label: "5 hours" },
    { value: 6, label: "6 hours" },
    { value: 7, label: "7 hours" },
    { value: 8, label: "8 hours" },
    { value: 9, label: "9 hours" },
    { value: 10, label: "10 hours" },
    { value: 11, label: "11 hours" },
    { value: 12, label: "12 hours" },
    { value: 13, label: "13 hours" },
    { value: 14, label: "14 hours" },
    { value: 15, label: "15 hours" },
    { value: 16, label: "16 hours" },
    { value: 17, label: "17 hours" },
    { value: 18, label: "18 hours" },
    { value: 19, label: "19 hours" },
    { value: 20, label: "20 hours" },
    { value: 21, label: "21 hours" },
    { value: 22, label: "22 hours" },
    { value: 23, label: "23 hours" },
  ];

  const serviceDurationMin = [
    { label: "0 min", value: 0 },
    { label: "5 min", value: 5 },
    { label: "10 min", value: 10 },
    { label: "15 min", value: 15 },
    { label: "20 min", value: 20 },
    { label: "25 min", value: 25 },
    { label: "30 min", value: 30 },
    { label: "35 min", value: 35 },
    { label: "40 min", value: 40 },
    { label: "45 min", value: 45 },
    { label: "50 min", value: 50 },
    { label: "55 min", value: 55 },
    { label: "60 min", value: 60 },
  ];

  const customStyles: StylesConfig<ServiceOption, false> = {
    control: (provided) => ({
      ...provided,
      backgroundColor: "white",
      borderColor: "#4F46E5",
      color: "black",
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "black",
    }),
    menu: (provided) => ({
      ...provided,
      padding: "px",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? "#e5e7eb" : "white",
      color: "black",
      borderBottom: "1px solid #d1d5db",
      padding: "10px",
    }),
    groupHeading: (provided) => ({
      ...provided,
      padding: "1rem  10px",
      color: "black",
      fontWeight: "600",
      fontSize: "20px",
    }),
  };

  const handleServiceTypeChange = (
    selectedOption: SingleValue<ServiceOption>
  ) => {
    // Handle when the selectedOption is null (cleared state)
    if (!selectedOption) {
      // Reset both the selected option and group label
      setServiceDetails({
        ...serviceDetails,
        type: null,
        groupLabel: "", // Reset the group label
      });
      return;
    }

    // Extract group label
    let groupLabel = "";
    serviceType.forEach((group) => {
      const foundOption = group.options.find(
        (option) => option.value === selectedOption.value
      );
      if (foundOption) {
        groupLabel = group.label; // Get group label
      }
    });

    // Update state with selected option and group label
    setServiceDetails({
      ...serviceDetails,
      type: selectedOption,
      groupLabel: groupLabel, // Store group label
    });
  };

  const handleDurationHour = (
    selectedOption: SingleValue<ServiceDurationOption>
  ) => {
    setServiceDetails({
      ...serviceDetails,
      duration: {
        hours: selectedOption?.value || 0,
        minutes: serviceDetails.duration.minutes,
      },
    });
  };

  const handleDurationMin = (
    selectedOption: SingleValue<ServiceDurationOption>
  ) => {
    setServiceDetails({
      ...serviceDetails,
      duration: {
        minutes: selectedOption?.value || 0,
        hours: serviceDetails.duration.hours,
      },
    });
  };

  const handleSubmit = () => {
    if (serviceDetails.name && serviceDetails.price) {
      const updatedServices = [...services, { ...serviceDetails }];
      setServices(updatedServices);
      localStorage.setItem("services", JSON.stringify(updatedServices));
      setServiceDetails({
        name: "",
        type: null, // Reset type to null
        groupLabel: "", // Reset group label
        duration: { hours: 0, minutes: 40 },
        price: "",
      });
    }

    console.log(serviceDetails); // This will now log the group label as well
  };

  const handleRemoveService = (index: number) => {
    const updatedServices = services.filter((_, i) => i !== index);
    setServices(updatedServices);

    // Save the updated services list to local storage
    localStorage.setItem("services", JSON.stringify(updatedServices));
  };
  return (
    <div className="p-4 space-y-4">
      {!addService && (
        <>
          {services.map((service, index) => (
            <div
              key={index}
              className="border rounded-lg p-4 flex items-center justify-between hover:bg-gray-50"
            >
              <div className="flex items-center">
                <button
                  onClick={() => handleRemoveService(index)}
                  className="hover:text-red-500"
                >
                  <FaTimes className="w-5 h-5 text-gray-400 mr-3" />
                </button>
                <span className="text-sm font-medium">
                  {service.name} - {service.price}
                </span>
              </div>
              <div className="flex items-center">
                <span className="mr-2 text-lg font-bold">${service.price}</span>
                <FaChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          ))}

          <button
            onClick={() => router.push("add-service")}
            className="w-full border rounded-lg p-4 flex items-center text-gray-500 hover:bg-gray-100 transition-colors"
          >
            <FaPlus className="w-5 h-5 mr-3" />
            Add Service
          </button>
        </>
      )}
      {addService && (
        <>
          <div className="space-y-4">
            <div>
              <Input
                id="service-name"
                type="text"
                placeholder="Service Name"
                value={serviceDetails.name}
                onChange={(e) =>
                  setServiceDetails({ ...serviceDetails, name: e.target.value })
                }
              />
            </div>

            {/* Service Type Selection */}
            <div>
              <Select
                isClearable
                styles={customStyles}
                options={serviceType}
                value={serviceDetails.type} // Set the selected value
                onChange={handleServiceTypeChange} // Handle change
              />
            </div>

            {/* Service Duration Selection */}
            <div>
              <label className="block text-sm text-gray-600 mb-2">
                Service duration
              </label>

              <div className="flex gap-4">
                <Select
                  options={serviceDurationHours}
                  value={serviceDurationHours.find(
                    (item) => item.value === serviceDetails.duration.hours
                  )}
                  onChange={(selectedOption) =>
                    handleDurationHour(selectedOption)
                  }
                />
                <Select
                  options={serviceDurationMin}
                  value={serviceDurationMin.find(
                    (item) => item.value === serviceDetails.duration.minutes
                  )}
                  onChange={(selectedOption) =>
                    handleDurationMin(selectedOption)
                  }
                />
              </div>
            </div>

            {/* Price Input */}
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="$25.00"
                className="flex-1 p-4 border rounded-lg"
                value={serviceDetails.price}
                onChange={(e) =>
                  setServiceDetails({
                    ...serviceDetails,
                    price: e.target.value,
                  })
                }
              />
            </div>

            <button
              onClick={handleSubmit}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded-lg py-4 font-medium transition-colors"
            >
              Save
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default BusinessServices;
