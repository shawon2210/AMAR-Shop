import { execSync } from 'child_process';

export default async function globalSetup() {
  process.env.NODE_ENV = 'test';
  process.env.DATABASE_URL = process.env.TEST_DATABASE_URL || 'postgresql://postgres:test@localhost:5432/amarshop_test';

  try {
    execSync('npx prisma migrate deploy', { stdio: 'inherit' });
    console.log('Test database migrations applied');
  } catch (error) {
    console.warn('Could not apply migrations, tests may fail:', error.message);
  }
}
