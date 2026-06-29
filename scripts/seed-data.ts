import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

const categories = [
  { name: 'Electronics', slug: 'electronics', icon: 'devices' },
  { name: 'Fashion', slug: 'fashion', icon: 'checkroom' },
  { name: 'Home & Living', slug: 'home-living', icon: 'home' },
  { name: 'Beauty & Health', slug: 'beauty-health', icon: 'spa' },
  { name: 'Sports & Outdoors', slug: 'sports-outdoors', icon: 'sports_soccer' },
  { name: 'Books & Media', slug: 'books-media', icon: 'menu_book' },
  { name: ' Toys & Games', slug: 'toys-games', icon: 'toys' },
  { name: 'Automotive', slug: 'automotive', icon: 'directions_car' },
  { name: 'Groceries', slug: 'groceries', icon: 'shopping_cart' },
  { name: 'Mobile & Tablets', slug: 'mobile-tablets', icon: 'smartphone' },
];

const productTemplates = [
  { name: 'Smartphone', minPrice: 5000, maxPrice: 150000 },
  { name: 'Laptop', minPrice: 30000, maxPrice: 200000 },
  { name: 'T-Shirt', minPrice: 200, maxPrice: 2000 },
  { name: 'Shoes', minPrice: 500, maxPrice: 15000 },
  { name: 'Watch', minPrice: 300, maxPrice: 50000 },
  { name: 'Headphones', minPrice: 300, maxPrice: 30000 },
  { name: 'Bag', minPrice: 300, maxPrice: 8000 },
  { name: 'Book', minPrice: 100, maxPrice: 2000 },
  { name: 'Sunglasses', minPrice: 200, maxPrice: 10000 },
  { name: 'Perfume', minPrice: 200, maxPrice: 5000 },
];

function randomPrice(min: number, max: number): number {
  return Math.round((Math.random() * (max - min) + min) / 10) * 10;
}

function randomName(base: string, index: number): string {
  const brands = ['Premium', 'Elite', 'Pro', 'Ultra', 'Classic', 'Modern', 'Luxury', 'Basic', 'Smart', 'Eco'];
  return `${brands[index % brands.length]} ${base} ${uuidv4().slice(0, 4).toUpperCase()}`;
}

async function seed() {
  console.log('Starting seed...');

  const catRecords: string[] = [];
  for (const cat of categories) {
    const created = await prisma.category.create({
      data: { name: cat.name, slug: cat.slug, icon: cat.icon },
    });
    catRecords.push(created.id);
    console.log(`  Created category: ${cat.name}`);
  }

  const sellerIds: string[] = [];
  for (let i = 0; i < 10000; i++) {
    const user = await prisma.user.create({
      data: {
        name: `Seller ${i + 1}`,
        phone: `017${String(10000000 + i).padStart(8, '0')}`,
        password: '$2b$12$seededhashplaceholder',
        role: 'SELLER',
        isSeller: true,
      },
    });

    const store = await prisma.store.create({
      data: {
        name: `Store ${i + 1}`,
        slug: `store-${i + 1}`,
        userId: user.id,
        commission: 5,
      },
    });

    sellerIds.push(store.id);
    if ((i + 1) % 1000 === 0) console.log(`  Created ${i + 1} sellers...`);
  }
  console.log(`  Created ${sellerIds.length} sellers`);

  for (let i = 0; i < 100000; i++) {
    const tmpl = productTemplates[i % productTemplates.length];
    const price = randomPrice(tmpl.minPrice, tmpl.maxPrice);
    const sellerId = sellerIds[Math.floor(Math.random() * sellerIds.length)];
    const categoryId = catRecords[Math.floor(Math.random() * catRecords.length)];

    await prisma.product.create({
      data: {
        name: randomName(tmpl.name, i),
        slug: `product-${uuidv4().slice(0, 8)}`,
        price,
        originalPrice: price + randomPrice(50, price * 0.3),
        images: [`https://picsum.photos/seed/${i}/400/400`],
        categoryId,
        storeId: sellerId,
        stockCount: Math.floor(Math.random() * 500) + 1,
        soldCount: Math.floor(Math.random() * 1000),
        rating: Math.round((Math.random() * 3 + 2) * 10) / 10,
        reviewCount: Math.floor(Math.random() * 200),
        status: 'active',
      },
    });

    if ((i + 1) % 10000 === 0) console.log(`  Created ${i + 1} products...`);
  }
  console.log('  Created 100,000 products');

  for (let i = 0; i < 1000000; i++) {
    await prisma.user.create({
      data: {
        name: `User ${i + 1}`,
        phone: `018${String(10000000 + i).padStart(8, '0')}`,
        password: '$2b$12$seededhashplaceholder',
        role: 'CUSTOMER',
      },
    });

    if ((i + 1) % 100000 === 0) console.log(`  Created ${i + 1} users...`);
  }
  console.log('  Created 1,000,000 users');

  console.log('Seed complete!');
}

seed()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
