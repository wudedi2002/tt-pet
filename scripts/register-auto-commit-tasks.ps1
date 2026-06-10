$ErrorActionPreference = "Stop"

$ScriptPath = Join-Path $PSScriptRoot "auto-commit-push.ps1"
$TaskPrefix = "Facemini-AutoCommitPush"
$Times = @(
    @{ Name = "1000"; Time = "10:00" },
    @{ Name = "1400"; Time = "14:00" },
    @{ Name = "1700"; Time = "17:00" }
)

$Action = "powershell.exe -NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File `"$ScriptPath`""

foreach ($entry in $Times) {
    $taskName = "$TaskPrefix-$($entry.Name)"
    $null = schtasks /Delete /TN $taskName /F 2>&1
    schtasks /Create `
        /TN $taskName `
        /TR $Action `
        /SC DAILY `
        /ST $entry.Time `
        /F
    Write-Host "Registered: $taskName at $($entry.Time) daily"
}

Write-Host ""
Write-Host "Tasks registered. View in Task Scheduler or run:"
Write-Host "  schtasks /Query /TN $TaskPrefix-1000 /V /FO LIST"
