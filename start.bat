@echo off
echo ========================================
echo   CPU and Memory Monitor Baslatiliyor
echo ========================================
echo.

REM Backend sunucusunu başlat
echo Backend sunucusu baslatiliyor (Port 9191)...
start "Backend Server" cmd /k "node server.js"

REM 3 saniye bekle
timeout /t 3 /nobreak >nul

REM Frontend'i başlat
echo Frontend baslatiliyor (Port 3000)...
start "Frontend" cmd /k "npm start"

echo.
echo ========================================
echo   Her iki sunucu da baslatildi!
echo   Tarayici otomatik acilacak...
echo   Backend: http://localhost:9191
echo   Frontend: http://localhost:3000
echo ========================================
echo.
echo Kapatmak icin bu pencereleri kapatabilirsiniz.
pause

