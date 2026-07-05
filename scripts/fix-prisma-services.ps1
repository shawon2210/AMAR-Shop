# Fix PrismaService usage in all services
# Now that PrismaService extends PrismaClient, we don't need the .client property

$files = @(
    "backend/src/common/health.controller.ts",
    "backend/src/modules/addresses/addresses.service.ts",
    "backend/src/modules/affiliate/affiliate.service.ts",
    "backend/src/modules/ai/recommendation.service.ts",
    "backend/src/modules/auth/auth.service.ts",
    "backend/src/modules/bi/bi.service.ts",
    "backend/src/modules/cart/cart.service.ts",
    "backend/src/modules/categories/categories.service.ts",
    "backend/src/modules/cms/cms.service.ts",
    "backend/src/modules/finance/finance.service.ts",
    "backend/src/modules/logistics/logistics.service.ts",
    "backend/src/modules/orders/orders.service.ts"
)

foreach ($file in $files) {
    if (Test-Path $file) {
        $content = Get-Content $file -Raw
        
        # Remove the line: this.prisma = this.prismaService.client;
        $content = $content -replace "^\s*this\.prisma = this\.prismaService\.client;\s*$", "", "Multiline"
        
        # Remove the private prisma property declaration if it exists
        $content = $content -replace "^\s*private prisma: any;\s*$", "", "Multiline"
        
        # Replace this.prisma. with this.prismaService.
        $content = $content -replace "this\.prisma\.", "this.prismaService."
        
        Set-Content -Path $file -Value $content -NoNewline
        Write-Host "Fixed: $file"
    } else {
        Write-Host "Not found: $file"
    }
}

Write-Host "Done!"