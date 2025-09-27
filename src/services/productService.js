import { axiosInstance } from './api';

class ProductService {
  // Get all products with pagination and filtering
  async getProducts(options = {}) {
    try {
      const params = new URLSearchParams();
      
      if (options.page) params.append('page', options.page);
      if (options.limit) params.append('limit', options.limit);
      if (options.categoryId) params.append('categoryId', options.categoryId);
      if (options.brandId) params.append('brandId', options.brandId);
      if (options.isActive !== undefined) params.append('isActive', options.isActive);
      if (options.isFeatured !== undefined) params.append('isFeatured', options.isFeatured);
      if (options.isHot !== undefined) params.append('isHot', options.isHot);
      if (options.isNew !== undefined) params.append('isNew', options.isNew);
      if (options.search) params.append('search', options.search);
      if (options.sortBy) params.append('sortBy', options.sortBy);
      if (options.sortOrder) params.append('sortOrder', options.sortOrder);

      const response = await axiosInstance.get(`/products?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Get products error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to get products',
        data: { products: [], pagination: {} }
      };
    }
  }

  // Get product by ID
  async getProductById(id) {
    try {
      const response = await axiosInstance.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      console.error('Get product by ID error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to get product',
        data: null
      };
    }
  }

  // Get product by slug
  async getProductBySlug(slug) {
    try {
      const response = await axiosInstance.get(`/products/slug/${slug}`);
      return response.data;
    } catch (error) {
      console.error('Get product by slug error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to get product',
        data: null
      };
    }
  }

  // Get featured products
  async getFeaturedProducts(limit = 10) {
    try {
      const response = await axiosInstance.get(`/products/featured?limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Get featured products error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to get featured products',
        data: []
      };
    }
  }

  // Get hot products
  async getHotProducts(limit = 10) {
    try {
      const response = await axiosInstance.get(`/products/hot?limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Get hot products error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to get hot products',
        data: []
      };
    }
  }

  // Get new products
  async getNewProducts(limit = 10) {
    try {
      const response = await axiosInstance.get(`/products/new?limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Get new products error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to get new products',
        data: []
      };
    }
  }

  // Search products
  async searchProducts(searchTerm, options = {}) {
    try {
      const params = new URLSearchParams();
      params.append('q', searchTerm);
      
      if (options.page) params.append('page', options.page);
      if (options.limit) params.append('limit', options.limit);
      if (options.categoryId) params.append('categoryId', options.categoryId);
      if (options.brandId) params.append('brandId', options.brandId);

      const response = await axiosInstance.get(`/products/search?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Search products error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to search products',
        data: { products: [], pagination: {} }
      };
    }
  }

  // Get products by category
  async getProductsByCategory(categoryId, options = {}) {
    try {
      const params = new URLSearchParams();
      
      if (options.page) params.append('page', options.page);
      if (options.limit) params.append('limit', options.limit);
      if (options.brandId) params.append('brandId', options.brandId);
      if (options.sortBy) params.append('sortBy', options.sortBy);
      if (options.sortOrder) params.append('sortOrder', options.sortOrder);

      const response = await axiosInstance.get(`/products/category/${categoryId}?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Get products by category error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to get products by category',
        data: { products: [], pagination: {} }
      };
    }
  }

  // Get products by brand
  async getProductsByBrand(brandId, options = {}) {
    try {
      const params = new URLSearchParams();
      
      if (options.page) params.append('page', options.page);
      if (options.limit) params.append('limit', options.limit);
      if (options.categoryId) params.append('categoryId', options.categoryId);
      if (options.sortBy) params.append('sortBy', options.sortBy);
      if (options.sortOrder) params.append('sortOrder', options.sortOrder);

      const response = await axiosInstance.get(`/products/brand/${brandId}?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Get products by brand error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to get products by brand',
        data: { products: [], pagination: {} }
      };
    }
  }

  // Get product images
  async getProductImages(productId) {
    try {
      const response = await axiosInstance.get(`/products/${productId}/images`);
      return response.data;
    } catch (error) {
      console.error('Get product images error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to get product images',
        data: []
      };
    }
  }

  // Transform product data for frontend use
  transformProductData(backendProduct) {
    if (!backendProduct) return null;
    // Get primary image or first image
    const primaryImage = backendProduct.images?.find(img => img.isPrimary) || 
                        backendProduct.images?.[0];
    
    // Calculate discount percentage if there's a compare price
    const variants = backendProduct.variants || [];
    const firstVariant = variants[0];
    const price = firstVariant?.price || 0;
    const originalPrice = firstVariant?.originalPrice || price;
    const discount = originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

    // Calculate average rating from reviews
    const reviews = backendProduct.reviews || [];
    const averageRating = reviews.length > 0 
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
      : 0;

    return {
      id: backendProduct.id,
      name: backendProduct.name,
      slug: backendProduct.slug,
      description: backendProduct.description,
      shortDescription: backendProduct.shortDescription,
      brand: backendProduct.brand?.name || 'Unknown Brand',
      brandId: backendProduct.brandId,
      categories: backendProduct.categories || [],
      price: price,
      originalPrice: originalPrice,
      discount: discount,
      image: primaryImage?.imageUrl || 'https://via.placeholder.com/300x300?text=No+Image',
      images: backendProduct.images || [],
      variants: variants,
      rating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
      reviews: reviews,
      reviewsCount: reviews.length,
      isActive: backendProduct.isActive,
      isFeatured: backendProduct.isFeatured,
      isHot: backendProduct.isHot,
      isNew: backendProduct.isNew,
      createdAt: backendProduct.createdAt,
      updatedAt: backendProduct.updatedAt
    };
  }

  // Transform multiple products
  transformProductsData(backendProducts) {
    if (!Array.isArray(backendProducts)) return [];
    return backendProducts.map(product => this.transformProductData(product));
  }
}

const productService = new ProductService();
export default productService;
