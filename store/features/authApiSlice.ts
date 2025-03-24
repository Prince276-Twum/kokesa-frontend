import { verify } from "crypto";
import { apiSlice } from "../service/apiSlice";

interface User {
  email: string;
}

interface GoogelAuthArgs {
  state: string;
  code: string;
}

interface CreateUserResponse {
  success: boolean;
  user: User;
}

const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation({
      query: ({ email, password }) => {
        return {
          url: "/users/",
          method: "POST",
          body: { email, password, user_type: "business" },
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

    googleAuth: builder.mutation<CreateUserResponse, GoogelAuthArgs>({
      query: ({ state, code }) => {
        return {
          url: `/o/google-oauth2/?state=${encodeURIComponent(
            state
          )}&code=${encodeURIComponent(code)}`,
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/x-www-form-urlencoded",
          },
        };
      },
    }),

    refresh: builder.mutation({
      query: () => {
        return {
          url: "/jwt/refresh/",
          method: "POST",
        };
      },
    }),

    verify: builder.mutation({
      query: () => {
        return {
          url: "/jwt/verify/",
          method: "POST",
        };
      },
    }),
  }),
});

export const {
  useRegisterMutation,
  useActivationMutation,
  useLoginMutation,
  useGoogleAuthMutation,
  useVerifyMutation,
  useRefreshMutation,
} = authApiSlice;
