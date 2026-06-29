import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { faker } from '@faker-js/faker';

const CHUNK = { categories: 50, brands: 100, products: 500, users: 1000, reviews: 5000, orders: 5000, shipments: 5000 };

const pool = new Pool({ user: 'postgres', password: 'shawon12', host: 'localhost', port: 5433, database: 'amarshop' });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

async function reset() {
  const tables: any = await prisma.$queryRawUnsafe("SELECT tablename FROM pg_tables WHERE schemaname = 'public'");
  for (const { tablename } of tables) {
    try { await prisma.$executeRawUnsafe(`TRUNCATE "${tablename}" CASCADE`); } catch {}
  }
  console.log(`Reset ${tables.length} tables.`);
}

function chunkArray<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) chunks.push(arr.slice(i, i + size));
  return chunks;
}

async function seedCategories(count: number) {
  console.log(`Seeding ${count} categories...`);
  const data = Array.from({ length: count }, () => ({
    name: faker.commerce.department() + ' ' + faker.string.alphanumeric(4),
    slug: faker.helpers.slugify(faker.commerce.department()).toLowerCase() + '-' + faker.string.numeric(5),
    description: faker.commerce.productDescription(),
    image: `https://picsum.photos/seed/cat-${faker.string.numeric(6)}/300/300`,
    isActive: true,
    sortOrder: faker.number.int({ min: 0, max: 100 }),
  }));
  for (const chunk of chunkArray(data, CHUNK.categories)) {
    await prisma.category.createMany({ data: chunk, skipDuplicates: true });
  }
  console.log(`  categories: ${count} done.`);
}

async function seedBrands(count: number) {
  console.log(`Seeding ${count} brands...`);
  const data = Array.from({ length: count }, () => {
    const name = faker.company.name();
    return {
      name,
      slug: faker.helpers.slugify(name).toLowerCase() + '-' + faker.string.numeric(4),
      description: faker.company.catchPhrase(),
      logo: `https://picsum.photos/seed/brand-${faker.string.numeric(6)}/120/120`,
      isActive: true,
    };
  });
  for (const chunk of chunkArray(data, CHUNK.brands)) {
    await prisma.brand.createMany({ data: chunk, skipDuplicates: true });
  }
  console.log(`  brands: ${count} done.`);
}

async function seedProducts(count: number) {
  console.log(`Seeding ${count} products...`);
  const cats = await prisma.category.findMany({ select: { id: true } });
  const brands = await prisma.brand.findMany({ select: { id: true } });
  const stores = await prisma.store.findMany({ select: { id: true } });
  if (!cats.length || !stores.length) throw new Error('Need categories + stores first');
  
  for (let i = 0; i < count; i += CHUNK.products) {
    const batch = Math.min(CHUNK.products, count - i);
    const data = Array.from({ length: batch }, () => {
      const price = parseFloat(faker.commerce.price({ min: 99, max: 99999 }));
      return {
        name: faker.commerce.productName(),
        slug: faker.helpers.slugify(faker.commerce.productName()).toLowerCase() + '-' + faker.string.numeric(8),
        description: faker.commerce.productDescription(),
        shortDescription: faker.commerce.productDescription().slice(0, 100),
        price,
        originalPrice: price * (1 + faker.number.float({ min: 0.05, max: 0.35 })),
        currency: 'BDT',
        images: Array.from({ length: 3 }, () => `https://picsum.photos/seed/p${faker.string.numeric(8)}/600/600`),
        categoryId: cats[Math.floor(Math.random() * cats.length)].id,
        brandId: brands.length ? brands[Math.floor(Math.random() * brands.length)].id : null,
        storeId: stores[Math.floor(Math.random() * stores.length)].id,
        inStock: faker.datatype.boolean({ probability: 0.9 }),
        stockCount: faker.number.int({ min: 0, max: 500 }),
        soldCount: faker.number.int({ min: 0, max: 200 }),
        isFeatured: faker.datatype.boolean({ probability: 0.15 }),
        isNew: faker.datatype.boolean({ probability: 0.2 }),
        freeShipping: faker.datatype.boolean({ probability: 0.3 }),
        weight: faker.number.float({ min: 0.1, max: 10 }),
        status: 'active',
      };
    });
    await prisma.product.createMany({ data, skipDuplicates: true });
    process.stdout.write(`  products: ${i + batch}/${count}\r`);
  }
  console.log(`  products: ${count} done.    `);
}

