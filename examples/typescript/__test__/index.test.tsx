import { render, screen } from "@testing-library/react";
import Home from "../pages";

(global.fetch as any) = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve(JSON.stringify({ name: "Tate" })),
  })
);

describe("Home", () => {
  it("renders a Link", () => {
    render(<Home />);
    const link = screen.getByText("Foo");
    expect(link).toBeInTheDocument();
  });
});
