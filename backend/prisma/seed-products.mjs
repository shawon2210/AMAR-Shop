import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const [admin] = await Promise.all([
    prisma.user.findFirst({ where: { role: 'ADMIN' } }),
  ]);

  if (!admin) {
    console.error('No admin user found. Run the main seed first.');
    process.exit(1);
  }

  let store = await prisma.store.findFirst({ where: { userId: admin.id } });
  if (!store) {
    store = await prisma.store.create({
      data: {
        name: 'AmarShop Official',
        slug: 'amarshop-official',
        description: 'Official AmarShop store with genuine products',
        isOfficial: true,
        isActive: true,
        userId: admin.id,
      },
    });
    console.log('Created store:', store.id);
  } else {
    console.log('Using existing store:', store.id);
  }

  const cat = await prisma.category.findFirst();
  if (!cat) {
    console.error('No categories found. Run the main seed first.');
    process.exit(1);
  }
  console.log('Using category:', cat.id, cat.name);

  const existing = await prisma.product.count();
  console.log('Existing products:', existing);

  const products = [
    { name: 'iPhone 16 Pro Max', price: 159999, originalPrice: 169999, images: ['https://picsum.photos/seed/iphone16/400/400'], inStock: true, stockCount: 25, isNew: true, isFeatured: true, freeShipping: true, brandName: 'Apple' },
    { name: 'Samsung Galaxy S25 Ultra', price: 139999, originalPrice: 149999, images: ['https://picsum.photos/seed/s25ultra/400/400'], inStock: true, stockCount: 30, isNew: true, isFeatured: true, freeShipping: true, brandName: 'Samsung' },
    { name: 'Xiaomi 14 Pro', price: 79999, originalPrice: 89999, images: ['https://picsum.photos/seed/xiaomi14/400/400'], inStock: true, stockCount: 40, isNew: false, isFeatured: true, brandName: 'Xiaomi' },
    { name: 'OnePlus 13', price: 89999, originalPrice: 94999, images: ['https://picsum.photos/seed/oneplus13/400/400'], inStock: true, stockCount: 20, isNew: true, isFeatured: false, brandName: 'OnePlus' },
    { name: 'MacBook Air M4', price: 145000, originalPrice: 155000, images: ['https://picsum.photos/seed/macbookair/400/400'], inStock: true, stockCount: 15, isNew: true, isFeatured: true, freeShipping: true, brandName: 'Apple' },
    { name: 'Dell XPS 16', price: 189000, originalPrice: 199000, images: ['https://picsum.photos/seed/dellxps/400/400'], inStock: true, stockCount: 10, isNew: false, isFeatured: false, freeShipping: true, brandName: 'Dell' },
    { name: 'Sony WH-1000XM6', price: 35000, originalPrice: 39999, images: ['https://picsum.photos/seed/sonyxm6/400/400'], inStock: true, stockCount: 50, isNew: true, isFeatured: true, brandName: 'Sony' },
    { name: 'Apple AirPods Pro 3', price: 29999, originalPrice: 34999, images: ['https://picsum.photos/seed/airpods3/400/400'], inStock: true, stockCount: 60, isNew: true, isFeatured: false, brandName: 'Apple' },
    { name: 'Samsung Galaxy Watch 7', price: 45000, originalPrice: 49999, images: ['https://picsum.photos/seed/galaxywatch/400/400'], inStock: true, stockCount: 35, isNew: true, isFeatured: true, brandName: 'Samsung' },
    { name: 'Logitech MX Master 4', price: 12999, originalPrice: 14999, images: ['https://picsum.photos/seed/mxmaster/400/400'], inStock: true, stockCount: 80, isNew: false, isFeatured: false, brandName: 'Logitech' },
    { name: 'Anker PowerCore 26800', price: 5999, originalPrice: 6999, images: ['https://picsum.photos/seed/anker/400/400'], inStock: true, stockCount: 100, isNew: false, isFeatured: false, brandName: 'Anker' },
    { name: 'JBL Flip 7', price: 15999, originalPrice: 17999, images: ['https://picsum.photos/seed/jblflip/400/400'], inStock: true, stockCount: 45, isNew: true, isFeatured: true, brandName: 'JBL' },
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
        name: p.name,
        slug,
        description: `Original ${p.name} with warranty. Experience the best in class performance and design.`,
        shortDescription: `Brand new ${p.name} — 100% authentic with official warranty.`,
        price: p.price,
        originalPrice: p.originalPrice,
        images: p.images,
        categoryId: cat.id,
        storeId: store.id,
        brandId: brand.id,
        inStock: p.inStock,
        stockCount: p.stockCount,
        isNew: p.isNew,
        isFeatured: p.isFeatured,
        freeShipping: p.freeShipping ?? false,
        status: 'active',
      },
    });
    console.log('  Created:', p.name);
  }

  const count = await prisma.product.count();
  console.log('\nTotal products now:', count);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
