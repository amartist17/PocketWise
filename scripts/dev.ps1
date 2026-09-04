$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path -Parent $PSScriptRoot

Write-Host 'Starting the API in the background...' -ForegroundColor Yellow
$apiJob = Start-Job -Name 'PocketWise API' -ScriptBlock {
  Set-Location -LiteralPath $using:projectRoot
  npm.cmd --prefix backend run dev
}

try {
  Write-Host 'Starting Expo in the foreground. The QR code will appear below.' -ForegroundColor Cyan
  Set-Location -LiteralPath $projectRoot
  npm.cmd run dev:mobile -- --go --lan
}
finally {
  Write-Host 'Stopping the API...' -ForegroundColor Yellow
  Stop-Job -Job $apiJob -ErrorAction SilentlyContinue
  Remove-Job -Job $apiJob -Force -ErrorAction SilentlyContinue
}
