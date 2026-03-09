import { render, screen, fireEvent } from "@testing-library/react";
import { Sidebar } from "./sidebar";

/* eslint-disable react/display-name */
jest.mock("next/link", () => {
  return ({ children, href }: any) => (
    <a href={href}>{children}</a>
  );
});

const pushMock = jest.fn();

jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
  useRouter: () => ({
    push: pushMock,
  }),
}));

jest.mock("../logotype/logotype", () => ({
  Logotype: () => <div data-testid="logo" />,
}));

jest.mock("@fortawesome/react-fontawesome", () => ({
  FontAwesomeIcon: () => <span data-testid="icon" />,
}));

const { usePathname } = require("next/navigation");

describe("Sidebar", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it("renders sidebar options", () => {
    usePathname.mockReturnValue("/calendar");

    render(<Sidebar />);

    expect(screen.getByText("Agenda")).toBeInTheDocument();
    expect(screen.getByText("Métricas")).toBeInTheDocument();
    expect(screen.getByText("Receitas")).toBeInTheDocument();
    expect(screen.getByText("Despesas")).toBeInTheDocument();
    expect(screen.getByText("Caixa Mensal")).toBeInTheDocument();
  });

  it("shows login button when not authenticated", () => {
    usePathname.mockReturnValue("/calendar");

    render(<Sidebar />);

    expect(screen.getByText("Login")).toBeInTheDocument();
  });

  it("shows logout button when authenticated", () => {
    usePathname.mockReturnValue("/calendar");

    localStorage.setItem("accessToken", "token");

    render(<Sidebar />);

    expect(screen.getByText("Logout")).toBeInTheDocument();
  });

  it("redirects to login when login clicked", () => {
    usePathname.mockReturnValue("/calendar");

    render(<Sidebar />);

    fireEvent.click(screen.getByText("Login"));

    expect(pushMock).toHaveBeenCalledWith("/login");
  });

  it("logs out user", () => {
    usePathname.mockReturnValue("/calendar");

    localStorage.setItem("accessToken", "token");
    localStorage.setItem("refreshToken", "token");

    delete (window as any).location;
    (window as any).location = { reload: jest.fn() };

    render(<Sidebar />);

    fireEvent.click(screen.getByText("Logout"));

    expect(localStorage.getItem("accessToken")).toBeNull();
    expect(localStorage.getItem("refreshToken")).toBeNull();
  });
});