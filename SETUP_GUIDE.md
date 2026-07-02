# AmarShop - Complete Setup Guide

This guide will help you set up and run the AmarShop e-commerce platform with backend, frontend, and database.

## Prerequisites

- Node.js 20+ installed
- PostgreSQL 15+ (or Docker Desktop)
- npm or pnpm package manager

## Quick Start

### Option 1: Using Docker (Recommended)

1. **Start Docker Desktop** on your machine

2. **Start all services with Docker Compose:**
   ```bash
   docker-compose up -d
   ```
   This will start:
   - PostgreSQL database on port 5433
   - Redis cache on port 6379
   - Backend API on port 4000
   - Frontend on port 3000

3. **Run database migrations:**
   ```bash
   cd backend
   npx prisma migrate deploy
   npx prisma db seed
   ```

### Option 2: Manual Setup (Without Docker)

#### Step 1: Install PostgreSQL

Download and install PostgreSQL 15 from [postgresql.org](https://www.postgresql.org/download/)

During installation:
- Set password: `shawon12`
- Port: `5433`

#### Step 2: Install Redis (Optional but recommended)

Download Redis for Windows from [GitHub](https://github.com/microsoftarchive/redis/releases)

Or skip Redis - the app will work with in-memory caching.

#### Step 3: Create Database

Open pgAdmin or use psql:
```sql
CREATE DATABASE amarshop;
```

#### Step 4: Setup Backend

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Copy environment variables
copy .env.example .env  # or manually create .env

# Run migrations
npx prisma migrate deploy

# Seed database (creates admin user)
npm run seed
```

#### Step 5: Start Backend

```bash
cd backend
npm run start:dev
```

Backend will be available at: http://localhost:4000/api/v1

#### Step 6: Setup Frontend

```bash
# In root directory (not backend)
npm install
```

#### Step 7: Start Frontend

```bash
npm run dev
```

Frontend will be available at: http://localhost:3000

---

## Authentication & User Roles

### Default Credentials (After Seeding)

After running `npm run seed` in the backend, the following users are created:

| Role | Phone | Password |
|------|-------|----------|
| **Admin** | `01712345678` | `admin123` |
| **Seller** | `01711111111` | `seller123` |
| **Customer** | `01700000000` | `customer123` |

### User Roles

The application supports the following user roles:

1. **CUSTOMER** - Regular users who can browse, buy, and review products
2. **SELLER** - Users who can create stores and sell products
3. **ADMIN** - Administrators who can manage the entire platform
4. **LOGISTICS** - Users who manage shipping and delivery
5. **MODERATOR** - Users who moderate content and handle disputes

### Authentication Flow

#### User Registration
1. Go to `/auth/register`
2. Enter name, phone number, and password
3. User is automatically logged in after registration

#### User Login
1. Go to `/auth/login`
2. Enter phone number and password
3. JWT token is stored in localStorage

#### Admin Login
1. Go to `/admin/login`
2. Enter admin credentials
3. System verifies user has ADMIN role
4. Non-admin users are redirected back to login

### Protected Routes

#### Customer Routes
- `/checkout` - Requires authentication
- `/orders` - Requires authentication
- `/account` - Requires authentication

#### Admin Routes
- `/admin/*` - All admin routes require ADMIN role
- `/admin/users` - View all users
- `/admin/products` - Manage products
- `/admin/orders` - View all orders
- `/admin/settings` - Platform settings

#### Seller Routes
- `/seller/*` - Seller dashboard and tools
- `/seller/products` - Manage store products
- `/seller/orders` - View store orders
- `/seller/ai/*` - AI-powered tools

---

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - User login
- `GET /api/v1/auth/profile` - Get user profile (requires auth)

### Products
- `GET /api/v1/products` - List all products
- `GET /api/v1/products/:id` - Get product details
- `GET /api/v1/category/:slug` - Get category products

### Orders
- `GET /api/v1/orders` - Get user orders (requires auth)
- `POST /api/v1/orders` - Create new order (requires auth)

### Cart
- `GET /api/v1/cart` - Get cart items (requires auth)
- `POST /api/v1/cart` - Add to cart (requires auth)
- `DELETE /api/v1/cart/:id` - Remove from cart (requires auth)

---

## Troubleshooting

### Database Connection Error

If you see "database connection error":
1. Ensure PostgreSQL is running
2. Check DATABASE_URL in `backend/.env`
3. Verify database `amarshop` exists

### Port Already in Use

If ports are already in use:
- Port 3000: Frontend - change in `package.json` dev script
- Port 4000: Backend - change PORT in `backend/.env`
- Port 5433: PostgreSQL - change during installation
- Port 6379: Redis - change in docker-compose.yml

### TypeScript Errors

Run `npm run typecheck` in the root directory to check for TypeScript errors.

### Build Errors

Clear the `.next` folder and rebuild:
```bash
rm -rf .next
npm run build
```

---

## Testing Authentication

### Test User Registration via API

```bash
curl -X POST http://localhost:4000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","phone":"+8801711000002","password":"test123"}'
```

### Test User Login via API

```bash
curl -X POST http://localhost:4000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"phone":"+8801711000002","password":"test123"}'
```

### Test Protected Route

```bash
curl http://localhost:4000/api/v1/auth/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## Production Deployment

For production deployment, update the following:

1. **Environment Variables:**
   - Set strong `JWT_SECRET`
   - Use production database URL
   - Set `NODE_ENV=production`

2. **Database:**
   - Use a managed PostgreSQL service (AWS RDS, Supabase, etc.)
   - Enable SSL for database connections

3. **Frontend:**
   - Build with `npm run build`
   - Deploy to Vercel, Netlify, or your own server

4. **Backend:**
   - Build with `npm run build`
   - Deploy to AWS, Google Cloud, or your own server
   - Use PM2 or Docker for process management

---

## Support

For issues and questions:
- Check the existing documentation in `backend/README.md`
- Review the Prisma schema in `backend/prisma/schema.prisma`
- Check API routes in `backend/src/modules/`