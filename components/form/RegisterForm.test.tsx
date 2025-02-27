import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import user from "@testing-library/user-event";
import RegisterForm from "./RegisterForm";
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

describe("RegisterForm", () => {
  test("renders the form with all fields", () => {
    render(
      <CustomProvider>
        <RegisterForm />
      </CustomProvider>
    );
    expect(screen.getByLabelText("Enter Your Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Enter Your Password")).toBeInTheDocument();
    expect(
      screen.getByLabelText("I agree to the terms and conditions")
    ).toBeInTheDocument();
    expect(screen.getByText("Create An Account")).toBeInTheDocument();
  });

  test("shows email error message on invalid email", async () => {
    render(
      <CustomProvider>
        <RegisterForm />
      </CustomProvider>
    );
    const emailInput = screen.getByLabelText("Enter Your Email");
    const submitButton = screen.getByText("Create An Account");

    await user.click(emailInput);
    await user.type(emailInput, "invalid-email");
    await user.click(submitButton);

    const errorElement = screen.getByText(
      "Please enter a valid email address."
    );
    expect(errorElement).toBeInTheDocument();
  });

  test("shows password feedback messages on typing", async () => {
    render(
      <CustomProvider>
        <RegisterForm />
      </CustomProvider>
    );
    const passwordInput = screen.getByLabelText("Enter Your Password");

    await user.type(passwordInput, "short");

    await waitFor(() => {
      expect(screen.getByText("At least 8 characters.")).toBeInTheDocument();
      expect(
        screen.getByText("At least one uppercase letter.")
      ).toBeInTheDocument();
      expect(
        screen.getByText("At least one lowercase letter.")
      ).toBeInTheDocument();
      expect(screen.getByText("At least one number.")).toBeInTheDocument();
      expect(
        screen.getByText("At least one special character.")
      ).toBeInTheDocument();
    });
  });

  test("shows terms error message if not accepted", async () => {
    render(
      <CustomProvider>
        <RegisterForm />
      </CustomProvider>
    );
    const submitButton = screen.getByText("Create An Account");
    fireEvent.click(submitButton);

    expect(
      screen.getByText("You must agree to the terms and conditions.")
    ).toBeInTheDocument();
  });

  test("submits the form successfully with valid inputs", async () => {
    render(
      <CustomProvider>
        <RegisterForm />
      </CustomProvider>
    );
    const emailInput = screen.getByLabelText("Enter Your Email");
    const passwordInput = screen.getByLabelText("Enter Your Password");
    const termsCheckbox = screen.getByLabelText(
      "I agree to the terms and conditions"
    );
    const submitButton = screen.getByText("Create An Account");

    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "ValidPassword12");
    await user.click(termsCheckbox);
    await user.click(submitButton);

    expect(screen.queryByText("Invalid email address")).not.toBeInTheDocument();
    expect(
      screen.queryByText("Password must be at least 8 characters long")
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(
        "You must agree to the terms and conditions before submitting."
      )
    ).not.toBeInTheDocument();
  });
});
