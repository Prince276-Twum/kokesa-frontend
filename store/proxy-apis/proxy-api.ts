import { apiSlice } from "../service/apiSlice";

const proxyApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    geocode: builder.query<any, string>({
      query: (query) => ({
        url: `/geocode/`,
        params: { q: query },
        method: "GET",
      }),
    }),
    reverseGeocode: builder.query<
      any,
      { latitude: number | null; longitude: number | null }
    >({
      query: ({ latitude, longitude }) => ({
        url: `/reverse-geocode/`,
        params: { latitude, longitude },
        method: "GET",
      }),
    }),
  }),
});

export const { useGeocodeQuery, useReverseGeocodeQuery } = proxyApi;
