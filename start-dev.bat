@echo off
echo ========================================
echo   AmarShop Development Setup Script
echo ========================================
echo.

echo [1/5] Starting PostgreSQL and Redis...
echo       Please ensure Docker Desktop is running!
docker-compose up -d postgres redis
if errorlevel 1 (
    echo.
    echo WARNING: Docker may not be running. Please start Docker Desktop and try again.
    echo Or install PostgreSQL manually on port 5433.
    echo.
)

echo [2/5] Waiting for database to be ready...
timeout /t 10 /nobreak >nul

echo [3/5] Installing backend dependencies...
cd backend
call npm install
if errorlevel 1 (
    echo ERROR: Failed to install backend dependencies
    pause
    exit /b 1
)

echo [4/5] Running database migrations...
call npx prisma migrate deploy
if errorlevel 1 (
    echo ERROR: Failed to run migrations. Make sure PostgreSQL is running.
    pause
    exit /b 1
)

echo [5/5] Seeding database with demo data...
call npm run seed
if errorlevel 1 (
    echo ERROR: Failed to seed database
    pause
    exit /b 1
    
)

cd ..

echo.
echo ========================================
echo   Setup Complete!
echo ========================================
echo.
echo Default Credentials:
echo   Admin:    01712345678 / admin123
echo   Seller:   01711111111 / seller123
echo   Customer: 01700000000 / customer123
echo.
echo Starting servers...
echo.

echo [Backend] Starting on http://localhost:4000
start cmd /k "cd backend && npm run start:dev"

timeout /t 3 /nobreak >nul

echo [Frontend] Starting on http://localhost:3000
start cmd /k "npm run dev"

echo.
echo Servers are starting in new windows...
echo Press any key to exit this window.
pause >nul