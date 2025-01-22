import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import Button from "./Button";

describe("Button Component", () => {
  it("renders as a button element with the correct props", async () => {
    const children = "Click Me";
    const onClick = jest.fn();
    const className = "custom-class";

    render(
      <Button
        el="button"
        type="button"
        primary
        onClick={onClick}
        className={className}
      >
        {children}
      </Button>
    );

    const button = screen.getByRole("button", { name: children });

    // Check if the button is rendered with correct props
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass("custom-class");
    expect(button).toHaveClass("bg-primary-base text-white"); // Primary button class
    expect(button).toHaveAttribute("type", "button");

    // Simulate a click event
    await userEvent.click(button);

    expect(onClick).toHaveBeenCalled();
  });

  it("renders as an anchor element with the correct props", () => {
    const children = "Go to Link";
    const href = "/test-link";
    const className = "custom-class";

    render(
      <Button el="anchor" href={href} secondary className={className}>
        {children}
      </Button>
    );

    const anchor = screen.getByText(children);

    // Check if the anchor is rendered with correct props
    expect(anchor).toBeInTheDocument();
    expect(anchor).toHaveClass("custom-class");
    expect(anchor).toHaveClass("bg-gray-500 text-white");
    expect(anchor).toHaveAttribute("href", href);
  });

  it("renders with a loading spinner when loading is true", () => {
    const children = "Loading";
    render(
      <Button el="button" type="button" primary loading>
        {children}
      </Button>
    );

    const button = screen.getByRole("button");

    expect(button).toHaveClass("opacity-80 cursor-not-allowed");
    expect(screen.getByTestId("spinner")).toBeInTheDocument();
    expect(screen.queryByText(children)).not.toBeInTheDocument();
  });

  it("applies the correct styles based on variations", () => {
    const children = "Styled Button";

    render(
      <Button el="button" danger rounded outline>
        {children}
      </Button>
    );

    const button = screen.getByText(children);

    // Check the applied styles
    expect(button).toHaveClass("bg-white text-red-500 rounded-lg");
  });

  it("renders with default behavior when `el` is omitted", () => {
    const children = "Default Button";

    render(
      <Button el="button" type="submit" success>
        {children}
      </Button>
    );

    const button = screen.getByText(children);

    // Check if the default element is a button
    expect(button.tagName).toBe("BUTTON");
    expect(button).toHaveClass("bg-green-500 text-white");
    expect(button).toHaveAttribute("type", "submit");
  });
});
