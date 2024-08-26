'use client'
import React, { useState, useEffect } from 'react';
import styles from './Login.module.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTooth } from '@fortawesome/free-solid-svg-icons';
import Alert from '@/app/components/alert'
import { apiBase, fetchRevenue, fetchExpenses } from '@/utils/api'
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function Login() {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [alertMessage, setAlertMessage] = useState('');
  const router = useRouter();

  const isFormValid = username !== '' && password !== '';

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(username, password)

    try {
      const loginData = {
        username,
        password,
      };

      const response = await axios.post(`${apiBase}/accounts/token/`, loginData)
      const accessToken = response.data.access
      const refreshToken = response.data.refresh
      console.log('accessToken', accessToken)
      console.log('refreshToken', refreshToken)

      if (accessToken && refreshToken) {
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        setAlertMessage("Login realizado com sucesso!");

        setTimeout(() => {
          router.push('/');
        }, 800)
        await fetchRevenue();
        await fetchExpenses();
      }      
    } catch (error) {
      setAlertMessage("Erro ao realizar o login.");
    }
  }

  useEffect(() => {
    if (alertMessage) {
      const timer = setTimeout(() => {
        setAlertMessage("")
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [alertMessage]);

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
      <Alert message={alertMessage} />
    </div>
  )
}