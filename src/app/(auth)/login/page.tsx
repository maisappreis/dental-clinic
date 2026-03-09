"use client"

import { Controller, useForm } from "react-hook-form";
import styles from "./Login.module.css";
import { Input } from "@/components/form/input";
import { Button } from "@/components/button__/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTooth } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";
import { useLogin } from "@/hooks/useLogin";
import { LoginPayload } from "@/types/login";

export default function Login() {
  const router = useRouter();
  const { login } = useLogin();

  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<LoginPayload>({
    mode: "onChange",
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginPayload) => {
    const success = await login(data);
    if (success) router.push("/");
  };

  return (
    <div className={styles.area}>
      <div className={styles.form}>
        <FontAwesomeIcon icon={faTooth} className={styles.icon} style={{ color: "#86cafe" }} />
        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="username"
            control={control}
            rules={{ required: "Username é obrigatório" }}
            render={({ field, fieldState }) => (
              <Input
                label="Username"
                {...field}
                error={fieldState.error?.message}
              />
            )}
          />

          <Controller
            name="password"
            control={control}
            rules={{ required: "Senha é obrigatória" }}
            render={({ field, fieldState }) => (
              <Input
                label="Senha"
                type="password"
                {...field}
                error={fieldState.error?.message}
              />
            )}
          />

          <div className={styles.button}>
            <Button
              type="submit"
              label="Entrar"
              variant="primary"
              size="lg"
              disabled={!isValid}
            />
          </div>
        </form>
      </div>
    </div>
  )
};