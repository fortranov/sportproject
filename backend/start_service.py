#!/usr/bin/env python3
"""
Скрипт для запуска Triathlon Training Service
"""

import uvicorn
import webbrowser
import time
import threading

def open_browser():
    """Открыть браузер через несколько секунд после запуска сервера"""
    time.sleep(2)
    print("🌐 Открываем браузер...")
    webbrowser.open("http://localhost:8000/docs")

if __name__ == "__main__":
    print("🏊‍♂️🚴‍♂️🏃‍♂️ Запуск Triathlon Training Service")
    print("=" * 50)
    print("📝 Сервис основан на методологии Джо Фрила")
    print("🔗 API документация: http://localhost:8000/docs")
    print("🔗 Альтернативная документация: http://localhost:8000/redoc")
    print("=" * 50)
    
    # Запускаем браузер в отдельном потоке
    browser_thread = threading.Thread(target=open_browser)
    browser_thread.daemon = True
    browser_thread.start()
    
    # Запускаем сервер
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
