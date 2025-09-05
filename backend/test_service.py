#!/usr/bin/env python3
"""
Тестовый скрипт для проверки работы Triathlon Training Service
"""

import requests
import json
from datetime import date, timedelta

BASE_URL = "http://localhost:8000"

def test_service():
    print("🏊‍♂️🚴‍♂️🏃‍♂️ Тестирование Triathlon Training Service")
    print("=" * 50)
    
    # Тестовые данные
    test_user = "test_user_123"
    competition_date = (date.today() + timedelta(days=90)).isoformat()  # Соревнование через 3 месяца
    difficulty = 500  # Средний уровень
    
    print(f"📋 Тестовые данные:")
    print(f"  UIN: {test_user}")
    print(f"  Дата соревнования: {competition_date}")
    print(f"  Сложность: {difficulty}")
    print()
    
    # Тест 1: Создание плана тренировок
    print("🔵 Тест 1: Создание плана тренировок")
    try:
        response = requests.post(f"{BASE_URL}/training-plan", json={
            "uin": test_user,
            "competition_date": competition_date,
            "difficulty": difficulty
        })
        
        if response.status_code == 200:
            plan = response.json()
            print(f"✅ План создан успешно!")
            print(f"  ID плана: {plan['id']}")
            print(f"  Количество тренировочных дней: {len(plan['training_days'])}")
            
            # Показать первые 5 дней
            print(f"  Первые 5 дней:")
            for day in plan['training_days'][:5]:
                print(f"    {day['date']}: Плавание {day['swimming_hours']}ч, Велосипед {day['cycling_hours']}ч, Бег {day['running_hours']}ч (Всего: {day['total_hours']}ч)")
        else:
            print(f"❌ Ошибка создания плана: {response.status_code}")
            print(response.text)
    except Exception as e:
        print(f"❌ Ошибка подключения: {e}")
    
    print()
    
    # Тест 2: Получение плана тренировок
    print("🔵 Тест 2: Получение плана тренировок")
    try:
        response = requests.get(f"{BASE_URL}/training-plan/{test_user}")
        
        if response.status_code == 200:
            plan = response.json()
            print(f"✅ План получен успешно!")
            
            # Статистика по видам спорта
            total_swimming = sum(day['swimming_hours'] for day in plan['training_days'])
            total_cycling = sum(day['cycling_hours'] for day in plan['training_days'])
            total_running = sum(day['running_hours'] for day in plan['training_days'])
            total_hours = sum(day['total_hours'] for day in plan['training_days'])
            
            print(f"  📊 Статистика плана:")
            print(f"    Общее время: {total_hours:.1f} часов")
            print(f"    Плавание: {total_swimming:.1f}ч ({total_swimming/total_hours*100:.1f}%)")
            print(f"    Велосипед: {total_cycling:.1f}ч ({total_cycling/total_hours*100:.1f}%)")
            print(f"    Бег: {total_running:.1f}ч ({total_running/total_hours*100:.1f}%)")
        else:
            print(f"❌ Ошибка получения плана: {response.status_code}")
            print(response.text)
    except Exception as e:
        print(f"❌ Ошибка подключения: {e}")
    
    print()
    
    # Тест 3: Обновление плана (повторное создание)
    print("🔵 Тест 3: Обновление плана тренировок")
    try:
        new_difficulty = 750  # Увеличиваем сложность
        response = requests.post(f"{BASE_URL}/training-plan", json={
            "uin": test_user,
            "competition_date": competition_date,
            "difficulty": new_difficulty
        })
        
        if response.status_code == 200:
            plan = response.json()
            print(f"✅ План обновлен успешно!")
            print(f"  Новая сложность: {new_difficulty}")
            
            # Сравним общее время тренировок
            total_hours = sum(day['total_hours'] for day in plan['training_days'])
            print(f"  Общее время тренировок: {total_hours:.1f} часов")
        else:
            print(f"❌ Ошибка обновления плана: {response.status_code}")
            print(response.text)
    except Exception as e:
        print(f"❌ Ошибка подключения: {e}")
    
    print()
    
    # Тест 4: Удаление плана
    print("🔵 Тест 4: Удаление плана тренировок")
    try:
        response = requests.delete(f"{BASE_URL}/training-plan/{test_user}")
        
        if response.status_code == 200:
            print("✅ План удален успешно!")
            
            # Проверим, что план действительно удален
            response = requests.get(f"{BASE_URL}/training-plan/{test_user}")
            if response.status_code == 404:
                print("✅ Подтверждено: план больше не существует")
            else:
                print("❌ План все еще существует")
        else:
            print(f"❌ Ошибка удаления плана: {response.status_code}")
            print(response.text)
    except Exception as e:
        print(f"❌ Ошибка подключения: {e}")
    
    print()
    
    # Тест 5: Проверка различных уровней сложности
    print("🔵 Тест 5: Проверка различных уровней сложности")
    difficulties = [100, 400, 800]  # Начинающий, средний, продвинутый
    
    for diff in difficulties:
        try:
            response = requests.post(f"{BASE_URL}/training-plan", json={
                "uin": f"test_user_{diff}",
                "competition_date": competition_date,
                "difficulty": diff
            })
            
            if response.status_code == 200:
                plan = response.json()
                total_hours = sum(day['total_hours'] for day in plan['training_days'])
                avg_weekly_hours = total_hours / (len(plan['training_days']) / 7)
                
                level = "Начинающий" if diff <= 300 else "Средний" if diff <= 700 else "Продвинутый"
                print(f"  {level} (сложность {diff}): {avg_weekly_hours:.1f} часов/неделя")
            else:
                print(f"  ❌ Ошибка для сложности {diff}: {response.status_code}")
        except Exception as e:
            print(f"  ❌ Ошибка для сложности {diff}: {e}")
    
    print()
    print("🏁 Тестирование завершено!")

if __name__ == "__main__":
    print("🚀 Запуск тестов...")
    print("⚠️  Убедитесь, что сервис запущен на http://localhost:8000")
    print()
    
    try:
        # Проверим, что сервис доступен
        response = requests.get(f"{BASE_URL}/")
        if response.status_code == 200:
            print("✅ Сервис доступен")
            print()
            test_service()
        else:
            print("❌ Сервис недоступен")
    except Exception as e:
        print(f"❌ Не удается подключиться к сервису: {e}")
        print("💡 Запустите сервис командой: python main.py")
