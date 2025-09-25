import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// Base API configuration
const API_BASE_URL = 'https://shin-app.up.railway.app/api';

let authToken = null;

export async function setToken(token) {
  authToken = token;
  if (token) {
    await AsyncStorage.setItem('auth_token', token);
  } else {
    await AsyncStorage.removeItem('auth_token');
  }
}

export async function getStoredToken() {
  try {
    const token = await AsyncStorage.getItem('auth_token');
    authToken = token;
    return token;
  } catch (_e) {
    return null;
  }
}

export async function clearToken() {
  authToken = null;
  await AsyncStorage.removeItem('auth_token');
}

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 20000,
});

axiosInstance.interceptors.request.use(
  async (config) => {
    if (!authToken) {
      const stored = await AsyncStorage.getItem('auth_token');
      authToken = stored;
    }
    if (authToken) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${authToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);

// Optional default export for convenience
export default {
  axiosInstance,
  setToken,
  getStoredToken,
  clearToken,
};
