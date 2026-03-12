"use client"

import { Controller, useForm } from "react-hook-form";
import styles from "./Login.module.css";
import { Input } from "@/components/form/input";
import { Button } from "@/components/button/button";
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

  const onSubmitRealUser = async (data: LoginPayload) => {
    const success = await login(data);
    if (success) router.push("/");
  };

  const onSubmitDemoUser  = async () => {
    const success = await login({
      username: "demo",
      password: "demo123",
    });
    if (success) router.push("/");
  };

  return (
    <div className={styles.area}>
      <div className={styles.box}>
        <div className="text-center">
          <h3 className="font-semibold">
            Entrar na aplicação como usuário demo.
          </h3>
          <h4 className="text-sm mt-3">
            Log in to the application as a demo user.
          </h4>
        </div>

        <div className="text-center">
          <p>
            Essa aplicação faz parte de um portfólio do Github,
            por isso possibilita acesso no modo demostração.
          </p>
          <p className="text-sm mt-3">
            This application is part of a Github portfolio,
            therefore it allows access in demo mode.
          </p>
        </div>
        
        <div className={styles.button}>
            <Button
              label="Entrar"
              variant="primary"
              size="lg"
              onClick={onSubmitDemoUser}
            />
          </div>
      </div>

      <div className={styles.box}>
        <FontAwesomeIcon icon={faTooth} className={styles.icon} style={{ color: "#86cafe" }} />
        <form id="loginForm" onSubmit={handleSubmit(onSubmitRealUser)}>
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
        </form>

        <div className={styles.button}>
            <Button
              form="loginForm"
              type="submit"
              label="Entrar"
              variant="primary"
              size="lg"
              disabled={!isValid}
            />
          </div>
      </div>
    </div>
  )
};