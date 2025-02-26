import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Button from "./Button";

describe("Button", () => {
  it("renders the button with children", () => {
    render(
      <Button el="button" primary>
        Click Me
      </Button>
    );
    const button = screen.getByRole("button", { name: /Click Me/i });
    expect(button).toBeInTheDocument();
  });

  it("renders the loading spinner when loading is true", () => {
    render(
      <Button el="button" loading warning>
        Click Me
      </Button>
    );
    const spinner = screen.getByTestId("spinner");
    expect(spinner).toHaveClass("animate-spin");
  });

  it("applies the correct classes based on props", () => {
    render(
      <Button el="button" primary>
        Primary Button
      </Button>
    );
    const button = screen.getByRole("button", { name: /Primary Button/i });
    expect(button).toHaveClass("bg-primary text-white");

    render(
      <Button el="button" secondary>
        Secondary Button
      </Button>
    );
    const buttonSecondary = screen.getByRole("button", {
      name: /Secondary Button/i,
    });
    expect(buttonSecondary).toHaveClass("bg-gray-500 text-white");

    render(
      <Button el="button" success>
        Success Button
      </Button>
    );
    const buttonSuccess = screen.getByRole("button", {
      name: /Success Button/i,
    });
    expect(buttonSuccess).toHaveClass("bg-green-500 text-white");

    render(
      <Button el="button" danger>
        Danger Button
      </Button>
    );
    const buttonDanger = screen.getByRole("button", { name: /Danger Button/i });
    expect(buttonDanger).toHaveClass("bg-red-500 text-white");

    render(
      <Button el="button" warning>
        Warning Button
      </Button>
    );
    const buttonWarning = screen.getByRole("button", {
      name: /Warning Button/i,
    });
    expect(buttonWarning).toHaveClass("bg-yellow-400 text-white");

    render(
      <Button el="button" rounded warning>
        Rounded Button
      </Button>
    );
    const buttonRounded = screen.getByRole("button", {
      name: /Rounded Button/i,
    });
    expect(buttonRounded).toHaveClass("rounded-[80px] text-white");

    render(
      <Button el="button" outline primary>
        Outlined Primary Button
      </Button>
    );
    const buttonOutlinedPrimary = screen.getByRole("button", {
      name: /Outlined Primary Button/i,
    });
    expect(buttonOutlinedPrimary).toHaveClass("bg-white text-primary");
  });
});
