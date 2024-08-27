import axios from 'axios';

export const apiBase: string = "https://django-apis-two.vercel.app/api"
// export const apiBase: string = "http://localhost:8000/api"

export const isAuthenticated = () => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    return true
  }
  return false
}

export const apiURL = (): string => {
  if (isAuthenticated()) {
    return `${apiBase}/dental`
  } else {
    return `${apiBase}/dental/test`
  }
}

export const fetchRevenue = async () => {
  try {
    configureAxios()
    const response = await axios.get(`${apiURL()}/revenue/`)
    return response.data
  } catch (error) {
    console.error('Erro ao requisitar a lista de receitas.', error)
  }
}

export const fetchExpenses = async () => {
  try {
    configureAxios()
    const response = await axios.get(`${apiURL()}/expense/`)
    return response.data
  } catch (error) {
    console.error('Erro ao requisitar a lista de despesas.', error)
  }
}

export const configureAxios = () => {
  axios.defaults.headers.common['Content-Type'] = 'application/json';

  axios.interceptors.request.use(
    (config) => {
      axios.defaults.baseURL = `${apiBase}`
      const token = localStorage.getItem('accessToken')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    },
    (error) => Promise.reject(error)
  );

  axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        const refreshToken = localStorage.getItem('refreshToken');

        if (refreshToken) {
          try {
            const response = await axios.post('/accounts/token/refresh/', { refresh: refreshToken });
            const { access } = response.data;
            localStorage.setItem('accessToken', access);
            axios.defaults.headers.common['Authorization'] = `Bearer ${access}`;
            return axios(originalRequest);
          } catch (refreshError) {
            console.error(refreshError);
          }
        }
      }
      return Promise.reject(error);
    }
  )
}