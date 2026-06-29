import 'package:flutter/material.dart';
import '../config/theme.dart';

class OrdersScreen extends StatelessWidget {
  const OrdersScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('My Orders')),
      body: ListView.builder(
        padding: const EdgeInsets.all(12),
        itemCount: 5,
        itemBuilder: (_, i) => Container(
          margin: const EdgeInsets.only(bottom: 12),
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(12), border: Border.all(color: AmarShopTheme.border)),
          child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
              Text('#ORD-${28900 + i}', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: AmarShopTheme.onBackground)),
              Container(padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3), decoration: BoxDecoration(color: AmarShopTheme.success.withOpacity(0.1), borderRadius: BorderRadius.circular(12)), child: Text('Delivered', style: TextStyle(fontSize: 10, color: AmarShopTheme.success, fontWeight: FontWeight.bold))),
            ]),
            const SizedBox(height: 8),
            Row(children: [
              Container(width: 60, height: 60, decoration: BoxDecoration(color: AmarShopTheme.background, borderRadius: BorderRadius.circular(8))),
              const SizedBox(width: 12),
              Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                Text('Product Name', style: TextStyle(fontSize: 13, color: AmarShopTheme.onBackground)),
                const SizedBox(height: 4),
                Text('Qty: 1', style: TextStyle(fontSize: 11, color: AmarShopTheme.subtleText)),
                Text('৳${1200 + i * 100}', style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: AmarShopTheme.primary)),
              ])),
            ]),
            const SizedBox(height: 8),
            Text('Ordered on 28 Jun 2026', style: TextStyle(fontSize: 11, color: AmarShopTheme.subtleText)),
          ]),
        ),
      ),
    );
  }
}
