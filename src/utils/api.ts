import axios from 'axios';
import { isAuthenticated } from './auth';

// export const apiBase: string = "https://django-apis-two.vercel.app/api"
export const apiBase: string = "http://localhost:8000/api"

export const apiURL = (): string => {
  if (isAuthenticated()) {
    return `${apiBase}/dental`
  } else {
    return `${apiBase}/dental/test`
  }
}

export const fetchRevenue = async () => {
  try {
    const response = await axios.get(`${apiURL()}/revenue/`)
    return response.data
  } catch (error) {
    console.error('Erro ao requisitar a lista de receitas.', error)
  }
}

export const fetchExpenses = async () => {
  try {
    const response = await axios.get(`${apiURL()}/expense/`)
    return response.data
  } catch (error) {
    console.error('Erro ao requisitar a lista de despesas.', error)
  }
}