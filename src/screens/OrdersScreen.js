import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from 'react-native-paper';
import { Colors, Spacing, Typography } from '../constants/colors';
import { ROUTES } from '../navigation/navigationConstants';
import LoadingSpinner from '../components/LoadingSpinner';

const { width } = Dimensions.get('window');

export default function OrdersScreen({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');
  
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

  const orders = [
    {
      id: 'ORD001',
      date: '2024-01-15',
      status: 'delivered',
      total: 2500000,
      items: [
        { name: 'Nike Air Max 270', size: '42', color: 'Black', quantity: 1, price: 1500000 },
        { name: 'Adidas Ultraboost 22', size: '41', color: 'White', quantity: 1, price: 1000000 },
      ],
    },
    {
      id: 'ORD002',
      date: '2024-01-10',
      status: 'shipped',
      total: 1800000,
      items: [
        { name: 'Converse Chuck Taylor', size: '40', color: 'Red', quantity: 1, price: 1800000 },
      ],
    },
    {
      id: 'ORD003',
      date: '2024-01-05',
      status: 'processing',
      total: 3200000,
      items: [
        { name: 'Jordan 1 Retro', size: '43', color: 'Blue', quantity: 1, price: 3200000 },
      ],
    },
    {
      id: 'ORD004',
      date: '2024-01-01',
      status: 'cancelled',
      total: 1200000,
      items: [
        { name: 'Vans Old Skool', size: '39', color: 'Black', quantity: 1, price: 1200000 },
      ],
    },
  ];

  const filters = [
    { key: 'all', label: 'All Orders', count: orders.length },
    { key: 'processing', label: 'Processing', count: orders.filter(o => o.status === 'processing').length },
    { key: 'shipped', label: 'Shipped', count: orders.filter(o => o.status === 'shipped').length },
    { key: 'delivered', label: 'Delivered', count: orders.filter(o => o.status === 'delivered').length },
    { key: 'cancelled', label: 'Cancelled', count: orders.filter(o => o.status === 'cancelled').length },
  ];

  const filteredOrders = selectedFilter === 'all' 
    ? orders 
    : orders.filter(order => order.status === selectedFilter);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'processing': return Colors.warning;
      case 'shipped': return Colors.info;
      case 'delivered': return Colors.success;
      case 'cancelled': return Colors.error;
      default: return Colors.textSecondary;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'processing': return '⏳';
      case 'shipped': return '🚚';
      case 'delivered': return '✅';
      case 'cancelled': return '❌';
      default: return '📦';
    }
  };

  const renderOrderItem = (order) => (
    <Animated.View
      key={order.id}
      style={[
        styles.orderCard,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <Card style={styles.orderCardContent}>
        <View style={styles.orderHeader}>
          <View style={styles.orderInfo}>
            <Text style={styles.orderId}>Order #{order.id}</Text>
            <Text style={styles.orderDate}>{order.date}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) }]}>
            <Text style={styles.statusIcon}>{getStatusIcon(order.status)}</Text>
            <Text style={styles.statusText}>{order.status.toUpperCase()}</Text>
          </View>
        </View>

        <View style={styles.orderItems}>
          {order.items.map((item, index) => (
            <View key={index} style={styles.orderItem}>
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemDetails}>
                  Size: {item.size} | Color: {item.color} | Qty: {item.quantity}
                </Text>
              </View>
              <Text style={styles.itemPrice}>{formatPrice(item.price)}</Text>
            </View>
          ))}
        </View>

        <View style={styles.orderFooter}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalPrice}>{formatPrice(order.total)}</Text>
        </View>

        <View style={styles.orderActions}>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>View Details</Text>
          </TouchableOpacity>
          {order.status === 'delivered' && (
            <TouchableOpacity style={[styles.actionButton, styles.primaryButton]}>
              <Text style={[styles.actionButtonText, styles.primaryButtonText]}>Reorder</Text>
            </TouchableOpacity>
          )}
        </View>
      </Card>
    </Animated.View>
  );

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
                <Text style={styles.backText}>My Orders</Text>
              </View>
            </TouchableOpacity>
          </Animated.View>

          {/* Stats Cards */}
          <Animated.View
            style={[
              styles.statsContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <Card style={styles.statsCard}>
              <View style={styles.statsContent}>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>{orders.length}</Text>
                  <Text style={styles.statLabel}>Total Orders</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>
                    {orders.filter(o => o.status === 'delivered').length}
                  </Text>
                  <Text style={styles.statLabel}>Delivered</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>
                    {orders.filter(o => o.status === 'processing' || o.status === 'shipped').length}
                  </Text>
                  <Text style={styles.statLabel}>In Progress</Text>
                </View>
              </View>
            </Card>
          </Animated.View>

          {/* Filters */}
          <Animated.View
            style={[
              styles.filtersContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.filtersList}>
                {filters.map((filter) => (
                  <TouchableOpacity
                    key={filter.key}
                    style={[
                      styles.filterChip,
                      selectedFilter === filter.key && styles.selectedFilterChip,
                    ]}
                    onPress={() => setSelectedFilter(filter.key)}
                  >
                    <Text
                      style={[
                        styles.filterText,
                        selectedFilter === filter.key && styles.selectedFilterText,
                      ]}
                    >
                      {filter.label} ({filter.count})
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </Animated.View>

          {/* Orders List */}
          <View style={styles.ordersList}>
            {loading ? (
              <View style={styles.loadingContainer}>
                <LoadingSpinner size="medium" color={Colors.primary} text="Loading orders..." />
              </View>
            ) : filteredOrders.length > 0 ? (
              filteredOrders.map(renderOrderItem)
            ) : (
              <Animated.View
                style={[
                  styles.emptyState,
                  {
                    opacity: fadeAnim,
                    transform: [{ translateY: slideAnim }],
                  },
                ]}
              >
                <Card style={styles.emptyCard}>
                  <Text style={styles.emptyIcon}>📦</Text>
                  <Text style={styles.emptyTitle}>No Orders Found</Text>
                  <Text style={styles.emptySubtitle}>
                    {selectedFilter === 'all' 
                      ? "You haven't placed any orders yet"
                      : `No ${selectedFilter} orders found`
                    }
                  </Text>
                  <TouchableOpacity
                    style={styles.shopButton}
                    onPress={() => navigation.navigate(ROUTES.MAIN_APP, { screen: ROUTES.HOME })}
                  >
                    <Text style={styles.shopButtonText}>Start Shopping</Text>
                  </TouchableOpacity>
                </Card>
              </Animated.View>
            )}
          </View>
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
  statsContainer: {
    marginHorizontal: Spacing.md,
    marginTop: Spacing.md,
    marginBottom: Spacing.md,
  },
  statsCard: {
    padding: Spacing.lg,
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
  statsContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    ...Typography.h2,
    color: Colors.primary,
    fontWeight: '800',
    marginBottom: Spacing.xs,
  },
  statLabel: {
    ...Typography.caption,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: Colors.borderLight,
    marginHorizontal: Spacing.md,
  },
  filtersContainer: {
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.md,
  },
  filtersList: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.sm,
  },
  filterChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    marginRight: Spacing.sm,
    borderRadius: 20,
    backgroundColor: Colors.surfaceLight,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  selectedFilterChip: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  selectedFilterText: {
    color: Colors.white,
    fontWeight: '600',
  },
  ordersList: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  orderCard: {
    marginBottom: Spacing.md,
  },
  orderCardContent: {
    padding: Spacing.lg,
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
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  orderInfo: {
    flex: 1,
  },
  orderId: {
    ...Typography.h5,
    color: Colors.textPrimary,
    fontWeight: '700',
    marginBottom: Spacing.xs,
  },
  orderDate: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: 15,
  },
  statusIcon: {
    fontSize: 14,
    marginRight: Spacing.xs,
  },
  statusText: {
    ...Typography.caption,
    color: Colors.white,
    fontWeight: '700',
    fontSize: 12,
  },
  orderItems: {
    marginBottom: Spacing.md,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  itemInfo: {
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
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
    paddingTop: Spacing.sm,
    borderTopWidth: 2,
    borderTopColor: Colors.borderLight,
  },
  totalLabel: {
    ...Typography.h5,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  totalPrice: {
    ...Typography.h4,
    color: Colors.primary,
    fontWeight: '800',
  },
  orderActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  actionButton: {
    flex: 1,
    paddingVertical: Spacing.sm,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    backgroundColor: Colors.surfaceLight,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  actionButtonText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  primaryButtonText: {
    color: Colors.white,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  emptyState: {
    marginTop: Spacing.xl,
  },
  emptyCard: {
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
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: Spacing.lg,
  },
  emptyTitle: {
    ...Typography.h3,
    color: Colors.textPrimary,
    fontWeight: '700',
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  emptySubtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.lg,
    lineHeight: 22,
  },
  shopButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: 25,
    elevation: 4,
    shadowColor: Colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  shopButtonText: {
    ...Typography.button,
    color: Colors.white,
    fontWeight: '700',
  },
});

