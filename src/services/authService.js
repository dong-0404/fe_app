import api, { axiosInstance, setToken, clearToken, getStoredToken } from './api';

class AuthService {
  async register(userData) {
    try {
      const res = await axiosInstance.post('/auth/register', userData);
      const data = res.data;
      if (data?.data?.token) {
        await setToken(data.data.token);
      }
      return data;
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      return {
        success: false,
        error: error.response?.data || error.toString(),
        message,
      };
    }
  }

  async login(email, password) {
    try {
      const res = await axiosInstance.post('/auth/login', { email, password });
      const data = res.data;
      if (data?.data?.token) {
        await setToken(data.data.token);
      }
      return data;
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      return {
        success: false,
        error: error.response?.data || error.toString(),
        message,
      };
    }
  }

  async logout() {
    try {
      await axiosInstance.post('/auth/logout');
      await clearToken();
      return { success: true };
    } catch (_e) {
      await clearToken();
      return { success: true };
    }
  }

  async getProfile() {
    const res = await axiosInstance.get('/auth/profile');
    return res.data;
  }

  async updateProfile(profileData) {
    const res = await axiosInstance.put('/auth/profile', profileData);
    return res.data;
  }

  async changePassword(currentPassword, newPassword) {
    const res = await axiosInstance.post('/auth/change-password', { currentPassword, newPassword });
    return res.data;
  }


  async refreshToken() {
    const res = await axiosInstance.post('/auth/refresh-token');
    if (res.data?.token) {
      await setToken(res.data.token);
    }
    return res.data;
  }

  async isAuthenticated() {
    const token = await getStoredToken();
    if (!token) return false;
    try {
      await this.getProfile();
      return true;
    } catch (_e) {
      await clearToken();
      return false;
    }
  }

  async getToken() {
    return await getStoredToken();
  }
}

const authService = new AuthService();
export default authService;

