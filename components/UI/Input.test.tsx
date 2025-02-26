import { render, screen } from "@testing-library/react";
import user from "@testing-library/user-event";
import Input from "./Input";
import "@testing-library/jest-dom";

describe("Input Component", () => {
  test("renders input with the correct label", () => {
    render(
      <Input
        id="email"
        placeholder="Email"
        type="email"
        cn="custom-class"
        data-testid="input-element"
      />
    );

    // Check if the input is rendered with the correct label
    const inputElement = screen.getByTestId("input-element");
    expect(inputElement).toBeInTheDocument();
    expect(inputElement).toHaveAttribute("type", "email");

    // Check for the label text
    const labelElement = screen.getByText("Email");
    expect(labelElement).toBeInTheDocument();
    expect(labelElement).toHaveAttribute("for", "email");
  });

  test("applies additional class names and styles", () => {
    render(
      <Input
        id="password"
        placeholder="Password"
        type="password"
        cn="custom-class"
        data-testid="input-element"
      />
    );

    const inputElement = screen.getByTestId("input-element");
    expect(inputElement).toHaveClass("custom-class");
  });

  test("handles user input correctly", async () => {
    render(
      <Input
        id="username"
        placeholder="Username"
        type="text"
        data-testid="input-element"
      />
    );

    const inputElement = screen.getByTestId("input-element");

    // Simulate user typing into the input field
    await user.type(inputElement, "testuser");

    expect(inputElement).toHaveValue("testuser");
  });

  test("renders with default props if no additional props are provided", () => {
    render(<Input id="default" placeholder="Default Input" />);

    const inputElement = screen.getByLabelText("Default Input");
    expect(inputElement).toBeInTheDocument();
    expect(inputElement).toHaveAttribute("type", "text");
  });

  test("interacts with focus and peer styles", async () => {
    render(
      <Input
        id="email"
        placeholder="Email"
        type="email"
        data-testid="input-element"
      />
    );

    const inputElement = screen.getByTestId("input-element");
    const labelElement = screen.getByText("Email");

    // Initially, the label should be at the default position
    expect(labelElement).toHaveClass("peer-placeholder-shown:top-2");

    // Focus on the input
    await user.click(inputElement);

    // After focusing, the label should move
    expect(labelElement).toHaveClass(
      "peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-gray-700"
    );
  });
});
