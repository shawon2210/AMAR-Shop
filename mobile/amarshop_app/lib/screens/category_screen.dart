import 'package:flutter/material.dart';
import '../config/theme.dart';

class CategoryScreen extends StatelessWidget {
  final String slug;
  const CategoryScreen({super.key, required this.slug});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(slug)),
      body: GridView.builder(
        padding: const EdgeInsets.all(12),
        gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(crossAxisCount: 2, childAspectRatio: 0.65, crossAxisSpacing: 8, mainAxisSpacing: 8),
        itemCount: 20,
        itemBuilder: (_, i) => Container(
          decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(12), border: Border.all(color: AmarShopTheme.border)),
          child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Expanded(child: Container(decoration: BoxDecoration(color: AmarShopTheme.background, borderRadius: const BorderRadius.vertical(top: Radius.circular(12))))),
            Padding(padding: const EdgeInsets.all(8), child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Text('Product $i', style: TextStyle(fontSize: 12, color: AmarShopTheme.onBackground), maxLines: 2),
              Text('৳${(i + 1) * 100}', style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: AmarShopTheme.primary)),
            ])),
          ]),
        ),
      ),
    );
  }
}
