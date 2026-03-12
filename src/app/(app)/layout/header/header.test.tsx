import { render, screen } from "@testing-library/react";
import { Header } from "./header";

jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
}));

jest.mock("@/stores/user.store", () => ({
  useUserStore: jest.fn(),
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
const { useUserStore } = require("@/stores/user.store");

describe("Header", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns null when route has no config", () => {
    usePathname.mockReturnValue("/unknown");

    const { container } = render(<Header />);

    expect(container.firstChild).toBeNull();
  });

  it("renders header content", () => {
    usePathname.mockReturnValue("/expenses");

    useUserStore.mockImplementation((selector: any) =>
      selector({ user: null })
    );

    render(<Header />);

    expect(screen.getByText("Despesas")).toBeInTheDocument();
    expect(screen.getByText("Controle de despesas")).toBeInTheDocument();
    expect(screen.getByTestId("icon")).toBeInTheDocument();
  });

  it("shows greeting when authenticated", () => {
    usePathname.mockReturnValue("/expenses");

    useUserStore.mockImplementation((selector: any) =>
      selector({
        user: { first_name: "João" },
      })
    );

    render(<Header />);

    expect(screen.getByText(/Olá, João/i)).toBeInTheDocument();
  });
});