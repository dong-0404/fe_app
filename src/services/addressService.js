import { axiosInstance } from './api';

class AddressService {
  // Get user addresses
  async getUserAddresses() {
    try {
      const response = await axiosInstance.get('/addresses');
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to get addresses',
        data: []
      };
    }
  }

  // Get address by ID
  async getAddressById(addressId) {
    try {
      const response = await axiosInstance.get(`/addresses/${addressId}`);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to get address',
        data: null
      };
    }
  }

  // Get default address
  async getDefaultAddress() {
    try {
      const response = await axiosInstance.get('/addresses/default');
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to get default address',
        data: null
      };
    }
  }

  // Create address
  async createAddress(addressData) {
    try {
      const response = await axiosInstance.post('/addresses', addressData);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create address',
        data: null
      };
    }
  }

  // Update address
  async updateAddress(addressId, addressData) {
    try {
      const response = await axiosInstance.put(`/addresses/${addressId}`, addressData);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update address',
        data: null
      };
    }
  }

  // Delete address
  async deleteAddress(addressId) {
    try {
      const response = await axiosInstance.delete(`/addresses/${addressId}`);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete address',
        data: null
      };
    }
  }

  // Set default address
  async setDefaultAddress(addressId) {
    try {
      const response = await axiosInstance.put(`/addresses/${addressId}/default`);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to set default address',
        data: null
      };
    }
  }

  // Transform address data for frontend use
  transformAddress(backendAddress) {
    if (!backendAddress) return null;

    const type = (backendAddress.type || 'home').toLowerCase();
    const normalizedType = type === 'work' ? 'office' : type;

    return {
      id: backendAddress.id,
      fullName: backendAddress.fullName,
      phone: backendAddress.phone,
      line1: backendAddress.line1,
      line2: backendAddress.line2,
      city: backendAddress.city,
      state: backendAddress.state,
      postalCode: backendAddress.postalCode,
      country: backendAddress.country || 'Vietnam',
      isDefault: backendAddress.isDefault || false,
      type: normalizedType,
      formatted: `${backendAddress.line1}${backendAddress.line2 ? ', ' + backendAddress.line2 : ''}, ${backendAddress.city}, ${backendAddress.state} ${backendAddress.postalCode}`
    };
  }

  // Transform addresses array
  transformAddresses(backendAddresses) {
    if (!Array.isArray(backendAddresses)) return [];
    return backendAddresses.map(address => this.transformAddress(address));
  }
}

const addressService = new AddressService();
export default addressService;

