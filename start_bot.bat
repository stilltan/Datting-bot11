@echo off
echo ========================================
echo   I•Match Dating Bot - Запуск (Windows)
echo ========================================

REM Проверяем Python
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Python не найден. Установите Python 3.9+
    pause
    exit /b 1
)

REM Создаём виртуальное окружение если его нет
if not exist "venv" (
    echo [INFO] Создаём виртуальное окружение...
    python -m venv venv
)

REM Активируем виртуальное окружение
call venv\Scripts\activate.bat

REM Устанавливаем зависимости
echo [INFO] Устанавливаем зависимости...
pip install -r requirements.txt -q

echo [INFO] Запускаем бота...
python telegram_bot.py

pause
