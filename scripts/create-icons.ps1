
$sizes = @(192, 512)

foreach ($size in $sizes) {
    $rx = [Math]::Round($size * 0.167)
    $fontSize = [Math]::Round($size * 0.52)
    $y = [Math]::Round($size * 0.68)
    $half = [Math]::Round($size * 0.5)
    
    $svg = '<svg xmlns="http://www.w3.org/2000/svg" width="' + $size + '" height="' + $size + '" viewBox="0 0 ' + $size + ' ' + $size + '">'
    $svg += '<rect width="' + $size + '" height="' + $size + '" rx="' + $rx + '" fill="#a63600"/>'
    $svg += '<text x="' + $half + '" y="' + $y + '" font-family="Arial,sans-serif" font-size="' + $fontSize + '" font-weight="bold" fill="white" text-anchor="middle">A</text></svg>'
    
    Set-Content -Path "public\images\icon-${size}.png" -Value $svg -NoNewline
    Write-Output "Created public\images\icon-${size}.png ($($svg.Length) bytes)"
}