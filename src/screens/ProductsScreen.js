import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Chip } from 'react-native-paper';
import { Colors, Spacing, Typography } from '../constants/colors';
import { ROUTES } from '../navigation/navigationConstants';
import productService from '../services/productService';

export default function ProductsScreen({ route, navigation }) {
  const { category, title } = route.params || {};
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterLoading, setFilterLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({});
  const [page, setPage] = useState(1);
  // Load products from API
  const loadProducts = async (pageNum = 1, reset = true) => {
    return loadProductsWithFilter(pageNum, reset, selectedFilter);
  };

  // Load products with specific filter
  const loadProductsWithFilter = async (pageNum = 1, reset = true, filter = selectedFilter, isFilterChange = false) => {
    try {
      if (reset) {
        if (isFilterChange) {
          setFilterLoading(true);
        } else {
          setLoading(true);
        }
        setError(null);
      }

      const options = {
        page: pageNum,
        limit: 20,
        sortBy: 'createdAt',
        sortOrder: 'DESC'
      };

      // Apply filters based on filter parameter
      switch (filter) {
        case 'price-low':
          options.sortBy = 'price';
          options.sortOrder = 'ASC';
          break;
        case 'price-high':
          options.sortBy = 'price';
          options.sortOrder = 'DESC';
          break;
        default:
          options.sortBy = 'createdAt';
          options.sortOrder = 'DESC';
      }

      // Determine which API to call based on route params
      if (category?.id) {
        options.categoryId = category.id;
      }

      const response = category?.id
        ? await productService.getProductsByCategory(category.id, options)
        : await productService.getProducts(options);

      if (response.success) {
        const transformedProducts = productService.transformProductsData(response.data.products || response.data);
        
        if (reset) {
          setProducts(transformedProducts);
        } else {
          setProducts(prev => [...prev, ...transformedProducts]);
        }
        
        setPagination(response.data.pagination || {});
      } else {
        setError(response.message || 'Failed to load products');
      }
    } catch (err) {
      setError('Failed to load products. Please check your connection.');
    } finally {
      setLoading(false);
      setFilterLoading(false);
    }
  };

  // Load more products (pagination)
  const loadMoreProducts = () => {
    if (!loading && pagination.page < pagination.totalPages) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadProducts(nextPage, false);
    }
  };

  // Handle filter change
  const handleFilterChange = (filter) => {
    setSelectedFilter(filter);
    setPage(1);
    // Load products with the new filter immediately
    loadProductsWithFilter(1, true, filter, true);
  };

  // Load products on component mount and when dependencies change
  useEffect(() => {
    loadProducts(1, true);
  }, [category]);

  const filters = [
    { key: 'all', label: 'Tất cả' },
    { key: 'price-low', label: 'Giá: Thấp đến cao' },
    { key: 'price-high', label: 'Giá: Cao đến thấp' },
  ];

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating || 0);
    const hasHalfStar = (rating || 0) % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    return '⭐'.repeat(fullStars) + 
           (hasHalfStar ? '⭐' : '') + 
           '☆'.repeat(emptyStars);
  };

  const renderProduct = ({ item }) => (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() => navigation.navigate(ROUTES.PRODUCT_DETAIL, { product: item })}
    >
      <View style={styles.productImageContainer}>
        <Image 
          source={{ uri: item.image }} 
          style={styles.productImage}
          defaultSource={{ uri: 'https://via.placeholder.com/300x300?text=Loading...' }}
        />
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
        <Text style={styles.productName} numberOfLines={1}>
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
            <Text style={styles.stars}>{renderStars(item.rating)}</Text>
            <Text style={styles.rating}>{item.rating || '0.0'}</Text>
          </View>
          <Text style={styles.reviews}>({item.reviewsCount || 0} reviews)</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  // Loading component
  const renderLoading = () => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={Colors.primary} />
      <Text style={styles.loadingText}>Loading products...</Text>
    </View>
  );

  // Error component
  const renderError = () => (
    <View style={styles.errorContainer}>
      <Text style={styles.errorText}>{error}</Text>
      <TouchableOpacity style={styles.retryButton} onPress={() => loadProducts(1, true)}>
        <Text style={styles.retryButtonText}>Retry</Text>
      </TouchableOpacity>
    </View>
  );

  // Footer for loading more
  const renderFooter = () => {
    if (!loading || page === 1) return null;
    return (
      <View style={styles.footerLoading}>
        <ActivityIndicator size="small" color={Colors.primary} />
        <Text style={styles.footerLoadingText}>Loading more...</Text>
      </View>
    );
  };

  // Empty state
  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No products found</Text>
      <Text style={styles.emptySubtext}>
        Try adjusting your filters or check back later.
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backText}>← {title || category?.name || 'Products'}</Text>
        </TouchableOpacity>
      </View>

      {/* Filters */}
      <View style={styles.filtersContainer}>
        <FlatList
          data={filters}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <Chip
              selected={selectedFilter === item.key}
              onPress={() => handleFilterChange(item.key)}
              style={[
                styles.filterChip,
                selectedFilter === item.key && styles.selectedFilterChip,
              ]}
              textStyle={[
                styles.filterText,
                selectedFilter === item.key && styles.selectedFilterText,
              ]}
            >
              {item.label}
            </Chip>
          )}
          keyExtractor={(item) => item.key}
          contentContainerStyle={styles.filtersList}
        />
      </View>

      {/* Products List */}
      {error ? renderError() : filterLoading ? (
        <View style={styles.filterLoadingOverlay}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.filterLoadingText}>Đang lọc sản phẩm...</Text>
        </View>
      ) : (
        <FlatList
          data={products}
          renderItem={renderProduct}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          contentContainerStyle={styles.productsList}
          showsVerticalScrollIndicator={false}
          onEndReached={loadMoreProducts}
          onEndReachedThreshold={0.1}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={!loading ? renderEmpty : null}
        />
      )}
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
  backButton: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.white,
    borderRadius: 20,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    elevation: 4,
    shadowColor: Colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  backText: {
    ...Typography.body,
    color: Colors.primary,
    fontWeight: '600',
  },
  filtersContainer: {
    backgroundColor: Colors.white,
    paddingVertical: Spacing.md,
    elevation: 2,
    shadowColor: Colors.shadow,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  filtersList: {
    paddingHorizontal: Spacing.md,
  },
  filterChip: {
    marginRight: Spacing.sm,
    backgroundColor: Colors.lightGray,
    borderRadius: 20,
  },
  selectedFilterChip: {
    backgroundColor: Colors.primary,
    borderRadius: 20,
  },
  filterText: {
    color: Colors.textPrimary,
    fontWeight: '500',
  },
  selectedFilterText: {
    color: Colors.white,
    fontWeight: '600',
  },
  filterLoadingOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  filterLoadingText: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginTop: Spacing.md,
    textAlign: 'center',
  },
  productsList: {
    padding: Spacing.md,
  },
  productCard: {
    flex: 1,
    margin: Spacing.xs,
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
  loadingContainer: {
    padding: Spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginTop: Spacing.md,
  },
  errorContainer: {
    padding: Spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    ...Typography.body,
    color: Colors.error,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  retryButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: 20,
  },
  retryButtonText: {
    ...Typography.button,
    color: Colors.white,
    fontWeight: '600',
  },
  footerLoading: {
    padding: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  footerLoadingText: {
    ...Typography.small,
    color: Colors.textSecondary,
    marginLeft: Spacing.sm,
  },
  emptyContainer: {
    padding: Spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    ...Typography.h4,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  emptySubtext: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});

