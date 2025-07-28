import axios from 'axios';

const API = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

API.interceptors.request.use((config) => {
  const isAuthRoute = config.url?.includes('/auth/login') || config.url?.includes('/auth/register');

  if (!isAuthRoute) {
    const auth = localStorage.getItem('auth');
    if (auth) {
      const { token } = JSON.parse(auth);
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

export default API;
