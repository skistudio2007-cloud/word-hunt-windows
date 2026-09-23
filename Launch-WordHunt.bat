@echo off
title Word Hunt - Windows Edition
cd /d "%~dp0"

if exist "dist-electron\win-unpacked\Word Hunt.exe" (
    start "" "dist-electron\win-unpacked\Word Hunt.exe"
    exit /b 0
)

if exist "dist-electron\Word Hunt 1.0.1.exe" (
    start "" "dist-electron\Word Hunt 1.0.1.exe"
    exit /b 0
)

if exist "dist-electron\Word Hunt 1.0.0.exe" (
    start "" "dist-electron\Word Hunt 1.0.0.exe"
    exit /b 0
)

echo [ERROR] Word Hunt executable not found!
echo Please check dist-electron folder.
pause
