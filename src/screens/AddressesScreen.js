import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
  Alert,
  RefreshControl,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from 'react-native-paper';
import { Colors, Spacing, Typography } from '../constants/colors';
import { ROUTES } from '../navigation/navigationConstants';
import LoadingSpinner from '../components/LoadingSpinner';
import addressService from '../services/addressService';

const { width } = Dimensions.get('window');

const DEFAULT_FORM_STATE = {
  fullName: '',
  phone: '',
  line1: '',
  line2: '',
  city: '',
  state: '',
  postalCode: '',
  type: 'home',
  isDefault: false,
};

const ADDRESS_TYPES = [
  { key: 'home', label: 'Home', icon: '🏠' },
  { key: 'office', label: 'Office', icon: '🏢' },
  { key: 'other', label: 'Other', icon: '📍' },
];

export default function AddressesScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [formData, setFormData] = useState({ ...DEFAULT_FORM_STATE });
  const [formErrors, setFormErrors] = useState({});
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  const fetchAddresses = useCallback(
    async (showSpinner = true) => {
      try {
        if (showSpinner) {
          setLoading(true);
        } else {
          setRefreshing(true);
        }
        setError(null);

        const response = await addressService.getUserAddresses();
        if (response?.success === false) {
          throw new Error(response.message || 'Failed to load addresses');
        }

        const rawAddresses =
          response?.data ||
          response?.addresses ||
          [];
        const transformed = addressService.transformAddresses(rawAddresses) || [];
        setAddresses(transformed);
      } catch (err) {
        const message =
          err?.message ||
          err?.response?.data?.message ||
          'Failed to load addresses. Please try again.';
        setError(message);
        setAddresses([]);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    []
  );

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
    fetchAddresses(true);
  }, [fetchAddresses, fadeAnim, slideAnim]);

  const homeCount = useMemo(
    () => addresses.filter(addr => addr.type === 'home').length,
    [addresses]
  );
  const officeCount = useMemo(
    () => addresses.filter(addr => addr.type === 'office').length,
    [addresses]
  );

  const resetForm = useCallback(() => {
    setFormData({ ...DEFAULT_FORM_STATE });
    setFormErrors({});
    setEditingAddress(null);
  }, [setFormData, setFormErrors, setEditingAddress]);

  const setDefaultAddress = async (addressId) => {
    try {
      const result = await addressService.setDefaultAddress(addressId);
      if (result.success !== false) {
        await fetchAddresses(true);
      } else {
        Alert.alert('Error', result.message || 'Failed to set default address');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to set default address');
    }
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
          onPress: async () => {
            try {
              const result = await addressService.deleteAddress(addressId);
              if (result.success) {
                await fetchAddresses(true);
              } else {
                Alert.alert('Error', result.message || 'Failed to delete address');
              }
            } catch (error) {
              Alert.alert('Error', 'Failed to delete address');
            }
          }
        }
      ]
    );
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const openAddAddressForm = () => {
    resetForm();
    setFormVisible(true);
  };

  const openEditAddressForm = (address) => {
    if (!address) return;
    setEditingAddress(address);
    setFormData({
      ...DEFAULT_FORM_STATE,
      ...address,
      line2: address.line2 || '',
      type: address.type || 'home',
      isDefault: !!address.isDefault,
    });
    setFormErrors({});
    setFormVisible(true);
  };

  const closeForm = () => {
    setFormVisible(false);
    resetForm();
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.fullName.trim()) errors.fullName = 'Full name is required';
    if (!formData.phone.trim()) errors.phone = 'Phone number is required';
    if (!formData.line1.trim()) errors.line1 = 'Address line is required';
    if (!formData.city.trim()) errors.city = 'City is required';
    if (!formData.state.trim()) errors.state = 'State/Province is required';
    if (!formData.postalCode.trim()) errors.postalCode = 'Postal code is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const submitForm = async () => {
    if (!validateForm()) return;

    setFormLoading(true);
    try {
      const payload = {
        fullName: formData.fullName.trim(),
        phone: formData.phone.trim(),
        line1: formData.line1.trim(),
        line2: formData.line2.trim() || null,
        city: formData.city.trim(),
        state: formData.state.trim(),
        postalCode: formData.postalCode.trim(),
        country: 'Vietnam',
        type: formData.type === 'office' ? 'work' : formData.type,
        isDefault: formData.isDefault,
      };

      let result;
      if (editingAddress?.id) {
        result = await addressService.updateAddress(editingAddress.id, payload);
      } else {
        result = await addressService.createAddress(payload);
      }

      if (result?.success === false) {
        Alert.alert('Error', result.message || 'Failed to save address');
        return;
      }

      Alert.alert(
        'Success',
        editingAddress ? 'Address updated successfully' : 'Address added successfully'
      );

      closeForm();
      await fetchAddresses(true);
    } catch (err) {
      const message =
        err?.message ||
        err?.response?.data?.message ||
        'Failed to save address. Please try again.';
      Alert.alert('Error', message);
    } finally {
      setFormLoading(false);
    }
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
              onPress={() => openEditAddressForm(address)}
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
          <Text style={styles.addressName}>{address.fullName}</Text>
          <Text style={styles.addressPhone}>{address.phone}</Text>
          <Text style={styles.addressText}>{address.line1}{address.line2 ? ', ' + address.line2 : ''}</Text>
          <Text style={styles.addressCity}>{address.city}, {address.state} {address.postalCode}</Text>
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

        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => fetchAddresses(false)}
              tintColor={Colors.primary}
              colors={[Colors.primary]}
            />
          }
        >
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
                    {homeCount}
                  </Text>
                  <Text style={styles.statLabel}>Home Addresses</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statIcon}>🏢</Text>
                  <Text style={styles.statNumber}>
                    {officeCount}
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
              onPress={openAddAddressForm}
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
                    {error || 'Add your first address to make ordering easier'}
                  </Text>
                  <TouchableOpacity
                    style={[styles.shopButton, error && styles.retryButton]}
                    onPress={error ? () => fetchAddresses(true) : openAddAddressForm}
                  >
                    <Text style={styles.shopButtonText}>
                      {error ? 'Try Again' : 'Add Address'}
                    </Text>
                  </TouchableOpacity>
                </Card>
              </Animated.View>
            )}
          </View>
        </ScrollView>
      </View>

      <Modal
        visible={formVisible}
        transparent
        animationType="slide"
        onRequestClose={closeForm}
      >
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.modalWrapper}
          >
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  {editingAddress ? 'Edit Address' : 'Add Address'}
                </Text>
                <TouchableOpacity onPress={closeForm} style={styles.modalCloseButton}>
                  <Text style={styles.modalCloseIcon}>✕</Text>
                </TouchableOpacity>
              </View>

              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.formScrollContent}
              >
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Full Name</Text>
                  <TextInput
                    style={[
                      styles.input,
                      formErrors.fullName && styles.inputError,
                    ]}
                    placeholder="Nguyễn Văn A"
                    value={formData.fullName}
                    onChangeText={(value) => handleInputChange('fullName', value)}
                    autoCapitalize="words"
                    placeholderTextColor={Colors.textLight}
                    returnKeyType="next"
                  />
                  {formErrors.fullName && (
                    <Text style={styles.errorText}>{formErrors.fullName}</Text>
                  )}
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Phone Number</Text>
                  <TextInput
                    style={[
                      styles.input,
                      formErrors.phone && styles.inputError,
                    ]}
                    placeholder="0901 234 567"
                    value={formData.phone}
                    onChangeText={(value) => handleInputChange('phone', value)}
                    keyboardType="phone-pad"
                    placeholderTextColor={Colors.textLight}
                    returnKeyType="next"
                  />
                  {formErrors.phone && (
                    <Text style={styles.errorText}>{formErrors.phone}</Text>
                  )}
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Address Type</Text>
                  <View style={styles.typeSelector}>
                    {ADDRESS_TYPES.map((type) => {
                      const selected = formData.type === type.key;
                      return (
                        <TouchableOpacity
                          key={type.key}
                          style={[
                            styles.typeChip,
                            selected && styles.typeChipSelected,
                          ]}
                          onPress={() => handleInputChange('type', type.key)}
                          disabled={formLoading}
                        >
                          <Text
                            style={[
                              styles.typeChipIcon,
                              selected && styles.typeChipIconSelected,
                            ]}
                          >
                            {type.icon}
                          </Text>
                          <Text
                            style={[
                              styles.typeChipLabel,
                              selected && styles.typeChipLabelSelected,
                            ]}
                          >
                            {type.label}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Address Line 1</Text>
                  <TextInput
                    style={[
                      styles.input,
                      formErrors.line1 && styles.inputError,
                    ]}
                    placeholder="123 Đường ABC"
                    value={formData.line1}
                    onChangeText={(value) => handleInputChange('line1', value)}
                    placeholderTextColor={Colors.textLight}
                    returnKeyType="next"
                  />
                  {formErrors.line1 && (
                    <Text style={styles.errorText}>{formErrors.line1}</Text>
                  )}
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Address Line 2 (Optional)</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Phường, khu vực..."
                    value={formData.line2}
                    onChangeText={(value) => handleInputChange('line2', value)}
                    placeholderTextColor={Colors.textLight}
                    returnKeyType="next"
                  />
                </View>

                <View style={styles.inputRow}>
                  <View style={[styles.inputGroup, styles.inputGroupHalf]}>
                    <Text style={styles.inputLabel}>City</Text>
                    <TextInput
                      style={[
                        styles.input,
                        formErrors.city && styles.inputError,
                      ]}
                      placeholder="Hà Nội"
                      value={formData.city}
                      onChangeText={(value) => handleInputChange('city', value)}
                      placeholderTextColor={Colors.textLight}
                      returnKeyType="next"
                    />
                    {formErrors.city && (
                      <Text style={styles.errorText}>{formErrors.city}</Text>
                    )}
                  </View>
                  <View style={[styles.inputGroup, styles.inputGroupHalf]}>
                    <Text style={styles.inputLabel}>State/Province</Text>
                    <TextInput
                      style={[
                        styles.input,
                        formErrors.state && styles.inputError,
                      ]}
                      placeholder="Quận/Huyện"
                      value={formData.state}
                      onChangeText={(value) => handleInputChange('state', value)}
                      placeholderTextColor={Colors.textLight}
                      returnKeyType="next"
                    />
                    {formErrors.state && (
                      <Text style={styles.errorText}>{formErrors.state}</Text>
                    )}
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Postal Code</Text>
                  <TextInput
                    style={[
                      styles.input,
                      formErrors.postalCode && styles.inputError,
                    ]}
                    placeholder="100000"
                    value={formData.postalCode}
                    onChangeText={(value) => handleInputChange('postalCode', value)}
                    keyboardType="number-pad"
                    placeholderTextColor={Colors.textLight}
                    returnKeyType="done"
                  />
                  {formErrors.postalCode && (
                    <Text style={styles.errorText}>{formErrors.postalCode}</Text>
                  )}
                </View>

                <TouchableOpacity
                  style={[
                    styles.defaultToggle,
                    formData.isDefault && styles.defaultToggleActive,
                  ]}
                  onPress={() => handleInputChange('isDefault', !formData.isDefault)}
                  disabled={formLoading}
                >
                  <Text
                    style={[
                      styles.defaultToggleText,
                      formData.isDefault && styles.defaultToggleTextActive,
                    ]}
                  >
                    {formData.isDefault ? 'This is your default address' : 'Set as default address'}
                  </Text>
                </TouchableOpacity>
              </ScrollView>

              <View style={styles.modalFooter}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={closeForm}
                  disabled={formLoading}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.saveButton,
                    formLoading && styles.saveButtonDisabled,
                  ]}
                  onPress={submitForm}
                  disabled={formLoading}
                >
                  <Text style={styles.saveButtonText}>
                    {formLoading
                      ? 'Saving...'
                      : editingAddress
                      ? 'Update Address'
                      : 'Save Address'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
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
  retryButton: {
    backgroundColor: Colors.info,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
  },
  modalWrapper: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderRadius: 24,
    padding: Spacing.lg,
    maxHeight: '90%',
    width: '100%',
    maxWidth: 420,
    alignSelf: 'center',
    elevation: 10,
    shadowColor: Colors.shadowDark,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  modalTitle: {
    ...Typography.h3,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  modalCloseButton: {
    padding: Spacing.sm,
  },
  modalCloseIcon: {
    fontSize: 20,
    color: Colors.textSecondary,
  },
  formScrollContent: {
    paddingBottom: Spacing.lg,
  },
  inputGroup: {
    marginBottom: Spacing.md,
  },
  inputGroupHalf: {
    flex: 1,
  },
  inputRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  inputLabel: {
    ...Typography.caption,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
    textTransform: 'uppercase',
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderRadius: 16,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.surfaceLight,
    color: Colors.textPrimary,
  },
  inputError: {
    borderColor: Colors.error,
  },
  errorText: {
    ...Typography.small,
    color: Colors.error,
    marginTop: Spacing.xs,
  },
  typeSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  typeChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.sm,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    backgroundColor: Colors.surfaceLight,
    gap: Spacing.xs,
  },
  typeChipSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  typeChipIcon: {
    fontSize: 16,
  },
  typeChipIconSelected: {
    color: Colors.white,
  },
  typeChipLabel: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  typeChipLabelSelected: {
    color: Colors.white,
  },
  defaultToggle: {
    marginTop: Spacing.sm,
    paddingVertical: Spacing.sm,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    backgroundColor: Colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  defaultToggleActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight,
  },
  defaultToggleText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  defaultToggleTextActive: {
    color: Colors.primaryDark,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  cancelButton: {
    flex: 1,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surfaceLight,
  },
  cancelButtonText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  saveButton: {
    flex: 1.2,
    borderRadius: 18,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    shadowColor: Colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    ...Typography.button,
    fontSize: 14,
    color: Colors.white,
  },
});

