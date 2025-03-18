// components/dashboard/appointments/AppointmentTable.tsx
import { MoreVertical, ExternalLink, Calendar, Clock } from "lucide-react";
import Avatar from "../Avatar";
import StatusBadge from "../StatusBadge";
import { formatDateTime } from "@/utils/dateTime";

export type AppointmentStatus =
  | "confirmed"
  | "reschedule"
  | "cancel"
  | "pending"
  | "complete"
  | "no-show";

export interface Appointment {
  id: string | number;
  client_name: string;
  clientAvatar?: string;
  service: { name: string; id: number };
  service_name: string;
  service_provider?: string;
  serviceProviderId?: string | number;
  date: string;
  time: string;
  status: AppointmentStatus;
  notes?: string;
  paymentStatus?: "unpaid" | "paid" | "refunded" | "partially_paid" | "charged";
  price?: number;
  duration?: number;
  local_start_time: string;
  local_timezone: string;
}

export interface AppointmentTableProps {
  appointments: Appointment[];
  onAppointmentAction?: (appointment: Appointment, action: string) => void;
  isLoading?: boolean;
  className?: string;
}

const AppointmentTable: React.FC<AppointmentTableProps> = ({
  appointments,
  onAppointmentAction,
  isLoading = false,
  className = "",
}) => {
  // Status badge mapping with more descriptive labels
  const getStatusBadge = (status: AppointmentStatus) => {
    switch (status) {
      case "confirmed":
        return <StatusBadge status="Available" label="Confirmed" />;
      case "reschedule":
        return <StatusBadge status="away" label="Rescheduled" />;
      case "cancel":
        return <StatusBadge status="busy" label="Cancelled" />;
      case "pending":
        return <StatusBadge status="offline" label="Pending" />;
      case "complete":
        return <StatusBadge status="Available" label="Completed" />;
      case "no-show":
        return <StatusBadge status="busy" label="No Show" />;
      default:
        return <StatusBadge status="offline" label="Unknown" />;
    }
  };

  // Handle appointment click with proper null check
  const handleAppointmentClick = (appointment: Appointment) => {
    if (onAppointmentAction) {
      onAppointmentAction(appointment, "view");
    }
  };

  // Handle view button click with proper null check
  const handleViewClick = (e: React.MouseEvent, appointment: Appointment) => {
    e.stopPropagation();
    if (onAppointmentAction) {
      onAppointmentAction(appointment, "view");
    }
  };

  // Handle menu button click with proper null check
  const handleMenuClick = (e: React.MouseEvent, appointment: Appointment) => {
    e.stopPropagation();
    if (onAppointmentAction) {
      onAppointmentAction(appointment, "menu");
    }
  };

  return (
    <div
      className={`overflow-hidden rounded-lg border border-gray-200 shadow-sm ${className}`}
    >
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-4 text-left text-sm font-medium text-gray-600 tracking-wide"
              >
                Client
              </th>
              <th
                scope="col"
                className="px-6 py-4 text-left text-sm font-medium text-gray-600 tracking-wide"
              >
                Service
              </th>
              <th
                scope="col"
                className="px-6 py-4 text-left text-sm font-medium text-gray-600 tracking-wide"
              >
                Provider
              </th>
              <th
                scope="col"
                className="px-6 py-4 text-left text-sm font-medium text-gray-600 tracking-wide"
              >
                Date & Time
              </th>
              <th
                scope="col"
                className="px-6 py-4 text-left text-sm font-medium text-gray-600 tracking-wide"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-6 py-4 text-right text-sm font-medium text-gray-600 tracking-wide"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading
              ? // Loading state
                Array.from({ length: 3 }).map((_, index) => (
                  <tr key={`loading-${index}`}>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="rounded-full h-10 w-10 bg-gray-200 animate-pulse"></div>
                        <div className="ml-4 h-5 w-32 bg-gray-200 animate-pulse rounded"></div>
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="h-5 w-40 bg-gray-200 animate-pulse rounded"></div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="h-5 w-40 bg-gray-200 animate-pulse rounded"></div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="h-5 w-48 bg-gray-200 animate-pulse rounded"></div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="h-8 w-24 bg-gray-200 animate-pulse rounded-full"></div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-right">
                      <div className="h-8 w-8 bg-gray-200 animate-pulse rounded-full ml-auto"></div>
                    </td>
                  </tr>
                ))
              : appointments.map((appointment) => (
                  <tr
                    key={appointment.id}
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => handleAppointmentClick(appointment)}
                  >
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center">
                        <Avatar
                          name={appointment.client_name}
                          size="md"
                          colorScheme={
                            Number(appointment.id) % 3 === 0
                              ? "blue"
                              : Number(appointment.id) % 2 === 0
                              ? "purple"
                              : "pink"
                          }
                        />
                        <div className="ml-4">
                          <div className="text-base font-medium text-gray-800">
                            {appointment.client_name}
                          </div>
                          {appointment.notes && (
                            <div className="text-sm text-gray-500 mt-1 max-w-xs truncate">
                              {appointment.notes}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="text-base text-gray-700">
                        {appointment.service_name}
                      </div>
                      {appointment.price !== undefined && (
                        <div className="text-sm text-gray-500 mt-1 font-medium">
                          $
                          {typeof appointment.price === "number"
                            ? appointment.price.toFixed(2)
                            : appointment.price}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      {appointment.service_provider ? (
                        <div className="text-base text-gray-700">
                          {appointment.service_provider}
                        </div>
                      ) : (
                        <div className="text-base text-gray-500 italic">
                          Not assigned
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex flex-col">
                        <div className="text-base text-gray-700 flex items-center">
                          <Calendar size={16} className="mr-2 text-primary" />
                          {
                            formatDateTime(
                              appointment.local_start_time,
                              appointment.local_timezone
                            ).date
                          }
                        </div>
                        <div className="text-base text-gray-700 flex items-center mt-1">
                          <Clock size={16} className="mr-2 text-primary" />
                          {
                            formatDateTime(
                              appointment.local_start_time,
                              appointment.local_timezone
                            ).time
                          }
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      {getStatusBadge(appointment.status)}
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          className="text-gray-500 hover:text-primary transition-colors p-2 rounded-full hover:bg-primary-50"
                          onClick={(e) => handleViewClick(e, appointment)}
                          aria-label="View details"
                        >
                          <ExternalLink size={20} />
                        </button>
                        <button
                          className="text-gray-500 hover:text-gray-700 transition-colors p-2 rounded-full hover:bg-gray-100"
                          onClick={(e) => handleMenuClick(e, appointment)}
                          aria-label="More options"
                        >
                          <MoreVertical size={20} />
                        </button>
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

export default AppointmentTable;
