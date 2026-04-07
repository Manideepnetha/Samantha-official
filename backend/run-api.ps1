param(
    [switch]$NoBuild
)

$ErrorActionPreference = 'Stop'

$projectDirectory = Join-Path $PSScriptRoot 'Samantha.API'
$projectPath = Join-Path $projectDirectory 'Samantha.API.csproj'
$runnerPathWindows = (Join-Path $PSScriptRoot 'run-api.ps1')
$runnerPathUnix = $runnerPathWindows.Replace('\', '/')
$runnerBuildRoot = Join-Path $PSScriptRoot '.runner'
$runnerPublishRoot = Join-Path $runnerBuildRoot 'publish'
$runnerConfiguration = 'Debug'
$runnerDll = Join-Path $runnerPublishRoot 'Samantha.API.dll'

$existingRunnerShells = Get-CimInstance Win32_Process | Where-Object {
    ($_.Name -eq 'powershell.exe' -or $_.Name -eq 'pwsh.exe') -and
    $_.CommandLine -and
    (
        $_.CommandLine -like "*$runnerPathWindows*" -or
        $_.CommandLine -like "*$runnerPathUnix*"
    )
}

foreach ($process in $existingRunnerShells) {
    if ($process.ProcessId -eq $PID) {
        continue
    }

    try {
        Stop-Process -Id $process.ProcessId -Force -ErrorAction Stop
    }
    catch {
        Write-Warning "Could not stop backend runner process $($process.ProcessId): $($_.Exception.Message)"
    }
}

$existingProcesses = Get-CimInstance Win32_Process | Where-Object {
    $_.Name -eq 'dotnet.exe' -and
    $_.CommandLine -and
    (
        $_.CommandLine -like '*Samantha.API.csproj*' -or
        $_.CommandLine -like '*Samantha.API.dll*'
    )
}

foreach ($process in $existingProcesses) {
    if ($process.ProcessId -eq $PID) {
        continue
    }

    try {
        Stop-Process -Id $process.ProcessId -Force -ErrorAction Stop
    }
    catch {
        Write-Warning "Could not stop Samantha.API process $($process.ProcessId): $($_.Exception.Message)"
    }
}

Start-Sleep -Milliseconds 500

if ((-not $NoBuild) -or -not (Test-Path $runnerDll)) {
    New-Item -ItemType Directory -Force -Path $runnerPublishRoot | Out-Null

    & dotnet publish $projectPath `
        -c $runnerConfiguration `
        -o $runnerPublishRoot `
        '-p:UseAppHost=false'

    if ($LASTEXITCODE -ne 0) {
        exit $LASTEXITCODE
    }
}

$env:ASPNETCORE_ENVIRONMENT = 'Development'
$env:ASPNETCORE_URLS = 'http://localhost:5035'

Push-Location $projectDirectory
try {
    & dotnet exec $runnerDll
}
finally {
    Pop-Location
}

exit $LASTEXITCODE
