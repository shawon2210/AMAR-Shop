import 'package:flutter/material.dart';
import '../config/theme.dart';
import '../config/routes.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('My Account')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Container(padding: const EdgeInsets.all(16), decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(12), border: Border.all(color: AmarShopTheme.border)), child: Row(children: [
            CircleAvatar(radius: 30, backgroundColor: AmarShopTheme.primary, child: Text('U', style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: Colors.white))),
            const SizedBox(width: 16),
            Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Text('User Name', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: AmarShopTheme.onBackground)),
              Text('01XXXXXXXXX', style: TextStyle(fontSize: 13, color: AmarShopTheme.subtleText)),
            ]),
            const Spacer(),
            Icon(Icons.chevron_right, color: AmarShopTheme.subtleText),
          ])),
          const SizedBox(height: 16),
          Container(decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(12), border: Border.all(color: AmarShopTheme.border)), child: Column(children: [
            _menuItem(Icons.receipt_long, 'My Orders', () => Navigator.pushNamed(context, AppRoutes.orders)),
            _menuItem(Icons.location_on_outlined, 'My Addresses', () {}),
            _menuItem(Icons.favorite_outline, 'Wishlist', () {}),
            _menuItem(Icons.payments_outlined, 'Payment Methods', () {}),
            _menuItem(Icons.discount_outlined, 'Coupons', () {}),
          ])),
          const SizedBox(height: 12),
          Container(decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(12), border: Border.all(color: AmarShopTheme.border)), child: Column(children: [
            _menuItem(Icons.headset_mic_outlined, 'Help & Support', () {}),
            _menuItem(Icons.settings_outlined, 'Settings', () {}),
            _menuItem(Icons.info_outline, 'About', () {}),
          ])),
          const SizedBox(height: 24),
          SizedBox(width: double.infinity, child: OutlinedButton(onPressed: () {}, child: const Text('Log Out'), style: OutlinedButton.styleFrom(foregroundColor: AmarShopTheme.error, side: const BorderSide(color: AmarShopTheme.error)))),
        ],
      ),
    );
  }

  Widget _menuItem(IconData icon, String label, VoidCallback onTap) {
    return ListTile(
      leading: Icon(icon, color: AmarShopTheme.onBackground, size: 22),
      title: Text(label, style: TextStyle(fontSize: 14, color: AmarShopTheme.onBackground)),
      trailing: Icon(Icons.chevron_right, color: AmarShopTheme.subtleText, size: 20),
      onTap: onTap,
      contentPadding: const EdgeInsets.symmetric(horizontal: 16),
    );
  }
}
