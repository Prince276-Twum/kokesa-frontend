import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import RegistrationPage from "./page";
import CustomProvider from "@/store/Provider";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn().mockReturnValue({
    route: "/",
    pathname: "",
    query: {},
    asPath: "",
  }),
}));

describe("RegistrationPage", () => {
  it("renders the image with correct alt text", () => {
    render(
      <CustomProvider>
        <RegistrationPage />
      </CustomProvider>
    );
    const image = screen.getByAltText("Registration Image");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("alt", "Registration Image");
  });

  it("renders the heading with correct text", () => {
    render(
      <CustomProvider>
        <RegistrationPage />
      </CustomProvider>
    );
    const heading = screen.getByRole("heading", { name: /Create an Account/i });
    expect(heading).toBeInTheDocument();
  });
});
