// components/dashboard/AppointmentListSkeleton.tsx
import React from "react";
import LoadingState from "./LoadingState";

interface AppointmentListSkeletonProps {
  rowCount?: number;
  className?: string;
}

const AppointmentListSkeleton: React.FC<AppointmentListSkeletonProps> = ({
  rowCount = 3,
  className = "",
}) => {
  // Create an array of specified length to render skeleton rows
  const skeletonRows = Array.from({ length: rowCount }, (_, index) => index);

  return (
    <div
      className={`bg-white rounded-lg shadow overflow-hidden h-full ${className}`}
    >
      <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
        <LoadingState width="40" height="6" />
        <LoadingState width="16" height="4" />
      </div>

      <div className="px-6">
        {skeletonRows.map((index) => (
          <div
            key={index}
            className={`flex items-center justify-between py-4 ${
              index > 0 ? "border-t border-gray-100" : ""
            }`}
          >
            <div className="flex items-center">
              <LoadingState
                type="avatar"
                width="10"
                height="10"
                className="mr-3 flex-shrink-0"
              />
              <div>
                <LoadingState width="32" height="5" className="mb-2" />
                <LoadingState width="24" height="4" />
              </div>
            </div>
            <div className="text-right">
              <LoadingState width="16" height="5" className="mb-2" />
              <LoadingState width="12" height="4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AppointmentListSkeleton;
