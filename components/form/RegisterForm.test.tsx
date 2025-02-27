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
    push: jest.fn(),
  }),
}));

describe("RegisterForm", () => {
  test("renders the form with all fields", () => {
    render(
      <CustomProvider>
        <RegisterForm />
      </CustomProvider>
    );
    expect(screen.getByLabelText("Email address")).toBeInTheDocument();
    expect(screen.getByLabelText("Create password")).toBeInTheDocument();
    expect(
      screen.getByLabelText(
        "I agree to the Terms of Service and Privacy Policy"
      )
    ).toBeInTheDocument();
    expect(screen.getByText("Create Account")).toBeInTheDocument();
  });

  test("shows email error message on invalid email", async () => {
    render(
      <CustomProvider>
        <RegisterForm />
      </CustomProvider>
    );
    const emailInput = screen.getByLabelText("Email address");
    const submitButton = screen.getByText("Create Account");

    await user.click(emailInput);
    await user.type(emailInput, "invalid-email");
    await user.click(submitButton);

    const errorElement = await screen.findByText((content) =>
      content.includes("Please enter a valid email address.")
    );
    expect(errorElement).toBeInTheDocument();
  });

  test("shows password feedback messages on typing", async () => {
    render(
      <CustomProvider>
        <RegisterForm />
      </CustomProvider>
    );
    const passwordInput = screen.getByLabelText("Create password");

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
    const submitButton = screen.getByText("Create Account");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText("Please accept the terms and conditions to continue")
      ).toBeInTheDocument();
    });
  });

  test("allows toggling password visibility", async () => {
    render(
      <CustomProvider>
        <RegisterForm />
      </CustomProvider>
    );

    const passwordInput = screen.getByLabelText("Create password");
    expect(passwordInput).toHaveAttribute("type", "password");

    const toggleButton = screen.getByLabelText("Show password");

    await user.click(toggleButton);
    expect(passwordInput).toHaveAttribute("type", "text");

    await user.click(toggleButton);
    expect(passwordInput).toHaveAttribute("type", "password");
  });

  test("submits the form successfully with valid inputs", async () => {
    render(
      <CustomProvider>
        <RegisterForm />
      </CustomProvider>
    );
    const emailInput = screen.getByLabelText("Email address");
    const passwordInput = screen.getByLabelText("Create password");
    const termsCheckbox = screen.getByLabelText(
      "I agree to the Terms of Service and Privacy Policy"
    );
    const submitButton = screen.getByText("Create Account");

    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "ValidPassword12!");
    await user.click(termsCheckbox);
    await user.click(submitButton);

    await waitFor(() => {
      expect(
        screen.queryByText("Invalid email address")
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText("Password must be at least 8 characters long")
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText("Please accept the terms and conditions to continue")
      ).not.toBeInTheDocument();
    });
  });

  test("handles Google sign-up button click", async () => {
    render(
      <CustomProvider>
        <RegisterForm />
      </CustomProvider>
    );

    const googleButton = screen.getByText("Continue with Google");
    await user.click(googleButton);

    // This just verifies the button is clickable
    expect(googleButton).toBeInTheDocument();
  });
});
