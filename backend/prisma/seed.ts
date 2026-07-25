import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '../../.env.local') });
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const databaseUrl =
  process.env.DATABASE_URL?.replace(/^["']|["']$/g, '') ||
  'postgresql://postgres@localhost:5433/amarshop?schema=public';
const dbUrl = new URL(databaseUrl);
const pool = new Pool({
  user: dbUrl.username || 'postgres',
  password: dbUrl.password ? decodeURIComponent(dbUrl.password) : undefined,
  host: dbUrl.hostname,
  port: parseInt(dbUrl.port, 10) || 5433,
  database: dbUrl.pathname.replace('/', ''),
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
  const superAdmin = await prisma.user.create({ data: { name: 'Super Admin', phone: '01799999999', email: 'super@amarshop.com', password: await bcrypt.hash('super123', 10), role: 'SUPER_ADMIN', isVerified: true } });
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

  // Seller 2 — distinct store, brand, and product for cross-seller IDOR testing
  const seller2 = await prisma.user.create({
    data: {
      name: 'Premium Seller', phone: '01722222222', email: 'seller2@amarshop.com',
      password: await bcrypt.hash('seller2123', 10), role: 'SELLER', isSeller: true, isVerified: true,
    },
  });
  const profile2 = await prisma.sellerProfile.create({
    data: { userId: seller2.id, businessName: 'AmarShop Premium Store', businessType: 'sole_proprietorship', nidNumber: '9876543210', isKycVerified: true },
  });
  const store2 = await prisma.store.create({
    data: { name: 'AmarShop Premium Store', slug: 'amarshop-premium-store', userId: seller2.id, sellerProfileId: profile2.id, isActive: true },
  });
  const brand2 = await prisma.brand.create({ data: { name: 'Apple', slug: 'apple' } });
  await prisma.product.create({
    data: {
      name: 'iPhone 15 Pro Max', slug: 'iphone-15-pro-max',
      description: 'Premium flagship smartphone', price: 149999,
      storeId: store2.id, categoryId: cat.id, brandId: brand2.id,
      images: ['https://picsum.photos/seed/a1/600/600', 'https://picsum.photos/seed/a2/600/600'],
      inStock: true, stockCount: 30, isFeatured: true,
    },
  });

  // Test accounts for MODERATOR and LOGISTICS roles
  await prisma.user.create({ data: { name: 'Moderator User', phone: '01733333333', email: 'moderator@amarshop.com', password: await bcrypt.hash('moderator123', 10), role: 'MODERATOR', isVerified: true } });
  await prisma.user.create({ data: { name: 'Logistics User', phone: '01744444444', email: 'logistics@amarshop.com', password: await bcrypt.hash('logistics123', 10), role: 'LOGISTICS', isVerified: true } });

  // Real address + order for customer (enables shipment tracking tests)
  const cust = await prisma.user.findFirst({ where: { email: 'customer@amarshop.com' } })!;
  if (cust) {
    const addr = await prisma.address.create({
      data: { userId: cust.id, label: 'Home', fullName: 'Demo Customer', phone: '01700000000', street: '123 Test Street', city: 'Dhaka', district: 'Dhaka', isDefault: true },
    });
    const order = await prisma.order.create({
      data: {
        orderNumber: 'ORD-TEST-001', userId: cust.id, addressId: addr.id,
        subtotal: 149999, shipping: 100, total: 150099, paymentMethod: 'COD',
        status: 'PENDING',
        items: { create: { productId: (await prisma.product.findFirst({ where: { slug: 'iphone-15-pro-max' } }))!.id, quantity: 1, price: 149999 } },
      },
    });
    // Create a real shipment for this order so tracking can be tested
    const courier = await prisma.courier.findFirst({ where: { isActive: true } });
    if (courier) {
      await prisma.shipment.create({
        data: {
          orderId: order.id, courierId: courier.id,
          trackingId: 'AMR-TEST-TRACK-001', status: 'IN_TRANSIT',
          weight: 0.5, shippingFee: 100,
          deliveryAddress: '123 Test Street, Dhaka, Dhaka',
          estimatedDays: '3',
          timeline: { create: { status: 'IN_TRANSIT', note: 'In transit to destination' } },
        },
      });
    }
  }

  console.log('SEEDED. admin@amarshop.com/admin123 | seller@amarshop.com/seller123 | customer@amarshop.com/customer123 | super@amarshop.com/super123 | seller2@amarshop.com/seller2123 | moderator@amarshop.com/moderator123 | logistics@amarshop.com/logistics123');
}

main().catch((e) => { console.error('FAIL:', e.message); process.exit(1); }).finally(() => prisma.$disconnect());
