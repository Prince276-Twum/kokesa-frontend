// components/dashboard/StatCard.tsx
import React, { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  change?: number;
  changeLabel?: string;
  iconBgColor?: string;
  iconColor?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  change,
  changeLabel = "from last month",
  iconBgColor = "bg-primary-100",
  iconColor = "text-primary",
}) => {
  const isPositive = change && change > 0;
  console.log(iconColor);

  return (
    <div className="bg-white rounded-lg shadow p-5 md:p-6 h-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-gray-500 font-medium">{title}</h2>
        <div
          className={`w-8 h-8 rounded-md ${iconBgColor} flex items-center justify-center`}
        >
          {icon}
        </div>
      </div>
      <div className="space-y-2">
        <h3 className="text-2xl md:text-3xl font-bold">{value}</h3>
        {change && (
          <p
            className={`text-sm flex items-center ${
              isPositive ? "text-green-500" : "text-red-500"
            }`}
          >
            <span
              className={`${
                isPositive ? "bg-green-100" : "bg-red-100"
              } px-1 rounded flex items-center`}
            >
              {isPositive ? "+" : ""}
              {change}%
            </span>
            <span className="ml-2">{changeLabel}</span>
          </p>
        )}
      </div>
    </div>
  );
};

export default StatCard;
