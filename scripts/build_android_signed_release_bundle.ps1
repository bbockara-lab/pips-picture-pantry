$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent $PSScriptRoot
$env:JAVA_HOME = "D:\Program Files\Android\Android Studio\jbr"
$env:ANDROID_HOME = "C:\Users\bbock\AppData\Local\Android\Sdk"
$env:ANDROID_SDK_ROOT = "C:\Users\bbock\AppData\Local\Android\Sdk"

$requiredEnv = @(
  "PPP_UPLOAD_STORE_FILE",
  "PPP_UPLOAD_STORE_PASSWORD",
  "PPP_UPLOAD_KEY_ALIAS",
  "PPP_UPLOAD_KEY_PASSWORD"
)

$missing = $requiredEnv | Where-Object { [string]::IsNullOrWhiteSpace([Environment]::GetEnvironmentVariable($_)) }
if ($missing.Count -gt 0) {
  throw "Missing Android signing environment variables: $($missing -join ', '). See docs\ANDROID_SIGNING_SETUP.md."
}

$keystorePath = [Environment]::GetEnvironmentVariable("PPP_UPLOAD_STORE_FILE")
if (-not (Test-Path -LiteralPath $keystorePath)) {
  throw "PPP_UPLOAD_STORE_FILE does not exist: $keystorePath"
}

$jarsigner = Join-Path $env:JAVA_HOME "bin\jarsigner.exe"
if (-not (Test-Path -LiteralPath $jarsigner)) {
  throw "jarsigner.exe was not found at $jarsigner"
}

Push-Location $repoRoot
try {
  npm run build
  npx cap sync android

  Push-Location "$repoRoot\android"
  try {
    .\gradlew.bat bundleRelease
  } finally {
    Pop-Location
  }

  $aabPath = Join-Path $repoRoot "android\app\build\outputs\bundle\release\app-release.aab"
  if (-not (Test-Path -LiteralPath $aabPath)) {
    throw "Release AAB was not produced: $aabPath"
  }

  $verifyOutput = & $jarsigner -verify -verbose -certs $aabPath 2>&1
  $verifyText = $verifyOutput -join [Environment]::NewLine
  Write-Host $verifyText

  if ($LASTEXITCODE -ne 0 -or $verifyText -match "jar is unsigned") {
    throw "Signed release verification failed."
  }

  Write-Host "Signed release AAB ready: $aabPath"
} finally {
  Pop-Location
}