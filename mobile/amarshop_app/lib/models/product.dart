class Product {
  final String id;
  final String name;
  final String slug;
  final String? description;
  final double price;
  final double? originalPrice;
  final double? discount;
  final String currency;
  final List<String> images;
  final String category;
  final String categoryId;
  final String? brand;
  final double rating;
  final int reviewCount;
  final bool inStock;
  final int stockCount;
  final bool isFlashSale;
  final bool isMall;
  final bool isNew;
  final bool freeShipping;
  final String? flashSaleEndsAt;
  final int? soldPercent;
  final String? sellerName;
  final bool sellerIsOfficial;
  final List<String>? colors;
  final List<String>? sizes;

  Product({
    required this.id,
    required this.name,
    required this.slug,
    this.description,
    required this.price,
    this.originalPrice,
    this.discount,
    this.currency = 'BDT',
    required this.images,
    required this.category,
    required this.categoryId,
    this.brand,
    this.rating = 0,
    this.reviewCount = 0,
    this.inStock = true,
    this.stockCount = 0,
    this.isFlashSale = false,
    this.isMall = false,
    this.isNew = false,
    this.freeShipping = false,
    this.flashSaleEndsAt,
    this.soldPercent,
    this.sellerName,
    this.sellerIsOfficial = false,
    this.colors,
    this.sizes,
  });

  factory Product.fromJson(Map<String, dynamic> json) {
    return Product(
      id: json['id'] as String,
      name: json['name'] as String,
      slug: json['slug'] as String,
      description: json['description'] as String?,
      price: (json['price'] as num).toDouble(),
      originalPrice: (json['originalPrice'] as num?)?.toDouble(),
      discount: (json['discount'] as num?)?.toDouble(),
      currency: json['currency'] as String? ?? 'BDT',
      images: List<String>.from(json['images'] ?? []),
      category: json['category'] as String? ?? '',
      categoryId: json['categoryId'] as String? ?? '',
      brand: json['brand'] as String?,
      rating: (json['rating'] as num?)?.toDouble() ?? 0,
      reviewCount: json['reviewCount'] as int? ?? 0,
      inStock: json['inStock'] as bool? ?? true,
      stockCount: json['stockCount'] as int? ?? 0,
      isFlashSale: json['isFlashSale'] as bool? ?? false,
      isMall: json['isMall'] as bool? ?? false,
      isNew: json['isNew'] as bool? ?? false,
      freeShipping: json['freeShipping'] as bool? ?? false,
      flashSaleEndsAt: json['flashSaleEndsAt'] as String?,
      soldPercent: json['soldPercent'] as int?,
      sellerName: json['seller'] != null ? json['seller']['name'] as String? : null,
      sellerIsOfficial: json['seller'] != null ? json['seller']['isOfficial'] as bool? ?? false : false,
      colors: json['colors'] != null ? List<String>.from(json['colors']) : null,
      sizes: json['sizes'] != null ? List<String>.from(json['sizes']) : null,
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'name': name,
    'slug': slug,
    'description': description,
    'price': price,
    'originalPrice': originalPrice,
    'discount': discount,
    'currency': currency,
    'images': images,
    'category': category,
    'categoryId': categoryId,
    'brand': brand,
    'rating': rating,
    'reviewCount': reviewCount,
    'inStock': inStock,
    'stockCount': stockCount,
    'isFlashSale': isFlashSale,
    'isMall': isMall,
    'isNew': isNew,
    'freeShipping': freeShipping,
    'flashSaleEndsAt': flashSaleEndsAt,
    'soldPercent': soldPercent,
  };

  double get discountPercent {
    if (originalPrice == null || originalPrice == 0) return 0;
    return ((originalPrice! - price) / originalPrice! * 100).roundToDouble();
  }
}
