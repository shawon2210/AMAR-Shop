import 'package:flutter/material.dart';
import '../config/theme.dart';

class OrderDetailScreen extends StatelessWidget {
  final String orderId;
  const OrderDetailScreen({super.key, required this.orderId});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Order #$orderId')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(padding: const EdgeInsets.all(16), decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(12), border: Border.all(color: AmarShopTheme.border)), child: Column(children: [
              Icon(Icons.check_circle, size: 48, color: AmarShopTheme.success),
              const SizedBox(height: 8),
              Text('Order Delivered', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: AmarShopTheme.onBackground)),
              const SizedBox(height: 4),
              Text('Your order has been delivered successfully', style: TextStyle(fontSize: 13, color: AmarShopTheme.subtleText)),
            ])),
            const SizedBox(height: 16),
            Container(padding: const EdgeInsets.all(16), decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(12), border: Border.all(color: AmarShopTheme.border)), child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Text('Order Timeline', style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: AmarShopTheme.onBackground)),
              const SizedBox(height: 12),
              _timelineItem('Order Placed', '28 Jun 2026, 10:30 AM', true),
              _timelineItem('Confirmed', '28 Jun 2026, 11:00 AM', true),
              _timelineItem('Shipped', '29 Jun 2026, 9:00 AM', true),
              _timelineItem('Out for Delivery', '29 Jun 2026, 2:00 PM', true),
              _timelineItem('Delivered', '29 Jun 2026, 4:30 PM', true),
            ])),
            const SizedBox(height: 16),
            Container(padding: const EdgeInsets.all(16), decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(12), border: Border.all(color: AmarShopTheme.border)), child: Column(children: [
              _detailRow('Subtotal', '৳2,400'),
              _detailRow('Shipping', '৳60'),
              _detailRow('Discount', '-৳120'),
              const Divider(),
              _detailRow('Total', '৳2,340', bold: true),
              _detailRow('Payment', 'Cash on Delivery'),
            ])),
          ],
        ),
      ),
    );
  }

  Widget _timelineItem(String title, String time, bool completed) {
    return Padding(padding: const EdgeInsets.only(bottom: 8), child: Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
      Column(children: [
        Icon(completed ? Icons.check_circle : Icons.radio_button_unchecked, size: 18, color: completed ? AmarShopTheme.success : AmarShopTheme.subtleText),
        Container(width: 1, height: 20, color: AmarShopTheme.border),
      ]),
      const SizedBox(width: 12),
      Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Text(title, style: TextStyle(fontSize: 13, fontWeight: FontWeight.w500, color: completed ? AmarShopTheme.onBackground : AmarShopTheme.subtleText)),
        Text(time, style: TextStyle(fontSize: 11, color: AmarShopTheme.subtleText)),
      ]),
    ]));
  }

  Widget _detailRow(String label, String value, {bool bold = false}) {
    return Padding(padding: const EdgeInsets.symmetric(vertical: 3), child: Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
      Text(label, style: TextStyle(fontSize: 13, color: AmarShopTheme.subtleText)),
      Text(value, style: TextStyle(fontSize: 13, fontWeight: bold ? FontWeight.bold : FontWeight.normal, color: AmarShopTheme.onBackground)),
    ]));
  }
}
