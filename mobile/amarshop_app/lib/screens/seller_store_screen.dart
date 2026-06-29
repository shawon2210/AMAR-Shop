import 'package:flutter/material.dart';
import '../config/theme.dart';

class SellerStoreScreen extends StatelessWidget {
  final String sellerId;
  const SellerStoreScreen({super.key, required this.sellerId});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Store Name')),
      body: CustomScrollView(
        slivers: [
          SliverToBoxAdapter(child: Container(padding: const EdgeInsets.all(16), child: Column(children: [
            CircleAvatar(radius: 40, backgroundColor: AmarShopTheme.primary, child: Icon(Icons.store, size: 32, color: Colors.white)),
            const SizedBox(height: 12),
            Text('Store Name', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: AmarShopTheme.onBackground)),
            const SizedBox(height: 4),
            Row(mainAxisAlignment: MainAxisAlignment.center, children: [
              Icon(Icons.star, size: 16, color: Colors.amber),
              Text(' 4.5 ', style: TextStyle(fontSize: 13, color: AmarShopTheme.onBackground)),
              Text('(128 reviews)', style: TextStyle(fontSize: 13, color: AmarShopTheme.subtleText)),
            ]),
            const SizedBox(height: 16),
            SizedBox(width: double.infinity, child: OutlinedButton.icon(onPressed: () {}, icon: const Icon(Icons.chat), label: const Text('Chat with Seller'), style: OutlinedButton.styleFrom(foregroundColor: AmarShopTheme.primary, side: const BorderSide(color: AmarShopTheme.primary)))),
          ]))),
          SliverPadding(padding: const EdgeInsets.all(16), sliver: SliverGrid(gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(crossAxisCount: 2, childAspectRatio: 0.65, crossAxisSpacing: 8, mainAxisSpacing: 8), delegate: SliverChildBuilderDelegate((_, i) => Container(decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(12), border: Border.all(color: AmarShopTheme.border)), child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Expanded(child: Container(decoration: BoxDecoration(color: AmarShopTheme.background, borderRadius: const BorderRadius.vertical(top: Radius.circular(12))))),
            Padding(padding: const EdgeInsets.all(8), child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Text('Product $i', style: TextStyle(fontSize: 12, color: AmarShopTheme.onBackground), maxLines: 2),
              SizedBox(height: 4),
              Text('৳${(i + 1) * 100}', style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: AmarShopTheme.primary)),
            ])),
          ])), childCount: 10))),
        ],
      ),
    );
  }
}
