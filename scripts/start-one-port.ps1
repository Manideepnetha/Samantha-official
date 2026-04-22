param(
    [switch]$NoFrontendBuild,
    [switch]$NoBackendBuild
)

$ErrorActionPreference = 'Stop'

$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$frontendBuildRoot = Join-Path $repoRoot 'dist\browser\browser'
$frontendIndexPath = Join-Path $frontendBuildRoot 'index.html'
$backendWwwRoot = Join-Path $repoRoot 'backend\Samantha.API\wwwroot'
$uploadsRoot = Join-Path $backendWwwRoot 'uploads'
$backendRunner = Join-Path $repoRoot 'backend\run-api.ps1'

if (-not $NoFrontendBuild) {
    Push-Location $repoRoot
    try {
        & npm run build
    }
    finally {
        Pop-Location
    }

    if ($LASTEXITCODE -ne 0) {
        exit $LASTEXITCODE
    }
}

if (-not (Test-Path -LiteralPath $frontendIndexPath)) {
    throw "Frontend build output was not found at '$frontendIndexPath'."
}

New-Item -ItemType Directory -Force -Path $backendWwwRoot | Out-Null
New-Item -ItemType Directory -Force -Path $uploadsRoot | Out-Null

Get-ChildItem -LiteralPath $backendWwwRoot -Force |
    Where-Object { $_.Name -ne 'uploads' } |
    ForEach-Object {
        Remove-Item -LiteralPath $_.FullName -Recurse -Force
    }

Copy-Item -Path (Join-Path $frontendBuildRoot '*') -Destination $backendWwwRoot -Recurse -Force

$backendCommand = @(
    '-ExecutionPolicy', 'Bypass',
    '-File', $backendRunner
)

if ($NoBackendBuild) {
    $backendCommand += '-NoBuild'
}

& powershell @backendCommand
exit $LASTEXITCODE
