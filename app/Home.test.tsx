import { render, screen } from "@testing-library/react";
import Home from "./page";
import "@testing-library/jest-dom";

test("Show the home page", () => {
  render(<Home />);

  const heading = screen.getByRole("heading");
  expect(heading).toBeInTheDocument();
});
