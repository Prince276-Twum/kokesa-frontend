import React from "react";
import { Search, X } from "lucide-react";

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filteredAppointmentsLength: number;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  setSearchQuery,
  filteredAppointmentsLength,
}) => {
  return (
    <div className="hidden md:block bg-white rounded-lg shadow mb-4 p-4">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={18} className="text-gray-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-primary focus:border-primary"
          placeholder="Search appointments by client, service, provider..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <button
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            onClick={() => setSearchQuery("")}
          >
            <X size={18} className="text-gray-400 hover:text-gray-600" />
          </button>
        )}
      </div>

      {/* Results count */}
      {searchQuery && (
        <div className="mt-2 text-sm text-gray-500">
          Found {filteredAppointmentsLength} appointments matching "
          {searchQuery}"
        </div>
      )}
    </div>
  );
};
