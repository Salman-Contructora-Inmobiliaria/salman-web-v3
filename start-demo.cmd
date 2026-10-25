@echo off
setlocal
cd /d "%~dp0"
where python >nul 2>nul
if errorlevel 1 (
  echo.
  echo No encontre Python en el PATH.
  echo Instala Python 3 o abre el index.html directamente (la voz requerira localhost/HTTPS).
  echo.
  pause
  exit /b 1
)
echo.
echo SALMAN - demo local
echo Abriendo http://localhost:8080/ ...
echo (Ctrl+C para detener el servidor)
echo.
start "" "http://localhost:8080/"
python -m http.server 8080
