import { apiSlice } from "../service/apiSlice";

const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation({
      query: ({ email, password }) => {
        return {
          url: "/users/",
          method: "POST",
          body: { email, password },
        };
      },
    }),

    activation: builder.mutation({
      query: ({ uid, token }) => {
        return {
          url: "/users/activation/",
          method: "POST",
          body: { uid, token },
        };
      },
    }),

    login: builder.mutation({
      query: ({ email, password }) => {
        return {
          url: "/jwt/create/",
          method: "POST",
          body: { email, password },
        };
      },
    }),
  }),
});

export const { useRegisterMutation, useActivationMutation, useLoginMutation } =
  authApiSlice;
