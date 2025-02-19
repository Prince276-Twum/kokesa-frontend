import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FaTimes, FaPlus, FaChevronRight } from "react-icons/fa";
import Input from "../UI/Input";
import { StylesConfig } from "react-select";
import { SingleValue } from "react-select";
import useCurrencyInfo from "@/hooks/useCurrencyInfo";
import {
  serviceDurationHours,
  serviceDurationMin,
} from "@/utils/common-varialbles";
import { serviceType } from "@/data/business-service";

import Select from "react-select";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  addBusinessService,
  addServiceEditIndex,
  updateBusinessService,
} from "@/store/features/businessSetupSlice";
import { NumericFormat } from "react-number-format";
import Button from "../UI/Button";

// Define type for service options
interface ServiceDurationOption {
  value: number;
  label: string;
}

interface ServiceOption {
  value: string;
  label: string;
}

interface ServiceDetails {
  name: string;
  type: ServiceOption | null; // Allow null for clearing
  groupLabel: string; // The group label for the selected service
  duration: { hours: number; minutes: number }; // Service duration
  price: number;
}

interface Props {
  addServices?: boolean;
}

const BusinessServices = ({ addServices }: Props) => {
  const { services } = useAppSelector((store) => store.businessSetup);
  const router = useRouter();
  const [isAddService] = useState(addServices);
  const { currencyCode, currencySymbol } = useCurrencyInfo();
  const [serviceDetails, setServiceDetails] = useState<ServiceDetails>({
    name: "",
    type: null, // Initialize as null
    groupLabel: "", // Empty label when no selection
    duration: { hours: 0, minutes: 40 }, // Default duration
    price: 25,
  });
  const dispatch = useAppDispatch();

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
    if (!selectedOption) {
      setServiceDetails({
        ...serviceDetails,
        type: null,
        groupLabel: "",
      });
      return;
    }

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

  const handleOnSave = () => {
    if (serviceDetails.name && serviceDetails.price) {
      const updatedServices = [...services.service, { ...serviceDetails }];
      localStorage.setItem("services", JSON.stringify(updatedServices));
      setServiceDetails({
        name: "",
        type: null, // Reset type to null
        groupLabel: "", // Reset group label
        duration: { hours: 0, minutes: 40 },
        price: 25,
      });
      dispatch(addBusinessService(updatedServices));
      dispatch(addServiceEditIndex(null));
      router.push("services");
    }

    console.log(serviceDetails); // This will now log the group label as well
  };

  const handleRemoveService = (index: number) => {
    const updatedServices = services.service.filter((_, i) => i !== index);
    dispatch(addBusinessService(updatedServices));

    console.log(updatedServices);
    localStorage.setItem("services", JSON.stringify(updatedServices));
  };

  console.log(services.editingIndex, "is outside");

  useEffect(() => {
    if (services.editingIndex !== null) {
      setServiceDetails(services.service[services.editingIndex]);
    }
  }, [services.editingIndex, services.service]);

  const handleSubmit = () => {
    router.push("hours");
  };

  return (
    <div className="p-4 space-y-4">
      {!isAddService && (
        <>
          {services.service.map((service, index) => (
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
                <span className="text-sm font-medium">{service.name}</span>
              </div>
              <div className="flex items-center">
                <span className="mr-2 text-lg font-bold">
                  {currencySymbol}
                  {service.price}
                </span>
                <FaChevronRight
                  className="w-5 h-5 text-gray-400"
                  onClick={() => {
                    dispatch(addServiceEditIndex(index));
                    router.push("add-service");
                  }}
                />
              </div>
            </div>
          ))}

          <button
            onClick={() => {
              dispatch(addServiceEditIndex(null));
              router.push("add-service");
            }}
            className="w-full border rounded-lg p-4 flex items-center text-gray-500 hover:bg-gray-100 transition-colors"
          >
            <FaPlus className="w-5 h-5 mr-3" />
            Add Service
          </button>

          <Button el="button" onClick={handleSubmit} primary>
            Next
          </Button>
        </>
      )}
      {isAddService && (
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
                  className="w-full"
                  options={serviceDurationHours}
                  value={serviceDurationHours.find(
                    (item) => item.value === serviceDetails.duration.hours
                  )}
                  onChange={(selectedOption) =>
                    handleDurationHour(selectedOption)
                  }
                />
                <Select
                  className="w-full"
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
            <div className="flex gap-4 justify-between">
              <NumericFormat
                id="service-price"
                placeholder="Price"
                value={serviceDetails.price}
                thousandSeparator
                prefix={`${currencyCode} `}
                customInput={Input}
                onValueChange={(values) =>
                  setServiceDetails({
                    ...serviceDetails,
                    price: Number(values.value),
                  })
                }
              />
              <div className="flex   w-full items-center space-x-2">
                <label htmlFor="price-start-23">Start At</label>
                <input
                  className="h-4 w-4"
                  id="price-start-23"
                  type="checkbox"
                />
              </div>
            </div>
            {services.editingIndex !== null ? (
              <button
                onClick={() => {
                  dispatch(updateBusinessService(serviceDetails));
                  router.push("services");
                }}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded-lg py-4 font-medium transition-colors"
              >
                Update
              </button>
            ) : (
              <button
                onClick={handleOnSave}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded-lg py-4 font-medium transition-colors"
              >
                Save
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default BusinessServices;
