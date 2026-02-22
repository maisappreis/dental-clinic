"use client";

import { Alert } from "@/components/Alert/Alert";
import { Loading } from '@/components/Loading/Loading';

import { useAlertStore } from "@/stores/alert.store";
import { useLoadingStore } from '@/stores/loading.store';

export function Providers({ children }: { children: React.ReactNode }) {
  const { message, variant, autoCloseAfter, clearAlert } = useAlertStore();
  const { isLoading, label } = useLoadingStore();

  return (
    <>
      {children}

      {isLoading && <Loading label={label} />}
      <Alert
        message={message}
        variant={variant}
        autoCloseAfter={autoCloseAfter}
        onClose={clearAlert}
      />
    </>
  );
}