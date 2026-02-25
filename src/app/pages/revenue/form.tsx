"use client";

import React, { useEffect, forwardRef, useImperativeHandle } from "react";
import { Controller, useForm } from "react-hook-form";
import { Input } from "@/components/form/input";
import { Checkbox } from "@/components/form/checkbox";
import { Select } from "@/components/form/select";
import { Textarea } from "@/components/form/textarea";
import { procedureOptions, paymentOptions, installmentOptions } from '@/assets/data';
import { getCurrentDate } from "@/utils/date";
import { formatCPF } from "@/utils/utils";
import { Revenue, RevenueFormData, RevenueFormRef } from "@/types/revenue";

interface RevenueFormProps {
  defaultValues?: Revenue;
  onSubmit: (data: RevenueFormData) => void;
}

export const RevenueForm = forwardRef<
  RevenueFormRef,
  RevenueFormProps
>(function RevenueForm({ defaultValues, onSubmit }, ref) {
  const {
    control,
    watch,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<RevenueFormData>({
    defaultValues: {
      id: 0,
      date: getCurrentDate(),
      name: "",
      cpf: "",
      nf: false,
      procedure: "",
      payment: "",
      installments: 0,
      value: 0,
      notes: ""
    }
  });

  const hasInvoice = watch("nf");

  const payment = watch("payment");
  const hasInstallments = payment === "Crédito à prazo";

  const isValidCPF = (cpf: string): boolean => {
    const numbers = cpf.replace(/\D/g, '');
    return numbers.length === 11;
  };

  useEffect(() => {
    if (!defaultValues) return;

    reset(defaultValues);
  }, [defaultValues, reset]);

  useImperativeHandle(ref, () => ({
    submit: handleSubmit(onSubmit),
  }));

  return (
    <form>
      <Controller
        name="name"
        control={control}
        rules={{ required: "Nome é obrigatório" }}
        render={({ field, fieldState }) => (
          <Input
            label="Nome"
            {...field}
            error={fieldState.error?.message}
          />
        )}
      />

      <Controller
        name="date"
        control={control}
        rules={{ required: "Data é obrigatória" }}
        render={({ field, fieldState }) => (
          <Input
            label="Data"
            type="date"
            {...field}
            error={fieldState.error?.message}
          />
        )}
      />

      <Controller
        name="nf"
        control={control}
        render={({ field }) => (
          <Checkbox
            label="Com nota fiscal?"
            checked={field.value}
            onChange={(checked) => {
              field.onChange(checked);

              if (!checked) {
                setValue("cpf", "");
              }
            }}
          />
        )}
      />

      {hasInvoice && (
        <Controller
          name="cpf"
          control={control}
          rules={{
            validate: (value) =>
              !hasInvoice || isValidCPF(value || "")
                ? true
                : "CPF inválido",
          }}
          render={({ field, fieldState }) => (
            <Input
              label="CPF"
              value={field.value}
              onChange={(value) => {
                const formatted = formatCPF(String(value ?? ""));
                field.onChange(formatted);
              }}
              error={fieldState.error?.message}
            />
          )}
        />
      )}

      <Controller
        name="procedure"
        control={control}
        rules={{ required: "Procedimento" }}
        render={({ field, fieldState }) => (
          <Select
            label="Procedimento"
            value={field.value}
            options={procedureOptions.map((item) => ({
              label: item,
              value: item,
            }))}
            onChange={field.onChange}
            error={fieldState.error?.message}
          />
        )}
      />

      <Controller
        name="payment"
        control={control}
        rules={{ required: "Forma de pagamento" }}
        render={({ field, fieldState }) => (
          <Select
            label="Forma de pagamento"
            value={field.value}
            options={paymentOptions.map((item) => ({
              label: item,
              value: item,
            }))}
            onChange={field.onChange}
            error={fieldState.error?.message}
          />
        )}
      />

      {hasInstallments && (
        <Controller
          name="installments"
          control={control}
          rules={{ required: "Número de parcelas" }}
          render={({ field, fieldState }) => (
            <Select
              label="Número de parcelas"
              value={field.value}
              options={installmentOptions.map((item) => ({
                label: String(item),
                value: item,
              }))}
              onChange={field.onChange}
              error={fieldState.error?.message}
            />
          )}
        />
      )}

      <Controller
        name="value"
        control={control}
        rules={{ required: "Valor obrigatório" }}
        render={({ field, fieldState }) => (
          <Input
            label="Valor"
            type="number"
            value={field.value ?? ""}
            onChange={(value) =>
              field.onChange(
                value === "" ? null : Number(value)
              )
            }
            error={fieldState.error?.message}
          />
        )}
      />

      <Controller
        name="notes"
        control={control}
        rules={{ maxLength: { value: 500, message: "Máx. 500 caracteres" } }}
        render={({ field, fieldState }) => (
          <Textarea
            label="Observações"
            placeholder="Digite aqui..."
            value={field.value}
            onChange={field.onChange}
            error={fieldState.error?.message}
          />
        )}
      />
    </form>
  );
});