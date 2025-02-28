import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FaTimes, FaPlus, FaChevronRight } from "react-icons/fa";
import Input from "../UI/Input";
import { SingleValue } from "react-select";
import useCurrencyInfo from "@/hooks/useCurrencyInfo";
import {
  serviceDurationHours,
  serviceDurationMin,
} from "@/utils/common-varialbles";
import { serviceType } from "@/data/business-service";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  addBusinessService,
  addServiceEditIndex,
  updateBusinessService,
} from "@/store/features/businessSetupSlice";
import { NumericFormat } from "react-number-format";
import Button from "../UI/Button";

// Import the FloatingSelect component
import FloatingSelect from "../UI/FloatingSelect";

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

const BusinessServices: React.FC<Props> = ({ addServices = false }) => {
  const { services } = useAppSelector((store) => store.businessSetup);
  const router = useRouter();
  const { currencySymbol } = useCurrencyInfo();
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
    type?: string;
  }>({});
  const dispatch = useAppDispatch();

  // Calculated disabled state for save/update button
  const isSaveButtonDisabled =
    !serviceDetails.name.trim() ||
    !serviceDetails.type ||
    !serviceDetails.price ||
    serviceDetails.price <= 0;

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

    if (formError.type) {
      setFormError({
        ...formError,
        type: undefined,
      });
    }
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
    const errors: { name?: string; price?: string; type?: string } = {};

    if (!serviceDetails.name.trim()) {
      errors.name = "Service name is required";
    }

    if (!serviceDetails.price || serviceDetails.price <= 0) {
      errors.price = "Please enter a valid price";
    }

    if (!serviceDetails.type) {
      errors.type = "Service type is required";
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
            disabled={services.service.length === 0}
          >
            Continue
          </Button>
        </>
      )}

      {addServices && (
        <div className="space-y-5">
          <div>
            <Input
              id="service-name"
              type="text"
              placeholder="Service Name"
              value={serviceDetails.name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setServiceDetails({ ...serviceDetails, name: e.target.value });
                if (formError.name && e.target.value.trim()) {
                  setFormError({
                    ...formError,
                    name: undefined,
                  });
                }
              }}
              error={formError.name}
            />
          </div>

          <div>
            <FloatingSelect
              id="service-type"
              options={serviceType}
              value={serviceDetails.type}
              onChange={handleServiceTypeChange}
              placeholder="Service Type"
              error={formError.type}
              isClearable={true}
              maxMenuHeight={300}
            />
          </div>

          <div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <FloatingSelect
                  id="duration-hours"
                  options={hourOptions}
                  value={findHourOption(serviceDetails.duration.hours)}
                  onChange={handleDurationHour}
                  placeholder="Hours"
                  maxMenuHeight={200}
                />
              </div>
              <div>
                <FloatingSelect
                  id="duration-minutes"
                  options={minuteOptions}
                  value={findMinuteOption(serviceDetails.duration.minutes)}
                  onChange={handleDurationMin}
                  placeholder="Minutes"
                  maxMenuHeight={200}
                />
              </div>
            </div>
          </div>

          {/* Price section with horizontal layout */}
          <div>
            <div className="grid grid-cols-2 gap-4 items-start">
              <div>
                {/* Price input */}
                <NumericFormat
                  id="service-price"
                  value={serviceDetails.price}
                  onValueChange={(values) => {
                    const numericValue = Number(values.value);
                    setServiceDetails({
                      ...serviceDetails,
                      price: numericValue,
                    });

                    if (formError.price && numericValue > 0) {
                      setFormError({
                        ...formError,
                        price: undefined,
                      });
                    }
                  }}
                  thousandSeparator={true}
                  placeholder="Price"
                  prefix={`${currencySymbol}  `}
                  customInput={Input}
                  error={formError.price}
                  decimalScale={2}
                  allowNegative={false}
                />
              </div>

              <div className="flex items-center h-full pt-3">
                {/* Starting price checkbox */}
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
              disabled={isSaveButtonDisabled}
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
              disabled={isSaveButtonDisabled}
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
