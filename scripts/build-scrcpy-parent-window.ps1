[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)]
    [string] $Msys2Root,

    [string] $SourceDir = (Join-Path $env:TEMP 'escrcpy-v4.0-parent-window'),

    [string] $OutputPath = (Join-Path $PSScriptRoot '..\desktop\electron\resources\extra\win\scrcpy\scrcpy.exe'),

    [switch] $InstallDependencies
)

$ErrorActionPreference = 'Stop'

$scrcpyRepository = 'https://github.com/Genymobile/scrcpy.git'
$scrcpyCommit = '2322868e9e256eb5fce0b3d659ab2a409f29bae1'
$patchPath = Join-Path $PSScriptRoot 'scrcpy-parent-window-v4.0.patch'
$msysShell = Join-Path $Msys2Root 'msys2_shell.cmd'
$cygpath = Join-Path $Msys2Root 'usr\bin\cygpath.exe'
$buildDirName = 'build-escrcpy-parent-window'

foreach ($requiredPath in @($msysShell, $cygpath, $patchPath)) {
    if (-not (Test-Path -LiteralPath $requiredPath)) {
        throw "Required file not found: $requiredPath"
    }
}

if (-not (Test-Path -LiteralPath (Join-Path $SourceDir '.git'))) {
    git clone --branch v4.0 --depth 1 $scrcpyRepository $SourceDir
    if ($LASTEXITCODE -ne 0) {
        throw 'Unable to clone scrcpy v4.0.'
    }
}

$actualCommit = (git -C $SourceDir rev-parse HEAD).Trim()
if ($LASTEXITCODE -ne 0 -or $actualCommit -ne $scrcpyCommit) {
    throw "SourceDir must be scrcpy commit $scrcpyCommit; found $actualCommit."
}

git -C $SourceDir apply --check $patchPath 2>$null
if ($LASTEXITCODE -eq 0) {
    git -C $SourceDir apply $patchPath
    if ($LASTEXITCODE -ne 0) {
        throw 'Unable to apply the parent-window patch.'
    }
}
else {
    git -C $SourceDir apply --reverse --check $patchPath 2>$null
    if ($LASTEXITCODE -ne 0) {
        throw 'The scrcpy source has unrelated changes or a partially applied patch.'
    }
}

if ($InstallDependencies) {
    $dependencyCommand = 'pacman -S --needed --noconfirm ' +
        'mingw-w64-x86_64-SDL3 mingw-w64-x86_64-ffmpeg ' +
        'mingw-w64-x86_64-libusb mingw-w64-x86_64-make ' +
        'mingw-w64-x86_64-gcc mingw-w64-x86_64-pkgconf ' +
        'mingw-w64-x86_64-meson'

    & $msysShell -defterm -no-start -mingw64 -c $dependencyCommand
    if ($LASTEXITCODE -ne 0) {
        throw 'Unable to install the MSYS2 build dependencies.'
    }
}

$sourceUnix = (& $cygpath -u $SourceDir).Trim()
$buildUnix = "$sourceUnix/$buildDirName"
$buildDir = Join-Path $SourceDir $buildDirName

if (Test-Path -LiteralPath $buildDir) {
    $setupCommand = "cd '$sourceUnix' && meson setup --reconfigure '$buildUnix' "
}
else {
    $setupCommand = "cd '$sourceUnix' && meson setup '$buildUnix' "
}

$setupCommand += '--buildtype=release --strip -Db_lto=true -Dcompile_server=false'

& $msysShell -defterm -no-start -mingw64 -c $setupCommand
if ($LASTEXITCODE -ne 0) {
    throw 'Meson setup failed.'
}

& $msysShell -defterm -no-start -mingw64 -c "meson compile -C '$buildUnix'"
if ($LASTEXITCODE -ne 0) {
    throw 'scrcpy compilation failed.'
}

$builtExecutable = Join-Path $buildDir 'app\scrcpy.exe'
if (-not (Test-Path -LiteralPath $builtExecutable)) {
    throw "Built executable not found: $builtExecutable"
}

$resolvedOutput = [System.IO.Path]::GetFullPath($OutputPath)
$outputDirectory = Split-Path -Parent $resolvedOutput
New-Item -ItemType Directory -Path $outputDirectory -Force | Out-Null
Copy-Item -LiteralPath $builtExecutable -Destination $resolvedOutput -Force

$hash = (Get-FileHash -Algorithm SHA256 -LiteralPath $resolvedOutput).Hash
Write-Output "Built scrcpy v4.0 parent-window client: $resolvedOutput"
Write-Output "SHA256: $hash"
