import { Usable } from "react";
import { apiSlice } from "../service/apiSlice";

export interface BusinessResponse {
  business_name: string;
  business_type: string;
  is_business_complete: boolean;
  current_step: number;
  created_at: string;
  service_location: string;
  user_name: string;
  phone_number: string;
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
    retrieveBusiness: builder.query<BusinessResponse[], void>({
      query: () => ({
        url: "/business/",
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
          url: "/business/",
          method: "POST",
          body: body,
        };
      },
    }),

    addBusinessAddress: builder.mutation({
      query: ({
        address,
        city,
        state,
        country,
        postalCode,
        latitude,
        longitude,
      }) => {
        return {
          url: "/business-address/",
          method: "POST",
          body: {
            street_address: address,
            city: city,
            state_or_region: state,
            country: country,
            postal_code: postalCode,
            latitude: latitude,
            longitude: longitude,
          },
        };
      },
    }),

    addTravelInfo: builder.mutation({
      query: ({ distance, travelFee, currencyCode }) => {
        return {
          url: "/business-travel/",
          method: "POST",
          body: {
            travel_distance: distance,
            travel_fee: travelFee,
            currency: currencyCode,
          },
        };
      },
    }),

    addBusinessWorkingHours: builder.mutation({
      query: ({ workingDays }) => {
        return {
          url: "/business-hours/",
          method: "POST",
          body: {
            working_hours: workingDays,
          },
        };
      },
    }),
  }),
});

export const {
  useRetrieveBusinessQuery,
  useSetupBusinessMutation,
  useAddBusinessAddressMutation,
  useAddTravelInfoMutation,
  useAddBusinessWorkingHoursMutation,
} = businessApiSlice;
