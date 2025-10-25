@echo off
echo ========================================
echo   CPU and Memory Monitor Kapatiliyor
echo ========================================
echo.

echo Node.js process'leri sonlandiriliyor...
taskkill /F /IM node.exe >nul 2>&1

echo Tum sunucular kapatildi!
echo.
pause

