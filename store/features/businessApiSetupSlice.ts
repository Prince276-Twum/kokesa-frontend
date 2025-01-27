import { apiSlice } from "../service/apiSlice";

export interface BusinessResponse {
  business_name: string;
  business_type: string;
  is_business_complete: boolean;
  current_step: number;
  created_at: string;
}

const businessApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getBusiness: builder.query<BusinessResponse, void>({
      query: () => ({
        url: "/business/me",
        method: "GET",
      }),
    }),
  }),
});

export const { useGetBusinessQuery } = businessApiSlice;