async function seedUsers(count: number, role: string) {
  console.log(`Seeding ${count} ${role.toLowerCase()}s...`);
  const bcrypt = require('bcrypt');
  const pass = await bcrypt.hash('password123', 10); // hash once, reuse
  let done = 0;
  
  for (let i = 0; i < count; i += CHUNK.users) {
    const batch = Math.min(CHUNK.users, count - i);
    const data = [];
    for (let j = 0; j < batch; j++) {
      data.push({
        name: faker.person.fullName(),
        phone: '01' + faker.string.numeric(9),
        email: faker.internet.email().toLowerCase(),
        password: pass,
        role: role as any,
        isVerified: faker.datatype.boolean({ probability: 0.7 }),
        isActive: true,
        avatar: faker.datatype.boolean({ probability: 0.3 }) ? `https://picsum.photos/seed/u${faker.string.numeric(6)}/100/100` : null,
      });
    }
    // For sellers, need nested create — do one-by-one
    if (role === 'SELLER') {
      for (const d of data) {
        try {
          await prisma.user.create({
            data: { ...d, sellerProfile: { create: { businessName: faker.company.name(), businessType: 'sole_proprietorship', nidNumber: faker.string.numeric(10) } } },
          });
          done++;
        } catch {}
      }
    } else {
      const result = await prisma.user.createMany({ data, skipDuplicates: true });
      done += result.count;
    }
    process.stdout.write(`  ${role.toLowerCase()}s: ${done}/${count}\r`);
  }
  console.log(`  ${role.toLowerCase()}s: ${done} done.    `);
}

async function seedReviews(count: number) {
  console.log(`Seeding ${count} reviews...`);
  const users = await prisma.user.findMany({ where: { role: 'CUSTOMER' }, select: { id: true } });
  const products = await prisma.product.findMany({ select: { id: true } });
  if (!users.length || !products.length) throw new Error('Need users + products first');
  
  // Use smaller inline batches to avoid memory issues
  const batchSize = 500;
  let created = 0;
  for (let i = 0; i < count; i += batchSize) {
    const batch = Math.min(batchSize, count - i);
    const data = [];
    for (let j = 0; j < batch; j++) {
      data.push({
        userId: users[Math.floor(Math.random() * users.length)].id,
        productId: products[Math.floor(Math.random() * products.length)].id,
        rating: faker.number.int({ min: 1, max: 5 }),
        comment: faker.lorem.sentence(),
      });
    }
    const result = await prisma.review.createMany({ data, skipDuplicates: true });
    created += result.count;
    process.stdout.write(`  reviews: ${created}/${count}\r`);
  }
  console.log(`  reviews: ${created} done.    `);
}

