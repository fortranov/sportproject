# 📁 Структура проекта - Полная архитектура

## 🏗️ Общая архитектура

```
triathlon-project/
├── backend/                          # Python FastAPI Backend
│   ├── main.py                      # Основной файл API сервиса
│   ├── requirements.txt             # Python зависимости
│   ├── test_service.py              # Тесты API
│   ├── examples.py                  # Примеры использования API
│   ├── start_service.py             # Скрипт запуска с браузером
│   ├── run_service.bat              # Батник для Windows
│   ├── README.md                    # Документация backend
│   └── triathlon_training.db        # SQLite база данных
│
└── frontend/                        # Next.js Frontend
    ├── app/                         # App Router (Next.js 13+)
    │   ├── globals.css              # Глобальные стили
    │   ├── layout.tsx               # Основной layout
    │   ├── page.tsx                 # Главная страница
    │   ├── create-plan/
    │   │   └── page.tsx            # Создание плана
    │   ├── view-plan/
    │   │   └── [uin]/
    │   │       └── page.tsx        # Просмотр плана
    │   ├── profile/
    │   │   └── page.tsx            # Профиль пользователя
    │   └── search-plan/
    │       └── page.tsx            # Поиск плана
    │
    ├── components/                  # React компоненты
    │   ├── ui/                      # Базовые UI компоненты
    │   │   ├── Button.tsx
    │   │   ├── Input.tsx
    │   │   ├── Card.tsx
    │   │   └── LoadingSpinner.tsx
    │   ├── TrainingCalendar.tsx     # Календарь тренировок
    │   ├── TrainingChart.tsx        # Графики статистики
    │   ├── TrainingDayModal.tsx     # Модалка дня тренировки
    │   ├── PlanCard.tsx             # Карточка плана
    │   ├── SportIcon.tsx            # Иконки видов спорта
    │   ├── DifficultySelector.tsx   # Селектор сложности
    │   └── MobileMenu.tsx           # Мобильное меню
    │
    ├── lib/                         # Утилиты и конфигурация
    │   ├── api.ts                   # API клиент
    │   ├── types.ts                 # TypeScript типы
    │   └── utils.ts                 # Вспомогательные функции
    │
    ├── hooks/                       # React хуки
    │   ├── useTrainingPlan.ts       # Хук для работы с планами
    │   ├── useApi.ts                # Хук для API запросов
    │   ├── useLocalStorage.ts       # Хук для localStorage
    │   └── useDebounce.ts           # Хук для debounce
    │
    ├── public/                      # Статические файлы
    │   └── icons/                   # SVG иконки
    │       ├── swimming.svg
    │       ├── cycling.svg
    │       └── running.svg
    │
    ├── package.json                 # Node.js зависимости
    ├── next.config.js               # Next.js конфигурация
    ├── tailwind.config.js           # Tailwind CSS конфигурация
    ├── tsconfig.json                # TypeScript конфигурация
    └── .env.local                   # Environment переменные
```

## 🔧 Технологический стек

### Backend:
- **Python 3.8+** - Основной язык
- **FastAPI** - Web фреймворк
- **SQLAlchemy** - ORM для работы с БД
- **SQLite** - База данных
- **Pydantic** - Валидация данных
- **Uvicorn** - ASGI сервер

### Frontend:
- **Next.js 14** - React фреймворк
- **TypeScript** - Типизированный JavaScript
- **Tailwind CSS** - CSS фреймворк
- **Headless UI** - Доступные компоненты
- **Recharts** - Графики и диаграммы
- **SWR** - Кэширование данных
- **React Hook Form** - Управление формами
- **Date-fns** - Работа с датами

## 📊 Архитектура данных

### База данных (SQLite):

```sql
-- Пользователи
CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    uin TEXT UNIQUE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Планы тренировок
CREATE TABLE training_plans (
    id INTEGER PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    competition_date DATE NOT NULL,
    difficulty INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Дни тренировок
CREATE TABLE training_days (
    id INTEGER PRIMARY KEY,
    training_plan_id INTEGER REFERENCES training_plans(id),
    date DATE NOT NULL,
    swimming_hours REAL DEFAULT 0.0,
    cycling_hours REAL DEFAULT 0.0,
    running_hours REAL DEFAULT 0.0,
    total_hours REAL DEFAULT 0.0
);

-- Зоны тренировки
CREATE TABLE training_zones (
    id INTEGER PRIMARY KEY,
    sport TEXT NOT NULL,
    zone INTEGER NOT NULL,
    description TEXT NOT NULL,
    intensity REAL NOT NULL
);

-- Шаблоны периодизации
CREATE TABLE periodization_templates (
    id INTEGER PRIMARY KEY,
    difficulty_min INTEGER NOT NULL,
    difficulty_max INTEGER NOT NULL,
    weeks_out INTEGER NOT NULL,
    swimming_percentage REAL NOT NULL,
    cycling_percentage REAL NOT NULL,
    running_percentage REAL NOT NULL,
    total_hours_per_week REAL NOT NULL
);
```

