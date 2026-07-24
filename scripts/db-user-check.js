const { Client } = require('pg');

(async () => {
  const client = new Client({ connectionString: 'postgresql://postgres@localhost:5432/amarshop' });
  try {
    await client.connect();
    const res = await client.query(
      'SELECT id, email, phone, role, "isActive" FROM "User" WHERE email IN ($1, $2, $3) OR phone IN ($4, $5, $6)',
      ['customer@amarshop.com', 'admin@amarshop.com', 'seller@amarshop.com', '01700000000', '01712345678', '01711111111'],
    );
    console.log(JSON.stringify(res.rows, null, 2));
  } catch (err) {
    console.error('ERROR', err.message);
  } finally {
    await client.end();
  }
})();