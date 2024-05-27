import { render, screen } from "@testing-library/react";
import Home from "../pages";

(global.fetch as any) = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve(JSON.stringify({ name: "Tate" })),
  }),
);

describe("Home", () => {
  it("renders a Link", () => {
    render(<Home />);
    const link = screen.getByText("Foo");
    // @ts-expect-error: https://github.com/testing-library/jest-dom/issues/546
    expect(link).toBeInTheDocument();
  });
});
