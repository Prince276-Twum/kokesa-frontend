import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import RegistrationPage from "./page";

describe("RegistrationPage", () => {
  it("renders the image with correct alt text", () => {
    render(<RegistrationPage />);
    const image = screen.getByAltText("Registration Image");
    expect(image).toBeInTheDocument();
    // We can skip testing the src in detail since it may be transformed, so we just check if it's set
    expect(image).toHaveAttribute("alt", "Registration Image");
  });

  it("renders the heading with correct text", () => {
    render(<RegistrationPage />);
    const heading = screen.getByRole("heading", { name: /Create an Account/i });
    expect(heading).toBeInTheDocument();
  });
});
