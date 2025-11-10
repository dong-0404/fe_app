import { axiosInstance } from './api';

class BrandService {
  // Get all brands
  async getAllBrands(includeInactive = false) {
    try {
      const params = new URLSearchParams();
      if (includeInactive) params.append('includeInactive', 'true');
      
      const response = await axiosInstance.get(`/brands?${params.toString()}`);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to get brands',
        data: { brands: [] }
      };
    }
  }

  // Get brand by ID
  async getBrandById(id) {
    try {
      const response = await axiosInstance.get(`/brands/${id}`);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to get brand',
        data: { brand: null }
      };
    }
  }

  // Get brand by slug
  async getBrandBySlug(slug) {
    try {
      const response = await axiosInstance.get(`/brands/slug/${slug}`);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to get brand',
        data: { brand: null }
      };
    }
  }
}

const brandService = new BrandService();
export default brandService;


