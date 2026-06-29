class User {
  final String id;
  final String name;
  final String? email;
  final String phone;
  final String? avatar;
  final String role;
  final bool isSeller;
  final bool isVerified;

  User({
    required this.id,
    required this.name,
    this.email,
    required this.phone,
    this.avatar,
    this.role = 'CUSTOMER',
    this.isSeller = false,
    this.isVerified = false,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id'] as String,
      name: json['name'] as String,
      email: json['email'] as String?,
      phone: json['phone'] as String,
      avatar: json['avatar'] as String?,
      role: json['role'] as String? ?? 'CUSTOMER',
      isSeller: json['isSeller'] as bool? ?? false,
      isVerified: json['isVerified'] as bool? ?? false,
    );
  }
}
