#!/bin/bash
# Скрипт запуска I•Match Dating Bot

echo "========================================"
echo "  I•Match Dating Bot - Запуск"
echo "========================================"

# Проверяем наличие Python
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 не найден. Установите Python 3.9+"
    exit 1
fi

# Создаём виртуальное окружение если его нет
if [ ! -d "venv" ]; then
    echo "📦 Создаём виртуальное окружение..."
    python3 -m venv venv
fi

# Активируем виртуальное окружение
source venv/bin/activate

# Устанавливаем зависимости
echo "📥 Устанавливаем зависимости..."
pip install -r requirements.txt -q

echo "🚀 Запускаем бота..."
python3 telegram_bot.py
