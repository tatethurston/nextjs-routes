import { render, screen } from "@testing-library/react";
import Home from ".";
import fetchMock from "jest-fetch-mock";

describe("Home", () => {
  beforeEach(() => {
    fetchMock.mockResponseOnce(JSON.stringify({ name: "Tate" }));
  });

  it("renders a Link", () => {
    render(<Home />);
    const link = screen.getByText("Foo");
    expect(link).toBeInTheDocument();
  });
});
