import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Card, IconButton } from 'react-native-paper';
import { Colors, Spacing, Typography } from '../constants/colors';
import { ROUTES } from '../navigation/navigationConstants';

export default function CartScreen({ navigation }) {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: 'Nike Air Max 270',
      brand: 'Nike',
      price: 2500000,
      originalPrice: 3000000,
      discount: 17,
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=300&q=80',
      size: 40,
      color: 'Black',
      quantity: 1,
      isNew: true,
    },
    {
      id: 2,
      name: 'Adidas Ultraboost 22',
      brand: 'Adidas',
      price: 3200000,
      originalPrice: 3500000,
      discount: 9,
      image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=300&q=80',
      size: 41,
      color: 'White',
      quantity: 1,
      isHot: true,
    },
  ]);

  const shippingFee = 50000;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity <= 0) {
      removeItem(id);
      return;
    }
    setCartItems(
      cartItems.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (id) => {
    Alert.alert(
      'Remove Item',
      'Are you sure you want to remove this item from your cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () =>
            setCartItems(cartItems.filter((item) => item.id !== id)),
        },
      ]
    );
  };

  const getSubtotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
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

  const renderCartItem = (item) => (
    <Card key={item.id} style={styles.cartItem}>
      <View style={styles.itemContainer}>
        <View style={styles.itemImageContainer}>
          <Image source={{ uri: item.image }} style={styles.itemImage} />
          {/* Badges */}
          <View style={styles.badgeContainer}>
            {item.isNew && (
              <View style={[styles.badge, styles.newBadge]}>
                <Text style={styles.badgeText}>NEW</Text>
              </View>
            )}
            {item.isHot && (
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
          <Text style={styles.itemBrand}>{item.brand}</Text>
          <Text style={styles.itemName} numberOfLines={2}>
            {item.name}
          </Text>
          <View style={styles.itemDetailsContainer}>
            <View style={styles.detailTag}>
              <Text style={styles.detailTagText}>Size {item.size}</Text>
            </View>
            <View style={styles.detailTag}>
              <Text style={styles.detailTagText}>{item.color}</Text>
            </View>
          </View>
          <View style={styles.priceContainer}>
            <Text style={styles.itemPrice}>{formatPrice(item.price)}</Text>
            {item.originalPrice > item.price && (
              <Text style={styles.originalPrice}>
                {formatPrice(item.originalPrice)}
              </Text>
            )}
          </View>
        </View>
        <View style={styles.itemActions}>
          <View style={styles.quantityContainer}>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => updateQuantity(item.id, item.quantity - 1)}
            >
              <Text style={styles.quantityButtonText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.quantityText}>{item.quantity}</Text>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => updateQuantity(item.id, item.quantity + 1)}
            >
              <Text style={styles.quantityButtonText}>+</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => removeItem(item.id)}
          >
            <Text style={styles.removeButtonText}>🗑️</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Card>
  );

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

      <ScrollView style={styles.cartList} showsVerticalScrollIndicator={false}>
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
    borderRadius: 20,
    elevation: 8,
    shadowColor: Colors.shadowDark,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    backgroundColor: Colors.white,
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
    borderRadius: 15,
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
    fontWeight: '500',
    marginBottom: 2,
  },
  itemName: {
    ...Typography.caption,
    fontWeight: '600',
    marginBottom: Spacing.sm,
    lineHeight: 18,
  },
  itemDetailsContainer: {
    flexDirection: 'row',
    marginBottom: Spacing.sm,
  },
  detailTag: {
    backgroundColor: Colors.lightGray,
    paddingHorizontal: Spacing.xs,
    paddingVertical: 2,
    borderRadius: 8,
    marginRight: Spacing.xs,
  },
  detailTagText: {
    ...Typography.small,
    color: Colors.textPrimary,
    fontWeight: '500',
    fontSize: 10,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemPrice: {
    ...Typography.price,
    marginRight: Spacing.xs,
  },
  originalPrice: {
    ...Typography.small,
    color: Colors.textSecondary,
    textDecorationLine: 'line-through',
  },
  itemActions: {
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
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
    backgroundColor: Colors.lightGray,
    borderRadius: 20,
    elevation: 2,
    shadowColor: Colors.shadow,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  removeButtonText: {
    fontSize: 18,
  },
  summaryCard: {
    margin: Spacing.md,
    padding: Spacing.lg,
    borderRadius: 20,
    backgroundColor: Colors.white,
    elevation: 8,
    shadowColor: Colors.shadowDark,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
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
