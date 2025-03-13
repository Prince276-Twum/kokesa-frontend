// components/dashboard/InfoStat.tsx
import React, { ReactNode } from "react";

interface InfoStatProps {
  icon: ReactNode;
  title: string;
  description?: string;
  value: string | number;
  iconBgColor?: string;
  iconColor?: string;
  className?: string;
  border?: boolean;
}

const InfoStat: React.FC<InfoStatProps> = ({
  icon,
  title,
  description,
  value,
  iconBgColor = "bg-blue-100",
  iconColor = "text-blue-500",
  className = "",
  border = false,
}) => {
  return (
    <div
      className={`flex items-center justify-between py-3 ${
        border ? "border-t border-gray-100" : ""
      } ${className}`}
    >
      <div className="flex items-center">
        <div
          className={`w-8 h-8 rounded-full ${iconBgColor} flex items-center justify-center mr-3`}
        >
          <span className={iconColor}>{icon}</span>
        </div>
        <div>
          <h4 className="font-medium">{title}</h4>
          {description && (
            <p className="text-sm text-gray-500">{description}</p>
          )}
        </div>
      </div>
      <div className="text-3xl font-bold">{value}</div>
    </div>
  );
};

export default InfoStat;
