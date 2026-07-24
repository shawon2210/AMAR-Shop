const { Client } = require('pg');
const bcrypt = require('bcrypt');

(async () => {
  const client = new Client({ connectionString: 'postgresql://postgres@localhost:5432/amarshop' });
  try {
    await client.connect();
    const rows = await client.query(
      'SELECT email, phone, password FROM "User" WHERE email IN ($1,$2,$3) OR phone IN ($4,$5,$6)',
      ['customer@amarshop.com', 'admin@amarshop.com', 'seller@amarshop.com', '01700000000', '01712345678', '01711111111'],
    );
    for (const row of rows.rows) {
      console.log('USER', row.email || row.phone);
      for (const [candidate, label] of [
        ['customer123', 'customer123'],
        ['admin123', 'admin123'],
        ['seller123', 'seller123'],
      ]) {
        const match = await bcrypt.compare(candidate, row.password);
        console.log('  candidate', label, '=>', match);
      }
    }
  } catch (err) {
    console.error('ERROR', err.message);
  } finally {
    await client.end();
  }
})();