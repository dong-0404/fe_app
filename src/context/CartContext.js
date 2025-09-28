import React, { createContext, useContext, useReducer, useEffect } from 'react';
import cartService from '../services/cartService';
import { useAuth } from './AuthContext';

// Initial state
const initialState = {
  cart: null,
  cartItems: [],
  totalItems: 0,
  totalPrice: 0,
  isLoading: false,
  error: null,
  lastUpdated: null,
};

// Action types
const CART_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_CART: 'SET_CART',
  ADD_ITEM: 'ADD_ITEM',
  UPDATE_ITEM: 'UPDATE_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM',
  CLEAR_CART: 'CLEAR_CART',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  REFRESH_CART: 'REFRESH_CART',
};

// Reducer
const cartReducer = (state, action) => {
  switch (action.type) {
    case CART_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };

    case CART_ACTIONS.SET_CART:
      const cartData = action.payload;
      return {
        ...state,
        cart: cartData.cart,
        cartItems: cartData.summary?.items || [],
        totalItems: cartData.summary?.totalItems || 0,
        totalPrice: cartData.summary?.totalPrice || 0,
        isLoading: false,
        error: null,
        lastUpdated: new Date().toISOString(),
      };

    case CART_ACTIONS.ADD_ITEM:
      return {
        ...state,
        isLoading: false,
        error: null,
        lastUpdated: new Date().toISOString(),
      };

    case CART_ACTIONS.UPDATE_ITEM:
      return {
        ...state,
        isLoading: false,
        error: null,
        lastUpdated: new Date().toISOString(),
      };

    case CART_ACTIONS.REMOVE_ITEM:
      return {
        ...state,
        isLoading: false,
        error: null,
        lastUpdated: new Date().toISOString(),
      };

    case CART_ACTIONS.CLEAR_CART:
      return {
        ...state,
        cart: null,
        cartItems: [],
        totalItems: 0,
        totalPrice: 0,
        isLoading: false,
        error: null,
        lastUpdated: new Date().toISOString(),
      };

    case CART_ACTIONS.SET_ERROR:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };

    case CART_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };

    case CART_ACTIONS.REFRESH_CART:
      return {
        ...state,
        lastUpdated: new Date().toISOString(),
      };

    default:
      return state;
  }
};

// Create context
const CartContext = createContext();

