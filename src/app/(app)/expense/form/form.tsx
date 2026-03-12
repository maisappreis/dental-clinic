"use client";

import { useEffect, forwardRef, useImperativeHandle } from "react";
import { Controller, useForm } from "react-hook-form";
import { Input } from "@/components/form/input";
import { Checkbox } from "@/components/form/checkbox";
import { Textarea } from "@/components/form/textarea";
import { Expense, ExpenseFormData, ExpenseFormRef } from "@/types/expense";

interface ExpenseFormProps {
  defaultValues?: Expense;
  onSubmit: (data: ExpenseFormData) => void;
}

export const ExpenseForm = forwardRef<
  ExpenseFormRef,
  ExpenseFormProps
>(function ExpenseForm({ defaultValues, onSubmit }, ref) {
  const {
    control,
    watch,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ExpenseFormData>({
    defaultValues: {
      installments: "",
      ...defaultValues
    }
  });

  const installments = watch("installments");
  const hasInstallments = installments !== "";

  const disableInstallments = !!defaultValues && !!defaultValues.installments;

  useEffect(() => {
    if (!defaultValues) return;

    reset({
      ...defaultValues,
    });
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
            label="Data de vencimento"
            type="date"
            {...field}
            error={fieldState.error?.message}
          />
        )}
      />

      <Checkbox
        label="Possui parcelas?"
        checked={hasInstallments}
        disabled={disableInstallments}
        onChange={(checked) => {
          if (!checked) {
            setValue("installments", "");
          } else {
            setValue("installments", "2");
          }
        }}
      />

      {hasInstallments && (
        <Controller
          name="installments"
          control={control}
          rules={{
            required: "Número de parcelas obrigatório",
            validate: (value) =>
              Number.isInteger(Number(value))
                ? true
                : "Parcelas inválidas",
          }}
          render={({ field, fieldState }) => (
            <Input
              label="Número de parcelas"
              value={field.value}
              disabled={disableInstallments}
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