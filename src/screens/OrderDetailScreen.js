import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
  Animated,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, Chip } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import { Colors, Spacing, Typography } from '../constants/colors';
import { ROUTES } from '../navigation/navigationConstants';
import LoadingSpinner from '../components/LoadingSpinner';
import orderService from '../services/orderService';

export default function OrderDetailScreen({ route, navigation }) {
  const { orderId } = route.params || {};
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  const animateIn = useCallback(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  const loadOrder = useCallback(
    async (showSpinner = true) => {
      if (!orderId) {
        setError('Thiếu thông tin mã đơn hàng. Vui lòng quay lại.');
        setLoading(false);
        return;
      }

      try {
        setError(null);
        if (showSpinner) {
          setLoading(true);
        } else {
          setRefreshing(true);
        }

        const response = await orderService.getOrderById(orderId);
        if (response?.success === false || !response?.data) {
          throw new Error(response?.message || 'Không thể tải thông tin đơn hàng.');
        }

        const transformed = orderService.transformOrder(response.data);
        setOrder(transformed);
        animateIn();
      } catch (err) {
        const message =
          err?.message ||
          err?.response?.data?.message ||
          'Không thể tải thông tin đơn hàng. Vui lòng thử lại.';
        setError(message);
        setOrder(null);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [orderId, animateIn]
  );

  useEffect(() => {
    loadOrder(true);
  }, [loadOrder]);

  useFocusEffect(
    useCallback(() => {
      loadOrder(false);
    }, [loadOrder])
  );

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price || 0);
  };

  const formatDate = (value) => {
    if (!value) return '—';
    const date = new Date(value);
    return date.toLocaleString('vi-VN');
  };

  const statusConfig = (status) => {
    switch (status) {
      case 'pending':
        return { label: 'Đang chờ xử lý', color: Colors.warning, emoji: '⏳' };
      case 'confirmed':
        return { label: 'Đã xác nhận', color: Colors.info, emoji: '✅' };
      case 'shipping':
        return { label: 'Đang giao hàng', color: Colors.info, emoji: '🚚' };
      case 'delivered':
        return { label: 'Đã giao', color: Colors.success, emoji: '📦' };
      case 'cancelled':
        return { label: 'Đã huỷ', color: Colors.error, emoji: '❌' };
      default:
        return { label: status || 'Không xác định', color: Colors.textSecondary, emoji: '📦' };
    }
  };

  const paymentStatusConfig = (status) => {
    switch (status) {
      case 'unpaid':
        return { label: 'Chưa thanh toán', color: Colors.warning };
      case 'paid':
        return { label: 'Đã thanh toán', color: Colors.success };
      case 'refunded':
        return { label: 'Đã hoàn tiền', color: Colors.info };
      default:
        return { label: status || 'Không rõ', color: Colors.textSecondary };
    }
  };

  const renderItem = (item, index) => {
    const isLast = index === (order?.items?.length || 0) - 1;
    return (
      <View key={item.id} style={[styles.itemCard, isLast && styles.itemCardLast]}>
        <View style={styles.itemContent}>
          {/* Product Image */}
          <Image
            source={{ uri: item.image || item.imageSnapshot || 'https://via.placeholder.com/80x80?text=No+Image' }}
            style={styles.itemImage}
            resizeMode="cover"
          />
          
          {/* Product Info */}
          <View style={styles.itemDetails}>
            <Text style={styles.itemName} numberOfLines={2}>
              {item.name || item.nameSnapshot || 'Sản phẩm'}
            </Text>
            {item.brand && (
              <Text style={styles.itemBrand} numberOfLines={1}>
                {item.brand || item.brandSnapshot}
              </Text>
            )}
            <Text style={styles.itemSku} numberOfLines={1}>
              SKU: {item.sku || item.skuSnapshot || '—'}
            </Text>
            
            {/* Price and Quantity Row */}
            <View style={styles.itemPriceRow}>
              <View style={styles.itemPriceInfo}>
                <Text style={styles.itemUnitPrice}>{formatPrice(item.unitPrice)}</Text>
                <Text style={styles.itemQuantity}>x {item.quantity}</Text>
              </View>
              <Text style={styles.itemTotalPrice}>{formatPrice(item.totalPrice)}</Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const renderAddress = (address, title, icon) => (
    <Card style={styles.addressCard}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionIcon}>{icon}</Text>
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      {address ? (
        <View style={styles.addressInfo}>
          <Text style={styles.addressName}>{address.fullName}</Text>
          <Text style={styles.addressPhone}>{address.phone}</Text>
          <Text style={styles.addressText}>{address.formatted}</Text>
        </View>
      ) : (
        <Text style={styles.emptyText}>Không có thông tin địa chỉ.</Text>
      )}
    </Card>
  );

  const onRefresh = useCallback(() => {
    loadOrder(false);
  }, [loadOrder]);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.gradient}>
        <View style={styles.decorativeElements}>
          <View style={[styles.decorativeCircle, styles.circle1]} />
          <View style={[styles.decorativeCircle, styles.circle2]} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={Colors.primary}
              colors={[Colors.primary]}
            />
          }
        >
          <Animated.View
            style={[
              styles.header,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <View style={styles.backButtonContainer}>
                <Text style={styles.backIcon}>←</Text>
                <Text style={styles.backText}>Chi tiết đơn hàng</Text>
              </View>
            </TouchableOpacity>
          </Animated.View>

          {loading ? (
            <View style={styles.loadingContainer}>
              <LoadingSpinner size="large" color={Colors.primary} text="Đang tải đơn hàng..." />
            </View>
          ) : error ? (
            <Card style={styles.errorCard}>
              <Text style={styles.errorIcon}>⚠️</Text>
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity style={styles.retryButton} onPress={() => loadOrder(true)}>
                <Text style={styles.retryText}>Thử lại</Text>
              </TouchableOpacity>
            </Card>
          ) : order ? (
            <View style={styles.content}>
              <Animated.View
                style={[
                  styles.summaryCardWrapper,
                  {
                    opacity: fadeAnim,
                    transform: [{ translateY: slideAnim }],
                  },
                ]}
              >
                <Card style={styles.summaryCard}>
                  <View style={styles.summaryHeader}>
                    <View style={styles.orderInfo}>
                      <Text style={styles.orderNumber} numberOfLines={1}>
                        Đơn #{order.orderNumber || order.id}
                      </Text>
                      <Text style={styles.placedAt} numberOfLines={1}>
                        Đặt lúc: {formatDate(order.placedAt)}
                      </Text>
                    </View>
                    <Chip
                      style={[
                        styles.statusChip,
                        { backgroundColor: statusConfig(order.status).color },
                      ]}
                      textStyle={styles.statusChipText}
                    >
                      {statusConfig(order.status).emoji} {statusConfig(order.status).label}
                    </Chip>
                  </View>

                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Tổng tiền</Text>
                    <Text style={styles.summaryValue}>{formatPrice(order.totalAmount)}</Text>
                  </View>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Tạm tính</Text>
                    <Text style={styles.summaryValue}>{formatPrice(order.subtotalAmount)}</Text>
                  </View>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Phí vận chuyển</Text>
                    <Text style={styles.summaryValue}>{formatPrice(order.shippingFee)}</Text>
                  </View>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Giảm giá</Text>
                    <Text style={styles.summaryValue}>
                      -{formatPrice(order.discountAmount || 0)}
                    </Text>
                  </View>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Thuế</Text>
                    <Text style={styles.summaryValue}>{formatPrice(order.taxAmount || 0)}</Text>
                  </View>
                  <View style={styles.summaryDivider} />
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Phương thức thanh toán</Text>
                    <Text style={styles.summaryValueWrap} numberOfLines={2}>
                      {order.paymentMethod === 'cash_on_delivery' ? 'COD - Thanh toán khi nhận hàng' : order.paymentMethod || '—'}
                    </Text>
                  </View>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Trạng thái thanh toán</Text>
                    <Chip
                      style={[
                        styles.paymentStatusChip,
                        { backgroundColor: paymentStatusConfig(order.paymentStatus).color },
                      ]}
                      textStyle={styles.paymentStatusText}
                    >
                      {paymentStatusConfig(order.paymentStatus).label}
                    </Chip>
                  </View>
                </Card>
              </Animated.View>

              <Animated.View
                style={[
                  styles.sectionWrapper,
                  {
                    opacity: fadeAnim,
                    transform: [{ translateY: slideAnim }],
                  },
                ]}
              >
                {renderAddress(order.shippingAddress, 'Địa chỉ giao hàng', '📍')}
                {renderAddress(order.billingAddress, 'Địa chỉ thanh toán', '🧾')}
              </Animated.View>

              <Animated.View
                style={[
                  styles.itemsWrapper,
                  {
                    opacity: fadeAnim,
                    transform: [{ translateY: slideAnim }],
                  },
                ]}
              >
                <Card style={styles.itemsCard}>
                  <View style={styles.sectionHeader}>
                    <Text style={styles.sectionIcon}>🛍️</Text>
                    <Text style={styles.sectionTitle}>Sản phẩm ({order.items?.length || 0})</Text>
                  </View>
                  {order.items && order.items.length > 0 ? (
                    order.items.map((item, index) => renderItem(item, index))
                  ) : (
                    <Text style={styles.emptyText}>Không có sản phẩm trong đơn hàng.</Text>
                  )}
                </Card>
              </Animated.View>
            </View>
          ) : (
            <View style={styles.loadingContainer}>
              <Text style={styles.emptyText}>Không tìm thấy thông tin đơn hàng.</Text>
            </View>
          )}
        </ScrollView>
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
    width: 160,
    height: 160,
    top: 60,
    right: -40,
  },
  circle2: {
    width: 120,
    height: 120,
    bottom: 220,
    left: -30,
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
    marginBottom: Spacing.md,
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
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  errorCard: {
    marginHorizontal: Spacing.lg,
    padding: Spacing.lg,
    borderRadius: 20,
    backgroundColor: Colors.white,
    elevation: 6,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  errorIcon: {
    fontSize: 32,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  errorText: {
    ...Typography.body,
    color: Colors.error,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  retryButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: 20,
    alignSelf: 'center',
  },
  retryText: {
    ...Typography.button,
    color: Colors.white,
  },
  content: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xxl,
    gap: Spacing.lg,
  },
  summaryCardWrapper: {
    marginBottom: Spacing.md,
  },
  summaryCard: {
    padding: Spacing.lg,
    borderRadius: 20,
    backgroundColor: Colors.white,
    elevation: 8,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },
  orderInfo: {
    flex: 1,
    minWidth: 0,
  },
  orderNumber: {
    ...Typography.h4,
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  placedAt: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  statusChip: {
    borderRadius: 14,
  },
  statusChipText: {
    ...Typography.captionBold,
    color: Colors.white,
    fontWeight: '700',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    gap: Spacing.sm,
  },
  summaryLabel: {
    ...Typography.caption,
    color: Colors.textSecondary,
    flexShrink: 0,
  },
  summaryValue: {
    ...Typography.bodyBold,
    color: Colors.textPrimary,
    textAlign: 'right',
  },
  summaryValueWrap: {
    ...Typography.bodyBold,
    color: Colors.textPrimary,
    textAlign: 'right',
    flex: 1,
    flexWrap: 'wrap',
  },
  summaryDivider: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginVertical: Spacing.sm,
  },
  paymentStatusChip: {
    borderRadius: 16,
    paddingHorizontal: Spacing.sm,
  },
  paymentStatusText: {
    ...Typography.captionBold,
    color: Colors.white,
  },
  sectionWrapper: {
    gap: Spacing.md,
  },
  addressCard: {
    padding: Spacing.lg,
    borderRadius: 20,
    backgroundColor: Colors.white,
    elevation: 6,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
    gap: Spacing.xs,
  },
  sectionIcon: {
    fontSize: 20,
  },
  sectionTitle: {
    ...Typography.h5,
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  addressInfo: {
    gap: Spacing.xs,
  },
  addressName: {
    ...Typography.bodyBold,
    color: Colors.textPrimary,
  },
  addressPhone: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  addressText: {
    ...Typography.body,
    color: Colors.textPrimary,
    lineHeight: 22,
  },
  emptyText: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  itemsWrapper: {
    marginTop: Spacing.md,
  },
  itemsCard: {
    padding: Spacing.lg,
    borderRadius: 20,
    backgroundColor: Colors.white,
    elevation: 6,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  itemCard: {
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  itemCardLast: {
    borderBottomWidth: 0,
  },
  itemContent: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: Colors.surfaceLight,
  },
  itemDetails: {
    flex: 1,
    justifyContent: 'space-between',
  },
  itemName: {
    ...Typography.bodyBold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  itemBrand: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  itemSku: {
    ...Typography.caption,
    color: Colors.textLight,
    marginBottom: Spacing.sm,
  },
  itemPriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto',
  },
  itemPriceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  itemUnitPrice: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  itemQuantity: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  itemTotalPrice: {
    ...Typography.h5,
    color: Colors.primary,
    fontWeight: '700',
  },
});

