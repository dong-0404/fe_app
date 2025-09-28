import { axiosInstance } from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

class CartService {
  // Generate or get session ID for guest users
  async getSessionId() {
    try {
      let sessionId = await AsyncStorage.getItem('guest_session_id');
      if (!sessionId) {
        sessionId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        await AsyncStorage.setItem('guest_session_id', sessionId);
      }
      return sessionId;
    } catch (error) {
      console.error('Error getting session ID:', error);
      return `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
  }

  // Get user's cart
  async getUserCart() {
    try {
      const response = await axiosInstance.get('/user/cart');
      return response.data;
    } catch (error) {
      console.error('Get user cart error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to get cart',
        data: { cart: null, summary: { totalItems: 0, totalPrice: 0, items: [] } }
      };
    }
  }

  // Get or create user's cart
  async getOrCreateUserCart() {
    try {
      const response = await axiosInstance.get('/user/cart/create');
      return response.data;
    } catch (error) {
      console.error('Get or create user cart error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to get or create cart',
        data: { cart: null, summary: { totalItems: 0, totalPrice: 0, items: [] } }
      };
    }
  }

  // Get guest cart
  async getGuestCart() {
    try {
      const sessionId = await this.getSessionId();
      const response = await axiosInstance.get(`/guest/cart/${sessionId}`);
      return response.data;
    } catch (error) {
      console.error('Get guest cart error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to get guest cart',
        data: { cart: null, summary: { totalItems: 0, totalPrice: 0, items: [] } }
      };
    }
  }

  // Get or create guest cart
  async getOrCreateGuestCart() {
    try {
      const sessionId = await this.getSessionId();
      const response = await axiosInstance.get(`/guest/cart/${sessionId}/create`);
      return response.data;
    } catch (error) {
      console.error('Get or create guest cart error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to get or create guest cart',
        data: { cart: null, summary: { totalItems: 0, totalPrice: 0, items: [] } }
      };
    }
  }

  // Add item to user's cart
  async addToUserCart(productVariantId, quantity = 1) {
    try {
      const response = await axiosInstance.post('/user/cart/items', {
        productVariantId,
        quantity
      });
      return response.data;
    } catch (error) {
      console.error('Add to user cart error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to add item to cart',
        data: null
      };
    }
  }

  // Add item to guest cart
  async addToGuestCart(productVariantId, quantity = 1) {
    try {
      const sessionId = await this.getSessionId();
      const response = await axiosInstance.post(`/guest/cart/${sessionId}/items`, {
        productVariantId,
        quantity
      });
      return response.data;
    } catch (error) {
      console.error('Add to guest cart error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to add item to guest cart',
        data: null
      };
    }
  }

  // Update item quantity in user's cart
  async updateUserCartItem(itemId, quantity) {
    try {
      const response = await axiosInstance.put(`/user/cart/items/${itemId}`, {
        quantity
      });
      return response.data;
    } catch (error) {
      console.error('Update user cart item error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update item quantity',
        data: null
      };
    }
  }

  // Update item quantity in guest cart
  async updateGuestCartItem(itemId, quantity) {
    try {
      const response = await axiosInstance.put(`/guest/cart/items/${itemId}`, {
        quantity
      });
      return response.data;
    } catch (error) {
      console.error('Update guest cart item error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update guest cart item quantity',
        data: null
      };
    }
  }

  // Remove item from user's cart
  async removeFromUserCart(itemId) {
    try {
      const response = await axiosInstance.delete(`/user/cart/items/${itemId}`);
      return response.data;
    } catch (error) {
      console.error('Remove from user cart error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to remove item from cart',
        data: null
      };
    }
  }

  // Remove item from guest cart
  async removeFromGuestCart(itemId) {
    try {
      const response = await axiosInstance.delete(`/guest/cart/items/${itemId}`);
      return response.data;
    } catch (error) {
      console.error('Remove from guest cart error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to remove item from guest cart',
        data: null
      };
    }
  }

  // Clear user's cart
  async clearUserCart() {
    try {
      const response = await axiosInstance.delete('/user/cart/clear');
      return response.data;
    } catch (error) {
      console.error('Clear user cart error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to clear cart',
        data: null
      };
    }
  }

  // Clear guest cart
  async clearGuestCart() {
    try {
      const sessionId = await this.getSessionId();
      const response = await axiosInstance.delete(`/guest/cart/${sessionId}/clear`);
      return response.data;
    } catch (error) {
      console.error('Clear guest cart error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to clear guest cart',
        data: null
      };
    }
  }

  // Convert guest cart to user cart
  async convertGuestCartToUserCart() {
    try {
      const sessionId = await this.getSessionId();
      const response = await axiosInstance.post('/cart/convert', {
        sessionId
      });
      return response.data;
    } catch (error) {
      console.error('Convert guest cart to user cart error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to convert guest cart to user cart',
        data: null
      };
    }
  }

  // Get cart by ID
  async getCartById(cartId) {
    try {
      const response = await axiosInstance.get(`/cart/${cartId}`);
      return response.data;
    } catch (error) {
      console.error('Get cart by ID error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to get cart',
        data: null
      };
    }
  }

  // Validate cart items
  async validateCartItems(cartId) {
    try {
      const response = await axiosInstance.get(`/cart/${cartId}/validate`);
      return response.data;
    } catch (error) {
      console.error('Validate cart items error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to validate cart items',
        data: null
      };
    }
  }

  // Update cart item prices
  async updateCartItemPrices(cartId) {
    try {
      const response = await axiosInstance.put(`/cart/${cartId}/update-prices`);
      return response.data;
    } catch (error) {
      console.error('Update cart item prices error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update cart item prices',
        data: null
      };
    }
  }

  // Transform cart data for frontend use
  transformCartData(backendCart) {
    if (!backendCart) return null;

    const items = backendCart.items?.map(item => this.transformCartItemData(item)) || [];

    return {
      id: backendCart.id,
      userId: backendCart.userId,
      sessionId: backendCart.sessionId,
      status: backendCart.status,
      items: items,
      totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
      totalPrice: items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      createdAt: backendCart.createdAt,
      updatedAt: backendCart.updatedAt
    };
  }

  // Transform cart item data for frontend use
  transformCartItemData(backendItem) {
    if (!backendItem) return null;

    const productVariant = backendItem.productVariant;
    const product = productVariant?.product;
    const brand = product?.brand;
    const primaryImage = product?.images?.find(img => img.isPrimary) || product?.images?.[0];

    // Calculate discount percentage
    const price = productVariant?.price || 0;
    const originalPrice = productVariant?.originalPrice || price;
    const discount = originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

    return {
      id: backendItem.id,
      cartId: backendItem.cartId,
      productVariantId: backendItem.productVariantId,
      quantity: backendItem.quantity,
      price: price,
      originalPrice: originalPrice,
      discount: discount,
      priceAtAdd: backendItem.priceAtAdd,
      product: {
        id: product?.id,
        name: product?.name,
        slug: product?.slug,
        description: product?.description,
        shortDescription: product?.shortDescription,
        brand: brand?.name || 'Unknown Brand',
        brandId: product?.brandId,
        image: primaryImage?.imageUrl || 'https://via.placeholder.com/300x300?text=No+Image',
        isActive: product?.isActive,
        isFeatured: product?.isFeatured,
        isHot: product?.isHot,
        isNew: product?.isNew
      },
      variant: {
        id: productVariant?.id,
        sku: productVariant?.sku,
        color: productVariant?.color,
        size: productVariant?.size,
        stockQuantity: productVariant?.stockQuantity,
        isActive: productVariant?.isActive,
        weight: productVariant?.weight,
        dimensions: productVariant?.dimensions
      },
      createdAt: backendItem.createdAt,
      updatedAt: backendItem.updatedAt
    };
  }

  // Transform cart summary data
  transformCartSummaryData(backendSummary) {
    if (!backendSummary) return { totalItems: 0, totalPrice: 0, items: [] };

    return {
      totalItems: backendSummary.totalItems || 0,
      totalPrice: backendSummary.totalPrice || 0,
      items: backendSummary.items?.map(item => this.transformCartItemData(item)) || []
    };
  }

  // Helper method to add item to cart (works for both user and guest)
  async addToCart(productVariantId, quantity = 1, isAuthenticated = false) {
    if (isAuthenticated) {
      return await this.addToUserCart(productVariantId, quantity);
    } else {
      return await this.addToGuestCart(productVariantId, quantity);
    }
  }

  // Helper method to update item quantity (works for both user and guest)
  async updateItemQuantity(itemId, quantity, isAuthenticated = false) {
    if (isAuthenticated) {
      return await this.updateUserCartItem(itemId, quantity);
    } else {
      return await this.updateGuestCartItem(itemId, quantity);
    }
  }

  // Helper method to remove item from cart (works for both user and guest)
  async removeFromCart(itemId, isAuthenticated = false) {
    if (isAuthenticated) {
      return await this.removeFromUserCart(itemId);
    } else {
      return await this.removeFromGuestCart(itemId);
    }
  }

  // Helper method to get cart (works for both user and guest)
  async getCart(isAuthenticated = false) {
    if (isAuthenticated) {
      return await this.getUserCart();
    } else {
      return await this.getGuestCart();
    }
  }

  // Helper method to get or create cart (works for both user and guest)
  async getOrCreateCart(isAuthenticated = false) {
    if (isAuthenticated) {
      return await this.getOrCreateUserCart();
    } else {
      return await this.getOrCreateGuestCart();
    }
  }

  // Helper method to clear cart (works for both user and guest)
  async clearCart(isAuthenticated = false) {
    if (isAuthenticated) {
      return await this.clearUserCart();
    } else {
      return await this.clearGuestCart();
    }
  }
}

const cartService = new CartService();
export default cartService;
