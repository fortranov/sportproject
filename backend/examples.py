#!/usr/bin/env python3
"""
Примеры использования Triathlon Training Service API
"""

import requests
import json
from datetime import date, timedelta

BASE_URL = "http://localhost:8000"

def example_create_beginner_plan():
    """Пример создания плана для начинающего триатлета"""
    print("🔰 Создание плана для начинающего триатлета")
    
    data = {
        "uin": "beginner_001",
        "competition_date": (date.today() + timedelta(days=120)).isoformat(),
        "difficulty": 200  # Начинающий уровень
    }
    
    response = requests.post(f"{BASE_URL}/training-plan", json=data)
    
    if response.status_code == 200:
        plan = response.json()
        print(f"✅ План создан! ID: {plan['id']}")
        
        # Показать статистику
        total_hours = sum(day['total_hours'] for day in plan['training_days'])
        avg_weekly = total_hours / (len(plan['training_days']) / 7)
        print(f"📊 Средняя нагрузка: {avg_weekly:.1f} часов/неделя")
        
        return plan
    else:
        print(f"❌ Ошибка: {response.text}")
        return None

def example_create_intermediate_plan():
    """Пример создания плана для среднего уровня"""
    print("🏃‍♂️ Создание плана для среднего уровня")
    
    data = {
        "uin": "intermediate_001",
        "competition_date": (date.today() + timedelta(days=150)).isoformat(),
        "difficulty": 500  # Средний уровень
    }
    
    response = requests.post(f"{BASE_URL}/training-plan", json=data)
    
    if response.status_code == 200:
        plan = response.json()
        print(f"✅ План создан! ID: {plan['id']}")
        
        # Показать распределение по видам спорта
        total_swim = sum(day['swimming_hours'] for day in plan['training_days'])
        total_bike = sum(day['cycling_hours'] for day in plan['training_days'])
        total_run = sum(day['running_hours'] for day in plan['training_days'])
        total = total_swim + total_bike + total_run
        
        print(f"🏊‍♂️ Плавание: {total_swim:.1f}ч ({total_swim/total*100:.1f}%)")
        print(f"🚴‍♂️ Велосипед: {total_bike:.1f}ч ({total_bike/total*100:.1f}%)")
        print(f"🏃‍♂️ Бег: {total_run:.1f}ч ({total_run/total*100:.1f}%)")
        
        return plan
    else:
        print(f"❌ Ошибка: {response.text}")
        return None

def example_create_advanced_plan():
    """Пример создания плана для продвинутого триатлета"""
    print("🏆 Создание плана для продвинутого триатлета")
    
    data = {
        "uin": "advanced_001",
        "competition_date": (date.today() + timedelta(days=180)).isoformat(),
        "difficulty": 850  # Продвинутый уровень
    }
    
    response = requests.post(f"{BASE_URL}/training-plan", json=data)
    
    if response.status_code == 200:
        plan = response.json()
        print(f"✅ План создан! ID: {plan['id']}")
        
        # Показать пиковую неделю
        weekly_hours = []
        for i in range(0, len(plan['training_days']), 7):
            week_days = plan['training_days'][i:i+7]
            week_total = sum(day['total_hours'] for day in week_days)
            weekly_hours.append(week_total)
        
        max_week = max(weekly_hours) if weekly_hours else 0
        print(f"⚡ Максимальная недельная нагрузка: {max_week:.1f} часов")
        
        return plan
    else:
        print(f"❌ Ошибка: {response.text}")
        return None

