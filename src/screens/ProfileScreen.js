import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, Button, Avatar } from 'react-native-paper';
import { Colors, Spacing, Typography } from '../constants/colors';
import { ROUTES } from '../navigation/navigationConstants';

export default function ProfileScreen({ navigation }) {
  const user = {
    name: 'John Doe',
    email: 'john@example.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
    memberSince: '2023',
    totalOrders: 12,
    loyaltyPoints: 1250,
  };

  const menuItems = [
    { id: 1, title: 'My Orders', subtitle: 'Track your orders', icon: '📦', color: Colors.primary, onPress: () => navigation.navigate(ROUTES.ORDERS) },
    { id: 2, title: 'Wishlist', subtitle: 'Your favorite items', icon: '❤️', color: Colors.error, onPress: () => navigation.navigate(ROUTES.WISHLIST) },
    { id: 3, title: 'Addresses', subtitle: 'Manage delivery addresses', icon: '📍', color: Colors.info, onPress: () => navigation.navigate(ROUTES.ADDRESSES) },
    { id: 4, title: 'Payment Methods', subtitle: 'Cards and payment options', icon: '💳', color: Colors.success, onPress: () => navigation.navigate(ROUTES.PAYMENT_METHODS) },
    { id: 5, title: 'Notifications', subtitle: 'App notifications', icon: '🔔', color: Colors.warning, onPress: () => navigation.navigate(ROUTES.NOTIFICATIONS) },
    { id: 6, title: 'Settings', subtitle: 'App preferences', icon: '⚙️', color: Colors.textSecondary, onPress: () => navigation.navigate(ROUTES.SETTINGS) },
    { id: 7, title: 'Help & Support', subtitle: 'Get help and support', icon: '❓', color: Colors.accent, onPress: () => navigation.navigate(ROUTES.HELP_SUPPORT) },
  ];

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => navigation.replace(ROUTES.LOGIN),
        },
      ]
    );
  };

  const renderMenuItem = (item) => (
    <TouchableOpacity
      key={item.id}
      style={styles.menuItem}
      onPress={item.onPress}
    >
      <View style={styles.menuItemLeft}>
        <View style={[styles.menuIconContainer, { backgroundColor: item.color + '20' }]}>
          <Text style={styles.menuIcon}>{item.icon}</Text>
        </View>
        <View style={styles.menuTextContainer}>
          <Text style={styles.menuTitle}>{item.title}</Text>
          <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
        </View>
      </View>
      <Text style={styles.menuArrow}>›</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>👤 Profile</Text>
        </View>

        {/* User Info Card */}
        <Card style={styles.userCard}>
          <View style={styles.userInfo}>
            <View style={styles.avatarContainer}>
              <Avatar.Image
                size={90}
                source={{ uri: user.avatar }}
                style={styles.avatar}
              />
              <View style={styles.onlineIndicator} />
            </View>
            <View style={styles.userDetails}>
              <Text style={styles.userName}>{user.name}</Text>
              <Text style={styles.userEmail}>{user.email}</Text>
              <Text style={styles.memberSince}>Member since {user.memberSince}</Text>
            </View>
          </View>
          <Button
            mode="contained"
            style={styles.editButton}
            onPress={() => Alert.alert('Coming Soon', 'Edit Profile feature will be available soon')}
          >
            Edit Profile
          </Button>
        </Card>

        {/* Stats Card */}
        <Card style={styles.statsCard}>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{user.totalOrders}</Text>
              <Text style={styles.statLabel}>Orders</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{user.loyaltyPoints}</Text>
              <Text style={styles.statLabel}>Points</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>Gold</Text>
              <Text style={styles.statLabel}>Member</Text>
            </View>
          </View>
        </Card>

        {/* Menu Items */}
        <Card style={styles.menuCard}>
          {menuItems.map(renderMenuItem)}
        </Card>

        {/* Logout Button */}
        <View style={styles.logoutContainer}>
          <Button
            mode="contained"
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            Logout
          </Button>
        </View>
      </ScrollView>
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
    backgroundColor: Colors.primary,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    elevation: 8,
    shadowColor: Colors.shadowDark,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  headerTitle: {
    ...Typography.h2,
    color: Colors.white,
    fontWeight: '800',
    textAlign: 'center',
  },
  userCard: {
    margin: Spacing.md,
    padding: Spacing.lg,
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
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: Spacing.md,
  },
  avatar: {
    borderWidth: 3,
    borderColor: Colors.primary,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: Colors.success,
    borderWidth: 2,
    borderColor: Colors.white,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    ...Typography.h3,
    marginBottom: Spacing.xs,
    fontWeight: '700',
  },
  userEmail: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  memberSince: {
    ...Typography.small,
    color: Colors.textLight,
  },
  editButton: {
    borderRadius: 25,
    backgroundColor: Colors.primary,
  },
  statsCard: {
    margin: Spacing.md,
    marginTop: 0,
    padding: Spacing.lg,
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
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    ...Typography.h2,
    color: Colors.primary,
    marginBottom: Spacing.xs,
    fontWeight: '800',
  },
  statLabel: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  statDivider: {
    width: 1,
    backgroundColor: Colors.border,
    marginHorizontal: Spacing.md,
  },
  menuCard: {
    margin: Spacing.md,
    marginTop: 0,
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
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  menuIcon: {
    fontSize: 20,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuTitle: {
    ...Typography.body,
    fontWeight: '600',
    marginBottom: 2,
  },
  menuSubtitle: {
    ...Typography.small,
    color: Colors.textSecondary,
  },
  menuArrow: {
    ...Typography.h3,
    color: Colors.textSecondary,
    fontWeight: 'bold',
  },
  logoutContainer: {
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
  logoutButton: {
    borderRadius: 25,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.error,
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