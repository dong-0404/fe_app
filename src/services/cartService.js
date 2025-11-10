import { axiosInstance } from './api';

class CartService {
  // Get user's cart
  async getCart() {
    try {
      const response = await axiosInstance.get('/cart');
      
      const backendData = response.data;
      
      if (backendData && backendData.success !== false && backendData.data) {
        const cart = backendData.data.cart || {};
        if (!cart.items) {
          cart.items = [];
        }
        
        return {
          success: true,
          message: backendData.message || 'Cart retrieved successfully',
          data: {
            cart: cart,
            totals: backendData.data.totals || { subtotal: 0, totalItems: 0 }
          }
        };
      } else {
        return {
          success: false,
          message: backendData?.message || 'Failed to get cart',
          data: { cart: { items: [] }, totals: { subtotal: 0, totalItems: 0 } }
        };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Failed to get cart',
        data: { cart: { items: [] }, totals: { subtotal: 0, totalItems: 0 } },
        error: {
          status: error.response?.status,
          code: error.code,
          message: error.message
        }
      };
    }
  }

  // Add item to cart
  async addItem(productVariantId, quantity = 1) {
    try {
      const response = await axiosInstance.post('/cart/items', {
        productVariantId,
        quantity
      });
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to add item to cart',
        data: null
      };
    }
  }

  // Update item quantity
  async updateItem(itemId, quantity) {
    try {
      const response = await axiosInstance.put(`/cart/items/${itemId}`, {
        quantity
      });
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update cart item',
        data: null
      };
    }
  }

  // Remove item from cart
  async removeItem(itemId) {
    try {
      const response = await axiosInstance.delete(`/cart/items/${itemId}`);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to remove cart item',
        data: null
      };
    }
  }

  // Clear cart
  async clearCart() {
    try {
      const response = await axiosInstance.delete('/cart');
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to clear cart',
        data: null
      };
    }
  }

  // Transform cart item data for frontend use
  transformCartItem(backendItem) {
    if (!backendItem) return null;

    const variant = backendItem.productVariant || {};
    const product = variant.product || {};
    const image = product.images?.[0] || {};

    return {
      id: backendItem.id,
      cartId: backendItem.cartId,
      productVariantId: backendItem.productVariantId,
      quantity: backendItem.quantity,
      priceAtAdd: parseFloat(backendItem.priceAtAdd) || 0,
      // Product info
      productId: product.id,
      name: product.name || 'Unknown Product',
      slug: product.slug,
      brand: product.brand?.name || variant.brand?.name || 'Unknown Brand',
      // Variant info
      sku: variant.sku,
      color: variant.color,
      size: variant.size,
      price: parseFloat(variant.price) || 0,
      originalPrice: parseFloat(variant.originalPrice) || parseFloat(variant.price) || 0,
      stockQuantity: variant.stockQuantity || 0,
      // Image
      image: image.imageUrl || 'https://via.placeholder.com/300x300?text=No+Image',
      // Calculated
      total: parseFloat(backendItem.priceAtAdd) * backendItem.quantity,
      discount: variant.originalPrice && variant.price
        ? Math.round(((variant.originalPrice - variant.price) / variant.originalPrice) * 100)
        : 0
    };
  }

  // Transform cart items array
  transformCartItems(backendItems) {
    if (!Array.isArray(backendItems)) return [];
    return backendItems.map(item => this.transformCartItem(item));
  }
}

const cartService = new CartService();
export default cartService;