def example_get_plan(uin):
    """Пример получения плана"""
    print(f"📋 Получение плана для пользователя {uin}")
    
    response = requests.get(f"{BASE_URL}/training-plan/{uin}")
    
    if response.status_code == 200:
        plan = response.json()
        print(f"✅ План найден! Дата соревнования: {plan['competition_date']}")
        
        # Показать следующие 7 дней
        today = date.today()
        upcoming_days = [
            day for day in plan['training_days'] 
            if date.fromisoformat(day['date']) >= today
        ][:7]
        
        print("📅 Ближайшие 7 дней:")
        for day in upcoming_days:
            print(f"  {day['date']}: {day['total_hours']:.1f}ч "
                  f"(🏊‍♂️{day['swimming_hours']:.1f} 🚴‍♂️{day['cycling_hours']:.1f} 🏃‍♂️{day['running_hours']:.1f})")
        
        return plan
    else:
        print(f"❌ План не найден: {response.text}")
        return None

def example_update_plan():
    """Пример обновления плана (перезаписи)"""
    print("🔄 Обновление существующего плана")
    
    # Сначала создаем план
    uin = "update_test_001"
    data1 = {
        "uin": uin,
        "competition_date": (date.today() + timedelta(days=100)).isoformat(),
        "difficulty": 300
    }
    
    response1 = requests.post(f"{BASE_URL}/training-plan", json=data1)
    if response1.status_code == 200:
        plan1 = response1.json()
        total1 = sum(day['total_hours'] for day in plan1['training_days'])
        print(f"✅ Первый план создан. Общее время: {total1:.1f} часов")
    
    # Теперь обновляем план с другой сложностью
    data2 = {
        "uin": uin,
        "competition_date": (date.today() + timedelta(days=100)).isoformat(),
        "difficulty": 600  # Увеличиваем сложность
    }
    
    response2 = requests.post(f"{BASE_URL}/training-plan", json=data2)
    if response2.status_code == 200:
        plan2 = response2.json()
        total2 = sum(day['total_hours'] for day in plan2['training_days'])
        print(f"✅ План обновлен. Новое общее время: {total2:.1f} часов")
        print(f"📈 Изменение: {total2-total1:+.1f} часов")

def example_delete_plan(uin):
    """Пример удаления плана"""
    print(f"🗑️ Удаление плана для пользователя {uin}")
    
    response = requests.delete(f"{BASE_URL}/training-plan/{uin}")
    
    if response.status_code == 200:
        print("✅ План успешно удален")
        
        # Проверяем, что план действительно удален
        check_response = requests.get(f"{BASE_URL}/training-plan/{uin}")
        if check_response.status_code == 404:
            print("✅ Подтверждено: план больше не существует")
        else:
            print("❌ Ошибка: план все еще существует")
    else:
        print(f"❌ Ошибка удаления: {response.text}")

def main():
    """Запуск всех примеров"""
    print("🏊‍♂️🚴‍♂️🏃‍♂️ Примеры использования Triathlon Training Service")
    print("=" * 60)
    
    try:
        # Проверяем доступность сервиса
        response = requests.get(f"{BASE_URL}/")
        if response.status_code != 200:
            print("❌ Сервис недоступен. Запустите его командой: python main.py")
            return
        
        print("✅ Сервис доступен")
        print()
        
        # Примеры создания планов
        print("1️⃣ СОЗДАНИЕ ПЛАНОВ")
        print("-" * 30)
        example_create_beginner_plan()
        print()
        example_create_intermediate_plan()
        print()
        example_create_advanced_plan()
        print()
        
        # Примеры получения планов
        print("2️⃣ ПОЛУЧЕНИЕ ПЛАНОВ")
        print("-" * 30)
        example_get_plan("intermediate_001")
        print()
        
        # Пример обновления плана
        print("3️⃣ ОБНОВЛЕНИЕ ПЛАНА")
        print("-" * 30)
        example_update_plan()
        print()
        
        # Пример удаления плана
        print("4️⃣ УДАЛЕНИЕ ПЛАНА")
        print("-" * 30)
        example_delete_plan("beginner_001")
        print()
        
        print("🏁 Все примеры выполнены!")
        
    except requests.exceptions.ConnectionError:
        print("❌ Не удается подключиться к сервису")
        print("💡 Запустите сервис командой: python main.py")
    except Exception as e:
        print(f"❌ Ошибка: {e}")

if __name__ == "__main__":
    main()
