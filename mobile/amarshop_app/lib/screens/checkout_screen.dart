import 'package:flutter/material.dart';
import '../config/theme.dart';

class CheckoutScreen extends StatelessWidget {
  const CheckoutScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Checkout')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(padding: const EdgeInsets.all(16), decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(12), border: Border.all(color: AmarShopTheme.border)), child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Text('Delivery Address', style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: AmarShopTheme.onBackground)),
              const SizedBox(height: 8),
              Text('John Doe\n01XXXXXXXXX\n123, Dhaka, Bangladesh', style: TextStyle(fontSize: 13, color: AmarShopTheme.onSurface)),
              const SizedBox(height: 8),
              TextButton(onPressed: () {}, child: const Text('Change Address', style: TextStyle(fontSize: 13))),
            ])),
            const SizedBox(height: 12),
            Container(padding: const EdgeInsets.all(16), decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(12), border: Border.all(color: AmarShopTheme.border)), child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Text('Payment Method', style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: AmarShopTheme.onBackground)),
              const SizedBox(height: 12),
              _paymentOption('bKash', Icons.account_balance_wallet),
              _paymentOption('Nagad', Icons.account_balance_wallet),
              _paymentOption('Cash on Delivery', Icons.money),
              _paymentOption('SSLCommerz', Icons.credit_card),
            ])),
            const SizedBox(height: 12),
            Container(padding: const EdgeInsets.all(16), decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(12), border: Border.all(color: AmarShopTheme.border)), child: Column(children: [
              _row('Subtotal', '৳2,400'),
              _row('Shipping', '৳60'),
              _row('Discount', '-৳120', color: AmarShopTheme.success),
              const Divider(),
              _row('Total', '৳2,340', bold: true),
            ])),
            const SizedBox(height: 24),
            SizedBox(width: double.infinity, child: ElevatedButton(onPressed: () {}, child: const Text('Place Order', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)))),
          ],
        ),
      ),
    );
  }

  Widget _paymentOption(String name, IconData icon) {
    return RadioListTile(value: name, groupValue: 'Cash on Delivery', title: Text(name, style: TextStyle(fontSize: 13)), secondary: Icon(icon, size: 20), contentPadding: EdgeInsets.zero, dense: true, onChanged: (_) {});
  }

  Widget _row(String label, String value, {Color? color, bool bold = false}) {
    return Padding(padding: const EdgeInsets.symmetric(vertical: 4), child: Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
      Text(label, style: TextStyle(fontSize: 13, color: AmarShopTheme.subtleText)),
      Text(value, style: TextStyle(fontSize: 13, fontWeight: bold ? FontWeight.bold : FontWeight.normal, color: color ?? AmarShopTheme.onBackground)),
    ]));
  }
}
