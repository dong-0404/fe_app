import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Alert,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from 'react-native-paper';
import { Colors, Spacing, Typography } from '../constants/colors';
import LoadingSpinner from '../components/LoadingSpinner';
import paymentMethodService from '../services/paymentMethodService';

const iconForType = (type) => {
  switch (type) {
    case 'credit_card':
    case 'debit_card':
      return '💳';
    case 'bank_transfer':
      return '🏦';
    case 'ewallet':
      return '📱';
    case 'cod':
      return '💵';
    default:
      return '💳';
  }
};

const colorForProvider = (provider) => {
  const map = {
    visa: '#1A1F71',
    mastercard: '#EB001B',
    americanexpress: '#2E77BC',
    jcb: '#003A8F',
    momo: '#D82D8B',
    zalopay: '#028FE3',
    vnpay: '#00519C',
    cod: '#16a34a',
  };
  return map[provider?.toLowerCase?.()] || Colors.primary;
};

export default function PaymentMethodsScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [paymentMethods, setPaymentMethods] = useState([]);

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
  }, [fadeAnim, slideAnim]);

  const enhancePaymentMethod = useCallback((method) => {
    if (!method) return null;
    const expiresAt = method.expiresAt
      ? new Date(method.expiresAt).toLocaleDateString('vi-VN')
      : null;

    return {
      ...method,
      icon: iconForType(method.type),
      color: colorForProvider(method.provider),
      displayName: method.displayName || method.provider || 'Payment method',
      expiresAt,
    };
  }, []);

  const fetchPaymentMethods = useCallback(
    async (showSpinner = true) => {
      try {
        if (showSpinner) {
          setLoading(true);
        } else {
          setRefreshing(true);
        }
        setError(null);

        const response = await paymentMethodService.getUserPaymentMethods();
        if (response?.success === false) {
          throw new Error(response.message || 'Failed to load payment methods');
        }

        const raw =
          response?.data ||
          response?.paymentMethods ||
          [];

        const transformed = paymentMethodService.transformPaymentMethods(raw) || [];
        setPaymentMethods(transformed.map(enhancePaymentMethod));
      } catch (err) {
        const message =
          err?.message ||
          err?.response?.data?.message ||
          'Failed to load payment methods. Please try again.';
        setError(message);
        setPaymentMethods([]);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [enhancePaymentMethod]
  );

  useEffect(() => {
    fetchPaymentMethods(true);
  }, [fetchPaymentMethods]);

  const setDefaultPayment = async (paymentId) => {
    try {
      const response = await paymentMethodService.setDefaultPaymentMethod(paymentId);
      if (response?.success === false) {
        throw new Error(response.message || 'Failed to set default payment method');
      }
      await fetchPaymentMethods(true);
    } catch (err) {
      Alert.alert('Error', err?.message || 'Failed to set default payment method.');
    }
  };

  const deletePaymentMethod = (paymentId) => {
    Alert.alert('Delete Payment Method', 'Are you sure you want to delete this payment method?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            const response = await paymentMethodService.deletePaymentMethod(paymentId);
            if (response?.success === false) {
              throw new Error(response.message || 'Failed to delete payment method');
            }
            await fetchPaymentMethods(true);
          } catch (err) {
            Alert.alert('Error', err?.message || 'Failed to delete payment method.');
          }
        },
      },
    ]);
  };

  const editPaymentMethod = () => {
    Alert.alert('Edit Payment Method', 'Edit payment method feature will be implemented');
  };

  const addNewPaymentMethod = () => {
    Alert.alert('Add Payment Method', 'Add new payment method feature will be implemented');
  };

  const cardCount = useMemo(
    () => paymentMethods.filter(method => ['credit_card', 'debit_card'].includes(method.type)).length,
    [paymentMethods]
  );
  const walletCount = useMemo(
    () => paymentMethods.filter(method => method.type === 'ewallet').length,
    [paymentMethods]
  );

  const renderPaymentMethodItem = (payment) => (
    <Animated.View
      key={payment.id}
      style={[
        styles.paymentCard,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <Card style={[styles.paymentCardContent, payment.isDefault && styles.defaultPaymentCard]}>
        <View style={styles.paymentHeader}>
          <View style={styles.paymentInfo}>
            <View style={[styles.paymentIconContainer, { backgroundColor: payment.color }]}>
              <Text style={styles.paymentIcon}>{payment.icon}</Text>
            </View>
            <View style={styles.paymentDetails}>
              <Text style={styles.paymentName}>{payment.displayName}</Text>
              <Text style={styles.paymentProvider}>{payment.provider}</Text>
              {payment.expiresAt && (
                <Text style={styles.paymentExpiry}>Expires {payment.expiresAt}</Text>
              )}
              {payment.phone && <Text style={styles.paymentPhone}>{payment.phone}</Text>}
              {payment.account && <Text style={styles.paymentAccount}>{payment.account}</Text>}
            </View>
          </View>
          <View style={styles.paymentActions}>
            {payment.isDefault && (
              <View style={styles.defaultBadge}>
                <Text style={styles.defaultBadgeText}>DEFAULT</Text>
              </View>
            )}
            <TouchableOpacity style={styles.actionButton} onPress={editPaymentMethod}>
              <Text style={styles.actionButtonText}>✏️</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => deletePaymentMethod(payment.id)}
            >
              <Text style={styles.actionButtonText}>🗑️</Text>
            </TouchableOpacity>
          </View>
        </View>

        {!payment.isDefault && (
          <TouchableOpacity
            style={styles.setDefaultButton}
            onPress={() => setDefaultPayment(payment.id)}
          >
            <Text style={styles.setDefaultButtonText}>Set as Default</Text>
          </TouchableOpacity>
        )}
      </Card>
    </Animated.View>
  );

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
              onRefresh={() => fetchPaymentMethods(false)}
              tintColor={Colors.primary}
              colors={[Colors.primary]}
            />
          }
        >
          <Animated.View
            style={[
              styles.header,
              { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
            ]}
          >
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <View style={styles.backButtonContainer}>
                <Text style={styles.backIcon}>←</Text>
                <Text style={styles.backText}>Payment Methods</Text>
              </View>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View
            style={[
              styles.statsContainer,
              { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
            ]}
          >
            <Card style={styles.statsCard}>
              <View style={styles.statsContent}>
                <View style={styles.statItem}>
                  <Text style={styles.statIcon}>💳</Text>
                  <Text style={styles.statNumber}>{paymentMethods.length}</Text>
                  <Text style={styles.statLabel}>Payment Methods</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statIcon}>🏦</Text>
                  <Text style={styles.statNumber}>{cardCount}</Text>
                  <Text style={styles.statLabel}>Credit Cards</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statIcon}>📱</Text>
                  <Text style={styles.statNumber}>{walletCount}</Text>
                  <Text style={styles.statLabel}>Digital Wallets</Text>
                </View>
              </View>
            </Card>
          </Animated.View>

          <Animated.View
            style={[
              styles.addButtonContainer,
              { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
            ]}
          >
            <TouchableOpacity style={styles.addButton} onPress={addNewPaymentMethod}>
              <Text style={styles.addButtonIcon}>➕</Text>
              <Text style={styles.addButtonText}>Add Payment Method</Text>
            </TouchableOpacity>
          </Animated.View>

          <View style={styles.paymentMethodsContainer}>
            {loading ? (
              <View style={styles.loadingContainer}>
                <LoadingSpinner
                  size="medium"
                  color={Colors.primary}
                  text="Loading payment methods..."
                />
              </View>
            ) : paymentMethods.length > 0 ? (
              paymentMethods.map(renderPaymentMethodItem)
            ) : (
              <Animated.View
                style={[
                  styles.emptyState,
                  { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
                ]}
              >
                <Card style={styles.emptyCard}>
                  <Text style={styles.emptyIcon}>💳</Text>
                  <Text style={styles.emptyTitle}>No Payment Methods</Text>
                  <Text style={styles.emptySubtitle}>
                    {error || 'Add a payment method to make checkout faster and easier'}
                  </Text>
                  <TouchableOpacity
                    style={[styles.shopButton, error && styles.retryButton]}
                    onPress={error ? () => fetchPaymentMethods(true) : addNewPaymentMethod}
                  >
                    <Text style={styles.shopButtonText}>
                      {error ? 'Try Again' : 'Add Payment Method'}
                    </Text>
                  </TouchableOpacity>
                </Card>
              </Animated.View>
            )}
          </View>

          <Animated.View
            style={[
              styles.securityNotice,
              { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
            ]}
          >
            <Card style={styles.securityCard}>
              <View style={styles.securityContent}>
                <Text style={styles.securityIcon}>🔒</Text>
                <View style={styles.securityText}>
                  <Text style={styles.securityTitle}>Secure Payment</Text>
                  <Text style={styles.securitySubtitle}>
                    Your payment information is encrypted and secure. We never store your full card
                    details.
                  </Text>
                </View>
              </View>
            </Card>
          </Animated.View>
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
  statIcon: {
    fontSize: 24,
    marginBottom: Spacing.sm,
  },
  statNumber: {
    ...Typography.h4,
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
    marginHorizontal: Spacing.sm,
  },
  addButtonContainer: {
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.md,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.lg,
    borderRadius: 25,
    elevation: 6,
    shadowColor: Colors.shadowDark,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  addButtonIcon: {
    fontSize: 20,
    marginRight: Spacing.sm,
  },
  addButtonText: {
    ...Typography.button,
    color: Colors.white,
    fontWeight: '700',
  },
  paymentMethodsContainer: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
  },
  paymentCard: {
    marginBottom: Spacing.md,
  },
  paymentCardContent: {
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
  defaultPaymentCard: {
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  paymentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  paymentInfo: {
    flexDirection: 'row',
    flex: 1,
  },
  paymentIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  paymentIcon: {
    fontSize: 24,
    color: Colors.white,
  },
  paymentDetails: {
    flex: 1,
  },
  paymentName: {
    ...Typography.bodyBold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  paymentProvider: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  paymentExpiry: {
    ...Typography.caption,
    color: Colors.textLight,
  },
  paymentPhone: {
    ...Typography.caption,
    color: Colors.textLight,
  },
  paymentAccount: {
    ...Typography.caption,
    color: Colors.textLight,
  },
  paymentActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  defaultBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: 10,
    marginRight: Spacing.sm,
  },
  defaultBadgeText: {
    ...Typography.caption,
    color: Colors.white,
    fontWeight: '700',
    fontSize: 10,
  },
  actionButton: {
    padding: Spacing.sm,
    marginLeft: Spacing.sm,
    borderRadius: 15,
    backgroundColor: Colors.surfaceLight,
  },
  actionButtonText: {
    fontSize: 16,
  },
  setDefaultButton: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.surfaceLight,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  setDefaultButtonText: {
    ...Typography.caption,
    color: Colors.primary,
    fontWeight: '600',
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
  retryButton: {
    backgroundColor: Colors.info,
  },
  shopButtonText: {
    ...Typography.button,
    color: Colors.white,
    fontWeight: '700',
  },
  securityNotice: {
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.xl,
  },
  securityCard: {
    padding: Spacing.lg,
    borderRadius: 20,
    elevation: 4,
    shadowColor: Colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    backgroundColor: Colors.surfaceLight,
  },
  securityContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  securityIcon: {
    fontSize: 24,
    marginRight: Spacing.md,
  },
  securityText: {
    flex: 1,
  },
  securityTitle: {
    ...Typography.bodyBold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  securitySubtitle: {
    ...Typography.caption,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
});

