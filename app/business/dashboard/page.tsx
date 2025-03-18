// app/dashboard/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Calendar, MapPin, Building } from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";
import AppointmentList from "@/components/dashboard/AppointmentList";
import AppointmentListSkeleton from "@/components/loading-states/AppointmentListSkeleton";
import Panel from "@/components/dashboard/Panel";
import InfoStat from "@/components/dashboard/InfoStat";
import StaffTable from "@/components/dashboard/StaffTable";
import StaffTableSkeleton from "@/components/loading-states/StaffTableSkeleton";
import { StatusType } from "@/components/dashboard/StatusBadge";
import { useGetUpcomingAppointmentsQuery } from "@/store/features/appointmentApiSlice";

const Dashboard = () => {
  // Loading states
  const [isStaffLoading, setIsStaffLoading] = useState(false);
  const [isAppointmentsLoading, setIsAppointmentsLoading] = useState(false);

  const [staffMembers, setStaffMembers] = useState([]);
  const { data: upcomingAppointments, isLoading: isUpcomingLoading } =
    useGetUpcomingAppointmentsQuery(undefined);

  // Simulate loading data
  useEffect(() => {
    // Simulated API calls to fetch data
    const fetchStaffData = async () => {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // // Sample data for staff members
      // const staffData = [
      //   {
      //     id: 1,
      //     name: "Sarah Johnson",
      //     email: "sarahjohnson@gmail.com",
      //     specialization: "Hair Stylist",
      //     status: "available" as StatusType,
      //   },
      //   userTimezone,
      //   // Other staff members
      // ];

      // setStaffMembers(staffData);
      // setIsStaffLoading(false);
    };

    const fetchAppointmentsData = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const appointmentsData = [
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
          service: "Haircut",
          time: "2:00 PM",
          date: "Today",
        },
      ];

      setIsAppointmentsLoading(false);
    };

    // Fetch data
    fetchStaffData();
    fetchAppointmentsData();
  }, []);

  // Handle staff action clicks
  const handleStaffAction = (actionType: string, staffId: string | number) => {
    console.log(`${actionType} clicked for staff ${staffId}`);
  };

  return (
    <div className="space-y-6 p-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 ">
        <StatCard
          value="234"
          title="Total Appointments"
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {isUpcomingLoading ? (
          <AppointmentListSkeleton rowCount={3} />
        ) : (
          <AppointmentList
            appointments={upcomingAppointments?.results.slice(0, 3) || []}
          />
        )}

        <Panel title="Your Reach">
          <div className="space-y-4">
            <InfoStat
              icon={<MapPin size={16} />}
              title="Countries Active In"
              description="Kenya, Ghana, Tanzania, Nigeria, Uganda"
              value="5"
              className="text-gray-900"
              iconBgColor="bg-blue-100"
              iconColor="text-blue-500"
            />

            <InfoStat
              icon={<Building size={16} />}
              title="Partner Businesses"
              description="Connected and Active"
              value="12"
              className="text-gray-900"
              iconBgColor="bg-[#F0F2F5]"
              iconColor="text-[#344054]"
              border
            />
          </div>
        </Panel>
      </div>

      {isStaffLoading ? (
        <StaffTableSkeleton
          rowCount={4}
          title="🏆 Your Stylists & Professionals"
        />
      ) : (
        <StaffTable staffMembers={staffMembers} onAction={handleStaffAction} />
      )}
    </div>
  );
};

export default Dashboard;
