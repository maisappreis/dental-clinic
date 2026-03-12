import { http } from "@/api/http";
import { apiBase } from "@/api/base";
import { LoginPayload, LoginAccess } from "@/types/login";

export const LoginService = {
  async login(payload: LoginPayload): Promise<LoginAccess> {
    const { data } = await http.post(`${apiBase}/accounts/token/`, payload);
    return data;
  },

  async profile() {
    const { data } = await http.post(`${apiBase}/accounts/profile/`);
    return data;
  }
};