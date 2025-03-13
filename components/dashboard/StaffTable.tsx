// components/dashboard/StaffTable.tsx
import React from "react";
import Image from "next/image";
import StatusBadge, { StatusType } from "./StatusBadge";

export interface StaffMember {
  id: string | number;
  name: string;
  email: string;
  avatar?: string;
  initials?: string;
  avatarBg?: string;
  specialization: string;
  status: StatusType;
}

interface StaffTableProps {
  staffMembers: StaffMember[];
  title?: string | React.ReactNode;
  className?: string;
  onAction?: (actionType: string, staffId: string | number) => void;
}

const StaffTable: React.FC<StaffTableProps> = ({
  staffMembers,
  title = "🏆 Your Stylists & Professionals",
  className = "",
  onAction,
}) => {
  return (
    <div className={`bg-white rounded-lg shadow overflow-hidden ${className}`}>
      <div className="p-5 md:p-6 border-b border-gray-100">
        <h2 className="font-semibold">{title}</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Name
              </th>
              <th
                scope="col"
                className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Specialization
              </th>
              <th
                scope="col"
                className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-4 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {staffMembers.map((staff) => (
              <tr key={staff.id}>
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {staff.avatar ? (
                      <div className="w-8 h-8 rounded-full mr-3 overflow-hidden">
                        <Image
                          src={staff.avatar}
                          alt={staff.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div
                        className={`w-8 h-8 rounded-full ${
                          staff.avatarBg || "bg-gray-200"
                        } flex items-center justify-center  mr-3`}
                      >
                        {staff.initials || staff.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <div className="font-medium">{staff.name}</div>
                      <div className="text-sm text-gray-500">{staff.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                  {staff.specialization}
                </td>
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                  <StatusBadge status={staff.status} />
                </td>
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-right">
                  <button
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-100"
                    onClick={() => onAction && onAction("options", staff.id)}
                    aria-label="Options"
                  >
                    ⋮
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StaffTable;
