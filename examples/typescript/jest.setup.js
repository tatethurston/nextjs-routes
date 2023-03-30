import "@testing-library/jest-dom/extend-expect";
// https://github.com/vercel/next.js/issues/43769
import { createContext } from "react";
import fetchMock from "jest-fetch-mock";

jest.mock("next/dist/shared/lib/router-context.js", () => ({
  RouterContext: createContext(true),
}));

fetchMock.enableMocks();
