import { defineConfig } from '@prisma/config';

export default defineConfig({
  datasource: {
    url: process.env.DATABASE_URL || 'postgresql://postgres:shawon12@localhost:5433/amarshop?schema=public',
  },
});
