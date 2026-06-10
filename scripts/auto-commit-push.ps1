$ErrorActionPreference = "Stop"

$ProjectRoot = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$LogDir = Join-Path $ProjectRoot "logs"
$LogFile = Join-Path $LogDir "auto-commit-push.log"

function Write-Log {
    param([string]$Message)
    $line = "[{0}] {1}" -f (Get-Date -Format "yyyy-MM-dd HH:mm:ss"), $Message
    if (-not (Test-Path $LogDir)) {
        New-Item -ItemType Directory -Path $LogDir -Force | Out-Null
    }
    Add-Content -Path $LogFile -Value $line -Encoding UTF8
}

try {
    Set-Location $ProjectRoot
    Write-Log "Started in $ProjectRoot"

    $status = git status --porcelain
    if (-not $status) {
        Write-Log "No changes. Skipped."
        exit 0
    }

    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm"
    $gitArgs = @(
        "-C", $ProjectRoot,
        "-c", "user.name=tutu",
        "-c", "user.email=tutu@local",
        "-c", "http.proxy=http://127.0.0.1:7897",
        "-c", "https.proxy=http://127.0.0.1:7897"
    )

    & git @gitArgs add -A
    & git @gitArgs commit -m "Auto commit: $timestamp"
    & git @gitArgs push origin main

    Write-Log "Committed and pushed successfully."
    exit 0
}
catch {
    Write-Log "Failed: $($_.Exception.Message)"
    exit 1
}
