import { PrismaService } from './src/common/prisma.service';

async function main() {
  const svc = new PrismaService({ get: (k: string) => process.env[k] } as any);
  await svc.onModuleInit();
  
  const userCount = await svc.user.count();
  const productCount = await svc.product.count();
  const orderCount = await svc.order.count();
  const categoryCount = await svc.category.count();
  
  console.log('Prisma adapter OK');
  console.log(JSON.stringify({ userCount, productCount, orderCount, categoryCount }));
  
  const result = await svc.$queryRaw`SELECT COUNT(*)::int AS cnt FROM "User"`;
  console.log('Raw query OK:', JSON.stringify(result));
  
  // Use two real models for transaction test
  await svc.$transaction([
    svc.review.count(),
    svc.cartItem.count(),
  ]).then((rows: any[]) => console.log('Transaction OK:', JSON.stringify(rows)));
  
  await svc.onModuleDestroy();
  process.exit(0);
}

main().catch((e) => { console.error('FAIL:', e.message); process.exit(1); });
