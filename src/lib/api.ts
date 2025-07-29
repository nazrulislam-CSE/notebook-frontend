import axios from 'axios';


const API_BASE_URL= process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000';
console.log('API_BASE_URL', process.env.NEXT_PUBLIC_API_BASE_URL)
const api = axios.create({
  baseURL: `${API_BASE_URL}/api/`,
  withCredentials: true,
    headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  }
});

// Add a request interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  console.log('Token:', token);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Reusable methods
export const apiGet = async (endpoint: string) => (await api.get(endpoint)).data;
export const apiPost = async (endpoint: string, data: any) => (await api.post(endpoint, data)).data;
export const apiPut = async (endpoint: string, data: any) => (await api.put(endpoint, data)).data;
export const apiDelete = async (endpoint: string) => (await api.delete(endpoint)).data;


export default api;