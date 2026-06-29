import 'package:flutter/material.dart';
import '../config/theme.dart';

class ProductDetailScreen extends StatelessWidget {
  final String productId;
  const ProductDetailScreen({super.key, required this.productId});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        actions: [
          IconButton(icon: const Icon(Icons.favorite_border), onPressed: () {}),
          IconButton(icon: const Icon(Icons.share), onPressed: () {}),
        ],
      ),
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(height: 300, color: AmarShopTheme.background, child: Center(child: Icon(Icons.image, size: 64, color: AmarShopTheme.subtleText))),
            Padding(padding: const EdgeInsets.all(16), child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Text('Product Name', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: AmarShopTheme.onBackground)),
              const SizedBox(height: 8),
              Row(children: [
                Text('৳1,200', style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: AmarShopTheme.primary)),
                const SizedBox(width: 8),
                Text('৳1,500', style: TextStyle(fontSize: 14, color: AmarShopTheme.subtleText, decoration: TextDecoration.lineThrough)),
                const SizedBox(width: 8),
                Container(padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2), decoration: BoxDecoration(color: AmarShopTheme.error.withOpacity(0.1), borderRadius: BorderRadius.circular(4)), child: Text('20% OFF', style: TextStyle(fontSize: 11, color: AmarShopTheme.error, fontWeight: FontWeight.bold))),
              ]),
              const SizedBox(height: 16),
              Row(children: [Icon(Icons.star, size: 16, color: Colors.amber), Text('4.5', style: TextStyle(fontSize: 13, color: AmarShopTheme.onBackground)), Text(' (128 reviews)', style: TextStyle(fontSize: 13, color: AmarShopTheme.subtleText))]),
              const SizedBox(height: 12),
              Text('Product description goes here. This is a detailed description of the product including features, specifications, and other relevant information.', style: TextStyle(fontSize: 14, color: AmarShopTheme.onSurface, height: 1.5)),
            ])),
          ],
        ),
      ),
      bottomNavigationBar: SafeArea(
        child: Container(padding: const EdgeInsets.all(16), decoration: BoxDecoration(color: Colors.white, boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 10, offset: const Offset(0, -5))]), child: Row(children: [
          Expanded(child: OutlinedButton(onPressed: () {}, child: const Text('Add to Cart'), style: OutlinedButton.styleFrom(foregroundColor: AmarShopTheme.primary, side: const BorderSide(color: AmarShopTheme.primary), padding: const EdgeInsets.symmetric(vertical: 14)))),
          const SizedBox(width: 12),
          Expanded(child: ElevatedButton(onPressed: () {}, child: const Text('Buy Now'))),
        ])),
      ),
    );
  }
}
