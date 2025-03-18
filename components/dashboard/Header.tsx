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
    <header className={`bg-white border-b border-gray-200 ${className}`}>
      <div className="flex items-center justify-between px-4 py-3 md:px-6 md:py-4">
        {/* Left section with menu toggle */}
        <div className="flex items-center">
          <button
            onClick={onMenuToggle}
            className="lg:hidden text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/40 rounded p-1 mr-3"
            aria-label="Toggle menu"
          >
            <Menu size={22} />
          </button>

          {/* Logo/Brand could go here if needed */}
        </div>

        {/* Center content */}
        <div className="hidden md:flex md:justify-center md:flex-1">
          {children}
        </div>

        {/* Right side controls */}
        <div className="flex items-center space-x-3">
          {/* Search button (mobile) */}
          <div className="hidden sm:block relative w-auto md:w-56 lg:w-72 xl:w-80">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="w-4 h-4 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full pl-10 pr-3 py-2 md:py-1.5"
            />
          </div>

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

      {/* Mobile search (full width under header) */}
      <div className="px-4 pb-3 sm:hidden">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="w-4 h-4 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search..."
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full pl-10 pr-3 py-2"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
