// components/dashboard/Header.tsx
import React, { ReactNode, useState } from "react";
import { Search, Bell, Menu } from "lucide-react";
import Avatar from "./Avatar";

interface HeaderProps {
  userName?: string;
  userInitials?: string;
  avatarColorScheme?:
    | "primary"
    | "purple"
    | "blue"
    | "pink"
    | "amber"
    | "green";
  children?: ReactNode;
  className?: string;
  searchIcon?: ReactNode;
  notificationIcon?: ReactNode;
  onMenuToggle?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  userName = "User",
  userInitials,
  avatarColorScheme = "primary",
  children,
  className = "",
  searchIcon = <Search size={20} />,
  notificationIcon = <Bell size={20} />,
  onMenuToggle,
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className={`bg-white border-b shadow-sm ${className}`}>
      <div className="flex items-center justify-between px-4 md:px-6 py-4">
        {/* Left section with menu toggle for mobile */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuToggle}
            className="lg:hidden text-gray-500 hover:text-gray-700 focus:outline-none"
            aria-label="Toggle menu"
          >
            <Menu size={24} />
          </button>

          {/* Search Bar */}
          <div className="relative">
            <div className="flex items-center border rounded-lg px-3 py-2 w-64 md:w-80 transition-all focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20">
              {searchIcon && (
                <span className="text-gray-400 mr-2">{searchIcon}</span>
              )}
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search here..."
                className="bg-transparent border-none focus:outline-none text-sm flex-1 text-text-primary"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Center content */}
        <div className="hidden md:flex md:justify-center md:flex-1">
          {children}
        </div>

        {/* Right side controls */}
        <div className="flex items-center space-x-3">
          <button
            className="p-2 rounded-full hover:bg-gray-100 text-gray-600 relative focus:outline-none focus:ring-2 focus:ring-primary/40"
            aria-label="Notifications"
          >
            {notificationIcon}
            <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-primary"></span>
          </button>
          <div className="cursor-pointer">
            <Avatar
              name={userName}
              initials={userInitials}
              size="md"
              colorScheme={avatarColorScheme}
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
