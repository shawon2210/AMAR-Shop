import 'package:flutter/material.dart';
import '../config/theme.dart';

class FlashSaleScreen extends StatelessWidget {
  final String? id;
  const FlashSaleScreen({super.key, this.id});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Flash Sale')),
      body: Column(
        children: [
          Container(
            padding: const EdgeInsets.all(16),
            color: AmarShopTheme.primary.withOpacity(0.1),
            child: Row(mainAxisAlignment: MainAxisAlignment.center, children: [
              const Icon(Icons.local_fire_department, color: AmarShopTheme.primary, size: 24),
              const SizedBox(width: 8),
              Text('Flash Sale Ends in', style: TextStyle(fontSize: 14, color: AmarShopTheme.onBackground)),
              const SizedBox(width: 12),
              Container(padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4), decoration: BoxDecoration(color: AmarShopTheme.primary, borderRadius: BorderRadius.circular(6)), child: Text('02:15:30', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.white, fontFeatures: [FontFeature.tabularFigures()]))),
            ]),
          ),
          Expanded(child: GridView.builder(
            padding: const EdgeInsets.all(12),
            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(crossAxisCount: 2, childAspectRatio: 0.7, crossAxisSpacing: 8, mainAxisSpacing: 8),
            itemCount: 10,
            itemBuilder: (_, i) => Container(
              decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(12), border: Border.all(color: AmarShopTheme.border)),
              child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                Expanded(child: Stack(children: [
                  Container(decoration: BoxDecoration(color: AmarShopTheme.background, borderRadius: const BorderRadius.vertical(top: Radius.circular(12)))),
                  Positioned(top: 8, left: 8, child: Container(padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 3), decoration: BoxDecoration(color: AmarShopTheme.error, borderRadius: BorderRadius.circular(4)), child: Text('${20 + i}%', style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Colors.white))),
                ])),
                Padding(padding: const EdgeInsets.all(8), child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                  Text('Product $i', style: TextStyle(fontSize: 12, color: AmarShopTheme.onBackground), maxLines: 2),
                  Text('৳${(i + 1) * 100}', style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: AmarShopTheme.primary)),
                  Text('৳${(i + 2) * 100}', style: TextStyle(fontSize: 11, color: AmarShopTheme.subtleText, decoration: TextDecoration.lineThrough),
                  ),
                  TweenAnimationBuilder<double>(tween: Tween(begin: 0, end: 0.7), duration: const Duration(seconds: 1), builder: (_, v, __) => Column(children: [
                    SizedBox(height: 4),
                    ClipRRect(borderRadius: BorderRadius.circular(2), child: LinearProgressIndicator(value: v, minHeight: 3, backgroundColor: AmarShopTheme.border, valueColor: AlwaysStoppedAnimation(AmarShopTheme.primary))),
                    Text('${(v * 100).toInt()}% sold', style: TextStyle(fontSize: 9, color: AmarShopTheme.subtleText)),
                  ])),
                ])),
              ]),
            ),
          )),
        ],
      ),
    );
  }
}
