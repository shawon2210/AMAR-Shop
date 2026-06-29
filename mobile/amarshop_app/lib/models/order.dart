import 'cart_item.dart';

class Order {
  final String id;
  final List<CartItem> items;
  final String status;
  final double total;
  final double subtotal;
  final double shipping;
  final double discount;
  final String paymentMethod;
  final String createdAt;
  final String? trackingNumber;

  Order({
    required this.id,
    required this.items,
    required this.status,
    required this.total,
    required this.subtotal,
    required this.shipping,
    required this.discount,
    required this.paymentMethod,
    required this.createdAt,
    this.trackingNumber,
  });

  factory Order.fromJson(Map<String, dynamic> json) {
    return Order(
      id: json['id'] as String,
      items: (json['items'] as List<dynamic>?)
          ?.map((e) => CartItem.fromJson(e as Map<String, dynamic>))
          .toList() ?? [],
      status: json['status'] as String? ?? 'pending',
      total: (json['total'] as num).toDouble(),
      subtotal: (json['subtotal'] as num?)?.toDouble() ?? 0,
      shipping: (json['shipping'] as num?)?.toDouble() ?? 0,
      discount: (json['discount'] as num?)?.toDouble() ?? 0,
      paymentMethod: json['paymentMethod'] as String? ?? 'cod',
      createdAt: json['createdAt'] as String? ?? '',
      trackingNumber: json['trackingNumber'] as String?,
    );
  }
}
