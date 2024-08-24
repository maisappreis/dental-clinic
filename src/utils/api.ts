import axios from 'axios';

// export const apiBase: string = "https://django-apis-two.vercel.app/api/dental"
export const apiBase: string = "http://localhost:8000/api/dental/test"

export const fetchRevenue = async () => {
  try {
    const response = await axios.get(`${apiBase}/revenue/`)
    return response.data
  } catch (error) {
    console.error('Erro ao requisitar a lista de receitas.', error)
  }
}

export const fetchExpenses = async () => {
  try {
    const response = await axios.get(`${apiBase}/expense/`)
    return response.data
  } catch (error) {
    console.error('Erro ao requisitar a lista de despesas.', error)
  }
}