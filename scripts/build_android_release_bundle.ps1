$ErrorActionPreference = "Stop"
$repoRoot = Split-Path -Parent $PSScriptRoot
$env:JAVA_HOME = "D:\Program Files\Android\Android Studio\jbr"
$env:ANDROID_HOME = "C:\Users\bbock\AppData\Local\Android\Sdk"
$env:ANDROID_SDK_ROOT = "C:\Users\bbock\AppData\Local\Android\Sdk"
Push-Location "$repoRoot\android"
try {
  .\gradlew.bat bundleRelease
} finally {
  Pop-Location
}