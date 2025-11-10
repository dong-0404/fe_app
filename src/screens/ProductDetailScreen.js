import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Alert,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Card, Chip } from 'react-native-paper';
import { Colors, Spacing, Typography } from '../constants/colors';
import { ROUTES, navigationHelpers } from '../navigation/navigationConstants';
import LoadingSpinner from '../components/LoadingSpinner';
import cartService from '../services/cartService';
import wishlistService from '../services/wishlistService';
import { useAuth } from '../context/AuthContext';

const { width } = Dimensions.get('window');

export default function ProductDetailScreen({ route, navigation }) {
  const product = route?.params?.product;
  const { isAuthenticated } = useAuth();

  if (!product) {
    return (
      <SafeAreaView style={styles.fallbackContainer}>
        <View style={styles.fallbackContent}>
          <Text style={styles.fallbackIcon}>🔍</Text>
          <Text style={styles.fallbackTitle}>Không tìm thấy sản phẩm</Text>
          <Text style={styles.fallbackSubtitle}>
            Thông tin sản phẩm không khả dụng. Vui lòng quay lại và thử lại sau.
          </Text>
          <TouchableOpacity
            style={styles.fallbackButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.fallbackButtonText}>Quay lại</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

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
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    const checkWishlistStatus = async () => {
      if (!isAuthenticated || !product?.id) {
        setIsFavorite(false);
        return;
      }
      try {
        const response = await wishlistService.checkProduct(product.id);
        if (response.success !== false && response.data) {
          const isInWishlist =
            response.data.isInWishlist ??
            response.data.wishlistExists ??
            false;
          setIsFavorite(Boolean(isInWishlist));
        } else {
          setIsFavorite(false);
        }
      } catch (error) {
        setIsFavorite(false);
      }
    };

    checkWishlistStatus();
  }, [isAuthenticated, product?.id]);

  // Extract unique sizes and colors from product variants
  const sizes = product.variants ? 
    [...new Set(product.variants.map(v => v.size).filter(Boolean))] : 
    [38, 39, 40, 41, 42, 43];
  
  const colors = product.variants ? 
    [...new Set(product.variants.map(v => v.color).filter(Boolean))].map(color => ({
      name: color,
      value: color.toLowerCase()
    })) : 
    [
      { name: 'Black', value: '#000000' },
      { name: 'White', value: '#ffffff' },
      { name: 'Blue', value: '#2196f3' },
      { name: 'Red', value: '#f44336' },
    ];

  // Use reviews from product data, fallback to empty array
  const reviews = product.reviews || [];

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const handleAddToCart = async () => {
    if (!selectedSize || !selectedColor) {
      Alert.alert('Error', 'Please select size and color');
      return;
    }

    // Find the matching variant based on selected size and color
    // selectedColor is the color name (string) from the colors array
    const matchingVariant = product.variants?.find(variant => {
      // Compare size - handle both string and number
      const sizeMatch = String(variant.size) === String(selectedSize);
      
      // Compare color - selectedColor is the color name from colors array
      const colorMatch = variant.color && 
        variant.color.toLowerCase() === selectedColor?.toLowerCase();
      
      return sizeMatch && colorMatch;
    });

    if (!matchingVariant) {
      Alert.alert('Error', 'Product variant not found. Please select a different size or color.');
      return;
    }

    if (!matchingVariant.isActive) {
      Alert.alert('Error', 'This variant is currently not available.');
      return;
    }

    if (matchingVariant.stockQuantity < quantity) {
      Alert.alert('Error', 'Insufficient stock available.');
      return;
    }

    setLoading(true);
    try {
      const response = await cartService.addItem(matchingVariant.id, quantity);
      
      if (response.success !== false) {
        Alert.alert('Success! 🎉', 'Product added to cart!', [
          { text: 'Continue Shopping', style: 'cancel' },
          {
            text: 'View Cart',
            onPress: () => {
              // Navigate back to MainApp first, then to Cart tab
              navigation.navigate(ROUTES.MAIN_APP, {
                screen: ROUTES.CART,
              });
            },
          },
        ]);
      } else {
        Alert.alert('Error', response.message || 'Failed to add product to cart');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to add product to cart. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async () => {
    if (!isAuthenticated) {
      Alert.alert('Thông báo', 'Vui lòng đăng nhập để sử dụng wishlist.');
      return;
    }

    if (!product?.id) {
      Alert.alert('Lỗi', 'Không xác định được sản phẩm.');
      return;
    }

    try {
      setFavoriteLoading(true);
      let response;

      if (isFavorite) {
        response = await wishlistService.removeProduct(product.id);
      } else {
        response = await wishlistService.addProduct(product.id);
      }

      if (response?.success === false) {
        throw new Error(response.message || 'Có lỗi xảy ra, vui lòng thử lại.');
      }

      setIsFavorite(!isFavorite);
    } catch (error) {
      Alert.alert(
        'Không thể cập nhật wishlist',
        error?.message || 'Vui lòng thử lại sau.'
      );
    } finally {
      setFavoriteLoading(false);
    }
  };

  const handleBuyNow = () => {
    if (!selectedSize || !selectedColor) {
      Alert.alert('Error', 'Please select size and color');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigation.navigate(ROUTES.CHECKOUT, {
        product: { ...product, selectedSize, selectedColor, quantity },
      });
    }, 1000);
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
                <Text style={styles.backText}>Back</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.favoriteButton}
              onPress={toggleFavorite}
              disabled={favoriteLoading}
            >
              <View style={styles.favoriteButtonContainer}>
                <Text style={styles.favoriteIcon}>
                  {favoriteLoading ? '…' : isFavorite ? '❤️' : '🤍'}
                </Text>
              </View>
            </TouchableOpacity>
          </Animated.View>

          {/* Product Image */}
          <Animated.View 
            style={[
              styles.imageContainer,
              {
                opacity: fadeAnim,
                transform: [
                  { translateY: slideAnim },
                  { scale: scaleAnim },
                ],
              },
            ]}
          >
            <View style={styles.imageWrapper}>
              <Image source={{ uri: product.image }} style={styles.productImage} />
              <View style={styles.imageOverlay} />
            </View>
          </Animated.View>

          {/* Product Info */}
          <Animated.View
            style={[
              styles.productCardContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <Card style={styles.productCard}>
              <View style={styles.productHeader}>
                <View style={styles.productTitleContainer}>
                  <Text style={styles.productName}>{product.name}</Text>
                  <View style={styles.badgeContainer}>
                    {product.isNew && <Text style={styles.newBadge}>NEW</Text>}
                    {product.isHot && <Text style={styles.hotBadge}>HOT</Text>}
                    {product.discount > 0 && <Text style={styles.discountBadge}>-{product.discount}%</Text>}
                  </View>
                </View>
                <View style={styles.priceContainer}>
                  <Text style={styles.currentPrice}>
                    {formatPrice(product.price)}
                  </Text>
                  {product.originalPrice > product.price && (
                    <Text style={styles.originalPrice}>
                      {formatPrice(product.originalPrice)}
                    </Text>
                  )}
                </View>
              </View>

        {/* Rating */}
        <View style={styles.ratingContainer}>
          <View style={styles.stars}>
            {renderStars(Math.floor(product.rating))}
          </View>
          <Text style={styles.ratingText}>
            {product.rating || '0.0'} ({product.reviewsCount || 0} reviews)
          </Text>
        </View>

        {/* Size Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Size</Text>
          <View style={styles.sizeContainer}>
            {sizes.map((size) => (
              <TouchableOpacity
                key={size}
                style={[
                  styles.sizeButton,
                  selectedSize === size && styles.selectedSizeButton,
                ]}
                onPress={() => setSelectedSize(size)}
              >
                <Text
                  style={[
                    styles.sizeText,
                    selectedSize === size && styles.selectedSizeText,
                  ]}
                >
                  {size}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Color Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Color</Text>
          <View style={styles.colorContainer}>
            {colors.map((color) => (
              <TouchableOpacity
                key={color.name}
                style={[
                  styles.colorButton,
                  { backgroundColor: color.value },
                  selectedColor === color.name && styles.selectedColorButton,
                ]}
                onPress={() => setSelectedColor(color.name)}
              >
                {selectedColor === color.name && (
                  <Text style={styles.checkmark}>✓</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Quantity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quantity</Text>
          <View style={styles.quantityContainer}>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => setQuantity(Math.max(1, quantity - 1))}
            >
              <Text style={styles.quantityButtonText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.quantityText}>{quantity}</Text>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => {
                // Get max available stock from selected variant if available
                const variant = product.variants?.find(v => 
                  String(v.size) === String(selectedSize) && 
                  v.color?.toLowerCase() === selectedColor?.toLowerCase()
                );
                const maxQuantity = variant?.stockQuantity || 999;
                setQuantity(Math.min(maxQuantity, quantity + 1));
              }}
            >
              <Text style={styles.quantityButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

              {/* Description */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Description</Text>
                <Text style={styles.description}>
                  High-quality athletic shoes designed for comfort and performance.
                  Features advanced cushioning technology and breathable materials
                  for all-day wear. Perfect for sports, casual wear, and everyday
                  activities.
                </Text>
              </View>
            </Card>
          </Animated.View>

          {/* Reviews */}
          <Animated.View
            style={[
              styles.reviewsContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <Card style={styles.reviewsCard}>
              <Text style={styles.sectionTitle}>Reviews ({product.reviewsCount || 0})</Text>
              {reviews.length > 0 ? (
                reviews.map((review) => (
                  <View key={review.id} style={styles.reviewItem}>
                    <View style={styles.reviewHeader}>
                      <Text style={styles.reviewUser}>{review.user?.full_name || 'Anonymous'}</Text>
                      <View style={styles.reviewRating}>
                        {renderStars(review.rating)}
                      </View>
                    </View>
                    <Text style={styles.reviewTitle}>{review.title}</Text>
                    <Text style={styles.reviewComment}>{review.comment}</Text>
                    <Text style={styles.reviewDate}>
                      {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                    </Text>
                  </View>
                ))
              ) : (
                <Text style={styles.noReviewsText}>No reviews yet</Text>
              )}
            </Card>
          </Animated.View>

          {/* Action Buttons */}
          <Animated.View 
            style={[
              styles.actionButtons,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            {loading ? (
              <View style={styles.loadingContainer}>
                <LoadingSpinner size="small" color={Colors.primary} text="Processing..." />
              </View>
            ) : (
              <>
                <TouchableOpacity
                  style={styles.addToCartButton}
                  onPress={handleAddToCart}
                >
                  <Text style={styles.addToCartButtonText}>🛒 Add to Cart</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.buyNowButton}
                  onPress={handleBuyNow}
                >
                  <Text style={styles.buyNowButtonText}>💳 Buy Now</Text>
                </TouchableOpacity>
              </>
            )}
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
    width: 120,
    height: 120,
    top: 100,
    right: -20,
  },
  circle2: {
    width: 80,
    height: 80,
    bottom: 300,
    left: -15,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    ...Typography.body,
    color: Colors.primary,
    fontWeight: '600',
  },
  favoriteButton: {
    alignSelf: 'flex-end',
  },
  favoriteButtonContainer: {
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
  favoriteIcon: {
    fontSize: 20,
  },
  imageContainer: {
    backgroundColor: Colors.white,
    alignItems: 'center',
    padding: Spacing.xl,
    marginHorizontal: Spacing.md,
    marginTop: Spacing.md,
    borderRadius: 25,
    elevation: 8,
    shadowColor: Colors.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  imageWrapper: {
    position: 'relative',
  },
  productImage: {
    width: width * 0.8,
    height: width * 0.8,
    resizeMode: 'contain',
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.primary,
    opacity: 0.05,
    borderRadius: 15,
  },
  productCardContainer: {
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.md,
  },
  productCard: {
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
  productHeader: {
    marginBottom: Spacing.lg,
  },
  productTitleContainer: {
    marginBottom: Spacing.md,
  },
  productName: {
    ...Typography.h2,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
    fontWeight: '700',
  },
  badgeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: Spacing.sm,
  },
  newBadge: {
    backgroundColor: Colors.success,
    color: Colors.white,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: '700',
    marginRight: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  hotBadge: {
    backgroundColor: Colors.error,
    color: Colors.white,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: '700',
    marginRight: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  discountBadge: {
    backgroundColor: Colors.accent,
    color: Colors.white,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: '700',
    marginRight: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currentPrice: {
    ...Typography.priceLarge,
    marginRight: Spacing.sm,
  },
  originalPrice: {
    ...Typography.body,
    color: Colors.textSecondary,
    textDecorationLine: 'line-through',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  stars: {
    flexDirection: 'row',
    marginRight: Spacing.sm,
  },
  star: {
    fontSize: 18,
  },
  ratingText: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    ...Typography.h4,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
    fontWeight: '600',
  },
  sizeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  sizeButton: {
    width: 55,
    height: 55,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: Colors.borderLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
    marginBottom: Spacing.sm,
    backgroundColor: Colors.surfaceLight,
  },
  selectedSizeButton: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  sizeText: {
    ...Typography.body,
    color: Colors.textPrimary,
    fontWeight: '500',
  },
  selectedSizeText: {
    color: Colors.white,
    fontWeight: '700',
  },
  colorContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  colorButton: {
    width: 55,
    height: 55,
    borderRadius: 27.5,
    marginRight: Spacing.sm,
    marginBottom: Spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: Colors.borderLight,
    elevation: 2,
    shadowColor: Colors.shadow,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  selectedColorButton: {
    borderColor: Colors.primary,
    borderWidth: 4,
    elevation: 4,
    shadowOpacity: 0.2,
  },
  checkmark: {
    color: Colors.white,
    fontSize: 20,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: Colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  quantityButtonText: {
    color: Colors.white,
    fontSize: 20,
    fontWeight: 'bold',
  },
  quantityText: {
    ...Typography.h4,
    marginHorizontal: Spacing.lg,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  description: {
    ...Typography.body,
    color: Colors.textSecondary,
    lineHeight: 24,
  },
  reviewsContainer: {
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.md,
  },
  reviewsCard: {
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
  reviewItem: {
    marginBottom: Spacing.lg,
    paddingBottom: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  reviewUser: {
    ...Typography.bodyBold,
    color: Colors.textPrimary,
  },
  reviewRating: {
    flexDirection: 'row',
  },
  reviewTitle: {
    ...Typography.caption,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  reviewComment: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
    lineHeight: 22,
  },
  reviewDate: {
    ...Typography.caption,
    color: Colors.textLight,
  },
  noReviewsText: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
    padding: Spacing.lg,
  },
  actionButtons: {
    flexDirection: 'row',
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.lg,
  },
  addToCartButton: {
    flex: 1,
    backgroundColor: Colors.surfaceLight,
    borderRadius: 25,
    paddingVertical: Spacing.lg,
    borderWidth: 2,
    borderColor: Colors.primary,
    elevation: 4,
    shadowColor: Colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  addToCartButtonText: {
    ...Typography.button,
    textAlign: 'center',
    color: Colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  buyNowButton: {
    flex: 1,
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
  buyNowButtonText: {
    ...Typography.button,
    textAlign: 'center',
    color: Colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  fallbackContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  fallbackContent: {
    alignItems: 'center',
    padding: Spacing.xl,
    backgroundColor: Colors.white,
    borderRadius: 24,
    shadowColor: Colors.shadow,
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 16,
    elevation: 10,
  },
  fallbackIcon: {
    fontSize: 48,
    marginBottom: Spacing.lg,
  },
  fallbackTitle: {
    ...Typography.h3,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  fallbackSubtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  fallbackButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: 24,
    elevation: 4,
  },
  fallbackButtonText: {
    ...Typography.button,
    color: Colors.white,
  },
});
