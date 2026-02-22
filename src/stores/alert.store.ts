import { create } from "zustand";

type AlertVariant = "success" | "error" | "warning" | "info";

interface AlertState {
  message: string;
  variant: AlertVariant;
  autoCloseAfter?: number;
  showAlert: (payload: {
    message: string;
    variant?: AlertVariant;
    autoCloseAfter?: number;
  }) => void;
  clearAlert: () => void;
}

export const useAlertStore = create<AlertState>((set) => ({
  message: "",
  variant: "success",
  autoCloseAfter: undefined,

  showAlert: ({ message, variant = "success", autoCloseAfter }) =>
    set({
      message,
      variant,
      autoCloseAfter,
    }),

  clearAlert: () =>
    set({
      message: "",
      autoCloseAfter: undefined,
    }),
}));
