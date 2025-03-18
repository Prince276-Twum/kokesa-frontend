"use client";

import React, { useState, useCallback, useEffect, useMemo } from "react";
import { Plus } from "lucide-react";
import BusinessCalendar from "@/components/dashboard/BusinessCalendar";
import AppointmentReminders from "@/components/dashboard/apointments/AppointmentReminders";
import AppointmentTable from "@/components/dashboard/apointments/AppointmentTable";
import Pagination from "@/components/dashboard/Pagination";
import AppointmentGrid from "@/components/dashboard/apointments/AppointmentGrid";
import { DesktopHeader } from "@/components/dashboard/apointments/DesktopHeader";
import { MobileHeader } from "@/components/dashboard/apointments";
import { SearchBar } from "@/components/dashboard/apointments";
import { FilterPanel } from "@/components/dashboard/apointments";
import { AppointmentTabs } from "@/components/dashboard/apointments";
import { useAppointment } from "@/hooks/useAppointment";
import { NoResults } from "@/components/dashboard/apointments";
import { Appointment } from "@/components/dashboard/apointments/AppointmentTable";
import EditAppointmentModal from "@/components/dashboard/apointments/EditAppointmentModal";
import {
  useLazyGetUpcomingAppointmentsQuery,
  useLazyGetPastAppointmentsQuery,
  useLazyGetCancelledAppointmentsQuery,
  useGetTodayAppointmentsQuery,
} from "@/store/features/appointmentApiSlice";

