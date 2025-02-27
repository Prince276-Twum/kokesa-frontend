import { render, screen } from "@testing-library/react";
import LoginPage from "./page";
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

    // Check for the presence of the heading
    const headings = screen.getAllByText("Sign In");
    expect(headings.length).toBeGreaterThan(0);

    // Check for the presence of the LoginForm component
    const emailInput = screen.getByLabelText("Enter Your Email");
    const passwordInput = screen.getByLabelText("Enter Your Password");
    const signInButtons = screen.getAllByText("Sign In");
    const signInButton = signInButtons.find(
      (button) => button.tagName === "BUTTON"
    );

    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(signInButton).toBeInTheDocument();
  });
});
