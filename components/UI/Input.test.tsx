import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import Input from "./Input";

describe("Input Component", () => {
  it("renders the input element with the correct props", () => {
    const id = "test-input";
    const placeholder = "Enter text";
    const type = "text";
    const label = "Test Label";

    render(
      <Input id={id} placeholder={placeholder} type={type}>
        {label}
      </Input>
    );

    // Check if the label is rendered with the correct text
    expect(screen.getByText(label)).toBeInTheDocument();

    // Check if the input element is rendered
    const input = screen.getByPlaceholderText(placeholder);
    expect(input).toBeInTheDocument();

    // Check if the input has the correct id and type
    expect(input).toHaveAttribute("id", id);
    expect(input).toHaveAttribute("type", type);
  });

  it("applies additional props to the input element", async () => {
    const id = "test-input";
    const placeholder = "Enter text";
    const type = "text";
    const onChange = jest.fn();

    render(
      <Input id={id} placeholder={placeholder} type={type} onChange={onChange}>
        Test Label
      </Input>
    );

    const input = screen.getByPlaceholderText(placeholder);

    await userEvent.type(input, "Hello");

    // Ensure the onChange handler is called
    expect(onChange).toHaveBeenCalled();
    expect(onChange).toHaveBeenCalledTimes(5); // "Hello" = 5 calls
  });

  it("renders with the correct styles", () => {
    const id = "test-input";
    const placeholder = "Enter text";
    const type = "text";

    render(
      <Input id={id} placeholder={placeholder} type={type}>
        Test Label
      </Input>
    );

    const input = screen.getByPlaceholderText(placeholder);

    // Check if the input has the correct class name
    expect(input).toHaveClass(
      "border-2 border-neutral-formBorder px-4 py-3 md:py-3 w-full rounded-md focus:outline-none"
    );
  });
});
