import { Usable } from "react";
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

type SetupBusinessRequestBody =
  | {
      currentStep: 1;
      businessName: string;
      userName: string;
      phoneNumber: string | undefined;
    }
  | {
      currentStep: 2;
      businessCategory: string;
    }
  | {
      currentStep: 3;
      serviceLocation: string;
    }
  | {
      currentStep: 4;
      services: string[];
    };

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

    setupBusiness: builder.mutation<any, SetupBusinessRequestBody>({
      query: ({ currentStep, ...data }) => {
        let body: Record<string, any> = {
          currentStep,
          ...data,
        };

        switch (currentStep) {
          case 1:
            body = {
              current_step: currentStep,
              business_name: body.businessName,
              user_name: body.userName,
              phone_number: body.phoneNumber,
            };
            break;
          case 2:
            body = {
              current_step: currentStep,
              business_type: body.businessCategory,
            };
            break;
          case 3:
            body = {
              current_step: currentStep,
              service_location: body.serviceLocation,
            };
            break;
          case 4:
            body = {
              services: body.services,
            };
            break;
          default:
            throw new Error("Invalid currentStep");
        }

        return {
          url: "/business/setup_detail/",
          method: "POST",
          body: body,
        };
      },
    }),
  }),
});

export const {
  useGetBusinessQuery,
  useGetBusinessDetailQuery,
  useSetupBusinessMutation,
} = businessApiSlice;
