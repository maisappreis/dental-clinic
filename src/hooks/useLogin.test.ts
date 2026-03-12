import { renderHook, act } from "@testing-library/react";
import { useLogin } from "./useLogin";
import { LoginService } from "@/services/login.service";
import { useLoadingStore } from "@/stores/loading.store";
import { useAlertStore } from "@/stores/alert.store";
import { useUserStore } from "@/stores/user.store";


jest.mock("@/services/login.service");
jest.mock("@/stores/loading.store");
jest.mock("@/stores/alert.store");
jest.mock("@/stores/user.store");

describe("useLogin", () => {
  const show = jest.fn();
  const hide = jest.fn();
  const alertShow = jest.fn();
  const setUser = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();

    (useLoadingStore as unknown as jest.Mock).mockImplementation((selector) =>
      selector({ show, hide })
    );

    (useAlertStore as unknown as jest.Mock).mockImplementation((selector) =>
      selector({ show: alertShow })
    );

    (useUserStore as unknown as jest.Mock).mockImplementation((selector) =>
      selector({ setUser })
    );

    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  it("logs in successfully", async () => {
    (LoginService.login as jest.Mock).mockResolvedValue({
      access: "access123",
      refresh: "refresh123",
      user: { id: 1, name: "Admin" },
    });

    const { result } = renderHook(() => useLogin());

    let response;

    await act(async () => {
      response = await result.current.login({
        username: "admin",
        password: "123456",
      });
    });

    expect(setUser).toHaveBeenCalledWith({
      id: 1,
      name: "Admin",
    });
    expect(show).toHaveBeenCalledWith("Fazendo login...");
    expect(LoginService.login).toHaveBeenCalledWith({
      username: "admin",
      password: "123456"
    });

    expect(localStorage.getItem("accessToken")).toBe("access123");
    expect(localStorage.getItem("refreshToken")).toBe("refresh123");

    expect(alertShow).toHaveBeenCalledWith({
      message: "Login realizado com sucesso!",
      variant: "success",
    });

    expect(hide).toHaveBeenCalled();
    expect(response).toStrictEqual({
      access: "access123",
      refresh: "refresh123",
      user: { id: 1, name: "Admin" },
    });
  });

  it("handles login error", async () => {
    (LoginService.login as jest.Mock).mockRejectedValue(new Error("fail"));

    const { result } = renderHook(() => useLogin());

    let response;

    await act(async () => {
      response = await result.current.login({
        username: "admin",
        password: "123456",
      });
    });

    expect(show).toHaveBeenCalledWith("Fazendo login...");
    expect(LoginService.login).toHaveBeenCalled();

    expect(alertShow).toHaveBeenCalledWith({
      message: "Erro ao realizar o login..",
      variant: "error",
    });

    expect(hide).toHaveBeenCalled();
    expect(response).toBe(false);
  });
});