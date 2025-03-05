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
  business_address: [
    {
      street_address: string;
      city: string;
      state_or_region: string;
      postal_code: string;
      country: string;
      latitude: string;
      longitude: string;
    }
  ];
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
      query: ({ distance, travelFee, currencyCode, travelPolicy, feeType }) => {
        console.log(distance, travelFee, travelPolicy, currencyCode, feeType);
        return {
          url: "/business-travel/",
          method: "POST",
          body: {
            travel_distance: distance,
            travel_fee: travelFee,
            currency: currencyCode,
            travel_policy: travelPolicy,
            fee_type: feeType,
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

    RetrieveBusinessWorkingHours: builder.query({
      query: () => {
        return {
          url: "/business-hours/",
          method: "GET",
        };
      },
    }),

    addAdditionalInformation: builder.mutation({
      query: ({ teamSize, activationDate, activationOption, isLaunched }) => {
        console.log(teamSize, activationDate, activationOption);
        return {
          url: "/additional-info/",
          method: "POST",
          body: {
            team_size: teamSize,
            activation_date: activationDate,
            activation_option: activationOption,
            is_launched: isLaunched,
          },
        };
      },
    }),

    retrieveAdditionalInfo: builder.query({
      query: () => {
        return {
          url: "/additional-info/",
          method: "GET",
        };
      },
    }),

    retrieveTravelAndDistance: builder.query({
      query: () => {
        return {
          url: "/business-travel/",
          method: "GET",
        };
      },
    }),

    saveBusinessService: builder.mutation({
      query: (data) => ({
        url: "/business-service/",
        method: "POST",
        body: data,
      }),
    }),

    retrieveService: builder.query({
      query: () => {
        return {
          url: "/business-service/",
          method: "GET",
        };
      },
    }),

    updateService: builder.mutation({
      query: ({ id, ...data }) => {
        return {
          url: `/business-service/${id}/`,
          method: "PUT",
          body: data,
        };
      },
    }),

    deleteService: builder.mutation({
      query: (id) => {
        return {
          url: `/business-service/${id}/`,
          method: "DELETE",
        };
      },
    }),
    saveBusinessGoals: builder.mutation({
      query: (data) => ({
        url: "/business-goals/",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useRetrieveBusinessQuery,
  useSetupBusinessMutation,
  useAddBusinessAddressMutation,
  useAddTravelInfoMutation,
  useAddBusinessWorkingHoursMutation,
  useAddAdditionalInformationMutation,
  useSaveBusinessGoalsMutation,
  useRetrieveAdditionalInfoQuery,
  useRetrieveTravelAndDistanceQuery,
  useSaveBusinessServiceMutation,
  useRetrieveServiceQuery,
  useUpdateServiceMutation,
  useDeleteServiceMutation,
  useRetrieveBusinessWorkingHoursQuery,
} = businessApiSlice;
