import { defineConfig } from '@prisma/config';

export default defineConfig({
  datasource: {
    // DATABASE_URL must be set via environment variable — no fallback with real password
    url: process.env.DATABASE_URL || `postgresql://postgres:${process.env.DB_PASSWORD || 'your_db_password'}@localhost:5433/amarshop?schema=public`,
  },
});
