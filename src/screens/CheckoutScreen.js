import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Animated,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, Button, RadioButton, TextInput } from 'react-native-paper';
import { Colors, Spacing, Typography } from '../constants/colors';
import { ROUTES } from '../navigation/navigationConstants';
import LoadingSpinner from '../components/LoadingSpinner';

const { width } = Dimensions.get('window');

export default function CheckoutScreen({ route, navigation }) {
  const { cartItems, subtotal, shippingFee, total } = route.params || {};
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [loading, setLoading] = useState(false);
  const [shippingAddress, setShippingAddress] = useState({
    name: 'John Doe',
    phone: '0901234567',
    address: '123 Main Street, District 1, Ho Chi Minh City',
  });

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const handlePlaceOrder = () => {
    setLoading(true);
    // Simulate order processing
    setTimeout(() => {
      setLoading(false);
      Alert.alert(
        'Order Placed! 🎉',
        'Your order has been placed successfully. You will receive a confirmation email shortly.',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate(ROUTES.MAIN_APP, { screen: ROUTES.HOME }),
          },
        ]
      );
    }, 2000);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.gradient}>
        {/* Background decorative elements */}
        <View style={styles.decorativeElements}>
          <View style={[styles.decorativeCircle, styles.circle1]} />
          <View style={[styles.decorativeCircle, styles.circle2]} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <Animated.View 
            style={[
              styles.header,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <View style={styles.backButtonContainer}>
                <Text style={styles.backIcon}>←</Text>
                <Text style={styles.backText}>Checkout</Text>
              </View>
            </TouchableOpacity>
          </Animated.View>

          {/* Shipping Address */}
          <Animated.View
            style={[
              styles.sectionContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <Card style={styles.sectionCard}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionIcon}>📍</Text>
                <Text style={styles.sectionTitle}>Shipping Address</Text>
              </View>
              <View style={styles.addressContainer}>
                <View style={styles.addressInfo}>
                  <Text style={styles.addressName}>{shippingAddress.name}</Text>
                  <Text style={styles.addressPhone}>{shippingAddress.phone}</Text>
                  <Text style={styles.addressText}>{shippingAddress.address}</Text>
                </View>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => Alert.alert('Edit Address', 'Address editing feature coming soon')}
                >
                  <Text style={styles.editButtonText}>✏️ Edit</Text>
                </TouchableOpacity>
              </View>
            </Card>
          </Animated.View>

          {/* Payment Method */}
          <Animated.View
            style={[
              styles.sectionContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <Card style={styles.sectionCard}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionIcon}>💳</Text>
                <Text style={styles.sectionTitle}>Payment Method</Text>
              </View>
              <View style={styles.paymentOptions}>
                <TouchableOpacity
                  style={[
                    styles.paymentOption,
                    paymentMethod === 'cod' && styles.selectedPaymentOption,
                  ]}
                  onPress={() => setPaymentMethod('cod')}
                >
                  <View style={styles.paymentOptionLeft}>
                    <Text style={styles.paymentIcon}>💰</Text>
                    <Text style={styles.paymentText}>Cash on Delivery</Text>
                  </View>
                  <View style={[
                    styles.radioButton,
                    paymentMethod === 'cod' && styles.selectedRadioButton,
                  ]}>
                    {paymentMethod === 'cod' && <Text style={styles.radioDot}>●</Text>}
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.paymentOption,
                    paymentMethod === 'vnpay' && styles.selectedPaymentOption,
                  ]}
                  onPress={() => setPaymentMethod('vnpay')}
                >
                  <View style={styles.paymentOptionLeft}>
                    <Text style={styles.paymentIcon}>🏦</Text>
                    <Text style={styles.paymentText}>VNPay</Text>
                  </View>
                  <View style={[
                    styles.radioButton,
                    paymentMethod === 'vnpay' && styles.selectedRadioButton,
                  ]}>
                    {paymentMethod === 'vnpay' && <Text style={styles.radioDot}>●</Text>}
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.paymentOption,
                    paymentMethod === 'momo' && styles.selectedPaymentOption,
                  ]}
                  onPress={() => setPaymentMethod('momo')}
                >
                  <View style={styles.paymentOptionLeft}>
                    <Text style={styles.paymentIcon}>📱</Text>
                    <Text style={styles.paymentText}>MoMo</Text>
                  </View>
                  <View style={[
                    styles.radioButton,
                    paymentMethod === 'momo' && styles.selectedRadioButton,
                  ]}>
                    {paymentMethod === 'momo' && <Text style={styles.radioDot}>●</Text>}
                  </View>
                </TouchableOpacity>
              </View>
            </Card>
          </Animated.View>

          {/* Order Summary */}
          <Animated.View
            style={[
              styles.sectionContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <Card style={styles.sectionCard}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionIcon}>📋</Text>
                <Text style={styles.sectionTitle}>Order Summary</Text>
              </View>
              {cartItems?.map((item) => (
                <View key={item.id} style={styles.orderItem}>
                  <View style={styles.orderItemInfo}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.itemDetails}>
                      Size: {item.size} | Color: {item.color} | Qty: {item.quantity}
                    </Text>
                  </View>
                  <Text style={styles.itemPrice}>
                    {formatPrice(item.price * item.quantity)}
                  </Text>
                </View>
              ))}
              
              <View style={styles.summaryDivider} />
              
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal</Text>
                <Text style={styles.summaryValue}>{formatPrice(subtotal || 0)}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Shipping</Text>
                <Text style={styles.summaryValue}>{formatPrice(shippingFee || 0)}</Text>
              </View>
              <View style={[styles.summaryRow, styles.totalRow]}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>{formatPrice(total || 0)}</Text>
              </View>
            </Card>
          </Animated.View>
        </ScrollView>

        {/* Place Order Button */}
        <Animated.View 
          style={[
            styles.placeOrderContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {loading ? (
            <View style={styles.loadingContainer}>
              <LoadingSpinner size="small" color={Colors.white} text="Processing order..." />
            </View>
          ) : (
            <TouchableOpacity
              style={styles.placeOrderButton}
              onPress={handlePlaceOrder}
              disabled={loading}
            >
              <Text style={styles.placeOrderButtonText}>
                Place Order - {formatPrice(total || 0)}
              </Text>
            </TouchableOpacity>
          )}
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    backgroundColor: Colors.background,
    position: 'relative',
  },
  decorativeElements: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  decorativeCircle: {
    position: 'absolute',
    borderRadius: 100,
    backgroundColor: Colors.primary,
    opacity: 0.05,
  },
  circle1: {
    width: 150,
    height: 150,
    top: 50,
    right: -30,
  },
  circle2: {
    width: 100,
    height: 100,
    bottom: 200,
    left: -20,
  },
  header: {
    padding: Spacing.lg,
    backgroundColor: Colors.white,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    elevation: 8,
    shadowColor: Colors.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  backButton: {
    alignSelf: 'flex-start',
  },
  backButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceLight,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 20,
    elevation: 2,
    shadowColor: Colors.shadow,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  backIcon: {
    fontSize: 18,
    color: Colors.primary,
    marginRight: Spacing.xs,
  },
  backText: {
    ...Typography.h4,
    color: Colors.primary,
    fontWeight: '600',
  },
  sectionContainer: {
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.md,
  },
  sectionCard: {
    padding: Spacing.xl,
    borderRadius: 20,
    elevation: 8,
    shadowColor: Colors.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    backgroundColor: Colors.white,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  sectionIcon: {
    fontSize: 20,
    marginRight: Spacing.sm,
  },
  sectionTitle: {
    ...Typography.h4,
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  addressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  addressInfo: {
    flex: 1,
    marginRight: Spacing.md,
  },
  addressName: {
    ...Typography.bodyBold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  addressPhone: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  addressText: {
    ...Typography.body,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  editButton: {
    backgroundColor: Colors.surfaceLight,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  editButtonText: {
    ...Typography.caption,
    color: Colors.primary,
    fontWeight: '600',
  },
  paymentOptions: {
    marginTop: Spacing.sm,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
    borderRadius: 15,
    backgroundColor: Colors.surfaceLight,
    borderWidth: 2,
    borderColor: Colors.borderLight,
  },
  selectedPaymentOption: {
    backgroundColor: Colors.primaryLight,
    borderColor: Colors.primary,
  },
  paymentOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  paymentIcon: {
    fontSize: 20,
    marginRight: Spacing.sm,
  },
  paymentText: {
    ...Typography.body,
    color: Colors.textPrimary,
    fontWeight: '500',
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedRadioButton: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary,
  },
  radioDot: {
    color: Colors.white,
    fontSize: 12,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  orderItemInfo: {
    flex: 1,
    marginRight: Spacing.sm,
  },
  itemName: {
    ...Typography.bodyBold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  itemDetails: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  itemPrice: {
    ...Typography.bodyBold,
    color: Colors.primary,
  },
  summaryDivider: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginVertical: Spacing.md,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  summaryLabel: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  summaryValue: {
    ...Typography.body,
    color: Colors.textPrimary,
    fontWeight: '500',
  },
  totalRow: {
    borderTopWidth: 2,
    borderTopColor: Colors.borderLight,
    marginTop: Spacing.sm,
    paddingTop: Spacing.md,
  },
  totalLabel: {
    ...Typography.h4,
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  totalValue: {
    ...Typography.h4,
    color: Colors.primary,
    fontWeight: '800',
  },
  placeOrderContainer: {
    padding: Spacing.lg,
    backgroundColor: Colors.white,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    elevation: 12,
    shadowColor: Colors.shadowDark,
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 12,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  placeOrderButton: {
    backgroundColor: Colors.primary,
    borderRadius: 25,
    paddingVertical: Spacing.lg,
    elevation: 6,
    shadowColor: Colors.shadowDark,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  placeOrderButtonText: {
    ...Typography.button,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
  },
});
