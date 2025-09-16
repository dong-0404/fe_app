// Modern Color palette for ShoeStore app - Ecommerce Theme
export const Colors = {
  // Primary Colors - Modern Orange/Red for shoes
  primary: '#FF6B35', // Vibrant orange-red
  primaryDark: '#E55A2B',
  primaryLight: '#FF8A65',
  
  // Secondary Colors - Complementary
  secondary: '#2C3E50', // Dark blue-gray
  secondaryLight: '#34495E',
  accent: '#F39C12', // Golden yellow
  accentLight: '#F7DC6F',
  
  // Status Colors
  success: '#27AE60', // Green
  error: '#E74C3C', // Red
  warning: '#F39C12', // Orange
  info: '#3498DB', // Blue
  
  // Neutral Colors - Modern grays
  background: '#F8F9FA', // Very light gray
  surface: '#FFFFFF',
  surfaceLight: '#FAFBFC',
  textPrimary: '#2C3E50',
  textSecondary: '#7F8C8D',
  textLight: '#BDC3C7',
  border: '#E8E8E8',
  borderLight: '#F0F0F0',
  
  // Additional Colors
  white: '#FFFFFF',
  black: '#2C3E50',
  gray: '#95A5A6',
  lightGray: '#ECF0F1',
  darkGray: '#34495E',
  
  // Gradient Colors
  gradientStart: '#FF6B35',
  gradientEnd: '#F39C12',
  
  // Shadow Colors
  shadow: 'rgba(0, 0, 0, 0.1)',
  shadowDark: 'rgba(0, 0, 0, 0.2)',
  
  // Status Colors
  pending: '#F39C12',
  confirmed: '#27AE60',
  shipping: '#3498DB',
  delivered: '#27AE60',
  cancelled: '#E74C3C',
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const Typography = {
  h1: {
    fontSize: 32,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: -0.5,
  },
  h2: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.textPrimary,
    letterSpacing: -0.3,
  },
  h3: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.textPrimary,
    letterSpacing: -0.2,
  },
  h4: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  h5: {
    fontSize: 18,
    fontWeight: '500',
    color: Colors.textPrimary,
  },
  body: {
    fontSize: 16,
    fontWeight: '400',
    color: Colors.textPrimary,
    lineHeight: 24,
  },
  bodyBold: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    lineHeight: 24,
  },
  caption: {
    fontSize: 14,
    fontWeight: '400',
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  captionBold: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  small: {
    fontSize: 12,
    fontWeight: '400',
    color: Colors.textLight,
    lineHeight: 16,
  },
  button: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.white,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.primary,
  },
  priceLarge: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.primary,
  },
};
