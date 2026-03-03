
"use client";
import React, { useEffect, forwardRef, useImperativeHandle } from "react";
import { Controller, useForm } from "react-hook-form";
import { Input } from "@/components/form/input";
import { Select } from "@/components/form/select";
import { Textarea } from "@/components/form/textarea";
import { scheduleOptions } from "@/constants/appointment";
import { AppointmentFormData, AppointmentFormRef } from "@/types/agenda";

interface AppointmentFormProps {
  defaultValues?: Partial<AppointmentFormData>;
  onSubmit: (data: AppointmentFormData) => void;
}

export const AppointmentForm = forwardRef<
  AppointmentFormRef,
  AppointmentFormProps
>(function AppointmentForm({ defaultValues, onSubmit }, ref) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AppointmentFormData>({
    defaultValues: defaultValues ?? {
      name: "",
      date: "",
      time: "",
      notes: "",
    },
  });

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
        rules={{ required: "Paciente é obrigatório" }}
        render={({ field, fieldState }) => (
          <Input
            label="Paciente"
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
        name="time"
        control={control}
        rules={{ required: "Horário" }}
        render={({ field, fieldState }) => (
          <Select
            label="Horário"
            value={field.value}
            options={scheduleOptions.map((item) => ({
              label: item,
              value: item,
            }))}
            onChange={field.onChange}
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