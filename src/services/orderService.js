import { axiosInstance } from './api';

class OrderService {
  // Create order from cart
  async createOrder(orderData) {
    try {
      const response = await axiosInstance.post('/orders', orderData);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create order',
        data: null
      };
    }
  }

  // Get order by ID
  async getOrderById(orderId) {
    try {
      const response = await axiosInstance.get(`/orders/${orderId}`);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to get order',
        data: null
      };
    }
  }

  // Get user orders
  async getUserOrders(options = {}) {
    try {
      const params = new URLSearchParams();
      if (options.status) params.append('status', options.status);
      if (options.page) params.append('page', options.page);
      if (options.limit) params.append('limit', options.limit);
      if (options.orderBy) params.append('orderBy', options.orderBy);
      if (options.orderDirection) params.append('orderDirection', options.orderDirection);

      const response = await axiosInstance.get(`/orders?${params.toString()}`);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to get orders',
        data: { orders: [], pagination: null }
      };
    }
  }

  // Cancel order
  async cancelOrder(orderId) {
    try {
      const response = await axiosInstance.put(`/orders/${orderId}/cancel`);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to cancel order',
        data: null
      };
    }
  }

  // Transform order data for frontend use
  transformOrder(backendOrder) {
    if (!backendOrder) return null;

    return {
      id: backendOrder.id,
      orderNumber: backendOrder.orderNumber,
      status: backendOrder.status,
      paymentStatus: backendOrder.paymentStatus,
      paymentMethod: backendOrder.paymentMethod,
      paymentProvider: backendOrder.paymentProvider,
      totalAmount: parseFloat(backendOrder.totalAmount) || 0,
      subtotalAmount: parseFloat(backendOrder.subtotalAmount) || 0,
      shippingFee: parseFloat(backendOrder.shippingFee) || 0,
      discountAmount: parseFloat(backendOrder.discountAmount) || 0,
      taxAmount: parseFloat(backendOrder.taxAmount) || 0,
      placedAt: backendOrder.placedAt,
      shippedAt: backendOrder.shippedAt,
      deliveredAt: backendOrder.deliveredAt,
      notes: backendOrder.notes,
      items: this.transformOrderItems(backendOrder.items || []),
      shippingAddress: this.transformOrderAddress(
        backendOrder.addresses?.find(addr => addr.type === 'shipping')
      ),
      billingAddress: this.transformOrderAddress(
        backendOrder.addresses?.find(addr => addr.type === 'billing')
      )
    };
  }

  // Transform order items
  transformOrderItems(backendItems) {
    if (!Array.isArray(backendItems)) return [];
    return backendItems.map(item => ({
      id: item.id,
      productId: item.productId,
      productVariantId: item.productVariantId,
      name: item.nameSnapshot,
      brand: item.brandSnapshot,
      image: item.imageSnapshot,
      sku: item.skuSnapshot,
      unitPrice: parseFloat(item.unitPrice) || 0,
      originalPrice: parseFloat(item.originalPrice) || 0,
      quantity: item.quantity,
      totalPrice: parseFloat(item.totalPrice) || 0,
      product: item.product ? {
        id: item.product.id,
        name: item.product.name,
        slug: item.product.slug,
        image: item.product.images?.[0]?.imageUrl
      } : null,
      variant: item.productVariant ? {
        id: item.productVariant.id,
        sku: item.productVariant.sku,
        color: item.productVariant.color,
        size: item.productVariant.size
      } : null
    }));
  }

  // Transform order address
  transformOrderAddress(backendAddress) {
    if (!backendAddress) return null;

    return {
      type: backendAddress.type,
      fullName: backendAddress.fullName,
      phone: backendAddress.phone,
      line1: backendAddress.line1,
      line2: backendAddress.line2,
      city: backendAddress.city,
      state: backendAddress.state,
      postalCode: backendAddress.postalCode,
      country: backendAddress.country,
      formatted: `${backendAddress.line1}${backendAddress.line2 ? ', ' + backendAddress.line2 : ''}, ${backendAddress.city}, ${backendAddress.state} ${backendAddress.postalCode}`
    };
  }

  // Transform orders array
  transformOrders(backendOrders) {
    if (!Array.isArray(backendOrders)) return [];
    return backendOrders.map(order => this.transformOrder(order));
  }
}

const orderService = new OrderService();
export default orderService;

