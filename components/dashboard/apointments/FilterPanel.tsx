import React from "react";
import { X } from "lucide-react";
import StatusBadge from "@/components/dashboard/StatusBadge";

interface FilterPanelProps {
  filters: {
    status: string[];
    serviceProvider: string[];
    dateRange: { start: Date | null; end: Date | null };
    paymentStatus: string[];
  };
  handleFilterChange: (filterType: string, value: any) => void;
  resetFilters: () => void;
  toggleFilters: () => void;
  serviceProviders: string[];
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  handleFilterChange,
  resetFilters,
  toggleFilters,
  serviceProviders,
}) => {
  return (
    <div className="bg-white rounded-lg shadow mb-4 p-3 md:p-4">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-medium">Filters</h3>
        <div className="flex space-x-2">
          <button
            onClick={resetFilters}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Reset
          </button>
          <button
            onClick={toggleFilters}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <div className="flex flex-wrap gap-2">
            {["accept", "pending", "reschedule", "cancel"].map((status) => (
              <div
                key={status}
                onClick={() => {
                  const newStatuses = filters.status.includes(status)
                    ? filters.status.filter((s) => s !== status)
                    : [...filters.status, status];
                  handleFilterChange("status", newStatuses);
                }}
                className={`cursor-pointer ${
                  filters.status.includes(status) ? "ring-2 ring-primary" : ""
                }`}
              >
                <StatusBadge status={status} />
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Service Provider
          </label>
          <div className="flex flex-wrap gap-2">
            {serviceProviders.map((provider) => (
              <div
                key={provider}
                onClick={() => {
                  const newProviders = filters.serviceProvider.includes(
                    provider
                  )
                    ? filters.serviceProvider.filter((p) => p !== provider)
                    : [...filters.serviceProvider, provider];
                  handleFilterChange("serviceProvider", newProviders);
                }}
                className={`cursor-pointer px-2 py-1 rounded-full text-xs ${
                  filters.serviceProvider.includes(provider)
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {provider}
              </div>
            ))}
          </div>
        </div>

        {/* Payment status filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Payment Status
          </label>
          <div className="flex flex-wrap gap-2">
            {["paid", "unpaid", "partially_paid", "refunded"].map((status) => (
              <div
                key={status}
                onClick={() => {
                  const newStatuses = filters.paymentStatus.includes(status)
                    ? filters.paymentStatus.filter((s) => s !== status)
                    : [...filters.paymentStatus, status];
                  handleFilterChange("paymentStatus", newStatuses);
                }}
                className={`cursor-pointer ${
                  filters.paymentStatus.includes(status)
                    ? "ring-2 ring-primary"
                    : ""
                }`}
              >
                <StatusBadge status={status} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
