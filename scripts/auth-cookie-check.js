const http = require('http');

const make = (payload) => new Promise((resolve) => {
  const data = JSON.stringify(payload);
  const req = http.request(
    {
      host: 'localhost',
      port: 4000,
      path: '/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data),
      },
    },
    (res) => {
      let body = '';
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => {
        resolve({ status: res.statusCode, headers: res.headers, body });
      });
    },
  );
  req.on('error', (err) => resolve({ error: err.message }));
  req.write(data);
  req.end();
});

(async () => {
  const accounts = [
    { label: 'CUSTOMER', email: 'customer@amarshop.com', password: 'customer123' },
    { label: 'ADMIN', email: 'admin@amarshop.com', password: 'admin123' },
    { label: 'SELLER', email: 'seller@amarshop.com', password: 'seller123' },
  ];
  for (const account of accounts) {
    console.log('---', account.label, 'LOGIN ---');
    const result = await make({ email: account.email, password: account.password });
    console.log(JSON.stringify(result, null, 2));
  }
})();
