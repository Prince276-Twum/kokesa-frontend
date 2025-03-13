// components/dashboard/AppointmentList.tsx
import React from "react";
import Link from "next/link";
import Avatar from "./Avatar";
import Image from "next/image";

interface Appointment {
  id: string | number;
  clientName: string;
  clientInitials?: string;
  clientAvatar?: string;
  clientAvatarBg?: string;
  service: string;
  time: string;
  date: string;
}

interface AppointmentListProps {
  appointments: Appointment[];
  title?: string;
  viewAllLink?: string;
  className?: string;
}

const AppointmentList = ({
  appointments,
  title = "Upcoming Appointments",
  viewAllLink = "/appointments",
  className = "",
}: AppointmentListProps) => {
  return (
    <div
      className={`bg-white rounded-lg shadow overflow-hidden h-full ${className}`}
    >
      <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
        <h2 className="font-semibold">{title}</h2>
        {viewAllLink && (
          <Link
            href={viewAllLink}
            className="text-gray-500 text-sm hover:text-primary transition-colors flex items-center"
          >
            See all
          </Link>
        )}
      </div>

      <div className="px-6">
        {appointments.length === 0 ? (
          <p className="text-gray-500 text-center py-4">
            No appointments scheduled
          </p>
        ) : (
          appointments.map((appointment, index) => (
            <div
              key={appointment.id}
              className={`flex items-center justify-between py-4 ${
                index > 0 ? "border-t border-gray-100" : ""
              }`}
            >
              <div className="flex items-center">
                {appointment.clientAvatar ? (
                  <div className="w-10 h-10 rounded-full mr-3 overflow-hidden flex-shrink-0">
                    <Image
                      src={appointment.clientAvatar}
                      alt={appointment.clientName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div
                    className={`w-10 h-10 rounded-full ${
                      appointment.clientAvatarBg || "bg-gray-200"
                    } flex items-center justify-center font-bold mr-3 flex-shrink-0`}
                  >
                    <Avatar
                      colorScheme={
                        Number(appointment.id) % 3 === 0
                          ? "blue"
                          : Number(appointment.id) % 2 === 0
                          ? "purple"
                          : "pink"
                      }
                      name={appointment.clientName}
                    />
                  </div>
                )}
                <div>
                  <h4 className="font-medium text-gray-800">
                    {appointment.clientName}
                  </h4>
                  <p className="text-sm text-gray-500">{appointment.service}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-800">{appointment.time}</p>
                <p className="text-sm text-gray-500">{appointment.date}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AppointmentList;
