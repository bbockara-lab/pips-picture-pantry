$ErrorActionPreference = "Stop"
$repoRoot = Split-Path -Parent $PSScriptRoot
$env:JAVA_HOME = "D:\Program Files\Android\Android Studio\jbr"
$env:ANDROID_HOME = "C:\Users\bbock\AppData\Local\Android\Sdk"
$env:ANDROID_SDK_ROOT = "C:\Users\bbock\AppData\Local\Android\Sdk"

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

Push-Location "$repoRoot\android"
try {
  Invoke-NativeCommand ".\gradlew.bat" @("bundleRelease")
} finally {
  Pop-Location
}
