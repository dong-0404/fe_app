# 👟 ShoeStore Ecommerce App

Ứng dụng mua bán giày thể thao được xây dựng bằng React Native với Expo.

## 🚀 Tính năng đã hoàn thành

### ✅ Giao diện người dùng

- **Splash Screen** - Màn hình khởi động với animation
- **Login Screen** - Đăng nhập với form validation
- **Home Screen** - Trang chủ với banner, categories, products
- **Product Detail Screen** - Chi tiết sản phẩm với size/color selection
- **Cart Screen** - Giỏ hàng với quantity management
- **Checkout Screen** - Thanh toán với địa chỉ và phương thức thanh toán
- **Profile Screen** - Thông tin người dùng
- **Products Screen** - Danh sách sản phẩm với filter

### ✅ Navigation

- Bottom Tab Navigation cho main app
- Stack Navigation cho flow chính
- Safe Area support cho tất cả màn hình

### ✅ Design System

- Color palette nhất quán
- Typography system
- Spacing system
- Material Design components

## 📱 Cách chạy ứng dụng

### Yêu cầu

- Node.js 18+
- Expo CLI
- Expo Go app trên điện thoại

### Cài đặt

```bash
# Cài đặt dependencies
npm install

# Chạy ứng dụng
npm start
```

### Sử dụng

1. Scan QR code bằng Expo Go app (Android) hoặc Camera app (iOS)
2. Hoặc chạy trên simulator:
   - Nhấn `i` cho iOS simulator
   - Nhấn `a` cho Android emulator

## 🎨 Màn hình chính

### 1. Splash Screen

- Animation logo và loading
- Tự động chuyển đến Main App sau 3 giây

### 2. Login Screen

- Form đăng nhập với email/password
- Validation cơ bản
- Link đăng ký và quên mật khẩu

### 3. Home Screen

- Banner carousel
- Categories với icons
- Featured products
- Best sellers
- Search bar

### 4. Product Detail Screen

- Hình ảnh sản phẩm
- Thông tin chi tiết
- Chọn size và color
- Quantity selector
- Reviews
- Add to cart / Buy now

### 5. Cart Screen

- Danh sách sản phẩm trong giỏ
- Quantity management
- Remove items
- Order summary
- Proceed to checkout

### 6. Checkout Screen

- Shipping address
- Payment methods (COD, VNPay, MoMo)
- Order summary
- Place order

### 7. Profile Screen

- User information
- Statistics (orders, wishlist, reviews)
- Menu items
- Logout

## 🛠 Tech Stack

### Frontend

- **React Native** 0.81.4
- **Expo** 54.0.0
- **React Navigation** 6.x
- **React Native Paper** 5.14.5
- **React Native Chart Kit** 6.12.0
- **Safe Area Context** - Safe area support

### Design

- Material Design components
- Custom color palette
- Typography system
- Responsive design

## 📁 Cấu trúc thư mục

```
src/
├── constants/
│   └── colors.js          # Color palette và typography
├── navigation/
│   └── AppNavigator.js    # Navigation setup
├── screens/
│   ├── SplashScreen.js    # Màn hình khởi động
│   ├── LoginScreen.js     # Đăng nhập
│   ├── HomeScreen.js      # Trang chủ
│   ├── ProductDetailScreen.js # Chi tiết sản phẩm
│   ├── ProductsScreen.js  # Danh sách sản phẩm
│   ├── CartScreen.js      # Giỏ hàng
│   ├── CheckoutScreen.js  # Thanh toán
│   └── ProfileScreen.js   # Profile
└── components/            # Reusable components (sẽ thêm sau)
```

## 🎯 Tính năng sắp tới (Giai đoạn 2)

### Backend Development

- Node.js + Express server
- MySQL database
- API endpoints
- Authentication với JWT

### Web Admin Panel

- Dashboard thống kê
- Product management
- Order management
- User management

### API Integration

- Real data thay vì mock data
- Image upload
- Payment integration (VNPay)

## 📊 Database Schema

Đã thiết kế schema hoàn chỉnh với 8 bảng chính:

- `users` - Người dùng
- `categories` - Danh mục sản phẩm
- `products` - Sản phẩm
- `cart` - Giỏ hàng
- `orders` - Đơn hàng
- `order_items` - Chi tiết đơn hàng
- `reviews` - Đánh giá
- `payments` - Thanh toán

## 🚀 Deployment

### Mobile App

- EAS Build cho production
- Amazon Appstore deployment
- Google Play Store (tùy chọn)

### Backend

- AWS EC2 hoặc Heroku
- AWS RDS cho database
- AWS S3 cho file storage

## 📝 Ghi chú

- Tất cả màn hình đã được tối ưu cho Safe Area
- Navigation đã được setup hoàn chỉnh
- Design system nhất quán
- Responsive cho các kích thước màn hình khác nhau
- Mock data cho demo, sẽ thay thế bằng API thực

## 🐛 Troubleshooting

### Lỗi thường gặp

1. **Metro bundler issues**: Chạy `npx expo start --clear`
2. **Navigation errors**: Kiểm tra tên screen trong navigation
3. **Safe area issues**: Đảm bảo SafeAreaProvider đã được wrap

### Performance

- Images được optimize
- Lazy loading cho danh sách
- Smooth animations
- Memory management

## 📞 Support

Nếu gặp vấn đề, hãy kiểm tra:

1. Console logs trong Metro bundler
2. Expo Go app logs
3. Device compatibility
4. Network connection
