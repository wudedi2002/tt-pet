@echo off
chcp 65001 >nul
title Facemini 改版原型
cd /d "%~dp0"

echo.
echo  Facemini 改版原型 — 正在启动本地预览...
echo  项目目录: %CD%
echo.

where npx >nul 2>&1
if %errorlevel%==0 (
  start "" "http://localhost:8765/#home"
  echo  浏览器将打开 http://localhost:8765/#home
  echo  按 Ctrl+C 可停止服务
  echo.
  npx --yes serve -l 8765 .
  goto :eof
)

where python >nul 2>&1
if %errorlevel%==0 (
  start "" "http://localhost:8765/#home"
  echo  浏览器将打开 http://localhost:8765/#home
  echo  按 Ctrl+C 可停止服务
  echo.
  python -m http.server 8765
  goto :eof
)

where py >nul 2>&1
if %errorlevel%==0 (
  start "" "http://localhost:8765/#home"
  echo  浏览器将打开 http://localhost:8765/#home
  echo  按 Ctrl+C 可停止服务
  echo.
  py -m http.server 8765
  goto :eof
)

echo  未找到 Node 或 Python，将直接用浏览器打开 index.html
start "" "%CD%\index.html#home"
pause
