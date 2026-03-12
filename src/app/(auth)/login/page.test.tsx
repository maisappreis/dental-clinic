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

    const buttons = screen.getAllByRole("button", { name: "Entrar" });
    expect(buttons).toHaveLength(2);
  });

  it("logs in with real user and redirects on success", async () => {
    login.mockResolvedValue(true);

    render(<Login />);

    fireEvent.change(screen.getByLabelText("Username"), {
      target: { value: "admin" },
    });

    fireEvent.change(screen.getByLabelText("Senha"), {
      target: { value: "123456" },
    });

    const submitButton = screen.getAllByRole("button", { name: "Entrar" })[1];

    await waitFor(() => expect(submitButton).not.toBeDisabled());

    fireEvent.click(submitButton);

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

    const submitButton = screen.getAllByRole("button", { name: "Entrar" })[1];

    await waitFor(() => expect(submitButton).not.toBeDisabled());

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(login).toHaveBeenCalledWith({
        username: "admin",
        password: "123456",
      });
    });

    expect(push).not.toHaveBeenCalled();
  });

  it("logs in with demo user", async () => {
    login.mockResolvedValue(true);

    render(<Login />);

    const demoButton = screen.getAllByRole("button", { name: "Entrar" })[0];

    fireEvent.click(demoButton);

    await waitFor(() => {
      expect(login).toHaveBeenCalledWith({
        username: "demo",
        password: "demo123",
      });
    });

    expect(push).toHaveBeenCalledWith("/");
  });

  it("disables submit button when form is invalid", () => {
    render(<Login />);

    const submitButton = screen.getAllByRole("button", { name: "Entrar" })[1];

    expect(submitButton).toBeDisabled();
  });
});