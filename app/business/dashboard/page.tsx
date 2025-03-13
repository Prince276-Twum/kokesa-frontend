// app/dashboard/page.tsx or pages/dashboard.tsx
"use client";

import React from "react";
import { Calendar, MapPin, Building, CreditCard } from "lucide-react";
import PageHeader from "@/components/dashboard/PageHeader";
import DateCard from "@/components/dashboard/DateCard";
import StatCard from "@/components/dashboard/StatCard";
import AppointmentList from "@/components/dashboard/AppointmentCard";
import Panel from "@/components/dashboard/Panel";
import InfoStat from "@/components/dashboard/InfoStat";
import StaffTable from "@/components/dashboard/StaffTable";
import { StatusType } from "@/components/dashboard/StatusBadge";

const Dashboard = () => {
  // Sample data for appointments
  const upcomingAppointments = [
    {
      id: 1,
      clientName: "Sarah Johnson",
      service: "Haircut",
      time: "2:00 PM",
      date: "Today",
    },
    {
      id: 2,
      clientName: "Sarah Johnson",
      clientInitials: "OM",
      clientAvatarBg: "bg-orange-200",
      service: "Haircut",
      time: "5:00 PM",
      date: "Today",
    },
  ];

  // Sample data for staff members
  const staffMembers = [
    {
      id: 1,
      name: "Sarah Johnson",
      email: "sarahjohnson@gmail.com",
      specialization: "Hair Stylist",
      status: "available" as StatusType,
    },
    {
      id: 2,
      name: "Mike Peters",
      email: "mikepeters@gmail.com",
      specialization: "Barber",
      status: "busy" as StatusType,
    },
    {
      id: 3,
      name: "Emma Wilson",
      email: "emmawilson@gmail.com",
      initials: "EM",
      avatarBg: "bg-pink-200",
      specialization: "Nail Technician",
      status: "onLeave" as StatusType,
    },
    {
      id: 4,
      name: "Joseph Sambo",
      email: "josephsambo@gmail.com",
      specialization: "Esthetician",
      status: "available" as StatusType,
    },
  ];

  // Handle staff action clicks
  const handleStaffAction = (actionType: string, staffId: string | number) => {
    console.log(`${actionType} clicked for staff ${staffId}`);
    // Implementation for staff actions like view profile, edit, etc.
  };

  return (
    <div className="space-y-6">
      {/* Header Section
      <PageHeader
        title="Welcome, Kokesa Dashboard"
        subtitle="Manage your appointments, track your growth, and connect with customers—all in one place."
        emoji="👋"
        action={<DateCard />}
      /> */}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <StatCard
          title="Total Appointments"
          value="248"
          icon={<Calendar size={18} className="text-red-500" />}
          change={12}
          iconBgColor="bg-red-100"
          iconColor="text-red-500"
        />

        <StatCard
          title="Earnings This Month"
          value="$ 50,000.00"
          icon={<span className="text-orange-500 font-bold">$</span>}
          change={25}
          iconBgColor="bg-orange-100"
          iconColor="text-orange-500"
        />
      </div>

      {/* Appointments and Reach */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <AppointmentList appointments={upcomingAppointments} />

        <Panel title="Your Reach">
          <div className="space-y-4">
            <InfoStat
              icon={<MapPin size={16} />}
              title="Countries Active In"
              description="Kenya, Ghana, Tanzania, Nigeria, Uganda"
              value="5"
              iconBgColor="bg-blue-100"
              iconColor="text-blue-500"
            />

            <InfoStat
              icon={<Building size={16} />}
              title="Partner Businesses"
              description="Connected and Active"
              value="12"
              iconBgColor="bg-[#F0F2F5]"
              iconColor="text-[#344054]"
              border
            />
          </div>
        </Panel>
      </div>

      {/* Staff Table */}
      <StaffTable staffMembers={staffMembers} onAction={handleStaffAction} />
    </div>
  );
};

export default Dashboard;
