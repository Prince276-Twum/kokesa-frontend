// components/utils/LoadingState.tsx
import React from "react";

interface LoadingStateProps {
  type?: "circle" | "rect" | "text" | "avatar";
  width?: string;
  height?: string;
  className?: string;
  rounded?: "none" | "sm" | "md" | "lg" | "full";
}

const LoadingState: React.FC<LoadingStateProps> = ({
  type = "rect",
  width = "full",
  height = "4",
  className = "",
  rounded = "md",
}) => {
  const roundedClasses = {
    none: "",
    sm: "rounded",
    md: "rounded-md",
    lg: "rounded-lg",
    full: "rounded-full",
  };

  const widthClasses = width === "full" ? "w-full" : `w-${width}`;
  const heightClasses = `h-${height}`;

  // Special case for avatar type
  if (type === "avatar") {
    return (
      <div
        className={`${widthClasses} ${heightClasses} rounded-full bg-gray-200 animate-pulse ${className}`}
      ></div>
    );
  }

  // Special case for circle type
  if (type === "circle") {
    return (
      <div
        className={`${width === "full" ? "w-8" : `w-${width}`} ${
          height === "4" ? "h-8" : `h-${height}`
        } rounded-full bg-gray-200 animate-pulse ${className}`}
      ></div>
    );
  }

  return (
    <div
      className={`${widthClasses} ${heightClasses} ${roundedClasses[rounded]} bg-gray-200 animate-pulse ${className}`}
    ></div>
  );
};

export default LoadingState;
