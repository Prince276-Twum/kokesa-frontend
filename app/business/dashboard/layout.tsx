// app/layout.tsx or components/layout/DashboardLayout.tsx
"use client";

import React, { type ReactNode, useState, useEffect } from "react";
import SidebarNavigation from "@/components/dashboard/SidebarNavigation";
import Header from "@/components/dashboard/Header";
import RequireAuth from "@/components/utils/RequireAuth";
import RequireBusinessComplete from "@/components/utils/RequireBusinessComplete";
import {
  Home,
  Calendar,
  Users,
  Settings,
  BarChart2,
  MessageSquare,
  CreditCard,
  HelpCircle,
  Share2,
} from "lucide-react";

interface Props {
  children: ReactNode;
}

const navigationSections = [
  {
    items: [
      {
        icon: <Home size={20} />,
        text: "Dashboard",
        href: "/business/dashboard",
        isActive: true,
      },
      {
        icon: <Calendar size={20} />,
        text: "Appointments",
        href: "dashboard/appointments",
      },
      { icon: <Users size={20} />, text: "Customers", href: "/customers" },
      { icon: <BarChart2 size={20} />, text: "Services", href: "/services" },
      {
        icon: <MessageSquare size={20} />,
        text: "Messages",
        href: "/messages",
      },
      { icon: <BarChart2 size={20} />, text: "Analytics", href: "/analytics" },
      { icon: <CreditCard size={20} />, text: "Payments", href: "/payments" },
    ],
  },
  {
    items: [
      { icon: <Settings size={20} />, text: "Settings", href: "/settings" },
      { icon: <HelpCircle size={20} />, text: "Help Center", href: "/help" },
      {
        icon: <Share2 size={20} />,
        text: "Refer family & friends",
        href: "/refer",
      },
    ],
  },
];

const userData = {
  name: "Daniel Kyle",
  email: "daniel@kokesa.org",
};

function DashboardLayout({ children }: Props) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      if (window.innerWidth < 1024) {
        setIsCollapsed(true);
        setIsMobileOpen(false);
      }
    };
    checkIfMobile();

    window.addEventListener("resize", checkIfMobile);

    // Clean up
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.getElementById("mobile-sidebar");
      if (isMobileOpen && sidebar && !sidebar.contains(event.target as Node)) {
        setIsMobileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobileOpen]);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleMobileMenu = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  return (
    <>
      <RequireAuth>
        <RequireBusinessComplete>
          <div className="flex h-screen overflow-hidden bg-gray-50">
            {/* Overlay for mobile menu */}
            {isMobileOpen && (
              <div
                className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                onClick={toggleMobileMenu}
              />
            )}

            {/* Sidebar - conditional rendering based on mobile/desktop */}
            <div
              id="mobile-sidebar"
              className={`fixed inset-y-0 left-0 z-50 transform transition-all duration-300 ease-in-out lg:relative lg:translate-x-0 ${
                isMobileOpen ? "translate-x-0" : "-translate-x-full"
              } ${isCollapsed ? "lg:w-20" : "lg:w-64"}`}
            >
              <SidebarNavigation
                logo={
                  isCollapsed ? (
                    <div className="text-white font-bold text-xl">K</div>
                  ) : (
                    <div className="text-white font-bold text-xl">Kokesa</div>
                  )
                }
                user={userData}
                sections={navigationSections}
                onToggleCollapse={toggleCollapse}
                isCollapsed={isCollapsed}
              />
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
              <Header
                onMenuToggle={toggleMobileMenu}
                userName={userData.name}
                userInitials={userData.name.charAt(0)}
                avatarColorScheme="primary"
              />

              {/* Page Content */}
              <main className="flex-1 overflow-y-auto p-4 lg:p-6">
                {children}
              </main>
            </div>
          </div>
        </RequireBusinessComplete>
      </RequireAuth>
    </>
  );
}

export default DashboardLayout;
