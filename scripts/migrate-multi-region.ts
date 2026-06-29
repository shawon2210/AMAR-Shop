import { PrismaClient } from '@prisma/client';

interface RegionConfig {
  name: string;
  databaseUrl: string;
  apiUrl: string;
}

const regions: RegionConfig[] = [
  { name: 'us-east-1', databaseUrl: process.env.DB_US_EAST || '', apiUrl: 'https://us-api.amarshop.com' },
  { name: 'ap-southeast-1', databaseUrl: process.env.DB_AP_SOUTHEAST_1 || '', apiUrl: 'https://sg-api.amarshop.com' },
  { name: 'ap-south-1', databaseUrl: process.env.DB_AP_SOUTH_1 || '', apiUrl: 'https://in-api.amarshop.com' },
];

async function getClient(databaseUrl: string): Promise<PrismaClient> {
  const client = new PrismaClient({
    datasources: { db: { url: databaseUrl } },
  });
  await client.$connect();
  return client;
}

async function migrateProducts(sourceUrl: string, targetUrl: string, region: string) {
  console.log(`Migrating products to ${region}...`);
  const source = await getClient(sourceUrl);
  const target = await getClient(targetUrl);

  const batchSize = 1000;
  let cursor: string | null = null;
  let total = 0;

  try {
    while (true) {
      const products = await source.product.findMany({
        take: batchSize,
        ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
        orderBy: { id: 'asc' },
      });

      if (products.length === 0) break;

      for (const product of products) {
        await target.product.upsert({
          where: { id: product.id },
          create: product,
          update: product,
        });
      }

      cursor = products[products.length - 1].id;
      total += products.length;
      console.log(`  Migrated ${total} products...`);
    }
  } finally {
    await source.$disconnect();
    await target.$disconnect();
  }

  console.log(`  Completed: ${total} products migrated to ${region}`);
}

async function migrateUsers(sourceUrl: string, targetUrl: string, region: string) {
  console.log(`Migrating users to ${region}...`);
  const source = await getClient(sourceUrl);
  const target = await getClient(targetUrl);

  const batchSize = 2000;
  let cursor: string | null = null;
  let total = 0;

  try {
    while (true) {
      const users = await source.user.findMany({
        take: batchSize,
        ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
        orderBy: { id: 'asc' },
        select: { id: true, name: true, email: true, phone: true, role: true, isSeller: true, isActive: true, createdAt: true },
      });

      if (users.length === 0) break;

      await target.user.createMany({
        data: users,
        skipDuplicates: true,
      });

      cursor = users[users.length - 1].id;
      total += users.length;
      if (total % 10000 === 0) console.log(`  Migrated ${total} users...`);
    }
  } finally {
    await source.$disconnect();
    await target.$disconnect();
  }

  console.log(`  Completed: ${total} users migrated to ${region}`);
}

async function syncOrders(sourceUrl: string, targetUrl: string, region: string) {
  console.log(`Syncing recent orders to ${region}...`);
  const source = await getClient(sourceUrl);
  const target = await getClient(targetUrl);

  try {
    const recentOrders = await source.order.findMany({
      where: { createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } },
      take: 10000,
      include: { items: true },
    });

    for (const order of recentOrders) {
      const { items, ...orderData } = order;
      await target.order.upsert({
        where: { id: order.id },
        create: orderData,
        update: orderData,
      });

      for (const item of items) {
        await target.orderItem.upsert({
          where: { id: item.id },
          create: item,
          update: item,
        });
      }
    }

    console.log(`  Synced ${recentOrders.length} recent orders to ${region}`);
  } finally {
    await source.$disconnect();
    await target.$disconnect();
  }
}

async function migrateAll() {
  console.log('='.repeat(60));
  console.log('AmarShop Multi-Region Migration');
  console.log('='.repeat(60));

  const sourceUrl = process.env.SOURCE_DATABASE_URL || process.env.DATABASE_URL || '';

  if (!sourceUrl) {
    console.error('SOURCE_DATABASE_URL or DATABASE_URL must be set');
    process.exit(1);
  }

  for (const region of regions) {
    if (!region.databaseUrl) {
      console.log(`Skipping ${region.name} - no database URL configured`);
      continue;
    }

    console.log(`\n--- Migrating to ${region.name} (${region.apiUrl}) ---\n`);

    await migrateProducts(sourceUrl, region.databaseUrl, region.name);
    await migrateUsers(sourceUrl, region.databaseUrl, region.name);
    await syncOrders(sourceUrl, region.databaseUrl, region.name);
  }

  console.log('\n' + '='.repeat(60));
  console.log('Multi-region migration complete!');
  console.log('='.repeat(60));
}

migrateAll().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
