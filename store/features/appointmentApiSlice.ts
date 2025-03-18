import { apiSlice } from "../service/apiSlice";
import {
  TodayAppointmentType,
  UpcomingAppointmentType,
} from "./appointmentsTypes";

interface Appointment {
  id: number;
  start_time: string;
  end_time: string;
  local_start_time?: string;
  local_end_time?: string;
  duration_minutes: number;
  service_name: string;
  client_name?: string;
  client_email?: string;
  status: string;
  notes: string;
  price: number;
  payment_status: string;
  service_provider: string;
  location: string;
  client_avatar: string;
  minutes_until_appointment?: number;
  time_until_formatted?: string;
  hours_until?: number;
  remaining_minutes?: number;
  intended_start_time?: string;
  intended_end_time?: string;
  local_timezone?: string;
  intended_timezone?: string;
  timezone?: string;
}

interface PaginationMetadata {
  count: number;
  //   totalPages: number;
  //   currentPage: number;
  //   next: string | null;
  //   previous: string | null;
  //
}

interface TodayMetadata {
  today_date: string;
  timezone: string;
  current_time: string;
}

interface UpcomingAppointmentResponse {
  results: UpcomingAppointmentType[];
  count: number;
  timezone?: string;
}

interface TodayAppointmentsResponse {
  results: TodayAppointmentType[];
  count: number;
  timezone?: string;
}

interface AppointmentParams {
  timezone?: string;
  page?: number;
  page_size?: number;
}

const appointmentApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => {
    return {
      getUpcomingAppointments: builder.query<
        UpcomingAppointmentResponse,
        AppointmentParams | void
      >({
        query: (params) => {
          const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
          return {
            url: "/apointments/upcoming/",
            method: "GET",

            params: {
              timezone: userTimezone,
              page: params?.page || 1,
              page_size: params?.page_size || 10,
            },
          };
        },
        // Transform the response to format dates and times for display
        // transformResponse: (response) => {
        //   if (Array.isArray(response)) {
        //     return response.map((appointment) => {
        //       // Format the times using our formatter utility
        //       const formattedTime = formatBackendTime(appointment);

        //       // Return the appointment with additional formatted properties
        //       return {
        //         ...appointment,
        //         formattedDate: formattedTime.date,
        //         formattedTime: formattedTime.time,
        //         userTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        //       };
        //     });
        //   }
        //   return response;
        // },
      }),

      getPastAppointments: builder.query({
        query: () => {
          return {
            url: "/appointments/past/",
            method: "GET",
          };
        },
      }),

      getCancelledAppointments: builder.query({
        query: () => {
          return {
            url: "/appointments/cancelled/",
            method: "GET",
          };
        },
      }),

      getTodayAppointments: builder.query<
        TodayAppointmentsResponse,
        AppointmentParams | void
      >({
        query: () => {
          const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
          return {
            url: "/apointments/today_appointments/",
            method: "GET",
            params: {
              timezone: userTimezone,
            },
          };
        },
      }),
    };
  },
});

export const {
  useLazyGetCancelledAppointmentsQuery,
  useLazyGetPastAppointmentsQuery,
  useLazyGetUpcomingAppointmentsQuery,
  useGetUpcomingAppointmentsQuery,
  useGetTodayAppointmentsQuery,
} = appointmentApiSlice;
