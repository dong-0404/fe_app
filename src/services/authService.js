import apiService from './api';

class AuthService {
  // Register new user
  async register(userData) {
    try {
      const response = await apiService.post('/auth/register', userData);
      return response;
    } catch (error) {
      throw new Error(error.message || 'Registration failed');
    }
  }

  // Login user
  async login(email, password) {
    try {
      const response = await apiService.post('/auth/login', { email, password });
      
      // Store token if login successful
      if (response.data && response.data.token) {
        await apiService.setToken(response.data.token);
      }
      
      return response;
    } catch (error) {
      throw new Error(error.message || 'Login failed');
    }
  }

  // Logout user
  async logout() {
    try {
      await apiService.post('/auth/logout');
      await apiService.clearToken();
      return { success: true };
    } catch (error) {
      // Even if API call fails, clear local token
      await apiService.clearToken();
      throw new Error(error.message || 'Logout failed');
    }
  }

  // Get user profile
  async getProfile() {
    try {
      const response = await apiService.get('/auth/profile');
      return response;
    } catch (error) {
      throw new Error(error.message || 'Failed to get profile');
    }
  }

  // Update user profile
  async updateProfile(profileData) {
    try {
      const response = await apiService.put('/auth/profile', profileData);
      return response;
    } catch (error) {
      throw new Error(error.message || 'Failed to update profile');
    }
  }

  // Change password
  async changePassword(currentPassword, newPassword) {
    try {
      const response = await apiService.post('/auth/change-password', {
        currentPassword,
        newPassword,
      });
      return response;
    } catch (error) {
      throw new Error(error.message || 'Failed to change password');
    }
  }

  // Refresh token
  async refreshToken() {
    try {
      const response = await apiService.post('/auth/refresh-token');
      
      // Update stored token
      if (response.data && response.data.token) {
        await apiService.setToken(response.data.token);
      }
      
      return response;
    } catch (error) {
      throw new Error(error.message || 'Failed to refresh token');
    }
  }

  // Check if user is authenticated
  async isAuthenticated() {
    try {
      const token = await apiService.getStoredToken();
      if (!token) return false;

      // Verify token by getting profile
      await this.getProfile();
      return true;
    } catch (error) {
      // Token is invalid, clear it
      await apiService.clearToken();
      return false;
    }
  }

  // Get stored token
  async getToken() {
    return await apiService.getStoredToken();
  }
}

// Create singleton instance
const authService = new AuthService();

export default authService;

