import { render, screen } from "@testing-library/react";
import RootLayout, { metadata } from "./layout";

jest.mock("./providers/providers", () => ({
  Providers: ({ children }: any) => <div data-testid="providers">{children}</div>,
}));

jest.mock("next/font/google", () => ({
  Montserrat: () => ({ className: "montserrat-font" }),
}));

describe("RootLayout", () => {
  const originalError = console.error;

  beforeAll(() => {
    jest.spyOn(console, "error").mockImplementation((...args) => {
      if (
        typeof args[0] === "string" &&
        args[0].includes("validateDOMNesting")
      ) {
        return;
      }
      originalError(...args);
    });
  });

  afterAll(() => {
    console.error = originalError;
  });

  it("renders children inside Providers", () => {
    render(
      <RootLayout>
        <div data-testid="child">Child</div>
      </RootLayout>
    );

    expect(screen.getByTestId("providers")).toBeInTheDocument();
    expect(screen.getByTestId("child")).toBeInTheDocument();
  });

  it("applies montserrat class to body", () => {
    const { container } = render(
      <RootLayout>
        <div>Test</div>
      </RootLayout>
    );

    const body = container.querySelector("body");
    expect(body).toHaveClass("montserrat-font");
  });

  it("has correct metadata", () => {
    expect(metadata.title).toBe("Dental Clinic Web System");
    expect(metadata.description).toBe(
      "An ERP system for controlling schedule, revenue, expenses, profits and month-end closing."
    );
  });
});