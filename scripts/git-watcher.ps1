$watchDir = "C:\Users\Shawon\amarshop"
$logFile = "$watchDir\scripts\git-watcher.log"
$cooldown = 0

while ($true) {
    try {
        Push-Location $watchDir
        $status = git status --porcelain
        if ($status -and (Get-Date).Ticks -gt $cooldown) {
            $time = Get-Date -Format 'yyyy-MM-dd HH:mm:ss'
            Add-Content -Path $logFile -Value "[$time] Changes detected, committing..."
            git add -A
            git commit -m "auto: $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
            git push 2>&1 | Add-Content -Path $logFile
            Add-Content -Path $logFile -Value "[$time] Pushed successfully"
            $cooldown = (Get-Date).AddSeconds(30).Ticks
        }
        Pop-Location
    } catch {
        $errTime = Get-Date -Format 'HH:mm:ss'
        Add-Content -Path $logFile -Value "[$errTime ERROR] $_"
    }
    Start-Sleep -Seconds 10
}