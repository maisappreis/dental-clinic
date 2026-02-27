import { LoginService } from "@/services/login.service";
import { useLoadingStore } from "@/stores/loading.store";
import { useAlertStore } from "@/stores/alert.store";
import { LoginPayload } from "@/types/login";

export function useLogin() {
  const alert = useAlertStore.getState();
  const showLoading = useLoadingStore((s) => s.show);
  const hideLoading = useLoadingStore((s) => s.hide);

  const login = async (payload: LoginPayload) => {
    showLoading("Fazendo login...");
    try {
      const response = await LoginService.login(payload);

      localStorage.setItem("accessToken", response.access);
      localStorage.setItem("refreshToken", response.refresh);

      alert.show({
        message: "Login realizado com sucesso!",
        variant: "success",
      });

      return response;
    } catch (error) {
      console.error(error);
      alert.show({
        message: "Erro ao realizar o login..",
        variant: "error",
      });
    } finally {
      hideLoading();
    }
  };

  return {
    login
  };
};