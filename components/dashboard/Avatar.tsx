// components/Avatar.tsx
import React from "react";

interface AvatarProps {
  name: string;
  initials?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
  colorScheme?: "primary" | "purple" | "blue" | "pink" | "amber" | "green";
}

const Avatar: React.FC<AvatarProps> = ({
  name,
  initials,
  size = "md",
  className = "",
  colorScheme = "primary",
}) => {
  // Generate initials if not provided
  const generatedInitials =
    initials ||
    name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

  // Size mapping
  const sizeClasses = {
    xs: "h-6 w-6 text-xs",
    sm: "h-8 w-8 text-sm",
    md: "h-10 w-10 text-sm",
    lg: "h-12 w-12 text-base",
    xl: "h-16 w-16 text-lg",
  };

  // Color mapping based on your design system
  const colorClasses = {
    primary: "bg-primary text-white",
    purple: "bg-purple-500 text-white",
    blue: "bg-blue-500 text-white",
    pink: "bg-pink-500 text-white",
    amber: "bg-amber-800 text-white",
    green: "bg-green-500 text-white",
  };

  return (
    <div
      className={`rounded-full flex items-center justify-center font-bold ${sizeClasses[size]} ${colorClasses[colorScheme]} ${className}`}
      title={name}
    >
      {generatedInitials}
    </div>
  );
};

export default Avatar;
