'use client'
import React, { useState, useEffect } from 'react';
import styles from './Login.module.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTooth } from '@fortawesome/free-solid-svg-icons';
import Loading from "@/app/common/loading";
import { apiBase, fetchRevenue, fetchExpenses,
  isAuthenticated,   configureAxios } from '@/utils/api'
import { useRouter } from 'next/navigation';
import { useAlertStore } from '@/stores/alert.store';
import axios from 'axios';

export default function Login() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const isFormValid = username !== '' && password !== '';
  const { showAlert } = useAlertStore();

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    try {
      const loginData = {
        username,
        password,
      };

      const response = await axios.post(`${apiBase}/accounts/token/`, loginData)
      const accessToken = response.data.access
      const refreshToken = response.data.refresh

      if (accessToken && refreshToken) {
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);

        showAlert({
          message: "Login realizado com sucesso!",
          variant: "success",
          autoCloseAfter: 2000,
        });

        setTimeout(() => {
          router.push('/');
        }, 800)
        await fetchRevenue();
        await fetchExpenses();
      }      
    } catch (error) {
      showAlert({
          message: "Erro ao realizar o login.",
          variant: "error",
          autoCloseAfter: 2000,
        });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    isAuthenticated();
    configureAxios();
  }, []);

  if (loading) {
    return (
      <Loading>
        Carregando...
      </Loading>
    );
  }

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
            <button type="submit" className="btn blue size"
              disabled={!isFormValid}>Entrar</button>
          </div>
        </form>
      </div>
    </div>
  )
}