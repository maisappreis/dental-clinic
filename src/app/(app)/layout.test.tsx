import { render, screen } from "@testing-library/react";
import AppLayout from "./layout";

jest.mock("@/app/(app)/layout/header/header", () => ({
  Header: () => <div data-testid="header">Header</div>,
}));

jest.mock("@/app/(app)/layout/sidebar/sidebar", () => ({
  Sidebar: () => <div data-testid="sidebar">Sidebar</div>,
}));

describe("AppLayout", () => {
  it("renders sidebar, header and children", () => {
    render(
      <AppLayout>
        <div data-testid="child">Child</div>
      </AppLayout>
    );

    expect(screen.getByTestId("sidebar")).toBeInTheDocument();
    expect(screen.getByTestId("header")).toBeInTheDocument();
    expect(screen.getByTestId("child")).toBeInTheDocument();
  });
});