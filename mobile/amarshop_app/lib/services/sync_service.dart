import 'dart:async';
import 'package:shared_preferences/shared_preferences.dart';

class SyncService {
  static Timer? _timer;

  static Future<void> startSync({Duration interval = const Duration(minutes: 15)}) async {
    _timer?.cancel();
    await performSync();
    _timer = Timer.periodic(interval, (_) async {
      await performSync();
    });
  }

  static Future<void> performSync() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final lastSync = prefs.getString('last_sync');
      // Sync cart, orders, etc. from local to server
      await _syncCart();
      await _syncPendingOrders();
      await prefs.setString('last_sync', DateTime.now().toIso8601String());
    } catch (_) {}
  }

  static Future<void> _syncCart() async {}

  static Future<void> _syncPendingOrders() async {}

  static void stopSync() {
    _timer?.cancel();
    _timer = null;
  }
}
