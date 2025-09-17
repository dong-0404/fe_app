import AsyncStorage from '@react-native-async-storage/async-storage';

// Base API configuration
// Use actual IP instead of localhost for React Native
const API_BASE_URL = 'https://91a33718ec19.ngrok-free.app/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = null;
  }

  // Set authentication token
  async setToken(token) {
    this.token = token;
    if (token) {
      await AsyncStorage.setItem('auth_token', token);
    } else {
      await AsyncStorage.removeItem('auth_token');
    }
  }

  // Get stored token
  async getStoredToken() {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      this.token = token;
      return token;
    } catch (error) {
      console.error('Error getting stored token:', error);
      return null;
    }
  }

  // Clear stored token
  async clearToken() {
    this.token = null;
    await AsyncStorage.removeItem('auth_token');
  }

  // Get headers with authentication
  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    return headers;
  }

  // Generic API request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.getHeaders(),
      ...options,
    };

    try {
      console.log(url);
      const response = await fetch(url, config);
      const data = await response.json();
      console.log(data);

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // GET request
  async get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }

  // POST request
  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // PUT request
  async put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // DELETE request
  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }
}

// Create singleton instance
const apiService = new ApiService();

export default apiService;
