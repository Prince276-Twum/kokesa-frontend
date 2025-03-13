import React from "react";
import { Plus, RefreshCw, Filter, Download } from "lucide-react";

interface DesktopHeaderProps {
  refreshAppointments: () => void;
  toggleFilters: () => void;
  exportAppointments: () => void;
  showFilters: boolean;
  filters: {
    status: string[];
    serviceProvider: string[];
    dateRange: { start: Date | null; end: Date | null };
    paymentStatus: string[];
  };
}

export const DesktopHeader: React.FC<DesktopHeaderProps> = ({
  refreshAppointments,
  toggleFilters,
  exportAppointments,
  showFilters,
  filters,
}) => {
  // Helper to check if any filters are active
  const hasActiveFilters = Object.values(filters).some((v) =>
    Array.isArray(v) ? v.length > 0 : v !== null
  );

  return (
    <div className="hidden md:flex justify-between items-center mb-4">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Appointments</h1>
        <p className="text-text-secondary">Manage all your bookings</p>
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={refreshAppointments}
          className="p-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors"
          aria-label="Refresh appointments"
        >
          <RefreshCw size={16} />
        </button>
        <button
          onClick={toggleFilters}
          className={`p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors ${
            showFilters || hasActiveFilters
              ? "bg-primary-light bg-opacity-10 text-primary border-primary"
              : "text-gray-600"
          }`}
          aria-label="Filter appointments"
          aria-pressed={showFilters}
        >
          <Filter size={16} />
        </button>
        <button
          onClick={exportAppointments}
          className="p-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors"
          aria-label="Export appointments"
        >
          <Download size={16} />
        </button>
        <button className="bg-primary hover:bg-primary-dark text-white rounded-lg px-4 py-2 flex items-center transition-colors">
          <Plus size={18} className="mr-1" /> New Appointment
        </button>
      </div>
    </div>
  );
};
