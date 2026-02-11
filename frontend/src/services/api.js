import axios from 'axios'
const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL || ''}/api/v1`,
  withCredentials: true,
  timeout: 10000,
})
// Перехватчик для добавления токена к запросам
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)
// Перехватчик для обработки ошибок авторизации
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // Редирект на логин только если мы не на странице логина или регистрации
    if (error.response?.status === 401
      && !window.location.pathname.includes('/login')
      && !window.location.pathname.includes('/signup')) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  },
)
export default api
