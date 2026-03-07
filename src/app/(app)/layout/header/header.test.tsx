import { render, screen } from "@testing-library/react";
import { Header } from "./header";

jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
}));

jest.mock("@fortawesome/react-fontawesome", () => ({
  FontAwesomeIcon: () => <span data-testid="icon" />,
}));

jest.mock("@/constants/header", () => ({
  HEADER_CONFIG: {
    "/expenses": {
      title: "Despesas",
      subtitle: "Controle de despesas",
      icon: "icon",
    },
  },
}));

const { usePathname } = require("next/navigation");

describe("Header", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it("returns null when route has no config", () => {
    usePathname.mockReturnValue("/unknown");

    const { container } = render(<Header />);

    expect(container.firstChild).toBeNull();
  });

  it("renders header content", () => {
    usePathname.mockReturnValue("/expenses");

    render(<Header />);

    expect(screen.getByText("Despesas")).toBeInTheDocument();
    expect(screen.getByText("Controle de despesas")).toBeInTheDocument();
    expect(screen.getByTestId("icon")).toBeInTheDocument();
  });

  it("shows greeting when authenticated", () => {
    usePathname.mockReturnValue("/expenses");

    localStorage.setItem("accessToken", "token");

    render(<Header />);

    expect(screen.getByText("Olá, Dra Mirian")).toBeInTheDocument();
  });

  it("does not show greeting when not authenticated", () => {
    usePathname.mockReturnValue("/expenses");

    render(<Header />);

    expect(screen.queryByText("Olá, Dra Mirian")).not.toBeInTheDocument();
  });
});