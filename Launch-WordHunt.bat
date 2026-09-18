@echo off
title Word Hunt - Windows Edition
cd /d %~dp0
if exist dist-electron\Word Hunt 1.0.0.exe (
    start " dist-electron\Word Hunt 1.0.0.exe
 exit
)
if exist dist-electron\win-unpacked\Word Hunt.exe (
 start  dist-electron\win-unpacked\Word Hunt.exe
 exit
)
echo Word Hunt executable not found!
pause
