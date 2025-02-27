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

// Define types
interface ServiceDurationOption {
  value: number;
  label: string;
}

interface ServiceOption {
  value: string;
  label: string;
}

// This should match exactly the service type in your Redux store
interface StoreService {
  name: string;
  type: ServiceOption | null;
  groupLabel: string;
  duration: { hours: number; minutes: number };
  price: number;
  startAt: boolean; // Ensure startAt is defined
}

// Local interface with guaranteed startAt property for local state
interface LocalService {
  name: string;
  type: ServiceOption | null;
  groupLabel: string;
  duration: { hours: number; minutes: number };
  price: number;
  startAt: boolean;
}

interface Props {
  addServices?: boolean;
}

// Custom interface for our price input component
interface PriceInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id?: string;
  cn?: string;
}

// Define a custom input component that works with NumericFormat
const PriceInput: React.FC<PriceInputProps> = (props) => {
  const { id, cn, ...rest } = props;

  return (
    <Input
      id={id || "price-input"} // Provide a default ID to satisfy required prop
      type="text"
      cn={cn}
      {...rest}
    />
  );
};

const BusinessServices: React.FC<Props> = ({ addServices = false }) => {
  const { services } = useAppSelector((store) => store.businessSetup);
  const router = useRouter();
  const { currencyCode, currencySymbol } = useCurrencyInfo();
  const [serviceDetails, setServiceDetails] = useState<LocalService>({
    name: "",
    type: null,
    groupLabel: "",
    duration: { hours: 0, minutes: 40 }, // Default duration
    price: 25,
    startAt: false,
  });
  const [formError, setFormError] = useState<{
    name?: string;
    price?: string;
  }>({});
  const dispatch = useAppDispatch();

  // Styles for all selects
  const customStyles: StylesConfig<ServiceOption, false> = {
    control: (provided) => ({
      ...provided,
      backgroundColor: "white",
      borderColor: "#e5e7eb",
      borderRadius: "0.5rem",
      boxShadow: "none",
      minHeight: "42px",
      "&:hover": {
        borderColor: "#d1d5db",
      },
      "&:focus-within": {
        borderColor: "#EB5017",
        boxShadow: "0 0 0 1px #EB5017",
      },
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "#9ca3af",
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "#1f2937",
    }),
    menu: (provided) => ({
      ...provided,
      borderRadius: "0.5rem",
      boxShadow:
        "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      zIndex: 10,
      maxHeight: "300px",
      overflow: "visible",
    }),
    menuList: (provided) => ({
      ...provided,
      maxHeight: "250px", // Make the menu taller
      paddingTop: "4px",
      paddingBottom: "4px",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? "#FFECE5" : "white",
      color: state.isFocused ? "#EB5017" : "#1f2937",
      borderBottom: "1px solid #f3f4f6",
      padding: "10px 12px",
      cursor: "pointer",
      "&:hover": {
        backgroundColor: "#FFECE5",
      },
      "&:active": {
        backgroundColor: "#EB5017",
        color: "white",
      },
    }),
    groupHeading: (provided) => ({
      ...provided,
      padding: "1rem 12px",
      color: "#4b5563",
      fontWeight: "600",
      fontSize: "16px",
      textTransform: "none",
      letterSpacing: "normal",
      backgroundColor: "#f9fafb",
    }),
  };

  // Create typed duration styles and options
  const durationStyles: StylesConfig<ServiceDurationOption, false> =
    customStyles as any;
  const hourOptions = serviceDurationHours as ServiceDurationOption[];
  const minuteOptions = serviceDurationMin as ServiceDurationOption[];

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
        groupLabel = group.label;
      }
    });

    setServiceDetails({
      ...serviceDetails,
      type: selectedOption,
      groupLabel: groupLabel,
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

  const validateForm = (): boolean => {
    const errors: { name?: string; price?: string } = {};

    if (!serviceDetails.name.trim()) {
      errors.name = "Service name is required";
    }

    if (!serviceDetails.price || serviceDetails.price <= 0) {
      errors.price = "Please enter a valid price";
    }

    setFormError(errors);
    return Object.keys(errors).length === 0;
  };

  const handleOnSave = () => {
    if (!validateForm()) {
      return;
    }

    // Convert LocalService to StoreService for Redux
    const serviceToSave: StoreService = { ...serviceDetails };

    const updatedServices = [...services.service, serviceToSave];
    localStorage.setItem("services", JSON.stringify(updatedServices));
    setServiceDetails({
      name: "",
      type: null,
      groupLabel: "",
      duration: { hours: 0, minutes: 40 },
      price: 25,
      startAt: false,
    });

    dispatch(addBusinessService(updatedServices));
    dispatch(addServiceEditIndex(null));
    router.push("services");
  };

  const handleRemoveService = (index: number) => {
    const updatedServices = services.service.filter((_, i) => i !== index);
    dispatch(addBusinessService(updatedServices));
    localStorage.setItem("services", JSON.stringify(updatedServices));
  };

  useEffect(() => {
    if (
      services.editingIndex !== null &&
      services.service[services.editingIndex]
    ) {
      const serviceToEdit = services.service[services.editingIndex];

      // Convert StoreService to LocalService, ensuring startAt is defined
      const editableService: LocalService = {
        name: serviceToEdit.name,
        type: serviceToEdit.type,
        groupLabel: serviceToEdit.groupLabel,
        duration: serviceToEdit.duration,
        price: serviceToEdit.price,
        startAt: serviceToEdit.startAt || false, // Default to false if missing
      };

      setServiceDetails(editableService);
    }
  }, [services.editingIndex, services.service]);

  const handleSubmit = () => {
    router.push("hours");
  };

  const formatDuration = (hours: number, minutes: number): string => {
    if (hours === 0) {
      return `${minutes} min`;
    } else if (minutes === 0) {
      return `${hours} ${hours === 1 ? "hour" : "hours"}`;
    } else {
      return `${hours}h ${minutes}m`;
    }
  };

  // Helper function to safely find hour option
  const findHourOption = (hours: number): ServiceDurationOption => {
    return (
      hourOptions.find((option) => option.value === hours) || hourOptions[0]
    );
  };

  // Helper function to safely find minute option
  const findMinuteOption = (minutes: number): ServiceDurationOption => {
    return (
      minuteOptions.find((option) => option.value === minutes) ||
      minuteOptions[0]
    );
  };

  return (
    <div className="space-y-5">
      {!addServices && (
        <>
          <div className="space-y-3">
            {services.service.length === 0 ? (
              <div className="text-center p-8 bg-gray-50 rounded-xl border border-gray-200">
                <div className="bg-primary-50 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaPlus className="text-primary h-6 w-6" />
                </div>
                <h3 className="text-gray-700 font-medium mb-2">
                  No services added yet
                </h3>
                <p className="text-gray-500 text-sm mb-4">
                  Add your first service to continue
                </p>
                <button
                  onClick={() => {
                    dispatch(addServiceEditIndex(null));
                    router.push("add-service");
                  }}
                  className="px-4 py-2 bg-primary text-white rounded-lg font-medium text-sm hover:bg-primary-dark transition-colors"
                >
                  Add Your First Service
                </button>
              </div>
            ) : (
              <>
                {services.service.map((service, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-xl p-4 hover:border-primary hover:shadow-sm transition-all"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center mb-1">
                          <h3 className="font-medium text-gray-900">
                            {service.name}
                          </h3>
                          {/* Use optional chaining for startAt since it might be undefined */}
                          {service.startAt && (
                            <span className="ml-2 text-xs bg-primary-50 text-primary px-2 py-0.5 rounded-full">
                              Starting price
                            </span>
                          )}
                        </div>

                        <div className="text-sm text-gray-500 flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
                          {service.type && (
                            <span className="flex items-center">
                              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-1.5"></span>
                              {service.type.label}
                            </span>
                          )}
                          <span className="flex items-center">
                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-1.5"></span>
                            {formatDuration(
                              service.duration.hours,
                              service.duration.minutes
                            )}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="font-bold text-gray-900 whitespace-nowrap">
                          {currencySymbol}
                          {service.price}
                        </span>
                        <div className="flex">
                          <button
                            onClick={() => handleRemoveService(index)}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                            aria-label="Remove service"
                          >
                            <FaTimes className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => {
                              dispatch(addServiceEditIndex(index));
                              router.push("add-service");
                            }}
                            className="p-2 text-gray-400 hover:text-primary hover:bg-primary-50 rounded-full transition-colors"
                            aria-label="Edit service"
                          >
                            <FaChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}

            {services.service.length > 0 && (
              <button
                onClick={() => {
                  dispatch(addServiceEditIndex(null));
                  router.push("add-service");
                }}
                className="w-full border border-dashed border-gray-300 rounded-xl p-4 flex items-center justify-center text-primary font-medium hover:bg-primary-50 hover:border-primary-300 transition-colors"
              >
                <FaPlus className="w-4 h-4 mr-2" />
                Add Another Service
              </button>
            )}
          </div>

          <Button
            el="button"
            onClick={handleSubmit}
            primary
            rounded
            className="w-full py-3 mt-6"
            disabled={services.service.length === 0}
          >
            Continue
          </Button>
        </>
      )}

      {addServices && (
        <div className="space-y-5">
          <div>
            <label
              htmlFor="service-name"
              className="block text-sm font-medium text-gray-700 mb-1.5"
            >
              Service Name
            </label>
            <Input
              id="service-name"
              type="text"
              placeholder="e.g. Haircut, Manicure, Consultation"
              value={serviceDetails.name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setServiceDetails({ ...serviceDetails, name: e.target.value })
              }
              cn={formError.name ? "border-red-500" : ""}
            />
            {formError.name && (
              <p className="mt-1.5 text-sm text-red-500">{formError.name}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="service-type"
              className="block text-sm font-medium text-gray-700 mb-1.5"
            >
              Service Type
            </label>
            <Select<ServiceOption, false>
              id="service-type"
              isClearable
              styles={customStyles}
              options={serviceType}
              value={serviceDetails.type}
              onChange={handleServiceTypeChange}
              placeholder="Select service type"
              className="react-select-container"
              classNamePrefix="react-select"
              maxMenuHeight={300}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Service Duration
            </label>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">
                  Hours
                </label>
                <Select<ServiceDurationOption, false>
                  className="react-select-container"
                  classNamePrefix="react-select"
                  options={hourOptions}
                  value={findHourOption(serviceDetails.duration.hours)}
                  onChange={handleDurationHour}
                  styles={durationStyles}
                  maxMenuHeight={200}
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">
                  Minutes
                </label>
                <Select<ServiceDurationOption, false>
                  className="react-select-container"
                  classNamePrefix="react-select"
                  options={minuteOptions}
                  value={findMinuteOption(serviceDetails.duration.minutes)}
                  onChange={handleDurationMin}
                  styles={durationStyles}
                  maxMenuHeight={200}
                />
              </div>
            </div>
          </div>

          <div>
            <label
              htmlFor="service-price"
              className="block text-sm font-medium text-gray-700 mb-1.5"
            >
              Price
            </label>
            <div className="flex gap-4 items-center">
              <div className="flex-1">
                <NumericFormat
                  id="service-price"
                  placeholder={`${currencyCode} 0.00`}
                  value={serviceDetails.price}
                  thousandSeparator
                  prefix={`${currencyCode} `}
                  customInput={PriceInput}
                  onValueChange={(values) => {
                    setServiceDetails({
                      ...serviceDetails,
                      price: Number(values.value),
                    });
                  }}
                  className={formError.price ? "border-red-500" : ""}
                />
                {formError.price && (
                  <p className="mt-1.5 text-sm text-red-500">
                    {formError.price}
                  </p>
                )}
              </div>

              <div className="flex items-center">
                <input
                  id="price-start-toggle"
                  name="price-start"
                  type="checkbox"
                  checked={serviceDetails.startAt}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setServiceDetails({
                      ...serviceDetails,
                      startAt: e.target.checked,
                    })
                  }
                  className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
                <label
                  htmlFor="price-start-toggle"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Starting price
                </label>
              </div>
            </div>
          </div>

          {services.editingIndex !== null ? (
            <Button
              el="button"
              onClick={() => {
                if (!validateForm()) return;
                // Convert LocalService to StoreService for Redux
                const updatedService: StoreService = { ...serviceDetails };
                dispatch(updateBusinessService(updatedService));
                router.push("services");
              }}
              primary
              rounded
              className="w-full py-3 mt-6"
            >
              Update Service
            </Button>
          ) : (
            <Button
              el="button"
              onClick={handleOnSave}
              primary
              rounded
              className="w-full py-3 mt-6"
            >
              Save Service
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default BusinessServices;
