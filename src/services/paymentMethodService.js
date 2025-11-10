import { axiosInstance } from './api';

class PaymentMethodService {
  // Get user payment methods
  async getUserPaymentMethods() {
    try {
      const response = await axiosInstance.get('/payment-methods');
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to get payment methods',
        data: []
      };
    }
  }

  // Get payment method by ID
  async getPaymentMethodById(paymentMethodId) {
    try {
      const response = await axiosInstance.get(`/payment-methods/${paymentMethodId}`);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to get payment method',
        data: null
      };
    }
  }

  // Get default payment method
  async getDefaultPaymentMethod() {
    try {
      const response = await axiosInstance.get('/payment-methods/default');
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to get default payment method',
        data: null
      };
    }
  }

  // Create payment method
  async createPaymentMethod(paymentMethodData) {
    try {
      const response = await axiosInstance.post('/payment-methods', paymentMethodData);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create payment method',
        data: null
      };
    }
  }

  // Update payment method
  async updatePaymentMethod(paymentMethodId, paymentMethodData) {
    try {
      const response = await axiosInstance.put(`/payment-methods/${paymentMethodId}`, paymentMethodData);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update payment method',
        data: null
      };
    }
  }

  // Delete payment method
  async deletePaymentMethod(paymentMethodId) {
    try {
      const response = await axiosInstance.delete(`/payment-methods/${paymentMethodId}`);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete payment method',
        data: null
      };
    }
  }

  // Set default payment method
  async setDefaultPaymentMethod(paymentMethodId) {
    try {
      const response = await axiosInstance.put(`/payment-methods/${paymentMethodId}/default`);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to set default payment method',
        data: null
      };
    }
  }

  // Transform payment method data for frontend use
  transformPaymentMethod(backendMethod) {
    if (!backendMethod) return null;

    return {
      id: backendMethod.id,
      type: backendMethod.type,
      provider: backendMethod.provider,
      brand: backendMethod.brand,
      last4: backendMethod.last4,
      isDefault: backendMethod.isDefault || false,
      isActive: backendMethod.isActive !== false,
      expiresAt: backendMethod.expiresAt,
      displayName: this.getDisplayName(backendMethod)
    };
  }

  // Get display name for payment method
  getDisplayName(method) {
    if (method.type === 'credit_card' || method.type === 'debit_card') {
      return `${method.brand || method.provider} •••• ${method.last4 || ''}`;
    }
    return method.provider;
  }

  // Transform payment methods array
  transformPaymentMethods(backendMethods) {
    if (!Array.isArray(backendMethods)) return [];
    return backendMethods.map(method => this.transformPaymentMethod(method));
  }
}

const paymentMethodService = new PaymentMethodService();
export default paymentMethodService;

