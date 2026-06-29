class Category {
  final String id;
  final String name;
  final String? bnName;
  final String icon;
  final String slug;
  final int productCount;

  Category({
    required this.id,
    required this.name,
    this.bnName,
    required this.icon,
    required this.slug,
    this.productCount = 0,
  });

  factory Category.fromJson(Map<String, dynamic> json) {
    return Category(
      id: json['id'] as String,
      name: json['name'] as String,
      bnName: json['bnName'] as String?,
      icon: json['icon'] as String? ?? 'category',
      slug: json['slug'] as String,
      productCount: json['productCount'] as int? ?? 0,
    );
  }
}
