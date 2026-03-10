"use client";

import { useState, useEffect } from "react";
import { useLogin } from "@/hooks/useLogin";

import { Alert } from "@/components/alert/alert";
import { Loading } from '@/components/loading/loading';

import { useAlertStore } from "@/stores/alert.store";
import { useLoadingStore } from '@/stores/loading.store';

export function Providers({ children }: { children: React.ReactNode }) {
  const [authReady, setAuthReady] = useState(false);

  const { message, variant, autoCloseAfter, hide } = useAlertStore();
  const { isLoading, label } = useLoadingStore();
  const { login } = useLogin();

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        await login({
          username: "demo",
          password: "demo123",
        });
      }

      setAuthReady(true);
    };

    initAuth();
  }, [login]);

  if (!authReady) {
    return <Loading label="Inicializando aplicação..." />;
  }

  return (
    <>
      {children}

      {isLoading && <Loading label={label} />}
      <Alert
        message={message}
        variant={variant}
        autoCloseAfter={autoCloseAfter}
        onClose={hide}
      />
    </>
  );
}