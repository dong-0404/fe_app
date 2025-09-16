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

export default function NotificationsScreen({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'order',
      title: 'Order Delivered',
      message: 'Your order #ORD001 has been delivered successfully!',
      time: '2 hours ago',
      isRead: false,
      icon: '📦',
      color: Colors.success,
    },
    {
      id: 2,
      type: 'promotion',
      title: 'Special Offer',
      message: 'Get 20% off on all Nike shoes this weekend only!',
      time: '5 hours ago',
      isRead: false,
      icon: '🎉',
      color: Colors.accent,
    },
    {
      id: 3,
      type: 'payment',
      title: 'Payment Successful',
      message: 'Your payment of ₫2,500,000 has been processed successfully.',
      time: '1 day ago',
      isRead: true,
      icon: '💳',
      color: Colors.success,
    },
    {
      id: 4,
      type: 'wishlist',
      title: 'Price Drop Alert',
      message: 'Nike Air Max 270 is now 15% off! Check it out now.',
      time: '2 days ago',
      isRead: true,
      icon: '💰',
      color: Colors.warning,
    },
    {
      id: 5,
      type: 'order',
      title: 'Order Shipped',
      message: 'Your order #ORD002 has been shipped and is on its way!',
      time: '3 days ago',
      isRead: true,
      icon: '🚚',
      color: Colors.info,
    },
    {
      id: 6,
      type: 'account',
      title: 'Welcome to ShoeStore!',
      message: 'Thank you for joining us. Start shopping for your favorite shoes!',
      time: '1 week ago',
      isRead: true,
      icon: '👋',
      color: Colors.primary,
    },
  ]);
  
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

  const markAsRead = (notificationId) => {
    setNotifications(prev => prev.map(notif => 
      notif.id === notificationId ? { ...notif, isRead: true } : notif
    ));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, isRead: true })));
  };

  const deleteNotification = (notificationId) => {
    setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter(notif => !notif.isRead).length;

  const renderNotificationItem = (notification) => (
    <Animated.View
      key={notification.id}
      style={[
        styles.notificationCard,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <TouchableOpacity
        style={[
          styles.notificationCardContent,
          !notification.isRead && styles.unreadNotification,
        ]}
        onPress={() => markAsRead(notification.id)}
      >
        <Card style={styles.notificationCardInner}>
          <View style={styles.notificationContent}>
            <View style={[styles.notificationIcon, { backgroundColor: notification.color }]}>
              <Text style={styles.notificationIconText}>{notification.icon}</Text>
            </View>
            
            <View style={styles.notificationInfo}>
              <View style={styles.notificationHeader}>
                <Text style={[
                  styles.notificationTitle,
                  !notification.isRead && styles.unreadTitle
                ]}>
                  {notification.title}
                </Text>
                {!notification.isRead && (
                  <View style={styles.unreadDot} />
                )}
              </View>
              <Text style={styles.notificationMessage}>{notification.message}</Text>
              <Text style={styles.notificationTime}>{notification.time}</Text>
            </View>

            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => deleteNotification(notification.id)}
            >
              <Text style={styles.deleteButtonText}>🗑️</Text>
            </TouchableOpacity>
          </View>
        </Card>
      </TouchableOpacity>
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
                <Text style={styles.backText}>Notifications</Text>
              </View>
            </TouchableOpacity>
          </Animated.View>

          {/* Stats Card */}
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
                  <Text style={styles.statIcon}>🔔</Text>
                  <Text style={styles.statNumber}>{notifications.length}</Text>
                  <Text style={styles.statLabel}>Total Notifications</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statIcon}>🔴</Text>
                  <Text style={styles.statNumber}>{unreadCount}</Text>
                  <Text style={styles.statLabel}>Unread</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statIcon}>✅</Text>
                  <Text style={styles.statNumber}>{notifications.length - unreadCount}</Text>
                  <Text style={styles.statLabel}>Read</Text>
                </View>
              </View>
            </Card>
          </Animated.View>

          {/* Action Buttons */}
          <Animated.View
            style={[
              styles.actionsContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <View style={styles.actionsRow}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={markAllAsRead}
                disabled={unreadCount === 0}
              >
                <Text style={styles.actionButtonText}>Mark All Read</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.clearButton]}
                onPress={clearAllNotifications}
                disabled={notifications.length === 0}
              >
                <Text style={[styles.actionButtonText, styles.clearButtonText]}>Clear All</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>

          {/* Notifications List */}
          <View style={styles.notificationsContainer}>
            {loading ? (
              <View style={styles.loadingContainer}>
                <LoadingSpinner size="medium" color={Colors.primary} text="Loading notifications..." />
              </View>
            ) : notifications.length > 0 ? (
              notifications.map(renderNotificationItem)
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
                  <Text style={styles.emptyIcon}>🔔</Text>
                  <Text style={styles.emptyTitle}>No Notifications</Text>
                  <Text style={styles.emptySubtitle}>
                    You're all caught up! New notifications will appear here.
                  </Text>
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
  actionsContainer: {
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.md,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  actionButton: {
    flex: 1,
    backgroundColor: Colors.surfaceLight,
    paddingVertical: Spacing.md,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    alignItems: 'center',
  },
  clearButton: {
    backgroundColor: Colors.error,
    borderColor: Colors.error,
  },
  actionButtonText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  clearButtonText: {
    color: Colors.white,
  },
  notificationsContainer: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  notificationCard: {
    marginBottom: Spacing.sm,
  },
  notificationCardContent: {
    borderRadius: 15,
  },
  unreadNotification: {
    backgroundColor: Colors.primaryLight,
    opacity: 0.1,
  },
  notificationCardInner: {
    padding: Spacing.md,
    borderRadius: 15,
    elevation: 4,
    shadowColor: Colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    backgroundColor: Colors.white,
  },
  notificationContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  notificationIconText: {
    fontSize: 20,
    color: Colors.white,
  },
  notificationInfo: {
    flex: 1,
    marginRight: Spacing.sm,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  notificationTitle: {
    ...Typography.bodyBold,
    color: Colors.textPrimary,
    flex: 1,
  },
  unreadTitle: {
    color: Colors.primary,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
    marginLeft: Spacing.sm,
  },
  notificationMessage: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
    lineHeight: 20,
  },
  notificationTime: {
    ...Typography.caption,
    color: Colors.textLight,
  },
  deleteButton: {
    padding: Spacing.sm,
    borderRadius: 15,
    backgroundColor: Colors.surfaceLight,
  },
  deleteButtonText: {
    fontSize: 16,
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
    lineHeight: 22,
  },
});

