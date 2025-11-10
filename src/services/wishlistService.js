import { axiosInstance } from './api';

class WishlistService {
  // Get user's wishlist
  async getWishlist() {
    try {
      const response = await axiosInstance.get('/wishlist');
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to get wishlist',
        data: { wishlist: null, itemCount: 0 }
      };
    }
  }

  // Add product to wishlist
  async addProduct(productId) {
    try {
      const response = await axiosInstance.post('/wishlist/items', {
        productId
      });
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to add product to wishlist',
        data: null
      };
    }
  }

  // Remove product from wishlist
  async removeProduct(productId) {
    try {
      const response = await axiosInstance.delete(`/wishlist/items/product/${productId}`);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to remove product from wishlist',
        data: null
      };
    }
  }

  // Remove wishlist item by ID
  async removeItem(itemId) {
    try {
      const response = await axiosInstance.delete(`/wishlist/items/${itemId}`);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to remove wishlist item',
        data: null
      };
    }
  }

  // Check if product is in wishlist
  async checkProduct(productId) {
    try {
      const response = await axiosInstance.get(`/wishlist/check/${productId}`);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to check product',
        data: { isInWishlist: false }
      };
    }
  }

  // Get all user wishlists
  async getUserWishlists() {
    try {
      const response = await axiosInstance.get('/wishlists');
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to get wishlists',
        data: { wishlists: [] }
      };
    }
  }

  // Transform wishlist item data for frontend use
  transformWishlistItem(backendItem) {
    if (!backendItem) return null;

    const product = backendItem.product || {};
    const image = product.images?.[0] || {};
    const variant = product.variants?.[0] || {};

    return {
      id: backendItem.id,
      wishlistId: backendItem.wishlistId,
      productId: product.id,
      name: product.name || 'Unknown Product',
      slug: product.slug,
      brand: product.brand?.name || 'Unknown Brand',
      price: parseFloat(variant.price) || 0,
      originalPrice: parseFloat(variant.originalPrice) || parseFloat(variant.price) || 0,
      discount: variant.originalPrice && variant.price
        ? Math.round(((variant.originalPrice - variant.price) / variant.originalPrice) * 100)
        : 0,
      image: image.imageUrl || 'https://via.placeholder.com/300x300?text=No+Image',
      isActive: product.isActive,
      stockQuantity: variant.stockQuantity || 0,
      variants: product.variants || []
    };
  }

  // Transform wishlist items array
  transformWishlistItems(backendItems) {
    if (!Array.isArray(backendItems)) return [];
    return backendItems.map(item => this.transformWishlistItem(item));
  }
}

const wishlistService = new WishlistService();
export default wishlistService;


