import 'package:local_auth/local_auth.dart';
import 'api_service.dart';

class AuthService {
  static final LocalAuthentication _localAuth = LocalAuthentication();

  static Future<bool> isBiometricAvailable() async {
    try {
      return await _localAuth.canCheckBiometrics || await _localAuth.isDeviceSupported();
    } catch (_) {
      return false;
    }
  }

  static Future<bool> authenticateWithBiometrics() async {
    try {
      return await _localAuth.authenticate(
        localizedReason: 'Log in to AmarShop using biometrics',
        options: const AuthenticationOptions(
          biometricOnly: true,
          stickyAuth: true,
        ),
      );
    } catch (_) {
      return false;
    }
  }

  static Future<Map<String, dynamic>> login(String phone, String password) async {
    return ApiService.post('/api/auth/login', body: {
      'phone': phone,
      'password': password,
    });
  }

  static Future<Map<String, dynamic>> register(String name, String phone, String password) async {
    return ApiService.post('/api/auth/register', body: {
      'name': name,
      'phone': phone,
      'password': password,
    });
  }

  static Future<Map<String, dynamic>> getProfile() async {
    return ApiService.get('/api/auth/profile');
  }

  static Future<void> logout() async {
    await ApiService.clearToken();
  }
}
