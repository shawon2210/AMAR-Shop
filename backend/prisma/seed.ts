import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  // No fallback password — must be set via DB_PASSWORD env var
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5433', 10),
  database: process.env.DB_NAME || 'amarshop',
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function reset() {
  const tables: any = await prisma.$queryRawUnsafe("SELECT tablename FROM pg_tables WHERE schemaname = 'public'");
  for (const { tablename } of tables) {
    try { await prisma.$executeRawUnsafe('TRUNCATE "' + tablename + '" CASCADE'); } catch {}
  }
  console.log('Reset done.');
}

async function main() {
  await reset();
  console.log('Seeding minimal data...');
  const bcrypt = require('bcrypt');
  const seller = await prisma.user.create({
    data: {
      name: 'Demo Seller', phone: '01711111111', email: 'seller@amarshop.com',
      password: await bcrypt.hash('seller123', 10), role: 'SELLER', isSeller: true, isVerified: true,
    },
  });
  const profile = await prisma.sellerProfile.create({
    data: { userId: seller.id, businessName: 'AmarShop Demo Store', businessType: 'sole_proprietorship', nidNumber: '1234567890', isKycVerified: true },
  });
  const store = await prisma.store.create({
    data: { name: 'AmarShop Demo Store', slug: 'amarshop-demo-store', userId: seller.id, sellerProfileId: profile.id, isActive: true },
  });
  await prisma.user.create({ data: { name: 'Demo Customer', phone: '01700000000', email: 'customer@amarshop.com', password: await bcrypt.hash('customer123', 10), role: 'CUSTOMER', isVerified: true } });
  await prisma.user.create({ data: { name: 'Admin User', phone: '01712345678', email: 'admin@amarshop.com', password: await bcrypt.hash('admin123', 10), role: 'ADMIN', isVerified: true } });
  const cat = await prisma.category.create({ data: { name: 'Electronics', slug: 'electronics' } });
  const brand = await prisma.brand.create({ data: { name: 'Samsung', slug: 'samsung' } });
  await prisma.product.create({
    data: {
      name: 'Samsung Galaxy S24 Ultra', slug: 'samsung-galaxy-s24-ultra',
      description: 'Flagship smartphone with AI features', price: 129999,
      storeId: store.id, categoryId: cat.id, brandId: brand.id,
      images: ['https://picsum.photos/seed/s1/600/600', 'https://picsum.photos/seed/s2/600/600'],
      inStock: true, stockCount: 50, isFeatured: true,
    },
  });
  console.log('SEEDED. admin@amarshop.com/admin123 | seller@amarshop.com/seller123 | customer@amarshop.com/customer123');
}

main().catch((e) => { console.error('FAIL:', e.message); process.exit(1); }).finally(() => prisma.$disconnect());
