import React from 'react';
import { Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Import screens
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import ProductsScreen from '../screens/ProductsScreen';
import CartScreen from '../screens/CartScreen';
import CheckoutScreen from '../screens/CheckoutScreen';
import ProfileScreen from '../screens/ProfileScreen';
import AddressesScreen from '../screens/AddressesScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import OrdersScreen from '../screens/OrdersScreen';
import PaymentMethodsScreen from '../screens/PaymentMethodsScreen';
import WishlistScreen from '../screens/WishlistScreen';
import SettingsScreen from '../screens/SettingsScreen';
import HelpSupportScreen from '../screens/HelpSupportScreen';

// Import navigation constants
import { ROUTES, TAB_CONFIG } from './navigationConstants';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Simple icon component with emoji fallback
const TabIcon = ({ name, size, color }) => {
  const iconMap = {
    'home': '🏠',
    'category': '📦',
    'shopping-cart': '🛒',
    'person': '👤',
  };
  return <Text style={{ fontSize: size || 24, color }}>{iconMap[name] || '❓'}</Text>;
};

// Bottom Tab Navigator for main app
function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#FF6B35',
        tabBarInactiveTintColor: '#7F8C8D',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 0,
          elevation: 12,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: -4,
          },
          shadowOpacity: 0.15,
          shadowRadius: 12,
          paddingBottom: 20, // Tăng padding bottom để tránh home indicator
          paddingTop: 12,
          height: 85, // Tăng height để có chỗ cho padding
          borderTopLeftRadius: 25,
          borderTopRightRadius: 25,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: 4,
        },
        tabBarIconStyle: {
          marginTop: 4,
        },
      }}
    >
      <Tab.Screen
        name={ROUTES.HOME}
        component={HomeScreen}
        options={{
          tabBarLabel: TAB_CONFIG.HOME.label,
          tabBarIcon: ({ color, size }) => (
            <TabIcon name={TAB_CONFIG.HOME.icon} size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name={ROUTES.PRODUCTS}
        component={ProductsScreen}
        options={{
          tabBarLabel: TAB_CONFIG.PRODUCTS.label,
          tabBarIcon: ({ color, size }) => (
            <TabIcon name={TAB_CONFIG.PRODUCTS.icon} size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name={ROUTES.CART}
        component={CartScreen}
        options={{
          tabBarLabel: TAB_CONFIG.CART.label,
          tabBarIcon: ({ color, size }) => (
            <TabIcon name={TAB_CONFIG.CART.icon} size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name={ROUTES.PROFILE}
        component={ProfileScreen}
        options={{
          tabBarLabel: TAB_CONFIG.PROFILE.label,
          tabBarIcon: ({ color, size }) => (
            <TabIcon name={TAB_CONFIG.PROFILE.icon} size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

// Main App Navigator
export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={ROUTES.SPLASH}
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen 
          name={ROUTES.SPLASH} 
          component={SplashScreen}
        />
        <Stack.Screen 
          name={ROUTES.LOGIN} 
          component={LoginScreen}
        />
        <Stack.Screen 
          name={ROUTES.REGISTER} 
          component={RegisterScreen}
        />
        <Stack.Screen 
          name={ROUTES.MAIN_APP} 
          component={MainTabNavigator}
        />
        <Stack.Screen
          name={ROUTES.PRODUCT_DETAIL}
          component={ProductDetailScreen}
          options={{
            headerShown: false,
            presentation: 'modal',
          }}
        />
        <Stack.Screen
          name={ROUTES.CHECKOUT}
          component={CheckoutScreen}
          options={{
            headerShown: false,
            presentation: 'modal',
          }}
        />
        <Stack.Screen
          name={ROUTES.ADDRESSES}
          component={AddressesScreen}
          options={{
            headerShown: false,
            presentation: 'modal',
          }}
        />
        <Stack.Screen
          name={ROUTES.NOTIFICATIONS}
          component={NotificationsScreen}
          options={{
            headerShown: false,
            presentation: 'modal',
          }}
        />
        <Stack.Screen
          name={ROUTES.ORDERS}
          component={OrdersScreen}
          options={{
            headerShown: false,
            presentation: 'modal',
          }}
        />
        <Stack.Screen
          name={ROUTES.PAYMENT_METHODS}
          component={PaymentMethodsScreen}
          options={{
            headerShown: false,
            presentation: 'modal',
          }}
        />
        <Stack.Screen
          name={ROUTES.WISHLIST}
          component={WishlistScreen}
          options={{
            headerShown: false,
            presentation: 'modal',
          }}
        />
        <Stack.Screen
          name={ROUTES.SETTINGS}
          component={SettingsScreen}
          options={{
            headerShown: false,
            presentation: 'modal',
          }}
        />
        <Stack.Screen
          name={ROUTES.HELP_SUPPORT}
          component={HelpSupportScreen}
          options={{
            headerShown: false,
            presentation: 'modal',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}