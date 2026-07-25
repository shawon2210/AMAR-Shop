const http = require('http');
function request(method, host, port, path, body, headers = {}) {
  return new Promise((resolve, reject) => {
    const req = http.request({ host, port, path, method, headers }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: data }));
    });
    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}
(async () => {
  const loginRes = await request('POST', '127.0.0.1', 5000, '/auth/login', JSON.stringify({ email: 'admin@amarshop.com', password: 'admin123' }), { 'Content-Type': 'application/json' });
  const setCookies = loginRes.headers['set-cookie'] || [];
  const accessCookie = (Array.isArray(setCookies) ? setCookies : [setCookies]).find(c => c.startsWith('accessToken='));
  if (!accessCookie) throw new Error('no accessToken cookie');
  const cookieHeader = accessCookie.split(';')[0];
  const adminRes = await request('GET', '127.0.0.1', 3000, '/admin', null, { Cookie: cookieHeader });
  console.log('STATUS', adminRes.status);
  console.log('LOCATION', adminRes.headers.location);
  console.log('BODY_SNIPPET', adminRes.body.slice(0, 200));
})();
