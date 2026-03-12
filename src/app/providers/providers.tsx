"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Alert } from "@/components/alert/alert";
import { Loading } from '@/components/loading/loading';
import { useAlertStore } from "@/stores/alert.store";
import { useLoadingStore } from '@/stores/loading.store';
import { LoginService } from "@/services/login.service";
import { useUserStore } from "@/stores/user.store";


export function Providers({ children }: { children: React.ReactNode }) {
  const { message, variant, autoCloseAfter, hide } = useAlertStore();
  const { isLoading, label } = useLoadingStore();

  const setUser = useUserStore((s) => s.setUser);
  const router = useRouter();

  useEffect(() => {
    async function loadUser() {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const response = await LoginService.profile();
        setUser(response.user);
      } catch {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        router.push("/login");
      }
    }

    loadUser();
  }, [router, setUser]);

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
};