ALTER TYPE "UserRole" ADD VALUE 'SUPER_ADMIN';
UPDATE "User" SET role='SUPER_ADMIN', "isVerified"=true WHERE phone='01712345678';
INSERT INTO "User" (id, name, email, phone, password, role, "isVerified", "isSeller", "createdAt", "updatedAt")
SELECT gen_random_uuid()::text, 'ShopZone BD', 'seller@amarshop.com', '01798765432',
  (SELECT password FROM "User" WHERE phone='01712345678'), 'SELLER', true, true, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM "User" WHERE phone='01798765432');
INSERT INTO "User" (id, name, email, phone, password, role, "isVerified", "createdAt", "updatedAt")
SELECT gen_random_uuid()::text, 'Demo Customer', 'customer@amarshop.com', '01700000000',
  (SELECT password FROM "User" WHERE phone='01712345678'), 'CUSTOMER', true, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM "User" WHERE phone='01700000000');