## 🌐 API Endpoints

### Backend API:

```
GET  /                           # Информация о сервисе
POST /training-plan             # Создание/обновление плана
GET  /training-plan/{uin}       # Получение плана
DELETE /training-plan/{uin}     # Удаление плана
GET  /docs                      # Swagger документация
GET  /redoc                     # ReDoc документация
```

### Request/Response схемы:

```typescript
// Создание плана
POST /training-plan
{
  "uin": "user123",
  "competition_date": "2024-06-15",
  "difficulty": 500
}

// Ответ
{
  "id": 1,
  "competition_date": "2024-06-15",
  "difficulty": 500,
  "training_days": [
    {
      "date": "2024-03-01",
      "swimming_hours": 1.5,
      "cycling_hours": 2.0,
      "running_hours": 1.0,
      "total_hours": 4.5
    }
  ]
}
```

## 🚀 Развертывание

### Локальная разработка:

```bash
# Backend
cd backend
pip install -r requirements.txt
python main.py

# Frontend
cd frontend
npm install
npm run dev
```

### Production развертывание:

#### Backend (Docker):
```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

#### Frontend (Vercel/Netlify):
```bash
# Сборка для продакшена
npm run build
npm start
```

## 🔐 Безопасность

### Backend:
- Валидация входных данных через Pydantic
- SQL инъекции защищены через SQLAlchemy ORM
- CORS настройки для фронтенда
- Rate limiting (опционально)

### Frontend:
- TypeScript для типобезопасности
- Валидация форм через React Hook Form + Yup
- Санитизация пользовательского ввода
- HTTPS в продакшене

## 📱 Адаптивность

### Мобильные устройства:
- Responsive дизайн с Tailwind CSS
- Touch-friendly интерфейс
- Оптимизированные формы
- Мобильное меню

### PWA возможности:
- Service Worker для кэширования
- Offline поддержка (опционально)
- Install prompt
- Push уведомления (опционально)

## 🧪 Тестирование

### Backend тесты:
```python
# test_service.py
def test_create_plan():
    response = requests.post("/training-plan", json={
        "uin": "test_user",
        "competition_date": "2024-06-15",
        "difficulty": 500
    })
    assert response.status_code == 200
```

### Frontend тесты:
```typescript
// Jest + Testing Library
import { render, screen } from '@testing-library/react';
import { TrainingCalendar } from '@/components/TrainingCalendar';

test('renders training calendar', () => {
  render(<TrainingCalendar trainingDays={[]} />);
  expect(screen.getByText(/календарь/i)).toBeInTheDocument();
});
```

## 📈 Мониторинг и аналитика

### Backend:
- Логирование через Python logging
- Метрики производительности
- Health check endpoints

### Frontend:
- Google Analytics 4
- Sentry для отслеживания ошибок
- Web Vitals метрики
- User behavior tracking

## 🔄 CI/CD Pipeline

### GitHub Actions:
```yaml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy Backend
        run: |
          # Deploy to server
          
  frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy Frontend
        run: |
          # Deploy to Vercel
```

## 📚 Документация

### Файлы документации:
- **README.md** - Основная документация проекта
- **FRONTEND.md** - Документация по фронтенду
- **FRONTEND_COMPONENTS.md** - Компоненты и утилиты
- **FRONTEND_PAGES.md** - Примеры страниц
- **PROJECT_STRUCTURE.md** - Архитектура проекта
- **API.md** - Документация API (автогенерируется)

### Интерактивная документация:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`
- Storybook для компонентов (опционально)

---

**Примечание**: Данная архитектура обеспечивает масштабируемость, поддерживаемость и современный пользовательский опыт. Каждый компонент системы может развиваться независимо, что упрощает разработку и развертывание.
