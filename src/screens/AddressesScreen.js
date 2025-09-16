import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, TextInput } from 'react-native-paper';
import { Colors, Spacing, Typography } from '../constants/colors';
import { ROUTES } from '../navigation/navigationConstants';
import LoadingSpinner from '../components/LoadingSpinner';

const { width } = Dimensions.get('window');

export default function AddressesScreen({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      name: 'John Doe',
      phone: '0901234567',
      address: '123 Main Street, District 1',
      city: 'Ho Chi Minh City',
      postalCode: '700000',
      isDefault: true,
      type: 'home',
    },
    {
      id: 2,
      name: 'John Doe',
      phone: '0901234567',
      address: '456 Business Center, District 3',
      city: 'Ho Chi Minh City',
      postalCode: '700000',
      isDefault: false,
      type: 'office',
    },
    {
      id: 3,
      name: 'Jane Doe',
      phone: '0907654321',
      address: '789 Residential Area, District 7',
      city: 'Ho Chi Minh City',
      postalCode: '700000',
      isDefault: false,
      type: 'home',
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

  const setDefaultAddress = (addressId) => {
    setAddresses(prev => prev.map(addr => ({
      ...addr,
      isDefault: addr.id === addressId
    })));
  };

  const deleteAddress = (addressId) => {
    Alert.alert(
      'Delete Address',
      'Are you sure you want to delete this address?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setAddresses(prev => prev.filter(addr => addr.id !== addressId));
          }
        }
      ]
    );
  };

  const editAddress = (address) => {
    // Navigate to edit address screen
    Alert.alert('Edit Address', 'Edit address feature will be implemented');
  };

  const addNewAddress = () => {
    // Navigate to add address screen
    Alert.alert('Add Address', 'Add new address feature will be implemented');
  };

  const getAddressTypeIcon = (type) => {
    switch (type) {
      case 'home': return '🏠';
      case 'office': return '🏢';
      case 'other': return '📍';
      default: return '📍';
    }
  };

  const getAddressTypeColor = (type) => {
    switch (type) {
      case 'home': return Colors.success;
      case 'office': return Colors.info;
      case 'other': return Colors.warning;
      default: return Colors.textSecondary;
    }
  };

  const renderAddressItem = (address) => (
    <Animated.View
      key={address.id}
      style={[
        styles.addressCard,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <Card style={[styles.addressCardContent, address.isDefault && styles.defaultAddressCard]}>
        <View style={styles.addressHeader}>
          <View style={styles.addressTypeContainer}>
            <Text style={styles.addressTypeIcon}>{getAddressTypeIcon(address.type)}</Text>
            <Text style={[styles.addressType, { color: getAddressTypeColor(address.type) }]}>
              {address.type.toUpperCase()}
            </Text>
            {address.isDefault && (
              <View style={styles.defaultBadge}>
                <Text style={styles.defaultBadgeText}>DEFAULT</Text>
              </View>
            )}
          </View>
          <View style={styles.addressActions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => editAddress(address)}
            >
              <Text style={styles.actionButtonText}>✏️</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => deleteAddress(address.id)}
            >
              <Text style={styles.actionButtonText}>🗑️</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.addressInfo}>
          <Text style={styles.addressName}>{address.name}</Text>
          <Text style={styles.addressPhone}>{address.phone}</Text>
          <Text style={styles.addressText}>{address.address}</Text>
          <Text style={styles.addressCity}>{address.city} {address.postalCode}</Text>
        </View>

        {!address.isDefault && (
          <TouchableOpacity
            style={styles.setDefaultButton}
            onPress={() => setDefaultAddress(address.id)}
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
                <Text style={styles.backText}>Addresses</Text>
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
                  <Text style={styles.statIcon}>📍</Text>
                  <Text style={styles.statNumber}>{addresses.length}</Text>
                  <Text style={styles.statLabel}>Saved Addresses</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statIcon}>🏠</Text>
                  <Text style={styles.statNumber}>
                    {addresses.filter(addr => addr.type === 'home').length}
                  </Text>
                  <Text style={styles.statLabel}>Home Addresses</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statIcon}>🏢</Text>
                  <Text style={styles.statNumber}>
                    {addresses.filter(addr => addr.type === 'office').length}
                  </Text>
                  <Text style={styles.statLabel}>Office Addresses</Text>
                </View>
              </View>
            </Card>
          </Animated.View>

          {/* Add New Address Button */}
          <Animated.View
            style={[
              styles.addButtonContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <TouchableOpacity
              style={styles.addButton}
              onPress={addNewAddress}
            >
              <Text style={styles.addButtonIcon}>➕</Text>
              <Text style={styles.addButtonText}>Add New Address</Text>
            </TouchableOpacity>
          </Animated.View>

          {/* Addresses List */}
          <View style={styles.addressesContainer}>
            {loading ? (
              <View style={styles.loadingContainer}>
                <LoadingSpinner size="medium" color={Colors.primary} text="Loading addresses..." />
              </View>
            ) : addresses.length > 0 ? (
              addresses.map(renderAddressItem)
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
                  <Text style={styles.emptyIcon}>📍</Text>
                  <Text style={styles.emptyTitle}>No Addresses Found</Text>
                  <Text style={styles.emptySubtitle}>
                    Add your first address to make ordering easier
                  </Text>
                  <TouchableOpacity
                    style={styles.shopButton}
                    onPress={addNewAddress}
                  >
                    <Text style={styles.shopButtonText}>Add Address</Text>
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
  addressesContainer: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  addressCard: {
    marginBottom: Spacing.md,
  },
  addressCardContent: {
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
  defaultAddressCard: {
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  addressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  addressTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addressTypeIcon: {
    fontSize: 20,
    marginRight: Spacing.sm,
  },
  addressType: {
    ...Typography.caption,
    fontWeight: '700',
    marginRight: Spacing.sm,
  },
  defaultBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: 10,
  },
  defaultBadgeText: {
    ...Typography.caption,
    color: Colors.white,
    fontWeight: '700',
    fontSize: 10,
  },
  addressActions: {
    flexDirection: 'row',
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
  addressInfo: {
    marginBottom: Spacing.md,
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
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
    lineHeight: 22,
  },
  addressCity: {
    ...Typography.body,
    color: Colors.textSecondary,
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
  shopButtonText: {
    ...Typography.button,
    color: Colors.white,
    fontWeight: '700',
  },
});

