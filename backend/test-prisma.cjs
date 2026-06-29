const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

async function main() {
  const pool = new Pool({ 
    user: 'postgres',
    password: 'shawon12',
    host: 'localhost',
    port: 5433,
    database: 'amarshop',
  });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });
  await prisma.$connect();
  
  const userCount = await prisma.user.count();
  const productCount = await prisma.product.count();
  const orderCount = await prisma.order.count();
  const categoryCount = await prisma.category.count();
  
  console.log('Prisma 7 adapter works');
  console.log(JSON.stringify({ userCount, productCount, orderCount, categoryCount }));
  
  const result = await prisma.$queryRaw`SELECT COUNT(*)::int AS cnt FROM "User"`;
  console.log('Raw query OK:', JSON.stringify(result));
  
  await prisma.$transaction([
    prisma.review.count(),
    prisma.cartItem.count(),
  ]).then(rows => console.log('Transaction OK:', JSON.stringify(rows)));
  
  await prisma.$disconnect();
  process.exit(0);
}

main().catch(e => { console.error('FAIL:', e.message); process.exit(1); });