async function seedOrders(count: number) {
  console.log(`Seeding ${count} orders...`);
  const customers = await prisma.user.findMany({ where: { role: 'CUSTOMER' }, select: { id: true } });
  const products = await prisma.product.findMany({ select: { id: true, price: true } });
  if (!customers.length || !products.length) throw new Error('Need customers + products first');
  
  // Create addresses for customers that don't have them
  const addrCount = await prisma.address.count();
  if (addrCount === 0) {
    console.log('  Creating addresses...');
    const custSlice = customers.slice(0, Math.min(100, customers.length));
    for (const c of custSlice) {
      try {
        await prisma.address.create({
          data: { userId: c.id, fullName: 'Home', phone: '01' + faker.string.numeric(9), street: faker.location.streetAddress(), city: faker.location.city(), district: faker.location.state(), isDefault: true },
        });
      } catch {}
    }
  }
  const addrIds = (await prisma.address.findMany({ select: { id: true } })).map(a => a.id);
  if (!addrIds.length) throw new Error('No addresses available');
  
  const batchSize = 1000;
  for (let i = 0; i < count; i += batchSize) {
    const batch = Math.min(batchSize, count - i);
    const data = [];
    for (let j = 0; j < batch; j++) {
      const itemCount = faker.number.int({ min: 1, max: 4 });
      let subtotal = 0;
      const items = [];
      for (let k = 0; k < itemCount; k++) {
        const p = products[Math.floor(Math.random() * products.length)];
        const q = faker.number.int({ min: 1, max: 3 });
        subtotal += p.price * q;
        items.push({ productId: p.id, quantity: q, price: p.price });
      }
      data.push({
        orderNumber: 'AM' + faker.string.alphanumeric(10).toUpperCase(),
        userId: customers[Math.floor(Math.random() * customers.length)].id,
        addressId: addrIds[Math.floor(Math.random() * addrIds.length)],
        status: faker.helpers.arrayElement(['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'RETURNED']) as any,
        subtotal,
        shipping: faker.number.int({ min: 0, max: 200 }),
        discount: faker.datatype.boolean({ probability: 0.2 }) ? faker.number.int({ min: 50, max: 500 }) : 0,
        total: subtotal + faker.number.int({ min: 0, max: 200 }),
        paymentMethod: faker.helpers.arrayElement(['BKASH', 'NAGAD', 'COD', 'SSLCOMMERZ', 'WALLET']) as any,
        paymentStatus: faker.datatype.boolean({ probability: 0.7 }),
        paidAt: faker.datatype.boolean({ probability: 0.7 }) ? faker.date.recent({ days: 60 }) : null,
      });
    }
    await prisma.order.createMany({ data, skipDuplicates: true });
    process.stdout.write(`  orders: ${i + batch}/${count}\r`);
  }
  console.log(`  orders: ${count} done.    `);
}

async function seedShipments(count: number) {
  console.log(`Seeding ${count} shipments...`);
  const orders = await prisma.order.findMany({ select: { id: true }, where: { status: { in: ['SHIPPED', 'DELIVERED', 'CANCELLED', 'RETURNED'] } } });
  if (!orders.length) { console.log('  No shipped orders, skipping.'); return; }
  
  const shipBatch = 1000;
  for (let i = 0; i < count; i += shipBatch) {
    const batch = Math.min(shipBatch, count - i);
    const data = [];
    for (let j = 0; j < batch; j++) {
      data.push({
        orderId: orders[Math.floor(Math.random() * orders.length)].id,
        trackingId: 'AM' + faker.string.alphanumeric(12).toUpperCase(),
        status: faker.helpers.arrayElement(['PENDING', 'PICKUP_SCHEDULED', 'PICKED_UP', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED', 'FAILED', 'RETURNED']) as any,
        estimatedDays: String(faker.number.int({ min: 1, max: 7 })),
        deliveredAt: faker.datatype.boolean({ probability: 0.6 }) ? faker.date.recent() : null,
      });
    }
    await prisma.shipment.createMany({ data, skipDuplicates: true });
    process.stdout.write(`  shipments: ${i + batch}/${count}\r`);
  }
  console.log(`  shipments: ${count} done.    `);
}

async function seedCoupons(count: number) {
  console.log(`Seeding ${count} coupons...`);
  const data = Array.from({ length: count }, () => ({
    code: faker.string.alphanumeric(8).toUpperCase(),
    type: faker.helpers.arrayElement(['percentage', 'fixed', 'free_shipping']) as any,
    value: faker.number.int({ min: 5, max: 50 }),
    minPurchase: faker.number.int({ min: 200, max: 5000 }),
    maxUses: faker.number.int({ min: 50, max: 5000 }),
    usedCount: 0,
    maxPerUser: faker.number.int({ min: 1, max: 5 }),
    isActive: true,
    startsAt: new Date(),
    expiresAt: faker.date.future({ years: 1 }),
  }));
  await prisma.coupon.createMany({ data, skipDuplicates: true });
  console.log(`  coupons: ${count} done.`);
}

async function seedCampaigns(count: number) {
  console.log(`Seeding ${count} campaigns...`);
  const data = Array.from({ length: count }, () => ({
    title: faker.commerce.productAdjective() + ' ' + faker.helpers.arrayElement(['Flash Sale', 'Mega Deal', 'Special Offer', 'Seasonal Sale']),
    slug: faker.helpers.slugify(faker.commerce.productAdjective()) + '-' + faker.string.numeric(5),
    type: faker.helpers.arrayElement(['FLASH_SALE', 'MEGA_DEALS', 'SELLER_CAMPAIGN']) as any,
    description: faker.company.catchPhrase(),
    banner: `https://picsum.photos/seed/camp-${faker.string.numeric(6)}/800/400`,
    status: faker.helpers.arrayElement(['DRAFT', 'ACTIVE', 'ENDED']) as any,
    startsAt: faker.date.recent({ days: 10 }),
    endsAt: faker.date.soon({ days: 7 }),
    discount: faker.number.int({ min: 10, max: 60 }),
    maxProducts: faker.number.int({ min: 10, max: 100 }),
  }));
  await prisma.campaign.createMany({ data, skipDuplicates: true });
  console.log(`  campaigns: ${count} done.`);
}

async function seedCMSAndFAQ() {
  console.log('Seeding CMS pages + FAQs...');
  const cmsSlugs = ['about-us', 'terms-of-service', 'privacy-policy', 'return-policy', 'shipping-info', 'contact', 'careers', 'press'];
  for (const slug of cmsSlugs) {
    await prisma.cMSPage.create({
      data: {
        slug,
        title: slug.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' '),
        content: faker.lorem.paragraphs(5),
        metaTitle: slug + ' - AmarShop',
        metaDesc: faker.lorem.sentence(),
        isActive: true,
      },
    });
  }
  
  for (let i = 0; i < 30; i++) {
    await prisma.fAQ.create({
      data: {
        question: faker.lorem.sentence().replace(/\.$/, '?'),
        answer: faker.lorem.paragraphs(2),
        category: faker.helpers.arrayElement(['orders', 'payments', 'shipping', 'returns', 'account', 'products']),
        sortOrder: i,
        isActive: true,
      },
    });
  }
  console.log(`  CMS: ${cmsSlugs.length}, FAQs: 30 done.`);
}

async function seedBanners() {
  console.log('Seeding banners...');
  const data = Array.from({ length: 10 }, () => ({
    title: faker.commerce.productAdjective() + ' ' + faker.commerce.product(),
    image: `https://picsum.photos/seed/ban-${faker.string.numeric(6)}/1200/400`,
    link: '/category/electronics',
    position: faker.helpers.arrayElement(['HOME_TOP', 'HOME_MID', 'CATEGORY', 'SIDEBAR']) as any,
    sortOrder: faker.number.int({ min: 0, max: 10 }),
    isActive: true,
  }));
  await prisma.banner.createMany({ data, skipDuplicates: true });
  console.log('  banners: 10 done.');
}

async function seedNotifications(count: number) {
  console.log(`Seeding ${count} notifications...`);
  const users = await prisma.user.findMany({ select: { id: true }, take: 100 });
  if (!users.length) return;
  const data = Array.from({ length: count }, () => ({
    userId: users[Math.floor(Math.random() * users.length)].id,
    title: faker.lorem.sentence(6),
    body: faker.lorem.sentence(),
    type: faker.helpers.arrayElement(['ORDER_UPDATE', 'PROMOTION', 'SYSTEM', 'CHAT_MESSAGE', 'WALLET', 'FOLLOW', 'CAMPAIGN']) as any,
    read: faker.datatype.boolean({ probability: 0.6 }),
  }));
  await prisma.notification.createMany({ data, skipDuplicates: true });
  console.log(`  notifications: ${count} done.`);
}

async function seedWallets() {
  console.log('Seeding wallets for sellers...');
  const sellers = await prisma.user.findMany({ where: { role: 'SELLER' }, select: { id: true } });
  for (const s of sellers) {
    await prisma.wallet.create({
      data: {
        userId: s.id,
        balance: faker.number.float({ min: 0, max: 50000, fractionDigits: 2 }),
        totalEarned: faker.number.float({ min: 0, max: 200000, fractionDigits: 2 }),
        totalSpent: faker.number.float({ min: 0, max: 50000, fractionDigits: 2 }),
        bonusBalance: 0,
        cashbackBalance: faker.number.float({ min: 0, max: 5000, fractionDigits: 2 }),
      },
    });
  }
  console.log(`  wallets: ${sellers.length} done.`);
}

async function main() {
  const target = (process.env.SEED_TARGET as string) || 'showcase';
  const counts: Record<string, { categories: number; brands: number; products: number; sellers: number; customers: number; reviews: number; orders: number; shipments: number; coupons: number; campaigns: number; notifications: number }> = {
    showcase: { categories: 100, brands: 200, products: 10000, sellers: 500, customers: 25000, reviews: 150000, orders: 100000, shipments: 50000, coupons: 100, campaigns: 30, notifications: 5000 },
    lite:     { categories: 30, brands: 60, products: 1000, sellers: 20, customers: 500, reviews: 5000, orders: 1000, shipments: 500, coupons: 20, campaigns: 5, notifications: 200 },
  };
  const c = counts[target] || counts.showcase;
  console.log(`\n=== AmarShop Demo Seed: ${target} ===\n`);
  
  await reset();
  
  // Core entities
  await seedCategories(c.categories);
  await seedBrands(c.brands);
  
  // Sellers + stores
  await seedUsers(c.sellers, 'SELLER');
  // Create stores for sellers
  const sellers = await prisma.user.findMany({ where: { role: 'SELLER' }, include: { sellerProfile: true } });
  console.log(`Creating ${sellers.length} stores...`);
  let storeCount = 0;
  for (const s of sellers) {
    if (s.sellerProfile) {
      try {
        await prisma.store.create({
          data: {
            name: s.name + ' Store',
            slug: faker.helpers.slugify(s.name).toLowerCase() + '-' + faker.string.numeric(5),
            userId: s.id,
            sellerProfileId: s.sellerProfile.id,
            isActive: true,
          },
        });
        storeCount++;
      } catch { /* skip dups */ }
    }
  }
  console.log(`  stores: ${storeCount} created.`);
  
  // Products
  await seedProducts(c.products);
  
  // Customers
  await seedUsers(c.customers, 'CUSTOMER');
  
  // Reviews
  await seedReviews(c.reviews);
  
  // Orders
  await seedOrders(c.orders);
  
  // Shipments
  await seedShipments(c.shipments);
  
  // Marketing
  await seedCoupons(c.coupons);
  await seedCampaigns(c.campaigns);
  
  // Content
  await seedCMSAndFAQ();
  await seedBanners();
  
  // Engagement
  await seedNotifications(c.notifications);
  await seedWallets();
  
  // Summary
  const summary = {
    categories: await prisma.category.count(),
    brands: await prisma.brand.count(),
    products: await prisma.product.count(),
    users: await prisma.user.count(),
    stores: await prisma.store.count(),
    reviews: await prisma.review.count(),
    orders: await prisma.order.count(),
    shipments: await prisma.shipment.count(),
    coupons: await prisma.coupon.count(),
    campaigns: await prisma.campaign.count(),
    cmsPages: await prisma.cMSPage.count(),
    faqs: await prisma.fAQ.count(),
    banners: await prisma.banner.count(),
    notifications: await prisma.notification.count(),
    wallets: await prisma.wallet.count(),
  };
  console.log('\n=== Seed Summary ===');
  console.log(JSON.stringify(summary, null, 2));
  console.log('\n=== Demo seed complete ===');
  await prisma.$disconnect();
}

main().catch((e) => { console.error('Seed failed:', e.message); process.exit(1); });
