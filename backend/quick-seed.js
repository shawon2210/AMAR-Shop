const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();
(async () => {
  await prisma.$connect();
  const hash = bcrypt.hashSync('password123', 12);
  const u = await prisma.user.upsert({
    where: { phone: '01712345678' },
    update: {},
    create: { name: 'Admin User', email: 'admin@amarshop.com', phone: '01712345678', password: hash, role: 'SUPER_ADMIN', isVerified: true }
  });
  console.log('Admin:', u.id, u.role);
  const s = await prisma.user.upsert({
    where: { phone: '01798765432' },
    update: {},
    create: { name: 'ShopZone BD', email: 'seller@amarshop.com', phone: '01798765432', password: hash, role: 'SELLER', isVerified: true }
  });
  console.log('Seller:', s.id, s.role);
  const c = await prisma.user.upsert({
    where: { phone: '01700000000' },
    update: {},
    create: { name: 'Demo Customer', email: 'customer@amarshop.com', phone: '01700000000', password: hash, role: 'CUSTOMER', isVerified: true }
  });
  console.log('Customer:', c.id, c.role);
  await prisma.$disconnect();
})();
