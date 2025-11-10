import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  FlatList,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from 'react-native-paper';
import { Colors, Spacing, Typography } from '../constants/colors';
import { ROUTES } from '../navigation/navigationConstants';
import cartService from '../services/cartService';
import { useAuth } from '../context/AuthContext';

export default function CartScreen({ navigation }) {
  const { isAuthenticated } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [totals, setTotals] = useState({ subtotal: 0, totalItems: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const shippingFee = 50000;

  // Load cart on mount
  useEffect(() => {
    if (isAuthenticated) {
      loadCart();
    } else {
      setLoading(false);
      setCartItems([]);
    }
  }, [isAuthenticated]);

  // Reload cart when screen is focused
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (isAuthenticated) {
        loadCart({ showLoader: false });
      }
    });

    return unsubscribe;
  }, [navigation, isAuthenticated]);

  const loadCart = async ({ showLoader = true } = {}) => {
    try {
      setError(null);
      if (showLoader) {
        setLoading(true);
      }
      const response = await cartService.getCart();

      if (response.success !== false && response.data) {
        const items = response.data.cart?.items || [];
        const transformedItems = cartService.transformCartItems(items);
        setCartItems(transformedItems);
        setTotals(response.data.totals || { subtotal: 0, totalItems: 0 });
      } else {
        setCartItems([]);
        setTotals({ subtotal: 0, totalItems: 0 });
        if (response.message) {
          setError(response.message);
        }
      }
    } catch (err) {
      setError('Failed to load cart. Please try again.');
      setCartItems([]);
      setTotals({ subtotal: 0, totalItems: 0 });
    } finally {
      if (showLoader) {
        setLoading(false);
      }
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadCart({ showLoader: false });
    setRefreshing(false);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const updateQuantity = async (item, newQuantity) => {
    if (newQuantity <= 0) {
      removeItem(item.id);
      return;
    }

    if (item.stockQuantity > 0 && newQuantity > item.stockQuantity) {
      Alert.alert(
        'Stock limit reached',
        `Only ${item.stockQuantity} item${item.stockQuantity !== 1 ? 's' : ''} available in stock.`
      );
      return;
    }

    try {
      const response = await cartService.updateItem(item.id, newQuantity);
      if (response.success !== false && response.data) {
        const items = response.data.cart?.items || [];
        const transformedItems = cartService.transformCartItems(items);
        setCartItems(transformedItems);
        setTotals(response.data.totals || { subtotal: 0, totalItems: 0 });
      } else {
        Alert.alert('Error', response.message || 'Failed to update quantity');
        loadCart(); // Reload to sync
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to update quantity. Please try again.');
      loadCart(); // Reload to sync
    }
  };

  const removeItem = (itemId) => {
    Alert.alert(
      'Remove Item',
      'Are you sure you want to remove this item from your cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await cartService.removeItem(itemId);
              if (response.success !== false && response.data) {
                const items = response.data.cart?.items || [];
                const transformedItems = cartService.transformCartItems(items);
                setCartItems(transformedItems);
                setTotals(response.data.totals || { subtotal: 0, totalItems: 0 });
              } else {
                Alert.alert('Error', response.message || 'Failed to remove item');
                loadCart(); // Reload to sync
              }
            } catch (err) {
              Alert.alert('Error', 'Failed to remove item. Please try again.');
              loadCart(); // Reload to sync
            }
          },
        },
      ]
    );
  };

  const getSubtotal = () => {
    return totals.subtotal || 0;
  };

  const getTotal = () => {
    return getSubtotal() + shippingFee;
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      Alert.alert('Empty Cart', 'Please add items to your cart first');
      return;
    }
    navigation.navigate(ROUTES.CHECKOUT, { cartItems, subtotal: getSubtotal(), shippingFee, total: getTotal() });
  };

  const renderCartItem = ({ item }) => (
    <View style={styles.cartCard}>
      <View style={styles.cartRow}>
        <TouchableOpacity
          style={styles.imageWrapper}
          onPress={() => navigation.navigate(ROUTES.PRODUCT_DETAIL, { productId: item.productId })}
          activeOpacity={0.85}
        >
          <Image source={{ uri: item.image }} style={styles.cartImage} />
          {item.discount > 0 && (
            <View style={styles.discountPill}>
              <Text style={styles.discountText}>-{item.discount}%</Text>
            </View>
          )}
        </TouchableOpacity>

        <View style={styles.cartDetails}>
          <Text style={styles.brandLabel}>{item.brand}</Text>
          <Text style={styles.productName} numberOfLines={2}>
            {item.name}
          </Text>

          <View style={styles.variantRow}>
            {item.size ? (
              <View style={styles.variantBadge}>
                <Text style={styles.variantText}>Size {item.size}</Text>
              </View>
            ) : null}
            {item.color ? (
              <View style={styles.variantBadge}>
                <Text style={styles.variantText}>{item.color}</Text>
              </View>
            ) : null}
          </View>

          <View style={styles.priceRow}>
            <Text style={styles.currentPrice}>{formatPrice(item.priceAtAdd || item.price)}</Text>
            {item.originalPrice > item.priceAtAdd ? (
              <Text style={styles.strikePrice}>{formatPrice(item.originalPrice)}</Text>
            ) : null}
          </View>
        </View>
      </View>

      <View style={styles.cardFooter}>
        <View style={styles.quantityControls}>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => updateQuantity(item, item.quantity - 1)}
            disabled={loading}
          >
            <Text style={styles.quantitySymbol}>-</Text>
          </TouchableOpacity>
          <Text style={styles.quantityValue}>{item.quantity}</Text>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => updateQuantity(item, item.quantity + 1)}
            disabled={loading}
          >
            <Text style={styles.quantitySymbol}>+</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.removePill}
          onPress={() => removeItem(item.id)}
          disabled={loading}
        >
          <Text style={styles.removeText}>Remove</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderListHeader = () => (
    <View style={styles.listHeader}>
        <View style={styles.listHeaderRow}>
          <Text style={styles.listHeaderTitle}>Review your cart</Text>
          <View style={styles.itemsBadge}>
            <Text style={styles.itemsBadgeText}>
              {cartItems.length} different product{cartItems.length !== 1 ? 's' : ''}
            </Text>
          </View>
        </View>
      <Text style={styles.listHeaderSubtitle}>Free shipping on orders over 1.000.000₫</Text>
      {error ? (
        <View style={styles.errorBanner}>
          <Text style={styles.errorBannerText}>{error}</Text>
        </View>
      ) : null}
    </View>
  );

  const renderListFooter = () => (
    <View style={styles.summaryCard}>
      <Text style={styles.summaryTitle}>Order Summary</Text>
      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>Subtotal</Text>
        <Text style={styles.summaryValue}>{formatPrice(getSubtotal())}</Text>
      </View>
      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>Shipping fee</Text>
        <Text style={styles.summaryValue}>{formatPrice(shippingFee)}</Text>
      </View>
      <View style={[styles.summaryRow, styles.summaryHighlight]}>
        <Text style={styles.summaryHighlightLabel}>Estimated total</Text>
        <Text style={styles.summaryHighlightValue}>{formatPrice(getTotal())}</Text>
      </View>
      <Text style={styles.summaryNote}>Taxes calculated at checkout</Text>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom', 'left', 'right']}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading cart...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!isAuthenticated) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom', 'left', 'right']}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🔒</Text>
          <Text style={styles.emptyTitle}>Login Required</Text>
          <Text style={styles.emptySubtitle}>
            Please login to view your cart
          </Text>
          <Button
            mode="contained"
            style={styles.shopButton}
            onPress={() => navigation.navigate(ROUTES.LOGIN)}
          >
            Login
          </Button>
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
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backIcon}>←</Text>
          <View>
            <Text style={styles.headerTitle}>Your Bag</Text>
            <Text style={styles.headerSubtitle}>
              {cartItems.length} different product{cartItems.length !== 1 ? 's' : ''}
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderCartItem}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListHeaderComponent={renderListHeader}
        ListFooterComponent={renderListFooter}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={Colors.primary}
            colors={[Colors.primary]}
          />
        }
        showsVerticalScrollIndicator={false}
      />

      <SafeAreaView edges={['bottom']} style={styles.checkoutSafeArea}>
        <View style={styles.checkoutBar}>
          <View style={styles.checkoutInfo}>
            <Text style={styles.checkoutLabel}>Total</Text>
            <Text style={styles.checkoutAmount}>{formatPrice(getTotal())}</Text>
            <Text style={styles.checkoutSubtext}>
              {cartItems.length} product{cartItems.length !== 1 ? 's' : ''} • Subtotal {formatPrice(getSubtotal())}
            </Text>
          </View>
          <Button
            mode="contained"
            onPress={handleCheckout}
            style={styles.checkoutButton}
            contentStyle={styles.checkoutButtonContent}
            labelStyle={styles.checkoutButtonLabel}
          >
            Checkout
          </Button>
        </View>
      </SafeAreaView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 26,
    color: Colors.primary,
    marginRight: Spacing.md,
  },
  headerTitle: {
    ...Typography.h4,
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  headerSubtitle: {
    ...Typography.caption,
    color: Colors.textSecondary,
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
    borderRadius: 18,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.primary,
  },
  listContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xxl + 80,
  },
  separator: {
    height: Spacing.md,
  },
  listHeader: {
    paddingVertical: Spacing.lg,
  },
  listHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  listHeaderTitle: {
    ...Typography.h4,
    fontWeight: '700',
  },
  itemsBadge: {
    backgroundColor: Colors.lightGray,
    borderRadius: 999,
    paddingHorizontal: Spacing.md,
    paddingVertical: 4,
  },
  itemsBadgeText: {
    ...Typography.small,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  listHeaderSubtitle: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  errorBanner: {
    marginTop: Spacing.sm,
    backgroundColor: 'rgba(231, 76, 60, 0.08)',
    padding: Spacing.md,
    borderRadius: 14,
  },
  errorBannerText: {
    ...Typography.caption,
    color: Colors.error,
  },
  cartCard: {
    backgroundColor: Colors.surface,
    borderRadius: 24,
    padding: Spacing.lg,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 6,
  },
  cartRow: {
    flexDirection: 'row',
  },
  imageWrapper: {
    marginRight: Spacing.lg,
  },
  cartImage: {
    width: 96,
    height: 96,
    borderRadius: 20,
  },
  discountPill: {
    position: 'absolute',
    top: Spacing.sm,
    left: Spacing.sm,
    backgroundColor: Colors.error,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: 12,
  },
  discountText: {
    ...Typography.small,
    color: Colors.white,
    fontWeight: '700',
    fontSize: 10,
  },
  cartDetails: {
    flex: 1,
  },
  brandLabel: {
    ...Typography.small,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 4,
  },
  productName: {
    ...Typography.bodyBold,
    color: Colors.textPrimary,
    lineHeight: 22,
  },
  variantRow: {
    flexDirection: 'row',
    marginTop: Spacing.sm,
  },
  variantBadge: {
    backgroundColor: Colors.lightGray,
    borderRadius: 12,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    marginRight: Spacing.sm,
  },
  variantText: {
    ...Typography.small,
    color: Colors.textPrimary,
    fontWeight: '500',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginTop: Spacing.md,
  },
  currentPrice: {
    ...Typography.price,
  },
  strikePrice: {
    ...Typography.small,
    color: Colors.textSecondary,
    textDecorationLine: 'line-through',
    marginLeft: Spacing.sm,
  },
  cardFooter: {
    marginTop: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.lightGray,
    borderRadius: 999,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  quantitySymbol: {
    ...Typography.captionBold,
    color: Colors.textPrimary,
  },
  quantityValue: {
    ...Typography.bodyBold,
    marginHorizontal: Spacing.sm,
  },
  removePill: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  removeText: {
    ...Typography.captionBold,
    color: Colors.textSecondary,
  },
  summaryCard: {
    marginTop: Spacing.lg,
    padding: Spacing.lg,
    borderRadius: 24,
    backgroundColor: Colors.surface,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 5,
  },
  summaryTitle: {
    ...Typography.h5,
    marginBottom: Spacing.md,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  summaryLabel: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  summaryValue: {
    ...Typography.bodyBold,
  },
  summaryHighlight: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: Spacing.sm,
    marginTop: Spacing.sm,
  },
  summaryHighlightLabel: {
    ...Typography.bodyBold,
    color: Colors.textPrimary,
  },
  summaryHighlightValue: {
    ...Typography.price,
  },
  summaryNote: {
    ...Typography.small,
    color: Colors.textSecondary,
    marginTop: Spacing.sm,
  },
  checkoutSafeArea: {
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.lg,
  },
  checkoutBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.primary,
    borderRadius: 26,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    shadowColor: Colors.primaryDark,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  checkoutInfo: {
    flex: 1,
    marginRight: Spacing.md,
  },
  checkoutLabel: {
    ...Typography.small,
    color: Colors.white,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  checkoutAmount: {
    ...Typography.priceLarge,
    color: Colors.white,
  },
  checkoutSubtext: {
    ...Typography.small,
    color: Colors.white,
    opacity: 0.85,
  },
  checkoutButton: {
    borderRadius: 18,
    backgroundColor: Colors.white,
  },
  checkoutButtonContent: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
  },
  checkoutButtonLabel: {
    ...Typography.bodyBold,
    color: Colors.primary,
    textTransform: 'none',
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
});
