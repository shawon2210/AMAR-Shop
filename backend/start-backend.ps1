Set-Location -LiteralPath "C:\Users\Shawon\amarshop\backend"
$env:NODE_ENV='development'
$env:DATABASE_URL='postgresql://postgres:postgres@localhost:5432/amarshop?schema=public'
$env:JWT_SECRET='your-super-secret-key-change-in-production'
$env:JWT_REFRESH_SECRET='your-refresh-secret-key-change-in-production'
node dist/src/main.js
