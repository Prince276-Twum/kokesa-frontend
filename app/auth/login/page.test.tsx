import { render, screen } from "@testing-library/react";
import LoginPage from "./page";
import "@testing-library/jest-dom";
import CustomProvider from "@/store/Provider";

describe("LoginPage", () => {
  it("renders the login page with all elements", () => {
    render(
      <CustomProvider>
        <LoginPage />
      </CustomProvider>
    );

    // Check for the presence of the image
    const image = screen.getByAltText(
      "a 3D rendering of an abstract sculpture"
    );
    expect(image).toBeInTheDocument();

    // Check for the presence of the logo
    const logo = screen.getByAltText("kokesa logo");
    expect(logo).toBeInTheDocument();

    // Check for the presence of the heading
    const headings = screen.getAllByText("Sign In");
    expect(headings.length).toBeGreaterThan(0);

    // Check for the presence of the LoginForm component
    const emailInput = screen.getByPlaceholderText("Enter Your Email");
    const passwordInput = screen.getByPlaceholderText("Enter Your Password");
    const signInButtons = screen.getAllByText("Sign In");
    const signInButton = signInButtons.find(
      (button) => button.tagName === "BUTTON"
    );

    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(signInButton).toBeInTheDocument();
  });
});
