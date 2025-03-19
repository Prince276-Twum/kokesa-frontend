// components/dashboard/StatCard.tsx
import React, { ReactNode } from "react";
import LoadingState from "@/components/loading-states/LoadingState";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  change?: number | null;
  changeLabel?: string;
  iconBgColor?: string;
  iconColor?: string;
  isLoading?: boolean;
  isPositive?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  change,
  changeLabel = "from last month",
  iconBgColor = "bg-primary-100",
  iconColor = "text-primary",
  isLoading = false,
  isPositive = true,
}) => {
  console.log(change);
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-5 md:p-6 h-full">
        <div className="flex justify-between items-center mb-4">
          <LoadingState type="text" width="24" height="4" />
          <LoadingState type="circle" width="8" height="8" rounded="md" />
        </div>
        <div className="space-y-2">
          <LoadingState type="text" width="36" height="8" className="my-2" />
          <div className="flex items-center">
            <LoadingState type="text" width="12" height="4" rounded="sm" />
            <LoadingState type="text" width="24" height="4" className="ml-2" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-5 md:p-6 h-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-gray-500 font-medium">{title}</h2>
        <div
          className={`w-8 h-8 rounded-md ${iconBgColor} flex items-center justify-center ${iconColor}`}
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
