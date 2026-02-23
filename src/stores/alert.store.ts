import { create } from "zustand";

export type AlertVariant = "success" | "error" | "warning" | "info";

interface AlertPayload {
  message: string;
  variant?: AlertVariant;
  autoCloseAfter?: number;
}

interface AlertState {
  message: string;
  variant: AlertVariant;
  autoCloseAfter?: number;

  show: (payload: AlertPayload) => void;
  hide: () => void;
}

export const useAlertStore = create<AlertState>((set) => ({
  message: "",
  variant: "success",
  autoCloseAfter: 2000,

  show: ({ message, variant = "success", autoCloseAfter = 2000 }) =>
    set({
      message,
      variant,
      autoCloseAfter,
    }),

  hide: () =>
    set({
      message: "",
      autoCloseAfter: undefined,
    }),
}));