"use client"
import React, { useState } from "react";
import styles from "./Login.module.css";
import { Button } from "@/components/button/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTooth } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";
import { useLogin } from "@/hooks/useLogin";

export default function Login() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const router = useRouter();
  const { login } = useLogin();

  const isFormValid = username !== "" && password !== "";

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    await login({
      username,
      password,
    });

    router.push("/");
  };

  return (
    <div className={styles.area}>
      <div className={styles.form}>
        <FontAwesomeIcon icon={faTooth} className={styles.icon} style={{ color: "#86cafe" }} />
        <form onSubmit={handleLogin}>
          <div className={styles.field}>
            <label htmlFor="name" className={styles.label}>Username:</label>
            <input type="text" id="username" name="username"
              className={styles.input} value={username}
              onChange={(e) => setUsername(e.target.value)} required />
          </div>
          <div className={styles.field}>
            <label htmlFor="password" className={styles.label}>Senha:</label>
            <input type="password" id="password" name="password"
              className={styles.input} value={password}
              onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <div className={styles.button}>
            <Button
              type="submit"
              label="Entrar"
              variant="primary"
              size="lg"
              disabled={!isFormValid}
            />
          </div>
        </form>
      </div>
    </div>
  )
};