// CartProvider component
export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const { isAuthenticated } = useAuth();

  // Load cart on app start and when authentication status changes
  useEffect(() => {
    loadCart();
  }, [isAuthenticated]);

  const loadCart = async () => {
    try {
      dispatch({ type: CART_ACTIONS.SET_LOADING, payload: true });
      const response = await cartService.getCart(isAuthenticated);
      
      if (response.success !== false) {
        dispatch({
          type: CART_ACTIONS.SET_CART,
          payload: response.data,
        });
      } else {
        dispatch({
          type: CART_ACTIONS.SET_ERROR,
          payload: response.message,
        });
      }
    } catch (error) {
      dispatch({
        type: CART_ACTIONS.SET_ERROR,
        payload: 'Failed to load cart',
      });
    }
  };

  const addToCart = async (productVariantId, quantity = 1) => {
    try {
      dispatch({ type: CART_ACTIONS.SET_LOADING, payload: true });
      const response = await cartService.addToCart(productVariantId, quantity, isAuthenticated);
      
      if (response.success !== false) {
        dispatch({
          type: CART_ACTIONS.ADD_ITEM,
        });
        // Refresh cart to get updated data
        await loadCart();
        return response;
      } else {
        dispatch({
          type: CART_ACTIONS.SET_ERROR,
          payload: response.message,
        });
        return response;
      }
    } catch (error) {
      dispatch({
        type: CART_ACTIONS.SET_ERROR,
        payload: 'Failed to add item to cart',
      });
      return {
        success: false,
        message: 'Failed to add item to cart',
      };
    }
  };

  const updateItemQuantity = async (itemId, quantity) => {
    try {
      dispatch({ type: CART_ACTIONS.SET_LOADING, payload: true });
      const response = await cartService.updateItemQuantity(itemId, quantity, isAuthenticated);
      
      if (response.success !== false) {
        dispatch({
          type: CART_ACTIONS.UPDATE_ITEM,
        });
        // Refresh cart to get updated data
        await loadCart();
        return response;
      } else {
        dispatch({
          type: CART_ACTIONS.SET_ERROR,
          payload: response.message,
        });
        return response;
      }
    } catch (error) {
      dispatch({
        type: CART_ACTIONS.SET_ERROR,
        payload: 'Failed to update item quantity',
      });
      return {
        success: false,
        message: 'Failed to update item quantity',
      };
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      dispatch({ type: CART_ACTIONS.SET_LOADING, payload: true });
      const response = await cartService.removeFromCart(itemId, isAuthenticated);
      
      if (response.success !== false) {
        dispatch({
          type: CART_ACTIONS.REMOVE_ITEM,
        });
        // Refresh cart to get updated data
        await loadCart();
        return response;
      } else {
        dispatch({
          type: CART_ACTIONS.SET_ERROR,
          payload: response.message,
        });
        return response;
      }
    } catch (error) {
      dispatch({
        type: CART_ACTIONS.SET_ERROR,
        payload: 'Failed to remove item from cart',
      });
      return {
        success: false,
        message: 'Failed to remove item from cart',
      };
    }
  };

  const clearCart = async () => {
    try {
      dispatch({ type: CART_ACTIONS.SET_LOADING, payload: true });
      const response = await cartService.clearCart(isAuthenticated);
      
      if (response.success !== false) {
        dispatch({
          type: CART_ACTIONS.CLEAR_CART,
        });
        return response;
      } else {
        dispatch({
          type: CART_ACTIONS.SET_ERROR,
          payload: response.message,
        });
        return response;
      }
    } catch (error) {
      dispatch({
        type: CART_ACTIONS.SET_ERROR,
        payload: 'Failed to clear cart',
      });
      return {
        success: false,
        message: 'Failed to clear cart',
      };
    }
  };

  const convertGuestCartToUserCart = async () => {
    try {
      if (!isAuthenticated) {
        throw new Error('User must be authenticated to convert cart');
      }

      dispatch({ type: CART_ACTIONS.SET_LOADING, payload: true });
      const response = await cartService.convertGuestCartToUserCart();
      
      if (response.success !== false) {
        dispatch({
          type: CART_ACTIONS.SET_CART,
          payload: response.data,
        });
        return response;
      } else {
        dispatch({
          type: CART_ACTIONS.SET_ERROR,
          payload: response.message,
        });
        return response;
      }
    } catch (error) {
      dispatch({
        type: CART_ACTIONS.SET_ERROR,
        payload: 'Failed to convert guest cart to user cart',
      });
      return {
        success: false,
        message: 'Failed to convert guest cart to user cart',
      };
    }
  };

  const refreshCart = async () => {
    await loadCart();
  };

  const clearError = () => {
    dispatch({ type: CART_ACTIONS.CLEAR_ERROR });
  };

  // Helper functions
  const getItemById = (itemId) => {
    return state.cartItems.find(item => item.id === itemId);
  };

  const getItemByProductVariantId = (productVariantId) => {
    return state.cartItems.find(item => item.productVariantId === productVariantId);
  };

  const isItemInCart = (productVariantId) => {
    return state.cartItems.some(item => item.productVariantId === productVariantId);
  };

  const getItemQuantity = (productVariantId) => {
    const item = getItemByProductVariantId(productVariantId);
    return item ? item.quantity : 0;
  };

  const formatPrice = (price) => {
    const numPrice = parseFloat(price) || 0;
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(numPrice);
  };

  const value = {
    ...state,
    addToCart,
    updateItemQuantity,
    removeFromCart,
    clearCart,
    convertGuestCartToUserCart,
    refreshCart,
    clearError,
    loadCart,
    // Helper functions
    getItemById,
    getItemByProductVariantId,
    isItemInCart,
    getItemQuantity,
    formatPrice,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext;
