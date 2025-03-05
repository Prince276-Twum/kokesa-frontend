"use client";

import React, { useState } from "react";
import Button from "@/components/UI/Button";
import Input from "@/components/UI/Input";
import FloatingSelect from "@/components/UI/FloatingSelect";
import KokesaLogo from "@/components/common/KokesaLogo";

import {
  FiHome,
  FiCalendar,
  FiUsers,
  FiSettings,
  FiBarChart2,
  FiSearch,
  FiMenu,
  FiBell,
  FiPlus,
} from "react-icons/fi";

export default function Dashboard() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  type ViewOption = { value: string; label: string };
  const [selectedView, setSelectedView] = useState<ViewOption>({
    value: "week",
    label: "Weekly",
  });

  const viewOptions: Array<ViewOption> = [
    { value: "day", label: "Daily" },
    { value: "week", label: "Weekly" },
    { value: "month", label: "Monthly" },
  ];

  // Sample data for the dashboard
  interface Booking {
    id: number;
    name: string;
    service: string;
    time: string;
    date: string;
  }

  interface Stat {
    title: string;
    value: string;
    change: string;
    icon: React.ReactNode;
  }

  const upcomingBookings: Booking[] = [
    {
      id: 1,
      name: "John Doe",
      service: "Haircut",
      time: "9:00 AM",
      date: "Today",
    },
    {
      id: 2,
      name: "Jane Smith",
      service: "Manicure",
      time: "11:30 AM",
      date: "Today",
    },
    {
      id: 3,
      name: "Robert Johnson",
      service: "Massage",
      time: "2:00 PM",
      date: "Tomorrow",
    },
    {
      id: 4,
      name: "Emily Davis",
      service: "Facial",
      time: "4:30 PM",
      date: "Tomorrow",
    },
  ];

  const statsData: Stat[] = [
    {
      title: "Total Bookings",
      value: "342",
      change: "+12%",
      icon: <FiCalendar className="text-primary" />,
    },
    {
      title: "New Customers",
      value: "87",
      change: "+5%",
      icon: <FiUsers className="text-primary" />,
    },
    {
      title: "Revenue",
      value: "$8,942",
      change: "+15%",
      icon: <FiBarChart2 className="text-primary" />,
    },
  ];

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-50 font-manrope">
      {/* Mobile Header */}
      <header className="md:hidden bg-white shadow-sm z-10">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="p-2 rounded text-gray-500 hover:bg-gray-100"
          >
            <FiMenu size={24} />
          </button>
          <KokesaLogo />
          <div className="h-8 w-8 bg-primary rounded-full flex items-center justify-center text-white font-semibold">
            JD
          </div>
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`bg-secondary-DEFAULT text-white fixed md:static z-50 h-full transition-all duration-300 
          ${mobileSidebarOpen ? "left-0" : "-left-full"} 
          ${sidebarOpen ? "md:w-64" : "md:w-20"} 
          w-3/4 md:translate-x-0`}
      >
        <div className="p-4 flex items-center justify-between">
          {sidebarOpen ? (
            <KokesaLogo />
          ) : (
            <div className="w-10 h-10 mx-auto bg-gradient-to-br from-primary to-primary-light rounded-lg flex items-center justify-center transform rotate-45 shadow-lg">
              <span className="text-white font-bold text-xl transform -rotate-45">
                K
              </span>
            </div>
          )}
          <div className="flex items-center">
            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="md:hidden text-white p-1 rounded hover:bg-gray-700 mr-2"
            >
              <FiMenu />
            </button>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="hidden md:block text-white p-1 rounded hover:bg-gray-700"
            >
              <FiMenu />
            </button>
          </div>
        </div>

        <div className="mt-8">
          <NavItem
            icon={<FiHome />}
            text="Dashboard"
            active={true}
            collapsed={!sidebarOpen}
          />
          <NavItem
            icon={<FiCalendar />}
            text="Bookings"
            collapsed={!sidebarOpen}
          />
          <NavItem
            icon={<FiUsers />}
            text="Customers"
            collapsed={!sidebarOpen}
          />
          <NavItem
            icon={<FiBarChart2 />}
            text="Analytics"
            collapsed={!sidebarOpen}
          />
          <NavItem
            icon={<FiSettings />}
            text="Settings"
            collapsed={!sidebarOpen}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto w-full">
        {/* Desktop Header */}
        <header className="hidden md:block bg-white shadow-sm">
          <div className="flex items-center justify-between px-6 py-4">
            <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
            <div className="flex items-center gap-4">
              <div className="w-64">
                <Input
                  id="search"
                  placeholder="Search"
                  leftIcon={<FiSearch />}
                />
              </div>
              <button className="p-2 text-gray-500 hover:text-primary hover:bg-primary/10 rounded-full">
                <FiBell />
              </button>
              <div className="h-8 w-8 bg-primary rounded-full flex items-center justify-center text-white font-semibold">
                JD
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-4 md:p-6">
          {/* Mobile Search */}
          <div className="mb-4 md:hidden">
            <Input
              id="mobile-search"
              placeholder="Search"
              leftIcon={<FiSearch />}
            />
          </div>

          {/* Page Title for Mobile */}
          <div className="flex items-center justify-between mb-6 md:hidden">
            <h1 className="text-xl font-bold text-gray-800">Dashboard</h1>
            <button className="p-2 text-gray-500 hover:text-primary hover:bg-primary/10 rounded-full">
              <FiBell />
            </button>
          </div>

          {/* Statistics Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
            {statsData.map((stat, index) => (
              <div key={index} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">{stat.title}</p>
                    <h3 className="text-2xl font-bold text-gray-800 mt-1">
                      {stat.value}
                    </h3>
                    <span className="text-green-500 text-sm">
                      {stat.change} from last month
                    </span>
                  </div>
                  <div className="p-3 bg-primary/10 rounded-full">
                    {stat.icon}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Booking Section */}
          <div className="flex flex-col md:flex-row gap-4 md:gap-6">
            {/* Calendar Section */}
            <div className="w-full md:w-3/5 bg-white rounded-lg shadow p-4 md:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 md:mb-6 gap-3">
                <h2 className="text-lg md:text-xl font-semibold text-gray-800">
                  Booking Calendar
                </h2>
                <div className="flex items-center gap-3">
                  <div className="w-40">
                    <FloatingSelect
                      id="view-select"
                      options={viewOptions}
                      value={selectedView}
                      onChange={(newValue) =>
                        newValue && setSelectedView(newValue as ViewOption)
                      }
                      placeholder="View"
                    />
                  </div>
                  <Button
                    el="button"
                    primary
                    rounded
                    className="w-auto md:flex hidden"
                  >
                    <FiPlus />
                    New Booking
                  </Button>
                  <Button
                    el="button"
                    primary
                    rounded
                    className="w-10 h-10 p-0 flex md:hidden items-center justify-center"
                  >
                    <FiPlus />
                  </Button>
                </div>
              </div>

              {/* Placeholder for calendar - would be implemented with a calendar component */}
              <div className="border border-gray-200 rounded-lg h-80 flex items-center justify-center bg-gray-50">
                <p className="text-gray-400">
                  Calendar view will be implemented here
                </p>
              </div>
            </div>

            {/* Upcoming Bookings */}
            <div className="w-full md:w-2/5 bg-white rounded-lg shadow p-4 md:p-6 mt-4 md:mt-0">
              <div className="flex items-center justify-between mb-4 md:mb-6">
                <h2 className="text-lg md:text-xl font-semibold text-gray-800">
                  Upcoming Bookings
                </h2>
                <button className="text-primary hover:text-primary-dark text-sm">
                  View all
                </button>
              </div>

              <div className="space-y-4">
                {upcomingBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="border-b border-gray-100 pb-4 last:border-none"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-gray-800">
                          {booking.name}
                        </h3>
                        <p className="text-gray-500 text-sm">
                          {booking.service}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-800">
                          {booking.time}
                        </p>
                        <p className="text-gray-500 text-sm">{booking.date}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <Button el="button" outline primary className="w-full">
                  Manage All Bookings
                </Button>
              </div>
            </div>
          </div>

          {/* Mobile Action Button - Fixed at bottom */}
          <div className="fixed bottom-6 right-6 md:hidden">
            <button className="bg-primary text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg">
              <FiPlus size={24} />
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}

// Navigation Item Component
function NavItem({
  icon,
  text,
  active = false,
  collapsed = false,
}: {
  icon: React.ReactNode;
  text: string;
  active?: boolean;
  collapsed?: boolean;
}) {
  return (
    <div
      className={`flex items-center py-3 px-4 ${
        active
          ? "bg-primary text-white"
          : "text-gray-300 hover:bg-gray-800 hover:text-white"
      } transition-colors cursor-pointer`}
    >
      <div className={`${collapsed ? "mx-auto" : "mr-3"}`}>{icon}</div>
      {!collapsed && <span>{text}</span>}
    </div>
  );
}
