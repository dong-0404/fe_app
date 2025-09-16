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

export default function WishlistScreen({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [wishlistItems, setWishlistItems] = useState([
    {
      id: 1,
      name: 'Nike Air Max 270',
      brand: 'Nike',
      price: 1500000,
      originalPrice: 1800000,
      discount: 17,
      image: 'https://via.placeholder.com/200x200/FF6B35/FFFFFF?text=Nike+Air+Max+270',
      rating: 4.5,
      reviews: 128,
      isNew: true,
      isHot: false,
      size: 42,
      color: 'Black',
      addedDate: '2024-01-15',
    },
    {
      id: 2,
      name: 'Adidas Ultraboost 22',
      brand: 'Adidas',
      price: 1000000,
      originalPrice: 1200000,
      discount: 17,
      image: 'https://via.placeholder.com/200x200/2C3E50/FFFFFF?text=Adidas+Ultraboost+22',
      rating: 4.8,
      reviews: 95,
      isNew: false,
      isHot: true,
      size: 41,
      color: 'White',
      addedDate: '2024-01-12',
    },
    {
      id: 3,
      name: 'Jordan 1 Retro',
      brand: 'Jordan',
      price: 3200000,
      originalPrice: 3500000,
      discount: 9,
      image: 'https://via.placeholder.com/200x200/F39C12/FFFFFF?text=Jordan+1+Retro',
      rating: 4.9,
      reviews: 203,
      isNew: false,
      isHot: true,
      size: 43,
      color: 'Blue',
      addedDate: '2024-01-10',
    },
    {
      id: 4,
      name: 'Converse Chuck Taylor',
      brand: 'Converse',
      price: 1800000,
      originalPrice: 2000000,
      discount: 10,
      image: 'https://via.placeholder.com/200x200/E74C3C/FFFFFF?text=Converse+Chuck+Taylor',
      rating: 4.3,
      reviews: 87,
      isNew: true,
      isHot: false,
      size: 40,
      color: 'Red',
      addedDate: '2024-01-08',
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

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const removeFromWishlist = (itemId) => {
    setWishlistItems(prev => prev.filter(item => item.id !== itemId));
  };

  const addToCart = (item) => {
    // Simulate adding to cart
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // Show success message or navigate to cart
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

  const renderWishlistItem = (item) => (
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
          <View style={styles.itemImageContainer}>
            <View style={styles.badgeContainer}>
              {item.isNew && <Text style={styles.newBadge}>NEW</Text>}
              {item.isHot && <Text style={styles.hotBadge}>HOT</Text>}
              {item.discount > 0 && <Text style={styles.discountBadge}>-{item.discount}%</Text>}
            </View>
          </View>

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

            <View style={styles.sizeColorContainer}>
              <View style={styles.sizeColorItem}>
                <Text style={styles.sizeColorLabel}>Size:</Text>
                <Text style={styles.sizeColorValue}>{item.size}</Text>
              </View>
              <View style={styles.sizeColorItem}>
                <Text style={styles.sizeColorLabel}>Color:</Text>
                <Text style={styles.sizeColorValue}>{item.color}</Text>
              </View>
            </View>

            <View style={styles.priceContainer}>
              <Text style={styles.currentPrice}>{formatPrice(item.price)}</Text>
              {item.originalPrice > item.price && (
                <Text style={styles.originalPrice}>{formatPrice(item.originalPrice)}</Text>
              )}
            </View>

            <Text style={styles.addedDate}>Added on {item.addedDate}</Text>
          </View>

          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => removeFromWishlist(item.id)}
          >
            <Text style={styles.removeButtonText}>❌</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.itemActions}>
          <TouchableOpacity
            style={styles.addToCartButton}
            onPress={() => addToCart(item)}
            disabled={loading}
          >
            <Text style={styles.addToCartButtonText}>🛒 Add to Cart</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buyNowButton}
            onPress={() => navigation.navigate(ROUTES.PRODUCT_DETAIL, { product: item })}
          >
            <Text style={styles.buyNowButtonText}>💳 Buy Now</Text>
          </TouchableOpacity>
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
                  <Text style={styles.statNumber}>{wishlistItems.length}</Text>
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
                <LoadingSpinner size="medium" color={Colors.primary} text="Processing..." />
              </View>
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

