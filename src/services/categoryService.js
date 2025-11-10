import { axiosInstance } from './api';

class CategoryService {
  // Get all categories
  async getAllCategories(includeInactive = false) {
    try {
      const params = new URLSearchParams();
      if (includeInactive) params.append('includeInactive', 'true');
      
      const response = await axiosInstance.get(`/categories?${params.toString()}`);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to get categories',
        data: { categories: [] }
      };
    }
  }

  // Get category by ID
  async getCategoryById(id) {
    try {
      const response = await axiosInstance.get(`/categories/${id}`);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to get category',
        data: { category: null }
      };
    }
  }

  // Get category by slug
  async getCategoryBySlug(slug) {
    try {
      const response = await axiosInstance.get(`/categories/slug/${slug}`);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to get category',
        data: { category: null }
      };
    }
  }
}

const categoryService = new CategoryService();
export default categoryService;


