"use client";

import { Alert } from "@/components/alert__/alert";
import { Loading } from '@/components/loading__/loading';

import { useAlertStore } from "@/stores/alert.store";
import { useLoadingStore } from '@/stores/loading.store';

export function Providers({ children }: { children: React.ReactNode }) {
  const { message, variant, autoCloseAfter, hide } = useAlertStore();
  const { isLoading, label } = useLoadingStore();

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