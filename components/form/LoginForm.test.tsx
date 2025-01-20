import React from "react";
import { render, screen } from "@testing-library/react";
import user from "@testing-library/user-event";
import LoginForm from "./LoginForm";
import "@testing-library/jest-dom";
import CustomProvider from "@/store/Provider";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn().mockReturnValue({
    route: "/",
    pathname: "",
    query: {},
    asPath: "",
  }),
}));

describe("LoginForm", () => {
  test("renders the form with all fields", () => {
    render(
      <CustomProvider>
        <LoginForm />
      </CustomProvider>
    );
    expect(screen.getByPlaceholderText("Enter Your Email")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Enter Your Password")
    ).toBeInTheDocument();
    expect(screen.getByText("Sign In")).toBeInTheDocument();
  });

  test("shows email error message on invalid email", async () => {
    render(
      <CustomProvider>
        <LoginForm />
      </CustomProvider>
    );
    const emailInput = screen.getByPlaceholderText("Enter Your Email");
    const submitButton = screen.getByText("Sign In");

    await user.click(emailInput);
    await user.type(emailInput, "invalid-email");
    await user.click(submitButton);

    const errorElement = screen.getByText(
      "Please enter a valid email address."
    );
    expect(errorElement).toBeInTheDocument();
  });

  test("shows password error message if empty", async () => {
    render(
      <CustomProvider>
        <LoginForm />
      </CustomProvider>
    );
    const submitButton = screen.getByText("Sign In");

    await user.click(submitButton);

    const errorElement = screen.getByText("please enter a valid password");
    expect(errorElement).toBeInTheDocument();
  });

  test("allows form submission with valid inputs", async () => {
    render(
      <CustomProvider>
        <LoginForm />
      </CustomProvider>
    );
    const emailInput = screen.getByPlaceholderText("Enter Your Email");
    const passwordInput = screen.getByPlaceholderText("Enter Your Password");
    const submitButton = screen.getByText("Sign In");

    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "ValidPassword12");
    await user.click(submitButton);

    expect(screen.queryByText("Invalid email address")).not.toBeInTheDocument();
    expect(
      screen.queryByText("please enter a valid password")
    ).not.toBeInTheDocument();
  });
});
