import { render, screen } from "@testing-library/react";
import Home from "../pages/index";
import "@testing-library/jest-dom";

describe("Home", () => {
  it("renders a heading", () => {
    render(<Home />);
    const link = screen.getByText("Foo");
    expect(link).toBeInTheDocument();
  });
});
