// components/dashboard/AppointmentReminders.tsx
import React, { useMemo } from "react";
import { Bell, Clock, Calendar, User } from "lucide-react";

export interface ReminderItem {
  id: string | number;
  clientName: string;
  clientId?: string | number;
  service: string;
  serviceId?: string | number;
  serviceProvider?: string;
  serviceProviderId?: string | number;
  timeLeft: number;
  startTime?: string;
  status?: string;
}

export interface AppointmentRemindersProps {
  /**
   * Array of reminder items to display
   */
  reminders: ReminderItem[];
  /**
   * Callback when send reminder button is clicked
   */
  onSendReminder?: (reminderId: string | number) => void;
  /**
   * Optional title for the reminders section
   */
  title?: string;
  /**
   * Optional CSS class name
   */
  className?: string;
  /**
   * Optional flag to display a loading state
   */
  isLoading?: boolean;
}

const AppointmentReminders: React.FC<AppointmentRemindersProps> = ({
  reminders,
  onSendReminder,
  title = "Upcoming Reminders",
  className = "",
  isLoading = false,
}) => {
  // Check if we have any reminders to display
  const hasReminders = useMemo(
    () => Array.isArray(reminders) && reminders.length > 0,
    [reminders]
  );

  // Return null if no reminders and not loading
  if (!hasReminders && !isLoading) {
    return null;
  }

  return (
    <div
      className={`rounded-lg bg-red-50 overflow-hidden mb-6 relative ${className}`}
    >
      <div className="p-3 sm:p-4">
        <h3 className="font-semibold text-lg mb-3 text-gray-800 flex items-center">
          <Bell size={20} className="text-primary mr-2 hidden sm:inline" />
          {title}
        </h3>

        {isLoading ? (
          <div className="py-6 flex justify-center items-center">
            <div className="animate-pulse flex space-x-4">
              <div className="w-12 h-12 bg-red-200 rounded-full"></div>
              <div className="flex-1 space-y-3 py-1">
                <div className="h-2 bg-red-200 rounded w-3/4"></div>
                <div className="h-2 bg-red-200 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {reminders.map((reminder) => (
              <div
                key={reminder.id}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 rounded-md hover:bg-red-100 transition-colors"
              >
                <div className="flex items-start w-full sm:w-auto flex-grow mr-0 sm:mr-4 mb-3 sm:mb-0">
                  <div className="w-1 h-12 bg-primary rounded-full mr-3 flex-shrink-0"></div>
                  <div className="flex items-center">
                    <Bell
                      size={18}
                      className="text-primary mr-2 flex-shrink-0"
                    />
                    <div className="max-w-full overflow-hidden">
                      <p className="font-medium text-text-primary truncate max-w-full sm:max-w-xs md:max-w-md">
                        {reminder.service} with {reminder.clientName}
                      </p>
                      <div className="flex flex-wrap items-center mt-1 gap-x-3 gap-y-1 text-xs">
                        <span className="text-text-secondary flex items-center">
                          <Clock size={12} className="mr-1 text-gray-500" />
                          In {reminder.timeLeft}{" "}
                          {reminder.timeLeft === 1 ? "hour" : "hours"}
                        </span>

                        {reminder.startTime && (
                          <span className="text-text-secondary flex items-center">
                            <Calendar
                              size={12}
                              className="mr-1 text-gray-500"
                            />
                            {reminder.startTime}
                          </span>
                        )}

                        {reminder.serviceProvider && (
                          <span className="text-text-secondary flex items-center">
                            <User size={12} className="mr-1 text-gray-500" />
                            <span className="truncate max-w-[100px] sm:max-w-full">
                              {reminder.serviceProvider}
                            </span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex-shrink-0 z-10 w-full sm:w-auto">
                  <button
                    className="text-primary bg-white text-sm font-medium hover:text-white hover:bg-primary transition-colors px-3 py-2 rounded shadow-sm border border-red-100 w-full sm:w-auto"
                    onClick={() =>
                      onSendReminder && onSendReminder(reminder.id)
                    }
                    aria-label={`Send reminder to ${reminder.clientName}`}
                  >
                    Send Reminder
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="absolute right-4 sm:right-8 top-4">
        <div className="text-red-400 opacity-20 pointer-events-none">
          <svg
            width="60"
            height="60"
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-12 h-12 sm:w-20 sm:h-20"
          >
            <path
              d="M50 90C72.0914 90 90 72.0914 90 50C90 27.9086 72.0914 10 50 10C27.9086 10 10 27.9086 10 50C10 72.0914 27.9086 90 50 90Z"
              stroke="currentColor"
              strokeWidth="6"
            />
            <path
              d="M50 25V50L65 65"
              stroke="currentColor"
              strokeWidth="6"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default AppointmentReminders;
