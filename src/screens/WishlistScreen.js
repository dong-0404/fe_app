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
  ActivityIndicator,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, Button } from 'react-native-paper';
import { Colors, Spacing, Typography } from '../constants/colors';
import { ROUTES } from '../navigation/navigationConstants';
import LoadingSpinner from '../components/LoadingSpinner';
import wishlistService from '../services/wishlistService';
import cartService from '../services/cartService';
import productService from '../services/productService';
import { useAuth } from '../context/AuthContext';

const { width } = Dimensions.get('window');

export default function WishlistScreen({ navigation }) {
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [itemCount, setItemCount] = useState(0);
  const [processingItemId, setProcessingItemId] = useState(null);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  // Load wishlist on mount
  useEffect(() => {
    if (isAuthenticated) {
      loadWishlist();
    } else {
      setLoading(false);
      setWishlistItems([]);
    }
  }, [isAuthenticated]);

  // Reload wishlist when screen is focused
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (isAuthenticated) {
        loadWishlist();
      }
    });

    return unsubscribe;
  }, [navigation, isAuthenticated]);

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

  const loadWishlist = async () => {
    try {
      setLoading(true);
      const response = await wishlistService.getWishlist();
      
      if (response.success !== false && response.data) {
        const items = response.data.wishlist?.items || [];
        const transformedItems = wishlistService.transformWishlistItems(items);
        setWishlistItems(transformedItems);
        setItemCount(response.data.itemCount || 0);
      } else {
        setWishlistItems([]);
        setItemCount(0);
      }
    } catch (err) {
      setWishlistItems([]);
      setItemCount(0);
    } finally {
      setLoading(false);
    }
  };

  const buildProductForDetail = (backendProduct, fallbackItem) => {
    if (!backendProduct && !fallbackItem) return null;
    const productSource = backendProduct || {};
    const transformed = backendProduct
      ? productService.transformProductData(backendProduct)
      : null;

    return {
      ...(transformed || {}),
      ...productSource,
      variants: productSource.variants || fallbackItem?.variants || [],
      images: productSource.images || fallbackItem?.images || [],
      reviews: productSource.reviews || transformed?.reviews || [],
      brand: transformed?.brand || productSource.brand || fallbackItem?.brand,
      price: transformed?.price ?? fallbackItem?.price ?? 0,
      originalPrice:
        transformed?.originalPrice ?? fallbackItem?.originalPrice ?? fallbackItem?.price ?? 0,
      discount: transformed?.discount ?? fallbackItem?.discount ?? 0,
      name: productSource.name || fallbackItem?.name || 'Unknown Product',
      description: productSource.description || transformed?.description || '',
    };
  };

  const pickPreferredVariant = (variants = []) => {
    if (!Array.isArray(variants) || variants.length === 0) return null;
    const available = variants.find(
      (variant) =>
        Number(variant?.stockQuantity ?? 0) > 0 &&
        variant?.isActive !== false &&
        variant?.id
    );
    if (available) return available;
    return variants.find((variant) => variant?.id) || null;
  };

  const handleViewProduct = async (item) => {
    try {
      setProcessingItemId(item.id);
      const response = await productService.getProductById(item.productId);

      if (response?.success === false) {
        throw new Error(response.message || 'Không thể tải thông tin sản phẩm');
      }

      const backendProduct = response?.data?.product || response?.data;
      if (!backendProduct) {
        throw new Error('Sản phẩm không tồn tại hoặc đã bị xoá');
      }

      const productForDetail = buildProductForDetail(backendProduct, item);
      setProcessingItemId(null);
      navigation.navigate(ROUTES.PRODUCT_DETAIL, { product: productForDetail });
    } catch (err) {
      setProcessingItemId(null);
      Alert.alert(
        'Không thể mở sản phẩm',
        err?.message || 'Vui lòng thử lại sau.'
      );
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const removeFromWishlist = async (itemId) => {
    Alert.alert(
      'Remove Item',
      'Are you sure you want to remove this item from your wishlist?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await wishlistService.removeItem(itemId);
              if (response.success !== false) {
                await loadWishlist();
                Alert.alert('Success', 'Item removed from wishlist');
              } else {
                Alert.alert('Error', response.message || 'Failed to remove item');
              }
            } catch (err) {
              Alert.alert('Error', 'Failed to remove item. Please try again.');
            }
          },
        },
      ]
    );
  };

  const addToCart = async (item) => {
    try {
      setProcessingItemId(item.id);

      let variant = pickPreferredVariant(item.variants);
      let backendProduct = null;

      if (!variant || !variant.id || Number(variant.stockQuantity ?? 0) <= 0) {
        const response = await productService.getProductById(item.productId);
        if (response?.success === false) {
          throw new Error(response.message || 'Không thể lấy thông tin sản phẩm');
        }
        backendProduct = response?.data?.product || response?.data;
        variant = pickPreferredVariant(backendProduct?.variants || []);
      }

      if (!variant || !variant.id) {
        throw new Error('Sản phẩm chưa có biến thể khả dụng.');
      }

      if (Number(variant.stockQuantity ?? 0) <= 0) {
        throw new Error('Sản phẩm đã hết hàng.');
      }

      const response = await cartService.addItem(variant.id, 1);
      if (response.success !== false) {
        const successMessage =
          response.message || 'Đã thêm sản phẩm vào giỏ hàng';
        Alert.alert('Thành công', successMessage, [
          { text: 'Tiếp tục xem', style: 'cancel' },
          {
            text: 'Xem giỏ hàng',
            onPress: () =>
              navigation.navigate(ROUTES.MAIN_APP, { screen: ROUTES.CART }),
          },
        ]);
      } else {
        throw new Error(response.message || 'Không thể thêm sản phẩm vào giỏ');
      }
    } catch (err) {
      Alert.alert(
        'Không thể thêm vào giỏ hàng',
        err?.message || 'Vui lòng thử lại sau.'
      );
    } finally {
      setProcessingItemId(null);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Text key={i} style={styles.star}>
          {i <= rating ? '⭐' : '☆'}
        </Text>
      );
    }
    return stars;
  };

  const renderWishlistItem = (item) => {
    const isProcessing = processingItemId === item.id;

    return (
    <Animated.View
      key={item.id}
      style={[
        styles.wishlistItem,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <Card style={styles.itemCard}>
        <View style={styles.itemContent}>
          <TouchableOpacity
            style={styles.itemImageContainer}
            onPress={() => handleViewProduct(item)}
            disabled={isProcessing}
          >
            <Image source={{ uri: item.image }} style={styles.itemImage} />
            <View style={styles.badgeContainer}>
              {item.discount > 0 && <Text style={styles.discountBadge}>-{item.discount}%</Text>}
            </View>
          </TouchableOpacity>

          <View style={styles.itemInfo}>
            <Text style={styles.itemBrand}>{item.brand}</Text>
            <Text style={styles.itemName}>{item.name}</Text>
            
            <View style={styles.ratingContainer}>
              <View style={styles.starsContainer}>
                {renderStars(Math.floor(item.rating))}
              </View>
              <Text style={styles.rating}>
                {item.rating} ({item.reviews} reviews)
              </Text>
            </View>

            {item.variants && item.variants.length > 0 && (
              <View style={styles.sizeColorContainer}>
                {item.variants[0].size && (
                  <View style={styles.sizeColorItem}>
                    <Text style={styles.sizeColorLabel}>Size:</Text>
                    <Text style={styles.sizeColorValue}>{item.variants[0].size}</Text>
                  </View>
                )}
                {item.variants[0].color && (
                  <View style={styles.sizeColorItem}>
                    <Text style={styles.sizeColorLabel}>Color:</Text>
                    <Text style={styles.sizeColorValue}>{item.variants[0].color}</Text>
                  </View>
                )}
              </View>
            )}

            <View style={styles.priceContainer}>
              <Text style={styles.currentPrice}>{formatPrice(item.price)}</Text>
              {item.originalPrice > item.price && (
                <Text style={styles.originalPrice}>{formatPrice(item.originalPrice)}</Text>
              )}
            </View>
          </View>

          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => removeFromWishlist(item.id)}
            disabled={isProcessing}
          >
            <Text style={styles.removeButtonText}>❌</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.itemActions}>
          <TouchableOpacity
            style={styles.addToCartButton}
            onPress={() => addToCart(item)}
            disabled={isProcessing}
          >
            <Text style={styles.addToCartButtonText}>
              {isProcessing ? 'Đang xử lý...' : '🛒 Add to Cart'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buyNowButton}
            onPress={() => handleViewProduct(item)}
            disabled={isProcessing}
          >
            <Text style={styles.buyNowButtonText}>
              {isProcessing ? 'Đang mở...' : '💳 Buy Now'}
            </Text>
          </TouchableOpacity>
        </View>
      </Card>
    </Animated.View>
  );
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
                <Text style={styles.backText}>Wishlist</Text>
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
                  <Text style={styles.statIcon}>❤️</Text>
                  <Text style={styles.statNumber}>{itemCount}</Text>
                  <Text style={styles.statLabel}>Items in Wishlist</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statIcon}>💰</Text>
                  <Text style={styles.statNumber}>
                    {formatPrice(wishlistItems.reduce((total, item) => total + item.price, 0))}
                  </Text>
                  <Text style={styles.statLabel}>Total Value</Text>
                </View>
              </View>
            </Card>
          </Animated.View>

          {/* Wishlist Items */}
          <View style={styles.wishlistContainer}>
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={Colors.primary} />
                <Text style={styles.loadingText}>Loading wishlist...</Text>
              </View>
            ) : !isAuthenticated ? (
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
                  <Text style={styles.emptyIcon}>🔒</Text>
                  <Text style={styles.emptyTitle}>Login Required</Text>
                  <Text style={styles.emptySubtitle}>
                    Please login to view your wishlist
                  </Text>
                  <Button
                    mode="contained"
                    style={styles.shopButton}
                    onPress={() => navigation.navigate(ROUTES.LOGIN)}
                  >
                    Login
                  </Button>
                </Card>
              </Animated.View>
            ) : wishlistItems.length > 0 ? (
              wishlistItems.map(renderWishlistItem)
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
                  <Text style={styles.emptyIcon}>❤️</Text>
                  <Text style={styles.emptyTitle}>Your Wishlist is Empty</Text>
                  <Text style={styles.emptySubtitle}>
                    Save items you love by tapping the heart icon on any product
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
    marginHorizontal: Spacing.md,
  },
  wishlistContainer: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  wishlistItem: {
    marginBottom: Spacing.md,
  },
  itemCard: {
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
  itemContent: {
    flexDirection: 'row',
    marginBottom: Spacing.md,
  },
  itemImageContainer: {
    width: 100,
    height: 100,
    backgroundColor: Colors.surfaceLight,
    borderRadius: 15,
    marginRight: Spacing.md,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  itemImage: {
    width: '100%',
    height: '100%',
    borderRadius: 15,
  },
  badgeContainer: {
    position: 'absolute',
    top: -5,
    left: -5,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  newBadge: {
    backgroundColor: Colors.success,
    color: Colors.white,
    paddingHorizontal: Spacing.xs,
    paddingVertical: 2,
    borderRadius: 8,
    fontSize: 10,
    fontWeight: '700',
    marginRight: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  hotBadge: {
    backgroundColor: Colors.error,
    color: Colors.white,
    paddingHorizontal: Spacing.xs,
    paddingVertical: 2,
    borderRadius: 8,
    fontSize: 10,
    fontWeight: '700',
    marginRight: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  discountBadge: {
    backgroundColor: Colors.accent,
    color: Colors.white,
    paddingHorizontal: Spacing.xs,
    paddingVertical: 2,
    borderRadius: 8,
    fontSize: 10,
    fontWeight: '700',
    marginRight: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  itemInfo: {
    flex: 1,
    marginRight: Spacing.sm,
  },
  itemBrand: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  itemName: {
    ...Typography.bodyBold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  starsContainer: {
    flexDirection: 'row',
    marginRight: Spacing.sm,
  },
  star: {
    fontSize: 14,
  },
  rating: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  sizeColorContainer: {
    flexDirection: 'row',
    marginBottom: Spacing.sm,
  },
  sizeColorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  sizeColorLabel: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginRight: Spacing.xs,
  },
  sizeColorValue: {
    ...Typography.caption,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  currentPrice: {
    ...Typography.bodyBold,
    color: Colors.primary,
    marginRight: Spacing.sm,
  },
  originalPrice: {
    ...Typography.caption,
    color: Colors.textSecondary,
    textDecorationLine: 'line-through',
  },
  addedDate: {
    ...Typography.caption,
    color: Colors.textLight,
  },
  removeButton: {
    padding: Spacing.sm,
    borderRadius: 15,
    backgroundColor: Colors.surfaceLight,
  },
  removeButtonText: {
    fontSize: 16,
  },
  itemActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  addToCartButton: {
    flex: 1,
    backgroundColor: Colors.surfaceLight,
    borderRadius: 15,
    paddingVertical: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.primary,
    alignItems: 'center',
  },
  addToCartButtonText: {
    ...Typography.caption,
    color: Colors.primary,
    fontWeight: '600',
  },
  buyNowButton: {
    flex: 1,
    backgroundColor: Colors.primary,
    borderRadius: 15,
    paddingVertical: Spacing.sm,
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
  buyNowButtonText: {
    ...Typography.caption,
    color: Colors.white,
    fontWeight: '700',
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  loadingText: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginTop: Spacing.md,
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

