import { useCallback } from "react";
import { LoginService } from "@/services/login.service";
import { useLoadingStore } from "@/stores/loading.store";
import { useAlertStore } from "@/stores/alert.store";
import { useUserStore } from "@/stores/user.store";
import { LoginPayload } from "@/types/login";

export function useLogin() {
  const alert = useAlertStore((s) => s);
  const showLoading = useLoadingStore((s) => s.show);
  const hideLoading = useLoadingStore((s) => s.hide);
  const setUser = useUserStore((s) => s.setUser);

  const login = useCallback(async (payload: LoginPayload) => {
    showLoading("Fazendo login...");
    try {
      const response = await LoginService.login(payload);

      localStorage.setItem("accessToken", response.access);
      localStorage.setItem("refreshToken", response.refresh);

      alert.show({
        message: "Login realizado com sucesso!",
        variant: "success",
      });

      setUser(response.user);

      return response;
    } catch (error) {
      console.error(error);
      alert.show({
        message: "Erro ao realizar o login..",
        variant: "error",
      });

      return false;
    } finally {
      hideLoading();
    }
  }, [showLoading, hideLoading, alert, setUser]);

  return {
    login
  };
};