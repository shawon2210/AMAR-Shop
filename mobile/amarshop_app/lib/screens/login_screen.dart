import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../config/theme.dart';
import '../config/routes.dart';
import '../providers/auth_provider.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _phoneController = TextEditingController();
  final _passwordController = TextEditingController();
  bool _obscurePassword = true;

  @override
  void dispose() {
    _phoneController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  Future<void> _login() async {
    final auth = context.read<AuthProvider>();
    final success = await auth.login(
      _phoneController.text.trim(),
      _passwordController.text,
    );
    if (success && mounted) {
      Navigator.pushReplacementNamed(context, AppRoutes.home);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const SizedBox(height: 48),
              const Icon(Icons.store, size: 48, color: AmarShopTheme.primary),
              const SizedBox(height: 24),
              Text('Welcome Back', style: TextStyle(fontSize: 28, fontWeight: FontWeight.bold, color: AmarShopTheme.onBackground)),
              const SizedBox(height: 8),
              Text('Log in to your AmarShop account', style: TextStyle(fontSize: 14, color: AmarShopTheme.subtleText)),
              const SizedBox(height: 32),
              TextField(controller: _phoneController, keyboardType: TextInputType.phone, decoration: const InputDecoration(labelText: 'Phone Number', hintText: '01XXXXXXXXX')),
              const SizedBox(height: 16),
              TextField(controller: _passwordController, obscureText: _obscurePassword, decoration: InputDecoration(labelText: 'Password', suffixIcon: IconButton(icon: Icon(_obscurePassword ? Icons.visibility_off : Icons.visibility), onPressed: () => setState(() => _obscurePassword = !_obscurePassword)))),
              const SizedBox(height: 24),
              Consumer<AuthProvider>(builder: (_, auth, __) => SizedBox(width: double.infinity, child: ElevatedButton(onPressed: auth.loading ? null : _login, child: auth.loading ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white)) : const Text('Log In', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold))))),
              if (context.watch<AuthProvider>().error != null) Padding(padding: const EdgeInsets.only(top: 12), child: Text(context.watch<AuthProvider>().error!, style: const TextStyle(color: AmarShopTheme.error, fontSize: 13))),
              const SizedBox(height: 16),
              Center(child: TextButton(onPressed: () {}, child: const Text('Forgot Password?', style: TextStyle(color: AmarShopTheme.primary)))),
              const SizedBox(height: 32),
              Row(children: [const Expanded(child: Divider()), Padding(padding: const EdgeInsets.symmetric(horizontal: 16), child: Text('or', style: TextStyle(color: AmarShopTheme.subtleText))), const Expanded(child: Divider())]),
              const SizedBox(height: 24),
              SizedBox(width: double.infinity, child: OutlinedButton.icon(onPressed: () {}, icon: const Icon(Icons.fingerprint), label: const Text('Use Biometrics'), style: OutlinedButton.styleFrom(foregroundColor: AmarShopTheme.primary, side: const BorderSide(color: AmarShopTheme.primary), padding: const EdgeInsets.symmetric(vertical: 14)))),
              const SizedBox(height: 16),
              Center(child: TextButton(onPressed: () {}, child: const Text("Don't have an account? Register", style: TextStyle(color: AmarShopTheme.primary)))),
            ],
          ),
        ),
      ),
    );
  }
}
