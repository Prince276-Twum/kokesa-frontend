import { useMemo } from "react";
import { Appointment } from "@/components/dashboard/apointments/AppointmentTable";
import { TabOption } from "@/components/dashboard/apointments/TabNavigation";
import { ViewOption } from "@/components/dashboard/apointments/ViewToggle";

interface AppointmentDataProps {
  activeTab: string;
  filters: {
    status: string[];
    serviceProvider: string[];
    dateRange: { start: Date | null; end: Date | null };
    paymentStatus: string[];
  };
  searchQuery: string;
  currentPage: number;
  itemsPerPage: number;
}

export const useAppointment = ({
  activeTab,
  filters,
  searchQuery,
  currentPage,
  itemsPerPage,
}: AppointmentDataProps) => {
  const appointments = useMemo<Appointment[]>(
    () => [
      {
        id: 1,
        client_name: "Sarah Johnson",
        clientAvatar: "",
        service_name: "Hair Stylist",
        service: { name: "wd", id: 1 },
        service_provider: "Emma Rodriguez",
        serviceProviderId: 3,
        date: "Mar 15, 2025",
        time: "2:00 PM",
        local_start_time: "2:00 PM",
        local_timezone: "GMT-5",
        status: "confirmed",
        notes: "Regular client, prefers minimal styling",
        price: 75.0,
        duration: 60,
        paymentStatus: "unpaid",
      },
    ],
    []
  );

  // Get unique service providers for filters
  const serviceProviders = useMemo(() => {
    const uniqueProviders = new Set(
      appointments.map((a) => a.service_provider).filter(Boolean)
    );
    return Array.from(uniqueProviders) as string[];
  }, [appointments]);

  // Tab options with dynamic counts
  const tabOptions = useMemo<TabOption[]>(() => {
    const today = new Date();

    // Count upcoming appointments (future date + active status)
    const upcomingCount = appointments.filter((a) => {
      const aptDate = new Date(a.date);
      return (
        aptDate >= today &&
        ["accept", "pending", "reschedule"].includes(a.status as string)
      );
    }).length;

    // Count past appointments (past date or completed status)
    const pastCount = appointments.filter((a) => {
      const aptDate = new Date(a.date);
      return (
        aptDate < today || a.status === "complete" || a.status === "no-show"
      );
    }).length;

    // Count pending appointments
    const pendingCount = appointments.filter(
      (a) => a.status === "pending"
    ).length;

    // Count cancelled appointments
    const cancelledCount = appointments.filter(
      (a) => a.status === "cancel"
    ).length;

    return [
      { id: "upcoming", label: "Upcoming", count: upcomingCount },
      { id: "past", label: "Past", count: pastCount },
      { id: "pending", label: "Pending", count: pendingCount },
      { id: "cancelled", label: "Cancelled", count: cancelledCount },
    ];
  }, [appointments]);

  // View toggle options
  const viewOptions = useMemo<ViewOption[]>(
    () => [
      { id: "list", label: "List View", icon: "list" },
      { id: "grid", label: "Grid View", icon: "grid" },
      { id: "calendar", label: "Calendar View", icon: "calendar" },
    ],
    []
  );

  // Filter appointments based on active tab and filters
  const filteredAppointments = useMemo(() => {
    let filtered = [...appointments];
    const today = new Date();

    // Filter by tab
    switch (activeTab) {
      case "pending":
        filtered = filtered.filter((apt) => apt.status === "pending");
        break;
      case "cancelled":
        filtered = filtered.filter((apt) => apt.status === "cancel");
        break;
      case "past":
        // For past appointments, look at the date and status
        filtered = filtered.filter((apt) => {
          const aptDate = new Date(apt.date);
          return (
            aptDate < today ||
            apt.status === "complete" ||
            apt.status === "no-show"
          );
        });
        break;
      case "upcoming":
      default:
        // For upcoming, filter active appointments with future dates
        filtered = filtered.filter((apt) => {
          const aptDate = new Date(apt.date);
          return (
            aptDate >= today &&
            ["accept", "pending", "reschedule"].includes(apt.status as string)
          );
        });
        break;
    }

    // Apply custom filters if set
    if (filters.status && filters.status.length > 0) {
      filtered = filtered.filter((apt) =>
        filters.status.includes(apt.status as string)
      );
    }

    if (filters.serviceProvider && filters.serviceProvider.length > 0) {
      filtered = filtered.filter(
        (apt) =>
          apt.service_provider &&
          filters.serviceProvider.includes(apt.service_provider)
      );
    }

    if (filters.paymentStatus && filters.paymentStatus.length > 0) {
      filtered = filtered.filter(
        (apt) =>
          apt.paymentStatus &&
          filters.paymentStatus.includes(apt.paymentStatus as string)
      );
    }

    // Apply date range filter if set
    if (filters.dateRange.start || filters.dateRange.end) {
      filtered = filtered.filter((apt) => {
        const aptDate = new Date(apt.date);

        if (filters.dateRange.start && filters.dateRange.end) {
          return (
            aptDate >= filters.dateRange.start &&
            aptDate <= filters.dateRange.end
          );
        } else if (filters.dateRange.start) {
          return aptDate >= filters.dateRange.start;
        } else if (filters.dateRange.end) {
          return aptDate <= filters.dateRange.end;
        }

        return true;
      });
    }

    // Apply search query if present
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (apt) =>
          apt.client_name.toLowerCase().includes(query) ||
          apt.service_name.toLowerCase().includes(query) ||
          (apt.service_provider &&
            apt.service_provider.toLowerCase().includes(query)) ||
          apt.date.toLowerCase().includes(query) ||
          apt.time.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [appointments, activeTab, filters, searchQuery]);

  // Paginate appointments
  const paginatedAppointments = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredAppointments.slice(startIndex, endIndex);
  }, [filteredAppointments, currentPage, itemsPerPage]);

  // Calculate total pages
  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(filteredAppointments.length / itemsPerPage));
  }, [filteredAppointments.length, itemsPerPage]);

  return {
    appointments,
    serviceProviders,
    tabOptions,
    viewOptions,
    filteredAppointments,
    paginatedAppointments,
    totalPages,
  };
};
