import 'package:flutter/material.dart';
import '../config/theme.dart';
import '../config/routes.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int _currentIndex = 0;

  final _screens = [
    const _HomeTab(),
    const _CategoriesTab(),
    const _CartTab(),
    const _OrdersTab(),
    const _ProfileTab(),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: _screens[_currentIndex],
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _currentIndex,
        onTap: (i) => setState(() => _currentIndex = i),
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.home_outlined), activeIcon: Icon(Icons.home), label: 'Home'),
          BottomNavigationBarItem(icon: Icon(Icons.grid_view_outlined), activeIcon: Icon(Icons.grid_view), label: 'Categories'),
          BottomNavigationBarItem(icon: Icon(Icons.shopping_cart_outlined), activeIcon: Icon(Icons.shopping_cart), label: 'Cart'),
          BottomNavigationBarItem(icon: Icon(Icons.receipt_long_outlined), activeIcon: Icon(Icons.receipt_long), label: 'Orders'),
          BottomNavigationBarItem(icon: Icon(Icons.person_outline), activeIcon: Icon(Icons.person), label: 'Profile'),
        ],
      ),
    );
  }
}

class _HomeTab extends StatelessWidget {
  const _HomeTab();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Row(
          children: [
            const Icon(Icons.store, color: AmarShopTheme.primary, size: 24),
            const SizedBox(width: 8),
            const Text('AmarShop'),
            const Spacer(),
            IconButton(icon: const Icon(Icons.search), onPressed: () => Navigator.pushNamed(context, AppRoutes.search)),
            IconButton(icon: const Icon(Icons.notifications_outlined), onPressed: () {}),
          ],
        ),
      ),
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(height: 180, color: AmarShopTheme.primary.withOpacity(0.1), child: Center(child: Text('Hero Banner', style: TextStyle(fontSize: 18, color: AmarShopTheme.primary)))),
            Padding(padding: const EdgeInsets.all(16), child: Text('Categories', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: AmarShopTheme.onBackground))),
            SizedBox(height: 100, child: ListView.builder(scrollDirection: Axis.horizontal, padding: const EdgeInsets.symmetric(horizontal: 12), itemCount: 8, itemBuilder: (_, i) => Container(width: 72, margin: const EdgeInsets.symmetric(horizontal: 4), child: Column(children: [Container(width: 56, height: 56, decoration: BoxDecoration(color: AmarShopTheme.background, borderRadius: BorderRadius.circular(16)), child: Icon(Icons.category, color: AmarShopTheme.primary)), const SizedBox(height: 6), Text('Category', style: TextStyle(fontSize: 11, color: AmarShopTheme.onBackground))])))),
            Padding(padding: const EdgeInsets.all(16), child: Text('Flash Sale', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: AmarShopTheme.onBackground))),
            SizedBox(height: 220, child: ListView.builder(scrollDirection: Axis.horizontal, padding: const EdgeInsets.symmetric(horizontal: 12), itemCount: 5, itemBuilder: (_, i) => Container(width: 150, margin: const EdgeInsets.all(4), decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(12), border: Border.all(color: AmarShopTheme.border)), child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [Container(height: 120, decoration: BoxDecoration(color: AmarShopTheme.background, borderRadius: const BorderRadius.vertical(top: Radius.circular(12)))), Padding(padding: const EdgeInsets.all(8), child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [Text('Product Name', style: TextStyle(fontSize: 12, color: AmarShopTheme.onBackground), maxLines: 2), Text('৳1,200', style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: AmarShopTheme.primary)), Text('৳1,500', style: TextStyle(fontSize: 11, color: AmarShopTheme.subtleText, decoration: TextDecoration.lineThrough))]))]))),
            Padding(padding: const EdgeInsets.all(16), child: Text('Just For You', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: AmarShopTheme.onBackground))),
            GridView.builder(shrinkWrap: true, physics: const NeverScrollableScrollPhysics(), padding: const EdgeInsets.symmetric(horizontal: 12), gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(crossAxisCount: 2, childAspectRatio: 0.65, crossAxisSpacing: 8, mainAxisSpacing: 8), itemCount: 10, itemBuilder: (_, i) => Container(decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(12), border: Border.all(color: AmarShopTheme.border)), child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [Expanded(child: Container(decoration: BoxDecoration(color: AmarShopTheme.background, borderRadius: const BorderRadius.vertical(top: Radius.circular(12))))), Padding(padding: const EdgeInsets.all(8), child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [Text('Product $i', style: TextStyle(fontSize: 12, color: AmarShopTheme.onBackground), maxLines: 2), SizedBox(height: 4), Text('৳${(i + 1) * 100}', style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: AmarShopTheme.primary)), Text('৳${(i + 2) * 100}', style: TextStyle(fontSize: 11, color: AmarShopTheme.subtleText, decoration: TextDecoration.lineThrough))]))])),
          ],
        ),
      ),
    );
  }
}

class _CategoriesTab extends StatelessWidget {
  const _CategoriesTab();
  @override
  Widget build(BuildContext context) => Scaffold(appBar: AppBar(title: const Text('Categories')), body: const Center(child: Text('Categories')));
}

class _CartTab extends StatelessWidget {
  const _CartTab();
  @override
  Widget build(BuildContext context) => Scaffold(appBar: AppBar(title: const Text('Cart')), body: const Center(child: Text('Cart')));
}

class _OrdersTab extends StatelessWidget {
  const _OrdersTab();
  @override
  Widget build(BuildContext context) => Scaffold(appBar: AppBar(title: const Text('Orders')), body: const Center(child: Text('Orders')));
}

class _ProfileTab extends StatelessWidget {
  const _ProfileTab();
  @override
  Widget build(BuildContext context) => Scaffold(appBar: AppBar(title: const Text('Profile')), body: const Center(child: Text('Profile')));
}
