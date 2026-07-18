import { execSync } from 'child_process';

export default async function globalSetup() {
  process.env.NODE_ENV = 'test';
  process.env.DATABASE_URL = process.env.TEST_DATABASE_URL || process.env.DATABASE_URL;
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL (or TEST_DATABASE_URL) must be set for tests');
  }

  try {
    execSync('npx prisma migrate deploy', { stdio: 'inherit' });
    console.log('Test database migrations applied');
  } catch (error) {
    console.warn('Could not apply migrations, tests may fail:', (error as Error).message);
  }
}
