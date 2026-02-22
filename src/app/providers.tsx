"use client";

import { Alert } from "@/components/Alert/Alert";
import { useAlertStore } from "@/stores/alert.store";

export function Providers({ children }: { children: React.ReactNode }) {
  const { message, variant, autoCloseAfter, clearAlert } = useAlertStore();

  return (
    <>
      {children}

      <Alert
        message={message}
        variant={variant}
        autoCloseAfter={autoCloseAfter}
        onClose={clearAlert}
      />
    </>
  );
}