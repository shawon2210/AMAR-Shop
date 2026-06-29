import 'package:flutter/material.dart';
import '../screens/splash_screen.dart';
import '../screens/login_screen.dart';
import '../screens/home_screen.dart';
import '../screens/product_detail_screen.dart';
import '../screens/cart_screen.dart';
import '../screens/checkout_screen.dart';
import '../screens/orders_screen.dart';
import '../screens/order_detail_screen.dart';
import '../screens/profile_screen.dart';
import '../screens/seller_store_screen.dart';
import '../screens/category_screen.dart';
import '../screens/search_screen.dart';
import '../screens/flash_sale_screen.dart';

class AppRoutes {
  static const String splash = '/';
  static const String login = '/login';
  static const String home = '/home';
  static const String productDetail = '/product';
  static const String cart = '/cart';
  static const String checkout = '/checkout';
  static const String orders = '/orders';
  static const String orderDetail = '/order';
  static const String profile = '/profile';
  static const String sellerStore = '/seller';
  static const String category = '/category';
  static const String search = '/search';
  static const String flashSale = '/flash-sale';

  static Route<dynamic> generateRoute(RouteSettings settings) {
    switch (settings.name) {
      case splash:
        return MaterialPageRoute(builder: (_) => const SplashScreen());
      case login:
        return MaterialPageRoute(builder: (_) => const LoginScreen());
      case home:
        return MaterialPageRoute(builder: (_) => const HomeScreen());
      case productDetail:
        final id = settings.arguments as String;
        return MaterialPageRoute(builder: (_) => ProductDetailScreen(productId: id));
      case cart:
        return MaterialPageRoute(builder: (_) => const CartScreen());
      case checkout:
        return MaterialPageRoute(builder: (_) => const CheckoutScreen());
      case orders:
        return MaterialPageRoute(builder: (_) => const OrdersScreen());
      case orderDetail:
        final id = settings.arguments as String;
        return MaterialPageRoute(builder: (_) => OrderDetailScreen(orderId: id));
      case profile:
        return MaterialPageRoute(builder: (_) => const ProfileScreen());
      case sellerStore:
        final id = settings.arguments as String;
        return MaterialPageRoute(builder: (_) => SellerStoreScreen(sellerId: id));
      case category:
        final slug = settings.arguments as String;
        return MaterialPageRoute(builder: (_) => CategoryScreen(slug: slug));
      case search:
        return MaterialPageRoute(builder: (_) => const SearchScreen());
      case flashSale:
        final id = settings.arguments as String?;
        return MaterialPageRoute(builder: (_) => FlashSaleScreen(id: id));
      default:
        return MaterialPageRoute(builder: (_) => const SplashScreen());
    }
  }
}
