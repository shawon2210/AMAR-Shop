import 'package:flutter/foundation.dart';
import '../models/user.dart';
import '../services/auth_service.dart';
import '../services/api_service.dart';

class AuthProvider extends ChangeNotifier {
  User? _user;
  bool _loading = false;
  String? _error;

  User? get user => _user;
  bool get loading => _loading;
  String? get error => _error;
  bool get isLoggedIn => _user != null;

  Future<bool> login(String phone, String password) async {
    _loading = true;
    _error = null;
    notifyListeners();
    try {
      final response = await AuthService.login(phone, password);
      await ApiService.setToken(response['token'] as String);
      _user = User.fromJson(response['user'] as Map<String, dynamic>);
      _loading = false;
      notifyListeners();
      return true;
    } catch (e) {
      _error = e.toString();
      _loading = false;
      notifyListeners();
      return false;
    }
  }

  Future<bool> register(String name, String phone, String password) async {
    _loading = true;
    _error = null;
    notifyListeners();
    try {
      final response = await AuthService.register(name, phone, password);
      await ApiService.setToken(response['token'] as String);
      _user = User.fromJson(response['user'] as Map<String, dynamic>);
      _loading = false;
      notifyListeners();
      return true;
    } catch (e) {
      _error = e.toString();
      _loading = false;
      notifyListeners();
      return false;
    }
  }

  Future<void> loadProfile() async {
    try {
      final token = await ApiService.getToken();
      if (token == null) return;
      final response = await AuthService.getProfile();
      _user = User.fromJson(response);
      notifyListeners();
    } catch (_) {}
  }

  Future<void> logout() async {
    await AuthService.logout();
    _user = null;
    notifyListeners();
  }

  void clearError() {
    _error = null;
    notifyListeners();
  }
}
