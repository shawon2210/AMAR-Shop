import 'package:flutter/material.dart';
import '../config/theme.dart';

class SearchScreen extends StatefulWidget {
  const SearchScreen({super.key});

  @override
  State<SearchScreen> createState() => _SearchScreenState();
}

class _SearchScreenState extends State<SearchScreen> {
  final _controller = TextEditingController();

  final _recentSearches = ['samsung galaxy', 'tshirt men', 'smart watch', 'earbuds', 'iphone 15'];
  final _trendingSearches = ['summer sale', 'flash deal', 'new arrivals', 'free shipping', 'under 500'];

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: TextField(
          controller: _controller,
          autofocus: true,
          decoration: InputDecoration(
            hintText: 'Search products...',
            filled: true,
            fillColor: AmarShopTheme.background,
            border: OutlineInputBorder(borderRadius: BorderRadius.circular(8), borderSide: BorderSide.none),
            contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
          ),
        ),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Text('Recent Searches', style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: AmarShopTheme.onBackground)),
          const SizedBox(height: 8),
          Wrap(spacing: 8, runSpacing: 8, children: _recentSearches.map((s) => ActionChip(label: Text(s, style: TextStyle(fontSize: 12)), onPressed: () {}, deleteIcon: const Icon(Icons.close, size: 16), deleteIconColor: AmarShopTheme.subtleText)).toList()),
          const SizedBox(height: 24),
          Text('Trending Now', style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: AmarShopTheme.onBackground)),
          const SizedBox(height: 8),
          Wrap(spacing: 8, runSpacing: 8, children: _trendingSearches.map((s) => Chip(label: Row(mainAxisSize: MainAxisSize.min, children: [Icon(Icons.trending_up, size: 14, color: AmarShopTheme.primary), const SizedBox(width: 4), Text(s, style: TextStyle(fontSize: 12))]), onDeleted: null)).toList()),
        ],
      ),
    );
  }
}
