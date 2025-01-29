import { apiSlice } from "../service/apiSlice";

export interface BusinessResponse {
  business_name: string;
  business_type: string;
  is_business_complete: boolean;
  current_step: number;
  created_at: string;
}

interface BusinessDetailResponse {
  businessName: string;
  userName: string;
  phoneNumber: string;
}

const businessApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getBusiness: builder.query<BusinessResponse, void>({
      query: () => ({
        url: "/business/me",
        method: "GET",
      }),
    }),

    getBusinessDetail: builder.query<any, void>({
      query: () => ({
        url: "/business/setup_detail/",
        method: "GET",
      }),
    }),

    setBusinessDetail: builder.mutation({
      query: ({ businessName, userName, phoneNumber, currentStep }) => {
        return {
          url: "/business/setup_detail/",
          method: "POST",
          body: {
            business_name: businessName,
            user_name: userName,
            phone_number: phoneNumber,
            current_step: currentStep,
          },
        };
      },
    }),
  }),
});

export const {
  useGetBusinessQuery,
  useGetBusinessDetailQuery,
  useSetBusinessDetailMutation,
} = businessApiSlice;
