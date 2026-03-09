import { renderHook, act } from "@testing-library/react";
import { useLogin } from "./useLogin";
import { LoginService } from "@/services/login.service";
import { useLoadingStore } from "@/stores/loading.store";
import { useAlertStore } from "@/stores/alert.store";

jest.mock("@/services/login.service");
jest.mock("@/stores/loading.store");
jest.mock("@/stores/alert.store");

describe("useLogin", () => {
  const show = jest.fn();
  const hide = jest.fn();
  const alertShow = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();

    (useLoadingStore as unknown as jest.Mock).mockImplementation((selector) =>
      selector({ show, hide })
    );

    (useAlertStore.getState as jest.Mock) = jest.fn().mockReturnValue({
      show: alertShow,
    });

    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  it("logs in successfully", async () => {
    (LoginService.login as jest.Mock).mockResolvedValue({
      access: "access123",
      refresh: "refresh123",
    });

    const { result } = renderHook(() => useLogin());

    let response;

    await act(async () => {
      response = await result.current.login({
        username: "admin",
        password: "123456",
      });
    });

    expect(show).toHaveBeenCalledWith("Fazendo login...");
    expect(LoginService.login).toHaveBeenCalledWith({
      username: "admin",
      password: "123456",
    });

    expect(localStorage.getItem("accessToken")).toBe("access123");
    expect(localStorage.getItem("refreshToken")).toBe("refresh123");

    expect(alertShow).toHaveBeenCalledWith({
      message: "Login realizado com sucesso!",
      variant: "success",
    });

    expect(hide).toHaveBeenCalled();
    expect(response).toBe(true);
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