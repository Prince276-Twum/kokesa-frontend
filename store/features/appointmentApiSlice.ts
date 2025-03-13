import { apiSlice } from "../service/apiSlice";

const appointmentApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => {
    return {
      getUpcomingAppointments: builder.query({
        query: () => {
          // Detect the user's timezone
          const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

          return {
            url: "/apointments/upcoming/",
            method: "GET",
            // Send the timezone as a query parameter
            params: {
              timezone: userTimezone,
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
    };
  },
});

export const {
  useLazyGetCancelledAppointmentsQuery,
  useLazyGetPastAppointmentsQuery,
  useLazyGetUpcomingAppointmentsQuery,
} = appointmentApiSlice;
