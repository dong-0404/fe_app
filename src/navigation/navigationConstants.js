// Navigation Constants
export const ROUTES = {
  // Auth Stack
  SPLASH: 'Splash',
  LOGIN: 'Login',
  REGISTER: 'Register',
  
  // Main App Stack
  MAIN_APP: 'MainApp',
  
  // Tab Navigator
  HOME: 'Home',
  PRODUCTS: 'Products',
  CART: 'Cart',
  PROFILE: 'Profile',
  
  // Modal Screens
  PRODUCT_DETAIL: 'ProductDetail',
  CHECKOUT: 'Checkout',
  
  // Profile Sub-screens
  ADDRESSES: 'Addresses',
  NOTIFICATIONS: 'Notifications',
  ORDERS: 'Orders',
  PAYMENT_METHODS: 'PaymentMethods',
  WISHLIST: 'Wishlist',
  SETTINGS: 'Settings',
  HELP_SUPPORT: 'HelpSupport',
};

// Navigation Helpers
export const navigationHelpers = {
  // Navigate to product detail
  goToProductDetail: (navigation, productId, productData) => {
    navigation.navigate(ROUTES.PRODUCT_DETAIL, {
      productId,
      productData,
    });
  },
  
  // Navigate to checkout
  goToCheckout: (navigation, cartItems) => {
    navigation.navigate(ROUTES.CHECKOUT, {
      cartItems,
    });
  },
  
  // Navigate to products with filter
  goToProducts: (navigation, category, searchQuery, title) => {
    navigation.navigate(ROUTES.PRODUCTS, {
      category,
      searchQuery,
      title,
    });
  },
  
  // Navigate to cart
  goToCart: (navigation) => {
    navigation.navigate(ROUTES.MAIN_APP, {
      screen: ROUTES.CART,
    });
  },
  
  // Navigate to home
  goToHome: (navigation) => {
    navigation.navigate(ROUTES.MAIN_APP, {
      screen: ROUTES.HOME,
    });
  },
  
  // Navigate to profile
  goToProfile: (navigation) => {
    navigation.navigate(ROUTES.MAIN_APP, {
      screen: ROUTES.PROFILE,
    });
  },
  
  // Navigate to products tab
  goToProductsTab: (navigation) => {
    navigation.navigate(ROUTES.MAIN_APP, {
      screen: ROUTES.PRODUCTS,
    });
  },
  
  // Navigate to addresses
  goToAddresses: (navigation) => {
    navigation.navigate(ROUTES.ADDRESSES);
  },
  
  // Navigate to notifications
  goToNotifications: (navigation) => {
    navigation.navigate(ROUTES.NOTIFICATIONS);
  },
  
  // Navigate to orders
  goToOrders: (navigation) => {
    navigation.navigate(ROUTES.ORDERS);
  },
  
  // Navigate to payment methods
  goToPaymentMethods: (navigation) => {
    navigation.navigate(ROUTES.PAYMENT_METHODS);
  },
  
  // Navigate to wishlist
  goToWishlist: (navigation) => {
    navigation.navigate(ROUTES.WISHLIST);
  },
  
  // Navigate to settings
  goToSettings: (navigation) => {
    navigation.navigate(ROUTES.SETTINGS);
  },
  
  // Navigate to help & support
  goToHelpSupport: (navigation) => {
    navigation.navigate(ROUTES.HELP_SUPPORT);
  },
};

// Tab Bar Configuration
export const TAB_CONFIG = {
  HOME: {
    label: 'Trang chủ',
    icon: 'home',
  },
  PRODUCTS: {
    label: 'Sản phẩm',
    icon: 'category',
  },
  CART: {
    label: 'Giỏ hàng',
    icon: 'shopping-cart',
  },
  PROFILE: {
    label: 'Tài khoản',
    icon: 'person',
  },
};

export default {
  ROUTES,
  navigationHelpers,
  TAB_CONFIG,
};
