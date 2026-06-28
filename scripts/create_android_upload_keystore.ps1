param(
  [string]$KeystorePath,
  [string]$Alias = "pip-picture-pantry-upload"
)

$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent $PSScriptRoot
if ([string]::IsNullOrWhiteSpace($KeystorePath)) {
  $defaultDir = Join-Path (Split-Path -Parent $repoRoot) "_android_keystores"
  $KeystorePath = Join-Path $defaultDir "pip-picture-pantry-upload.jks"
}

$env:JAVA_HOME = "D:\Program Files\Android\Android Studio\jbr"
$keytool = Join-Path $env:JAVA_HOME "bin\keytool.exe"

if (-not (Test-Path -LiteralPath $keytool)) {
  throw "keytool.exe was not found at $keytool"
}

if (Test-Path -LiteralPath $KeystorePath) {
  throw "Keystore already exists: $KeystorePath"
}

$keystoreDir = Split-Path -Parent $KeystorePath
if (-not (Test-Path -LiteralPath $keystoreDir)) {
  New-Item -ItemType Directory -Path $keystoreDir | Out-Null
}

Write-Host "Creating Android upload keystore outside the repo:"
Write-Host "  $KeystorePath"
Write-Host ""
Write-Host "keytool will ask for passwords. Keep them in your password manager; do not commit them."
Write-Host ""

& $keytool -genkeypair -v `
  -keystore $KeystorePath `
  -alias $Alias `
  -keyalg RSA `
  -keysize 2048 `
  -validity 10000 `
  -dname "CN=Sunny Spoon Studios, OU=Sunny Spoon Studios, O=Sunny Spoon Studios, L=Seoul, ST=Seoul, C=KR"

Write-Host ""
Write-Host "Keystore created. For a signed release in this PowerShell session, set:"
Write-Host "`$env:PPP_UPLOAD_STORE_FILE='$KeystorePath'"
Write-Host "`$env:PPP_UPLOAD_KEY_ALIAS='$Alias'"
Write-Host "`$env:PPP_UPLOAD_STORE_PASSWORD='<store password>'"
Write-Host "`$env:PPP_UPLOAD_KEY_PASSWORD='<key password>'"
Write-Host ""
Write-Host "Then run: scripts\build_android_signed_release_bundle.ps1"