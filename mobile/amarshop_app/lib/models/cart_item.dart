import 'product.dart';

class CartItem {
  final String id;
  final Product product;
  int quantity;
  bool selected;

  CartItem({
    required this.id,
    required this.product,
    this.quantity = 1,
    this.selected = true,
  });

  factory CartItem.fromJson(Map<String, dynamic> json) {
    return CartItem(
      id: json['id'] as String,
      product: Product.fromJson(json['product'] as Map<String, dynamic>),
      quantity: json['quantity'] as int? ?? 1,
      selected: json['selected'] as bool? ?? true,
    );
  }

  double get totalPrice => product.price * quantity;
}
