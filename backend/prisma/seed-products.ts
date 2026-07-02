import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const pool = new Pool({ user: 'postgres', password: 'shawon12', host: 'localhost', port: 5433, database: 'amarshop' });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const admin = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
  if (!admin) { console.error('No admin user found.'); process.exit(1); }

  let store = await prisma.store.findFirst({ where: { userId: admin.id } });
  if (!store) {
    store = await prisma.store.create({
      data: {
        name: 'AmarShop Official',
        slug: 'amarshop-official',
        description: 'Official AmarShop store',
        isOfficial: true, isActive: true, userId: admin.id,
      },
    });
    console.log('Created store:', store.id);
  } else {
    console.log('Using existing store:', store.id);
  }

  const cat = await prisma.category.findFirst();
  if (!cat) { console.error('No categories found.'); process.exit(1); }
  console.log('Using category:', cat.name);

  const existing = await prisma.product.count();
  console.log('Existing products:', existing);

  const products = [
    { name: 'iPhone 16 Pro Max', price: 159999, originalPrice: 169999, stockCount: 25, isNew: true, isFeatured: true, freeShipping: true, brandName: 'Apple' },
    { name: 'Samsung Galaxy S25 Ultra', price: 139999, originalPrice: 149999, stockCount: 30, isNew: true, isFeatured: true, freeShipping: true, brandName: 'Samsung' },
    { name: 'Xiaomi 14 Pro', price: 79999, originalPrice: 89999, stockCount: 40, brandName: 'Xiaomi' },
    { name: 'OnePlus 13', price: 89999, originalPrice: 94999, stockCount: 20, isNew: true, brandName: 'OnePlus' },
    { name: 'MacBook Air M4', price: 145000, originalPrice: 155000, stockCount: 15, isNew: true, isFeatured: true, freeShipping: true, brandName: 'Apple' },
    { name: 'Dell XPS 16', price: 189000, originalPrice: 199000, stockCount: 10, freeShipping: true, brandName: 'Dell' },
    { name: 'Sony WH-1000XM6', price: 35000, originalPrice: 39999, stockCount: 50, isNew: true, isFeatured: true, brandName: 'Sony' },
    { name: 'Apple AirPods Pro 3', price: 29999, originalPrice: 34999, stockCount: 60, isNew: true, brandName: 'Apple' },
    { name: 'Samsung Galaxy Watch 7', price: 45000, originalPrice: 49999, stockCount: 35, isNew: true, isFeatured: true, brandName: 'Samsung' },
    { name: 'Logitech MX Master 4', price: 12999, originalPrice: 14999, stockCount: 80, brandName: 'Logitech' },
    { name: 'Anker PowerCore 26800', price: 5999, originalPrice: 6999, stockCount: 100, brandName: 'Anker' },
    { name: 'JBL Flip 7', price: 15999, originalPrice: 17999, stockCount: 45, isNew: true, isFeatured: true, brandName: 'JBL' },
  ];

  for (const p of products) {
    const slug = p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    let brand = await prisma.brand.findFirst({ where: { name: p.brandName } });
    if (!brand) {
      brand = await prisma.brand.create({
        data: { name: p.brandName, slug: p.brandName.toLowerCase().replace(/\s+/g, '-') },
      });
    }

    await prisma.product.upsert({
      where: { slug },
      update: { stockCount: p.stockCount, price: p.price },
      create: {
        name: p.name, slug,
        description: `Original ${p.name} with official warranty.`,
        shortDescription: `Brand new ${p.name} — 100% authentic.`,
        price: p.price, originalPrice: p.originalPrice,
        images: [`https://picsum.photos/seed/${slug}/400/400`],
        categoryId: cat.id, storeId: store.id, brandId: brand.id,
        inStock: true, stockCount: p.stockCount,
        isNew: p.isNew ?? false, isFeatured: p.isFeatured ?? false,
        freeShipping: p.freeShipping ?? false, status: 'active',
      },
    });
    console.log('  Created:', p.name);
  }

  const count = await prisma.product.count();
  console.log('\nTotal products now:', count);
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
