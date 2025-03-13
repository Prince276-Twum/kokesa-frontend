import React from "react";
import {
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  X,
  RefreshCw,
  Download,
  Plus,
} from "lucide-react";

interface MobileHeaderProps {
  toggleMobileSearch: () => void;
  toggleFilters: () => void;
  toggleMobileActions: () => void;
  showMobileActions: boolean;
  showMobileSearch: boolean;
  filters: {
    status: string[];
    serviceProvider: string[];
    dateRange: { start: Date | null; end: Date | null };
    paymentStatus: string[];
  };
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  refreshAppointments: () => void;
  exportAppointments: () => void;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({
  toggleMobileSearch,
  toggleFilters,
  toggleMobileActions,
  showMobileActions,
  showMobileSearch,
  filters,
  searchQuery,
  setSearchQuery,
  refreshAppointments,
  exportAppointments,
}) => {
  // Helper to check if any filters are active
  const hasActiveFilters = Object.values(filters).some((v) =>
    Array.isArray(v) ? v.length > 0 : v !== null
  );

  return (
    <div className="md:hidden">
      <div className="flex justify-between items-center mb-3">
        <h1 className="text-xl font-bold text-text-primary">Appointments</h1>
        <div className="flex items-center space-x-1">
          <button
            onClick={toggleMobileSearch}
            className="p-2 rounded-lg text-gray-600 hover:bg-gray-100"
            aria-label="Search"
          >
            <Search size={20} />
          </button>
          <button
            onClick={toggleFilters}
            className={`p-2 rounded-lg hover:bg-gray-100 ${
              hasActiveFilters ? "text-primary" : "text-gray-600"
            }`}
            aria-label="Filter"
          >
            <Filter size={20} />
          </button>
          <button
            onClick={toggleMobileActions}
            className="p-2 rounded-lg text-gray-600 hover:bg-gray-100"
            aria-label="Actions"
          >
            {showMobileActions ? (
              <ChevronUp size={20} />
            ) : (
              <ChevronDown size={20} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile search bar */}
      {showMobileSearch && (
        <div className="mb-3">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={16} className="text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-primary focus:border-primary"
              placeholder="Search appointments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
            {searchQuery && (
              <button
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setSearchQuery("")}
              >
                <X size={16} className="text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Mobile actions dropdown */}
      {showMobileActions && (
        <div className="bg-white rounded-lg shadow-md p-3 mb-3 grid grid-cols-2 gap-2">
          <button
            onClick={refreshAppointments}
            className="flex items-center justify-center p-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            <RefreshCw size={16} className="mr-1" />
            <span className="text-sm">Refresh</span>
          </button>
          <button
            onClick={exportAppointments}
            className="flex items-center justify-center p-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            <Download size={16} className="mr-1" />
            <span className="text-sm">Export</span>
          </button>
          <button className="col-span-2 flex items-center justify-center p-2 bg-primary text-white rounded-lg hover:bg-primary-dark">
            <Plus size={16} className="mr-1" />
            <span className="text-sm">New Appointment</span>
          </button>
        </div>
      )}
    </div>
  );
};
