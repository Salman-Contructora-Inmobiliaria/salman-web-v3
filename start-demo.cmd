@echo off
setlocal
cd /d "%~dp0"
echo.
echo SALMAN - demo local con voz y API
echo Abriendo http://localhost:8080/ ...
echo.
start "" "http://localhost:8080/"
where node >nul 2>nul
if not errorlevel 1 (
  echo Usando Node: scripts\dev-server.js
  echo Si tienes GEMINI_API_KEY, crea .env.local antes de iniciar.
  node scripts\dev-server.js
  exit /b %errorlevel%
)
echo Node no encontrado. Usando Python solo para el frontend.
echo La API /api/chat no estara disponible; la voz usara el fallback local.
where python >nul 2>nul
if errorlevel 1 (
  echo Instala Node o Python 3.
  pause
  exit /b 1
)
python -m http.server 8080
