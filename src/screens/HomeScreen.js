import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  FlatList,
  Animated,
  Alert,
  LinearGradient,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, Button, Searchbar, IconButton } from 'react-native-paper';
import { Colors, Spacing, Typography } from '../constants/colors';
import { ROUTES } from '../navigation/navigationConstants';

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [bannerIndex, setBannerIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  const banners = [
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80',
  ];

  const categories = [
    { id: 1, name: 'Sneakers', icon: '👟', color: Colors.primary, gradient: [Colors.primary, Colors.primaryLight] },
    { id: 2, name: 'Running', icon: '🏃‍♂️', color: Colors.accent, gradient: [Colors.accent, Colors.accentLight] },
    { id: 3, name: 'Basketball', icon: '🏀', color: Colors.info, gradient: [Colors.info, '#5DADE2'] },
    { id: 4, name: 'Lifestyle', icon: '✨', color: Colors.success, gradient: [Colors.success, '#58D68D'] },
    { id: 5, name: 'Football', icon: '⚽', color: Colors.warning, gradient: [Colors.warning, '#F7DC6F'] },
    { id: 6, name: 'Tennis', icon: '🎾', color: Colors.error, gradient: [Colors.error, '#F1948A'] },
  ];

  const featuredProducts = [
    {
      id: 1,
      name: 'Nike Air Max 270',
      brand: 'Nike',
      price: 2500000,
      originalPrice: 3000000,
      discount: 17,
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=300&q=80',
      rating: 4.8,
      reviews: 128,
      isNew: true,
      isHot: false,
    },
    {
      id: 2,
      name: 'Adidas Ultraboost 22',
      brand: 'Adidas',
      price: 3200000,
      originalPrice: 3500000,
      discount: 9,
      image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=300&q=80',
      rating: 4.9,
      reviews: 95,
      isNew: false,
      isHot: true,
    },
    {
      id: 3,
      name: 'Converse Chuck Taylor',
      brand: 'Converse',
      price: 1200000,
      originalPrice: 1200000,
      discount: 0,
      image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=300&q=80',
      rating: 4.7,
      reviews: 203,
      isNew: false,
      isHot: false,
    },
    {
      id: 4,
      name: 'Vans Old Skool',
      brand: 'Vans',
      price: 1800000,
      originalPrice: 2000000,
      discount: 10,
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=300&q=80',
      rating: 4.6,
      reviews: 87,
      isNew: true,
      isHot: false,
    },
  ];

  useEffect(() => {
    // Start animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // Banner carousel
    const interval = setInterval(() => {
      setBannerIndex((prev) => (prev + 1) % banners.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigation.navigate(ROUTES.PRODUCTS, { 
        searchQuery: searchQuery.trim(),
        title: `Search: ${searchQuery.trim()}`
      });
    } else {
      Alert.alert('Search', 'Please enter a search term');
    }
  };

  const filteredProducts = featuredProducts.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.brand.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderCategory = ({ item, index }) => (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [
          {
            translateY: slideAnim.interpolate({
              inputRange: [0, 50],
              outputRange: [0, 50],
            }),
          },
        ],
      }}
    >
      <TouchableOpacity
        style={styles.categoryItem}
        onPress={() => navigation.navigate(ROUTES.PRODUCTS, { category: item })}
        activeOpacity={0.8}
      >
        <View style={[styles.categoryGradient, { backgroundColor: item.color }]}>
          <Text style={styles.categoryIcon}>{item.icon}</Text>
          <Text style={styles.categoryName}>{item.name}</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );

  const renderProduct = ({ item, index }) => (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [
          {
            translateY: slideAnim.interpolate({
              inputRange: [0, 50],
              outputRange: [0, 50],
            }),
          },
        ],
      }}
    >
      <TouchableOpacity
        style={styles.productCard}
        onPress={() => navigation.navigate(ROUTES.PRODUCT_DETAIL, { product: item })}
        activeOpacity={0.8}
      >
        <View style={styles.productImageContainer}>
          <Image source={{ uri: item.image }} style={styles.productImage} />
          {/* Badges */}
          <View style={styles.badgeContainer}>
            {item.isNew && (
              <View style={[styles.badge, styles.newBadge]}>
                <Text style={styles.badgeText}>NEW</Text>
              </View>
            )}
            {item.isHot && (
              <View style={[styles.badge, styles.hotBadge]}>
                <Text style={styles.badgeText}>HOT</Text>
              </View>
            )}
            {item.discount > 0 && (
              <View style={[styles.badge, styles.discountBadge]}>
                <Text style={styles.badgeText}>-{item.discount}%</Text>
              </View>
            )}
          </View>
        </View>
        <View style={styles.productInfo}>
          <Text style={styles.productBrand}>{item.brand}</Text>
          <Text style={styles.productName} numberOfLines={2}>
            {item.name}
          </Text>
          <View style={styles.priceContainer}>
            <Text style={styles.productPrice}>{formatPrice(item.price)}</Text>
            {item.originalPrice > item.price && (
              <Text style={styles.originalPrice}>
                {formatPrice(item.originalPrice)}
              </Text>
            )}
          </View>
          <View style={styles.ratingContainer}>
            <View style={styles.starsContainer}>
              <Text style={styles.stars}>⭐⭐⭐⭐⭐</Text>
              <Text style={styles.rating}>{item.rating}</Text>
            </View>
            <Text style={styles.reviews}>({item.reviews} reviews)</Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScrollView showsVerticalScrollIndicator={false}>
      {/* Header */}
      <Animated.View 
        style={[
          styles.header,
          {
            opacity: fadeAnim,
            transform: [
              {
                translateY: slideAnim.interpolate({
                  inputRange: [0, 50],
                  outputRange: [0, 20],
                }),
              },
            ],
          },
        ]}
      >
        <View style={styles.headerGradient}>
          <View style={styles.headerContent}>
            <View style={styles.headerLeft}>
              <Text style={styles.headerTitle}>👟 ShoeStore</Text>
              <Text style={styles.headerSubtitle}>Find Your Perfect Pair</Text>
            </View>
            <TouchableOpacity
              style={styles.cartButton}
              onPress={() => navigation.navigate(ROUTES.CART)}
              activeOpacity={0.7}
            >
              <View style={styles.cartIconContainer}>
                <Text style={styles.cartIcon}>🛒</Text>
                <View style={styles.cartBadge}>
                  <Text style={styles.cartBadgeText}>3</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>

      {/* Search Bar */}
      <Animated.View
        style={[
          styles.searchContainer,
          {
            opacity: fadeAnim,
            transform: [
              {
                translateY: slideAnim.interpolate({
                  inputRange: [0, 50],
                  outputRange: [0, 20],
                }),
              },
            ],
          },
        ]}
      >
        <Searchbar
          placeholder="Search for shoes..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
          inputStyle={styles.searchInput}
          iconColor={Colors.primary}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
          blurOnSubmit={false}
        />
      </Animated.View>

      {/* Banner Carousel */}
      <Animated.View 
        style={[
          styles.bannerContainer,
          {
            opacity: fadeAnim,
            transform: [
              {
                translateY: slideAnim.interpolate({
                  inputRange: [0, 50],
                  outputRange: [0, 30],
                }),
              },
            ],
          },
        ]}
      >
        <Image source={{ uri: banners[bannerIndex] }} style={styles.banner} />
        <View style={styles.bannerGradient} />
        <View style={styles.bannerOverlay}>
          <Text style={styles.bannerTitle}>New Collection 2024</Text>
          <Text style={styles.bannerSubtitle}>Discover the latest trends</Text>
          <TouchableOpacity style={styles.bannerButton} onPress={() => navigation.navigate(ROUTES.PRODUCTS)}>
            <Text style={styles.bannerButtonText}>Shop Now</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.bannerDots}>
          {banners.map((_, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.dot,
                { 
                  opacity: index === bannerIndex ? 1 : 0.3,
                  backgroundColor: index === bannerIndex ? Colors.white : Colors.white,
                },
              ]}
              onPress={() => setBannerIndex(index)}
            />
          ))}
        </View>
      </Animated.View>

      {/* Categories */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Categories</Text>
        <FlatList
          data={categories}
          renderItem={renderCategory}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesList}
        />
      </View>

      {/* Featured Products */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Featured Products</Text>
          <TouchableOpacity onPress={() => navigation.navigate(ROUTES.PRODUCTS)}>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={featuredProducts}
          renderItem={renderProduct}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.productsList}
        />
      </View>

      {/* Best Sellers */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Best Sellers</Text>
        <FlatList
          data={featuredProducts.slice(0, 2)}
          renderItem={renderProduct}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.productsList}
        />
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
    backgroundColor: 'transparent',
    paddingBottom: Spacing.sm,
  },
  headerGradient: {
    backgroundColor: Colors.primary,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.lg,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 8,
    shadowColor: Colors.shadowDark,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    ...Typography.h2,
    color: Colors.white,
    fontWeight: '800',
    fontSize: 28,
  },
  headerSubtitle: {
    ...Typography.caption,
    color: Colors.white,
    marginTop: 4,
    opacity: 0.9,
    fontSize: 16,
  },
  cartButton: {
    position: 'relative',
  },
  cartIconContainer: {
    position: 'relative',
    padding: Spacing.sm,
    backgroundColor: Colors.white,
    borderRadius: 25,
    elevation: 4,
    shadowColor: Colors.shadowDark,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  cartIcon: {
    fontSize: 24,
    color: Colors.primary,
  },
  cartBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: Colors.error,
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.white,
  },
  cartBadgeText: {
    ...Typography.small,
    color: Colors.white,
    fontWeight: 'bold',
    fontSize: 12,
  },
  searchContainer: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  searchBar: {
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderRadius: 25,
    backgroundColor: Colors.white,
  },
  searchInput: {
    fontSize: 16,
    color: Colors.textPrimary,
  },
  bannerContainer: {
    margin: Spacing.md,
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  banner: {
    width: '100%',
    height: 240,
    resizeMode: 'cover',
  },
  bannerGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  bannerOverlay: {
    position: 'absolute',
    top: Spacing.lg,
    left: Spacing.lg,
    right: Spacing.lg,
  },
  bannerTitle: {
    ...Typography.h2,
    color: Colors.white,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  bannerSubtitle: {
    ...Typography.body,
    color: Colors.white,
    marginTop: Spacing.xs,
    marginBottom: Spacing.lg,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  bannerButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: 25,
    alignSelf: 'flex-start',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  bannerButtonText: {
    ...Typography.caption,
    color: Colors.white,
    fontWeight: 'bold',
  },
  bannerDots: {
    position: 'absolute',
    bottom: Spacing.lg,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.white,
    marginHorizontal: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    ...Typography.h3,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.md,
  },
  viewAllText: {
    ...Typography.caption,
    color: Colors.primary,
    fontWeight: '500',
  },
  categoriesList: {
    paddingHorizontal: Spacing.md,
  },
  categoryItem: {
    width: 110,
    height: 110,
    marginRight: Spacing.md,
    elevation: 6,
    shadowColor: Colors.shadowDark,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  categoryGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.sm,
  },
  categoryIcon: {
    fontSize: 32,
    marginBottom: Spacing.xs,
  },
  categoryName: {
    ...Typography.small,
    color: Colors.white,
    fontWeight: '600',
    textAlign: 'center',
    fontSize: 12,
  },
  productsList: {
    paddingHorizontal: Spacing.md,
  },
  productCard: {
    width: 180,
    marginRight: Spacing.md,
    backgroundColor: Colors.white,
    borderRadius: 20,
    elevation: 8,
    shadowColor: Colors.shadowDark,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    overflow: 'hidden',
  },
  productImageContainer: {
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: 140,
    resizeMode: 'cover',
  },
  badgeContainer: {
    position: 'absolute',
    top: Spacing.sm,
    left: Spacing.sm,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  badge: {
    paddingHorizontal: Spacing.xs,
    paddingVertical: 2,
    borderRadius: 8,
    marginRight: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  newBadge: {
    backgroundColor: Colors.success,
  },
  hotBadge: {
    backgroundColor: Colors.error,
  },
  discountBadge: {
    backgroundColor: Colors.warning,
  },
  badgeText: {
    ...Typography.small,
    color: Colors.white,
    fontWeight: 'bold',
    fontSize: 10,
  },
  productInfo: {
    padding: Spacing.md,
  },
  productBrand: {
    ...Typography.small,
    color: Colors.textSecondary,
    fontWeight: '500',
    marginBottom: 2,
  },
  productName: {
    ...Typography.caption,
    fontWeight: '600',
    marginBottom: Spacing.sm,
    lineHeight: 18,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  productPrice: {
    ...Typography.price,
    marginRight: Spacing.xs,
  },
  originalPrice: {
    ...Typography.small,
    color: Colors.textSecondary,
    textDecorationLine: 'line-through',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  starsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stars: {
    fontSize: 12,
    marginRight: Spacing.xs,
  },
  rating: {
    ...Typography.small,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  reviews: {
    ...Typography.small,
    color: Colors.textSecondary,
  },
});
