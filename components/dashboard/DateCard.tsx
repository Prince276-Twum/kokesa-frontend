// components/dashboard/DateCard.tsx
import React from "react";
import { Calendar } from "lucide-react";

interface DateCardProps {
  label?: string;
  className?: string;
}

const DateCard: React.FC<DateCardProps> = ({
  label = "Today's Date",
  className = "",
}) => {
  const today = new Date();
  const formattedDate = `${today.getDate()} ${today.toLocaleString("default", {
    month: "short",
  })}, ${today.getFullYear()}`;

  return (
    <div
      className={`bg-white rounded-lg shadow p-4 flex items-center ${className}`}
    >
      <Calendar className="text-primary mr-3 flex-shrink-0" size={20} />
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="font-semibold">{formattedDate}</p>
      </div>
    </div>
  );
};

export default DateCard;
