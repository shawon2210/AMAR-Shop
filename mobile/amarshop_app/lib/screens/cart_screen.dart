import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../config/theme.dart';
import '../config/routes.dart';
import '../providers/cart_provider.dart';

class CartScreen extends StatelessWidget {
  const CartScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final cart = context.watch<CartProvider>();
    return Scaffold(
      appBar: AppBar(title: const Text('Shopping Cart')),
      body: cart.items.isEmpty
          ? Center(child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [
              Icon(Icons.shopping_cart_outlined, size: 64, color: AmarShopTheme.subtleText),
              const SizedBox(height: 16),
              Text('Your cart is empty', style: TextStyle(fontSize: 16, color: AmarShopTheme.onBackground)),
              const SizedBox(height: 8),
              TextButton(onPressed: () => Navigator.pop(context), child: const Text('Continue Shopping')),
            ]))
          : Column(children: [
              Padding(padding: const EdgeInsets.all(12), child: Row(children: [
                Checkbox(value: cart.items.every((i) => i.selected), onChanged: (_) => cart.selectAll(!cart.items.every((i) => i.selected))),
                Text('Select All (${cart.itemCount} items)', style: TextStyle(fontSize: 13, color: AmarShopTheme.onBackground)),
              ])),
              Expanded(child: ListView.builder(itemCount: cart.items.length, itemBuilder: (_, i) {
                final item = cart.items[i];
                return Dismissible(key: Key(item.id), direction: DismissDirection.endToStart, onDismissed: (_) => cart.removeItem(item.id), background: Container(alignment: Alignment.centerRight, padding: const EdgeInsets.only(right: 20), color: AmarShopTheme.error, child: const Icon(Icons.delete, color: Colors.white)), child: Container(padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8), decoration: const BoxDecoration(border: Border(bottom: BorderSide(color: AmarShopTheme.border))), child: Row(children: [
                  Checkbox(value: item.selected, onChanged: (_) => cart.toggleSelected(item.id)),
                  Container(width: 80, height: 80, decoration: BoxDecoration(color: AmarShopTheme.background, borderRadius: BorderRadius.circular(8))),
                  const SizedBox(width: 12),
                  Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                    Text(item.product.name, style: TextStyle(fontSize: 13, color: AmarShopTheme.onBackground), maxLines: 2),
                    const SizedBox(height: 4),
                    Text('৳${item.product.price}', style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: AmarShopTheme.primary)),
                    const SizedBox(height: 8),
                    Row(children: [
                      Container(decoration: BoxDecoration(border: Border.all(color: AmarShopTheme.border), borderRadius: BorderRadius.circular(6)), child: Row(children: [
                        InkWell(onTap: () => cart.updateQuantity(item.id, item.quantity - 1), child: Container(padding: const EdgeInsets.all(4), child: const Icon(Icons.remove, size: 16))),
                        Container(padding: const EdgeInsets.symmetric(horizontal: 12), child: Text('${item.quantity}', style: TextStyle(fontSize: 13, color: AmarShopTheme.onBackground))),
                        InkWell(onTap: () => cart.updateQuantity(item.id, item.quantity + 1), child: Container(padding: const EdgeInsets.all(4), child: const Icon(Icons.add, size: 16))),
                      ])),
                    ]),
                  ])),
                ])));
              })),
            ]),
      bottomNavigationBar: cart.items.isEmpty ? null : SafeArea(child: Container(padding: const EdgeInsets.all(16), decoration: BoxDecoration(color: Colors.white, boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 10)]), child: Row(children: [
        Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, mainAxisSize: MainAxisSize.min, children: [
          Text('Subtotal', style: TextStyle(fontSize: 12, color: AmarShopTheme.subtleText)),
          Text('৳${cart.subtotal.toStringAsFixed(0)}', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: AmarShopTheme.onBackground)),
        ])),
        ElevatedButton(onPressed: cart.selectedCount == 0 ? null : () => Navigator.pushNamed(context, AppRoutes.checkout), child: Text('Checkout (${cart.selectedCount})')),
      ]))),
    );
  }
}
