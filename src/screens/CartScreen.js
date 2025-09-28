import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Card, IconButton, ActivityIndicator } from 'react-native-paper';
import { Colors, Spacing, Typography } from '../constants/colors';
import { ROUTES } from '../navigation/navigationConstants';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function CartScreen({ navigation }) {
  const { 
    cartItems, 
    totalItems, 
    totalPrice, 
    isLoading, 
    error,
    updateItemQuantity, 
    removeFromCart, 
    refreshCart,
    formatPrice 
  } = useCart();
  const { isAuthenticated } = useAuth();
  const [refreshing, setRefreshing] = useState(false);

  const shippingFee = 50000;

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshCart();
    setRefreshing(false);
  };

  const handleUpdateQuantity = async (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveItem(itemId);
      return;
    }
    
    const response = await updateItemQuantity(itemId, newQuantity);
    if (response.success === false) {
      Alert.alert('Error', response.message);
    }
  };

  const handleRemoveItem = (itemId) => {
    Alert.alert(
      'Remove Item',
      'Are you sure you want to remove this item from your cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            const response = await removeFromCart(itemId);
            if (response.success === false) {
              Alert.alert('Error', response.message);
            }
          },
        },
      ]
    );
  };

  const getSubtotal = () => {
    return totalPrice;
  };

  const getTotal = () => {
    return getSubtotal() + shippingFee;
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      Alert.alert('Empty Cart', 'Please add items to your cart first');
      return;
    }
    navigation.navigate(ROUTES.CHECKOUT, { 
      cartItems, 
      subtotal: getSubtotal(), 
      shippingFee, 
      total: getTotal() 
    });
  };

  const renderCartItem = (item) => (
    <Card key={item.id} style={styles.cartItem}>
      <View style={styles.itemContainer}>
        <View style={styles.itemImageContainer}>
          <Image 
            source={{ uri: item.productVariant?.product?.images?.[0]?.imageUrl || 'https://via.placeholder.com/300x300?text=No+Image' }} 
            style={styles.itemImage} 
          />
          {/* Badges */}
          <View style={styles.badgeContainer}>
            {item.productVariant?.product?.isNew && (
              <View style={[styles.badge, styles.newBadge]}>
                <Text style={styles.badgeText}>NEW</Text>
              </View>
            )}
            {item.productVariant?.product?.isHot && (
              <View style={[styles.badge, styles.hotBadge]}>
                <Text style={styles.badgeText}>HOT</Text>
              </View>
            )}
            {item.discount > 0 && (
              <View style={[styles.badge, styles.discountBadge]}>
                <Text style={styles.badgeText}>-{item.discount}%</Text>
              </View>
            )}
          </View>
        </View>
        <View style={styles.itemInfo}>
          <Text style={styles.itemBrand}>{item.productVariant?.product?.brand?.name || 'Unknown Brand'}</Text>
          <Text style={styles.itemName} numberOfLines={2}>
            {item.productVariant?.product?.name || 'Unknown Product'}
          </Text>
          <View style={styles.itemDetailsContainer}>
            {item.productVariant?.size && (
              <View style={styles.detailTag}>
                <Text style={styles.detailTagText}>Size {item.productVariant.size}</Text>
              </View>
            )}
            {item.productVariant?.color && (
              <View style={styles.detailTag}>
                <Text style={styles.detailTagText}>{item.productVariant.color}</Text>
              </View>
            )}
          </View>
          <View style={styles.priceContainer}>
            <Text style={styles.itemPrice}>{formatPrice(item.priceAtAdd)}</Text>
            {item.productVariant?.originalPrice > item.priceAtAdd && (
              <Text style={styles.originalPrice}>
                {formatPrice(item.productVariant.originalPrice)}
              </Text>
            )}
          </View>
        </View>
        <View style={styles.itemActions}>
          <View style={styles.quantityContainer}>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => handleUpdateQuantity(item.id, item.quantity - 1)}
            >
              <Text style={styles.quantityButtonText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.quantityText}>{item.quantity}</Text>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => handleUpdateQuantity(item.id, item.quantity + 1)}
            >
              <Text style={styles.quantityButtonText}>+</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => handleRemoveItem(item.id)}
          >
            <Text style={styles.removeButtonText}>🗑️</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Card>
  );

  if (isLoading && cartItems.length === 0) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom', 'left', 'right']}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading cart...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (cartItems.length === 0) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom', 'left', 'right']}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🛒</Text>
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptySubtitle}>
            Add some products to get started
          </Text>
          <Button
            mode="contained"
            style={styles.shopButton}
            onPress={() => navigation.navigate(ROUTES.HOME)}
          >
            Start Shopping
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backText}>← Shopping Cart</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.cartList} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {cartItems.map(renderCartItem)}
      </ScrollView>

      <Card style={styles.summaryCard}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Subtotal</Text>
          <Text style={styles.summaryValue}>{formatPrice(getSubtotal())}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Shipping</Text>
          <Text style={styles.summaryValue}>{formatPrice(shippingFee)}</Text>
        </View>
        <View style={[styles.summaryRow, styles.totalRow]}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>{formatPrice(getTotal())}</Text>
        </View>
      </Card>

      <View style={styles.checkoutContainer}>
        <Button
          mode="contained"
          style={styles.checkoutButton}
          onPress={handleCheckout}
          loading={isLoading}
          disabled={isLoading}
        >
          Proceed to Checkout
        </Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    padding: Spacing.md,
    backgroundColor: Colors.white,
  },
  backButton: {
    alignSelf: 'flex-start',
  },
  backText: {
    ...Typography.body,
    color: Colors.primary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  loadingText: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginTop: Spacing.md,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  emptyIcon: {
    fontSize: 80,
    marginBottom: Spacing.lg,
  },
  emptyTitle: {
    ...Typography.h2,
    marginBottom: Spacing.sm,
  },
  emptySubtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  shopButton: {
    borderRadius: 8,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.primary,
  },
  cartList: {
    flex: 1,
    padding: Spacing.md,
  },
  cartItem: {
    marginBottom: Spacing.md,
    borderRadius: 16,
    elevation: 4,
    shadowColor: Colors.shadowDark,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    backgroundColor: Colors.white,
    borderWidth: 0.5,
    borderColor: '#f0f0f0',
  },
  itemContainer: {
    flexDirection: 'row',
    padding: Spacing.md,
  },
  itemImageContainer: {
    position: 'relative',
    marginRight: Spacing.md,
  },
  itemImage: {
    width: 90,
    height: 90,
    borderRadius: 12,
  },
  badgeContainer: {
    position: 'absolute',
    top: -5,
    left: -5,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  badge: {
    paddingHorizontal: Spacing.xs,
    paddingVertical: 2,
    borderRadius: 8,
    marginRight: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  newBadge: {
    backgroundColor: Colors.success,
  },
  hotBadge: {
    backgroundColor: Colors.error,
  },
  discountBadge: {
    backgroundColor: Colors.warning,
  },
  badgeText: {
    ...Typography.small,
    color: Colors.white,
    fontWeight: 'bold',
    fontSize: 9,
  },
  itemInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  itemBrand: {
    ...Typography.small,
    color: Colors.textSecondary,
    fontWeight: '600',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  itemName: {
    ...Typography.caption,
    fontWeight: '600',
    marginBottom: Spacing.sm,
    lineHeight: 20,
    fontSize: 15,
    color: Colors.textPrimary,
  },
  itemDetailsContainer: {
    flexDirection: 'row',
    marginBottom: Spacing.sm,
  },
  detailTag: {
    backgroundColor: '#f7fafc',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: Spacing.sm,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  detailTagText: {
    ...Typography.small,
    color: '#4a5568',
    fontWeight: '500',
    fontSize: 11,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemPrice: {
    ...Typography.price,
    marginRight: Spacing.sm,
    fontSize: 16,
    fontWeight: 'bold',
  },
  originalPrice: {
    ...Typography.small,
    color: Colors.textSecondary,
    textDecorationLine: 'line-through',
    fontSize: 12,
  },
  itemActions: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    flexDirection: 'column',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: Colors.shadow,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  quantityButtonText: {
    ...Typography.caption,
    color: Colors.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
  quantityText: {
    ...Typography.caption,
    marginHorizontal: Spacing.md,
    minWidth: 24,
    textAlign: 'center',
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  removeButton: {
    padding: Spacing.sm,
    backgroundColor: '#ffebee',
    borderRadius: 20,
    elevation: 2,
    shadowColor: Colors.shadow,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    borderWidth: 1,
    borderColor: '#ffcdd2',
    minWidth: 40,
    minHeight: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    fontSize: 18,
  },
  summaryCard: {
    margin: Spacing.md,
    padding: Spacing.lg,
    borderRadius: 16,
    backgroundColor: Colors.white,
    elevation: 4,
    shadowColor: Colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  summaryLabel: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  summaryValue: {
    ...Typography.body,
    fontWeight: '500',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: Spacing.sm,
    marginTop: Spacing.sm,
  },
  totalLabel: {
    ...Typography.h4,
    color: Colors.textPrimary,
  },
  totalValue: {
    ...Typography.h4,
    color: Colors.primary,
    fontWeight: 'bold',
  },
  checkoutContainer: {
    padding: Spacing.md,
    paddingBottom: 105, // Tăng padding để phù hợp với tab bar mới
    backgroundColor: Colors.white,
  },
  checkoutButton: {
    borderRadius: 25,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.primary,
    elevation: 6,
    shadowColor: Colors.shadowDark,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
});
