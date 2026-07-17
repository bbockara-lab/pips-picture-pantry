$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent $PSScriptRoot
$aabPath = Join-Path $repoRoot "android\app\build\outputs\bundle\release\app-release.aab"

function Invoke-Step {
  param(
    [Parameter(Mandatory = $true)][string]$Name,
    [Parameter(Mandatory = $true)][scriptblock]$Command
  )

  Write-Host ""
  Write-Host "== $Name =="
  & $Command
}

function Invoke-NativeCommand {
  param(
    [Parameter(Mandatory = $true)][string]$File,
    [string[]]$Arguments = @()
  )

  & $File @Arguments
  if ($LASTEXITCODE -ne 0) {
    throw "$File $($Arguments -join ' ') failed with exit code $LASTEXITCODE"
  }
}

Push-Location $repoRoot
try {
  Invoke-Step "web release candidate QA" {
    Invoke-NativeCommand "npm" @("run", "qa:candidate")
  }

  Invoke-Step "Capacitor sync" {
    Invoke-NativeCommand "npm" @("run", "cap:sync")
  }

  Invoke-Step "Android release bundle" {
    & (Join-Path $PSScriptRoot "build_android_release_bundle.ps1")
  }

  Invoke-Step "AAB output check" {
    if (-not (Test-Path -LiteralPath $aabPath)) {
      throw "Release AAB was not produced: $aabPath"
    }

    $aab = Get-Item -LiteralPath $aabPath
    if ($aab.Length -lt 1000000) {
      throw "Release AAB is unexpectedly small: $($aab.Length) bytes"
    }

    Write-Host "Android candidate AAB ready: $aabPath"
    Write-Host "Android candidate AAB size bytes: $($aab.Length)"
  }

  Write-Host ""
  Write-Host "Android candidate check passed."
  Write-Host "Before the signed Play upload, bump android/app/build.gradle versionCode/versionName."
  Write-Host "Then run scripts/build_android_signed_release_bundle.ps1; it reruns qa:candidate, qa:privacy:live, and qa:release:final before signing."
} finally {
  Pop-Location
}
