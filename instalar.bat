@echo off
title Central de Validacoes - Instalador
echo ============================================
echo   Central de Validacoes - BigCard
echo   Instalando dependencias...
echo ============================================
echo.

:: Verifica Python
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERRO] Python nao encontrado.
    echo Instale o Python 3.10+ em https://python.org
    pause
    exit /b 1
)

:: Instala dependencias
echo Instalando pacotes Python...
pip install fastapi uvicorn pyodbc --quiet

echo.
echo ============================================
echo   Instalacao concluida!
echo   Execute "iniciar.bat" para abrir o sistema.
echo ============================================
pause
