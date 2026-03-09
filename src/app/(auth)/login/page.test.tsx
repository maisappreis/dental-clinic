import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Login from "./page";
import { useRouter } from "next/navigation";
import { useLogin } from "@/hooks/useLogin";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/hooks/useLogin");

describe("Login", () => {
  const push = jest.fn();
  const login = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (useRouter as jest.Mock).mockReturnValue({ push });
    (useLogin as jest.Mock).mockReturnValue({ login });
  });

  it("renders login form", () => {
    render(<Login />);

    expect(screen.getByLabelText("Username")).toBeInTheDocument();
    expect(screen.getByLabelText("Senha")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Entrar" })).toBeInTheDocument();
  });

  it("submits form and redirects on success", async () => {
    login.mockResolvedValue(true);

    render(<Login />);

    fireEvent.change(screen.getByLabelText("Username"), {
      target: { value: "admin" },
    });

    fireEvent.change(screen.getByLabelText("Senha"), {
      target: { value: "123456" },
    });

    const form = screen.getByRole("button", { name: "Entrar" }).closest("form")!;

    fireEvent.submit(form);

    await waitFor(() => {
      expect(login).toHaveBeenCalledWith({
        username: "admin",
        password: "123456",
      });
    });

    expect(push).toHaveBeenCalledWith("/");
  });

  it("does not redirect if login fails", async () => {
    login.mockResolvedValue(false);

    render(<Login />);

    fireEvent.change(screen.getByLabelText("Username"), {
      target: { value: "admin" },
    });

    fireEvent.change(screen.getByLabelText("Senha"), {
      target: { value: "123456" },
    });

    const form = screen.getByRole("button", { name: "Entrar" }).closest("form")!;

    fireEvent.submit(form);

    await waitFor(() => {
      expect(login).toHaveBeenCalled();
    });

    expect(push).not.toHaveBeenCalled();
  });
});