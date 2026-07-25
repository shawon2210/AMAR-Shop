const http = require('http');

function request(path, options = {}) {
  return new Promise((resolve, reject) => {
    const req = http.request({ host: '127.0.0.1', port: 5000, path, method: options.method || 'GET', headers: options.headers || {} }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: data }));
    });
    req.on('error', reject);
    if (options.body) req.write(options.body);
    req.end();
  });
}

(async () => {
  const adminLogin = await request('/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: 'admin@amarshop.com', password: 'admin123' }) });
  console.log('ADMIN LOGIN STATUS', adminLogin.status);
  console.log('ADMIN SET-COOKIE', adminLogin.headers['set-cookie']);
  console.log('ADMIN BODY', adminLogin.body);

  const adminProfile = await request('/auth/profile', { headers: { Cookie: adminLogin.headers['set-cookie'].join('; ') } });
  console.log('ADMIN PROFILE STATUS', adminProfile.status);
  console.log('ADMIN PROFILE BODY', adminProfile.body);

  const sellerLogin = await request('/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: 'seller@amarshop.com', password: 'seller123' }) });
  console.log('SELLER LOGIN STATUS', sellerLogin.status);
  console.log('SELLER SET-COOKIE', sellerLogin.headers['set-cookie']);
  const sellerProfile = await request('/auth/profile', { headers: { Cookie: sellerLogin.headers['set-cookie'].join('; ') } });
  console.log('SELLER PROFILE STATUS', sellerProfile.status);
  console.log('SELLER PROFILE BODY', sellerProfile.body);
})();
