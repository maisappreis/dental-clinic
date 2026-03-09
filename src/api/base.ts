import { API_URL } from "@/config/env";

export const apiBase = "http://localhost:8000/api";
// export const apiBase: string = "https://django-apis-two.vercel.app/api";

export const isAuthenticated = (): boolean => {
  return Boolean(localStorage.getItem("accessToken"));
};

export const apiURL = (): string => {
  return isAuthenticated()
    ? `${apiBase}/dental`
    : `${apiBase}/dental/test`;
};