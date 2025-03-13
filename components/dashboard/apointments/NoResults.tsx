import React from "react";
import { Calendar } from "lucide-react";

interface NoResultsProps {
  searchQuery: string;
  resetFilters: () => void;
}

export const NoResults: React.FC<NoResultsProps> = ({
  searchQuery,
  resetFilters,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 md:p-8 mt-4 text-center">
      <div className="flex flex-col items-center">
        <Calendar size={40} className="text-gray-300 mb-3" />
        <h3 className="text-lg font-medium text-gray-900 mb-1">
          No appointments found
        </h3>
        <p className="text-gray-500 mb-4">
          {searchQuery
            ? `No appointments match your search criteria "${searchQuery}"`
            : "There are no appointments for the selected filters"}
        </p>
        <button
          onClick={resetFilters}
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
};
