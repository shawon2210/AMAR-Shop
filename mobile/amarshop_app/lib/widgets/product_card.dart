import 'package:flutter/material.dart';
import '../config/theme.dart';
import '../models/product.dart';
import '../config/routes.dart';

class ProductCard extends StatelessWidget {
  final Product product;

  const ProductCard({super.key, required this.product});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () => Navigator.pushNamed(context, AppRoutes.productDetail, arguments: product.id),
      child: Container(
        decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(12), border: Border.all(color: AmarShopTheme.border)),
        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Expanded(child: Stack(children: [
            Container(decoration: BoxDecoration(color: AmarShopTheme.background, borderRadius: const BorderRadius.vertical(top: Radius.circular(12)))),
            if (product.discount != null && product.discount! > 0)
              Positioned(top: 8, left: 8, child: Container(padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2), decoration: BoxDecoration(color: AmarShopTheme.error, borderRadius: BorderRadius.circular(4)), child: Text('${product.discount!.toInt()}%', style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Colors.white)))),
            if (product.isFlashSale)
              Positioned(top: 8, right: 8, child: Container(padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2), decoration: BoxDecoration(color: AmarShopTheme.primary, borderRadius: BorderRadius.circular(4)), child: Text('FLASH', style: TextStyle(fontSize: 8, fontWeight: FontWeight.bold, color: Colors.white)))),
            if (product.freeShipping)
              Positioned(bottom: 8, left: 8, child: Container(padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 1), color: AmarShopTheme.success.withOpacity(0.9), child: Text('Free Shipping', style: TextStyle(fontSize: 8, color: Colors.white, fontWeight: FontWeight.bold)))),
          ])),
          Padding(padding: const EdgeInsets.all(8), child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Text(product.name, style: TextStyle(fontSize: 12, color: AmarShopTheme.onBackground), maxLines: 2, overflow: TextOverflow.ellipsis),
            const SizedBox(height: 4),
            Row(children: [
              Text('৳${product.price.toStringAsFixed(0)}', style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: AmarShopTheme.primary)),
              if (product.originalPrice != null && product.originalPrice! > product.price) ...[
                const SizedBox(width: 4),
                Text('৳${product.originalPrice!.toStringAsFixed(0)}', style: TextStyle(fontSize: 11, color: AmarShopTheme.subtleText, decoration: TextDecoration.lineThrough)),
              ],
            ]),
            if (product.rating > 0) ...[
              const SizedBox(height: 4),
              Row(children: [
                Icon(Icons.star, size: 12, color: Colors.amber),
                Text(' ${product.rating.toStringAsFixed(1)}', style: TextStyle(fontSize: 10, color: AmarShopTheme.subtleText)),
                Text(' (${product.reviewCount})', style: TextStyle(fontSize: 10, color: AmarShopTheme.subtleText)),
              ]),
            ],
          ])),
        ]),
      ),
    );
  }
}