const AppointmentsPage = () => {
  const [viewMode, setViewMode] = useState<string>("list");
  const [activeTab, setActiveTab] = useState<string>("upcoming");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [calendarViewMode, setCalendarViewMode] = useState<string>("week");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [showMobileSearch, setShowMobileSearch] = useState<boolean>(false);
  const [showMobileActions, setShowMobileActions] = useState<boolean>(false);
  const [filters, setFilters] = useState({
    status: [] as string[],
    serviceProvider: [] as string[],
    dateRange: { start: null, end: null } as {
      start: Date | null;
      end: Date | null;
    },
    paymentStatus: [] as string[],
  });

  // Initialize lazy query hooks for each tab
  const [fetchUpcomingAppointments, upcomingResult] =
    useLazyGetUpcomingAppointmentsQuery();
  const [fetchPastAppointments, pastResult] = useLazyGetPastAppointmentsQuery();
  const [fetchCancelledAppointments, cancelledResult] =
    useLazyGetCancelledAppointmentsQuery();

  const {
    data: reminderData,
    isLoading: isLoadingReminderData,
    refetch: refetchReminder,
  } = useGetTodayAppointmentsQuery(undefined);

  const {
    appointments,
    serviceProviders,
    tabOptions,
    viewOptions,
    filteredAppointments,
    paginatedAppointments,
    totalPages,
  } = useAppointment({
    activeTab,
    filters,
    searchQuery,
    currentPage,
    itemsPerPage,
  });

  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);

  // Fetch data when tab changes or pagination changes
  useEffect(() => {
    const fetchData = () => {
      const params = {
        page: currentPage,
        page_size: itemsPerPage,
        // itemsPerPage: itemsPerPage,
        // searchQuery: searchQuery,
        // ...filters,
      };

      console.log(params);

      switch (activeTab) {
        case "upcoming":
          fetchUpcomingAppointments(params);
          break;
        case "past":
          fetchPastAppointments(params);
          break;
        case "cancelled":
          fetchCancelledAppointments(params);
          break;
        default:
          fetchUpcomingAppointments(params);
      }
    };

    fetchData();
  }, [
    activeTab,
    currentPage,
    itemsPerPage,
    searchQuery,
    filters,
    fetchUpcomingAppointments,
    fetchPastAppointments,
    fetchCancelledAppointments,
  ]);

  console.log(upcomingResult);

  // Helper functions to get the current data and loading state - wrap in useCallback
  const getCurrentData = useCallback(() => {
    switch (activeTab) {
      case "upcoming":
        return upcomingResult.data || [];
      case "past":
        return pastResult.data || [];
      case "cancelled":
        return cancelledResult.data || [];
      default:
        return [];
    }
  }, [activeTab, upcomingResult.data, pastResult.data, cancelledResult.data]);

  const isLoadingCurrentTab = useCallback(() => {
    switch (activeTab) {
      case "upcoming":
        return upcomingResult.isLoading;
      case "past":
        return pastResult.isLoading;
      case "cancelled":
        return cancelledResult.isLoading;
      default:
        return false;
    }
  }, [
    activeTab,
    upcomingResult.isLoading,
    pastResult.isLoading,
    cancelledResult.isLoading,
  ]);

  const getTotalCount = useCallback(() => {
    switch (activeTab) {
      case "upcoming":
        return upcomingResult?.data?.count || 0;
      case "past":
        return pastResult.data?.count || 0;
      case "cancelled":
        return cancelledResult.data?.count || 0;
      default:
        return 0;
    }
  }, [
    activeTab,
    upcomingResult.data?.count,
    pastResult.data?.count,
    cancelledResult.data?.count,
  ]);

  const getApiTotalPages = useCallback(() => {
    const count = getTotalCount();
    return Math.ceil(count / itemsPerPage);
  }, [getTotalCount, itemsPerPage]);

  useEffect(() => {
    const currentData = getCurrentData();
    if (currentData.length > 0) {
      console.log(`${activeTab} appointments:`, currentData);
    }
  }, [
    upcomingResult.data,
    pastResult.data,
    cancelledResult.data,
    activeTab,
    getCurrentData,
  ]);

  // Memoize the API total pages to avoid the complex expression in dependency array
  const apiTotalPagesMemo = useMemo(
    () => getApiTotalPages(),
    [getApiTotalPages]
  );

  useEffect(() => {
    if (currentPage > apiTotalPagesMemo && apiTotalPagesMemo > 0) {
      setCurrentPage(apiTotalPagesMemo);
    } else if (currentPage < 1 && apiTotalPagesMemo > 0) {
      setCurrentPage(1);
    }
  }, [currentPage, apiTotalPagesMemo]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, filters, searchQuery, itemsPerPage]);

  const handlePageChange = useCallback(
    (page: number) => {
      const totalPages = getApiTotalPages();
      if (page >= 1 && page <= totalPages) {
        setCurrentPage(page);
        const appointmentsSection = document.getElementById(
          "appointments-section"
        );
        if (appointmentsSection) {
          appointmentsSection.scrollIntoView({ behavior: "smooth" });
        }
      }
    },
    [getApiTotalPages]
  );

  const handleSaveAppointment = useCallback(
    (updatedAppointment: Appointment) => {
      // Dispatch the update action
      console.log("Saving appointment:", updatedAppointment);
      setIsEditModalOpen(false);

      // Refresh the current tab data
      const params = {
        page: currentPage,
        itemsPerPage: itemsPerPage,
        searchQuery: searchQuery,
        ...filters,
      };

      switch (activeTab) {
        case "upcoming":
          fetchUpcomingAppointments(params);
          break;
        case "past":
          fetchPastAppointments(params);
          break;
        case "cancelled":
          fetchCancelledAppointments(params);
          break;
      }
    },
    [
      activeTab,
      currentPage,
      itemsPerPage,
      searchQuery,
      filters,
      fetchUpcomingAppointments,
      fetchPastAppointments,
      fetchCancelledAppointments,
    ]
  );

  const refreshAppointments = useCallback(() => {
    setIsLoading(true);

    // Refresh the current tab data
    const params = {
      page: currentPage,
      itemsPerPage: itemsPerPage,
      searchQuery: searchQuery,
      ...filters,
    };

    switch (activeTab) {
      case "upcoming":
        fetchUpcomingAppointments(params);
        break;
      case "past":
        fetchPastAppointments(params);
        break;
      case "cancelled":
        fetchCancelledAppointments(params);
        break;
    }

    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, [
    activeTab,
    currentPage,
    itemsPerPage,
    searchQuery,
    filters,
    fetchUpcomingAppointments,
    fetchPastAppointments,
    fetchCancelledAppointments,
  ]);

  const handleSendReminder = useCallback((reminderId: string | number) => {
    setIsLoading(true);
    console.log(`Sending reminder for ID: ${reminderId}`);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleAppointmentAction = useCallback(
    (appointment: Appointment, action: string) => {
      console.log(`Action ${action} for appointment ID: ${appointment.id}`);
      switch (action) {
        case "view":
          console.log(
            `Viewing appointment details for ${appointment.client_name}`
          );
          break;
        case "edit":
          console.log(`Editing appointment for ${appointment.client_name}`);
          setSelectedAppointment(appointment);
          setIsEditModalOpen(true);
          break;
        case "cancel":
          console.log(`Cancelling appointment for ${appointment.client_name}`);
          // Add cancel appointment logic here
          break;
        case "menu":
          console.log(`Opening menu for appointment ${appointment.id}`);
          break;
        default:
          break;
      }
    },
    []
  );

  const handleCalendarViewModeChange = useCallback((mode: string) => {
    setCalendarViewMode(mode);
  }, []);

  const toggleFilters = useCallback(() => {
    setShowFilters((prev) => !prev);
    if (window.innerWidth < 768) {
      setShowMobileSearch(false);
    }
  }, []);

  const handleFilterChange = useCallback((filterType: string, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      status: [],
      serviceProvider: [],
      dateRange: { start: null, end: null },
      paymentStatus: [],
    });
    setSearchQuery("");
  }, []);

  const exportAppointments = useCallback(() => {
    console.log("Exporting appointments...");
    const currentData = getCurrentData();
    console.log("Data to export:", currentData);
  }, [getCurrentData]);

  const handleItemsPerPageChange = useCallback((newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  }, []);

  const toggleMobileSearch = useCallback(() => {
    setShowMobileSearch((prev) => !prev);
    if (window.innerWidth < 768) {
      setShowFilters(false);
      setShowMobileActions(false);
    }
  }, []);

  const toggleMobileActions = useCallback(() => {
    setShowMobileActions((prev) => !prev);
    if (window.innerWidth < 768) {
      setShowFilters(false);
      setShowMobileSearch(false);
    }
  }, []);

  // Get the correct data and loading state for the current view
  const currentData = getCurrentData();
  const isCurrentTabLoading = isLoadingCurrentTab();
  const apiTotalPages = getApiTotalPages();
  const totalCount = getTotalCount();

  console.log(currentData.results);

  return (
    <div className="p-6">
      {/* Desktop Header */}
      <DesktopHeader
        refreshAppointments={refreshAppointments}
        toggleFilters={toggleFilters}
        exportAppointments={exportAppointments}
        showFilters={showFilters}
        filters={filters}
      />

      {/* Mobile Header */}
      <MobileHeader
        toggleMobileSearch={toggleMobileSearch}
        toggleFilters={toggleFilters}
        toggleMobileActions={toggleMobileActions}
        showMobileActions={showMobileActions}
        filters={filters}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        showMobileSearch={showMobileSearch}
        refreshAppointments={refreshAppointments}
        exportAppointments={exportAppointments}
      />

      {/* Reminders section */}
      <div className="mb-4">
        <AppointmentReminders
          timeZone={reminderData?.timezone}
          reminders={reminderData?.results?.slice(0, 3) || []}
          onSendReminder={handleSendReminder}
          isLoading={isLoadingReminderData}
        />
      </div>

      {/* Filter panel */}
      {showFilters && (
        <FilterPanel
          filters={filters}
          handleFilterChange={handleFilterChange}
          resetFilters={resetFilters}
          toggleFilters={toggleFilters}
          serviceProviders={serviceProviders}
        />
      )}

      {/* Desktop search bar */}
      <SearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filteredAppointmentsLength={currentData.length}
      />

      <div
        id="appointments-section"
        className="bg-white rounded-lg shadow overflow-hidden"
      >
        <AppointmentTabs
          tabOptions={tabOptions}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          viewOptions={viewOptions}
          viewMode={viewMode}
          setViewMode={setViewMode}
        />

        {/* View content based on selected view mode */}
        {viewMode === "list" ? (
          <>
            <div className="overflow-x-auto">
              <AppointmentTable
                appointments={currentData.results || []}
                onAppointmentAction={handleAppointmentAction}
                isLoading={isCurrentTabLoading}
              />
            </div>
            <div className="p-3 md:p-4">
              <Pagination
                currentPage={currentPage}
                totalPages={apiTotalPages}
                onPageChange={handlePageChange}
                totalItems={totalCount}
                itemsPerPage={itemsPerPage}
                showItemCount={true}
              />
            </div>
          </>
        ) : viewMode === "grid" ? (
          <div className="p-3 md:p-4">
            <AppointmentGrid
              appointments={currentData.results || []}
              onAppointmentAction={handleAppointmentAction}
            />

            <div className="mt-4">
              <Pagination
                currentPage={currentPage}
                totalPages={apiTotalPages}
                onPageChange={handlePageChange}
                totalItems={totalCount}
                itemsPerPage={itemsPerPage}
                showItemCount={true}
              />
            </div>
          </div>
        ) : (
          <div className="h-[500px] md:h-[700px]">
            <BusinessCalendar
              // viewMode={calendarViewMode}
              onViewModeChange={handleCalendarViewModeChange}
            />
          </div>
        )}
      </div>

      {/* No results message */}
      {!isCurrentTabLoading && currentData?.results?.length === 0 && (
        <NoResults searchQuery={searchQuery} resetFilters={resetFilters} />
      )}

      <EditAppointmentModal
        isOpen={isEditModalOpen}
        appointment={selectedAppointment}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedAppointment(null);
        }}
        onSave={handleSaveAppointment}
        serviceProviders={serviceProviders}
      />

      {/* Mobile fixed action button */}
      <div className="md:hidden fixed bottom-6 right-6 z-10">
        <button className="bg-primary hover:bg-primary-dark text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg">
          <Plus size={24} />
        </button>
      </div>
    </div>
  );
};

export default AppointmentsPage;
