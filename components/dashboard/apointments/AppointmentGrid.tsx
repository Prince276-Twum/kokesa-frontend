// components/dashboard/appointments/AppointmentGrid.tsx
import React from "react";
import Image from "next/image";
import { Appointment } from "@/components/dashboard/apointments/AppointmentTable";
import StatusBadge from "@/components/dashboard/StatusBadge";

interface AppointmentGridProps {
  /**
   * List of appointments to display in the grid
   */
  appointments: Appointment[];

  /**
   * Callback function when an action is performed on an appointment
   */
  onAppointmentAction: (appointment: Appointment, action: string) => void;

  /**
   * Optional loading state
   */
  isLoading?: boolean;

  /**
   * Optional additional className
   */
  className?: string;
}

/**
 * Grid view for displaying appointments as cards
 */
const AppointmentGrid: React.FC<AppointmentGridProps> = ({
  appointments,
  onAppointmentAction,
  isLoading = false,
  className = "",
}) => {
  if (isLoading) {
    return (
      <div className={`p-4 ${className}`}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={`skeleton-${index}`}
              className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden h-64 animate-pulse"
            >
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-gray-200 mr-3"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <div className="h-3 bg-gray-200 rounded w-full mb-3"></div>
                <div className="h-3 bg-gray-200 rounded w-full mb-3"></div>
                <div className="h-3 bg-gray-200 rounded w-full mb-3"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (appointments.length === 0) {
    return null;
  }

  return (
    <div className={`p-4 ${className}`}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {appointments.map((appointment) => (
          <div
            key={appointment.id}
            className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden cursor-pointer"
            onClick={() => onAppointmentAction(appointment, "view")}
          >
            <div className="p-4 border-b border-gray-100">
              <div className="flex justify-between items-start">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold">
                    {appointment.clientAvatar ? (
                      <Image
                        src={appointment.clientAvatar}
                        alt={appointment.client_name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      appointment.client_name.charAt(0)
                    )}
                  </div>
                  <div className="ml-3">
                    <h3 className="font-medium text-gray-800 truncate max-w-[150px]">
                      {appointment.client_name}
                    </h3>
                    <p className="text-sm text-gray-500 truncate max-w-[150px]">
                      {appointment.service_name}
                    </p>
                  </div>
                </div>
                <StatusBadge status={appointment.status} />
              </div>
            </div>

            <div className="p-4 space-y-3">
              <div className="flex justify-between">
                <div className="text-sm text-gray-500">Date & Time</div>
                <div className="text-sm font-medium">
                  {appointment.date}, {appointment.time}
                </div>
              </div>

              <div className="flex justify-between">
                <div className="text-sm text-gray-500">Provider</div>
                <div className="text-sm font-medium truncate max-w-[130px]">
                  {appointment.service_provider || "Not assigned"}
                </div>
              </div>

              <div className="flex justify-between">
                <div className="text-sm text-gray-500">Price</div>
                <div className="text-sm font-medium">${appointment.price}</div>
              </div>

              <div className="flex justify-between">
                <div className="text-sm text-gray-500">Payment</div>
                <StatusBadge
                  status={appointment.paymentStatus || "unpaid"}
                  size="xs"
                />
              </div>
            </div>

            <div className="bg-gray-50 px-4 py-2 text-right">
              <button
                className="text-sm text-primary hover:text-primary-dark transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  onAppointmentAction(appointment, "edit");
                }}
              >
                Edit Appointment
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AppointmentGrid;
