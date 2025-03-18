// components/dashboard/StaffTableSkeleton.tsx
import React from "react";
import LoadingState from "@/components/loading-states/LoadingState";

interface StaffTableSkeletonProps {
  rowCount?: number;
  className?: string;
  title?: string | React.ReactNode;
}

const StaffTableSkeleton: React.FC<StaffTableSkeletonProps> = ({
  rowCount = 4,
  className = "",
  title = null,
}) => {
  // Create an array of specified length to render skeleton rows
  const skeletonRows = Array.from({ length: rowCount }, (_, index) => index);

  return (
    <div className={`bg-white rounded-lg shadow overflow-hidden ${className}`}>
      <div className="p-5 md:p-6 border-b border-gray-100">
        {title || <LoadingState width="64" height="6" />}
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-4 sm:px-6 py-3 text-left">
                <LoadingState width="16" height="4" />
              </th>
              <th scope="col" className="px-4 sm:px-6 py-3 text-left">
                <LoadingState width="24" height="4" />
              </th>
              <th scope="col" className="px-4 sm:px-6 py-3 text-left">
                <LoadingState width="16" height="4" />
              </th>
              <th scope="col" className="px-4 sm:px-6 py-3 text-right">
                <div className="flex justify-end">
                  <LoadingState width="12" height="4" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {skeletonRows.map((index) => (
              <tr key={index}>
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <LoadingState
                      type="avatar"
                      width="8"
                      height="8"
                      className="mr-3"
                    />
                    <div>
                      <LoadingState width="32" height="4" className="mb-2" />
                      <LoadingState width="40" height="3" />
                    </div>
                  </div>
                </td>
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                  <LoadingState width="28" height="4" />
                </td>
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                  <LoadingState width="20" height="6" rounded="full" />
                </td>
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-right">
                  <div className="flex justify-end">
                    <LoadingState type="circle" width="8" height="8" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StaffTableSkeleton;
