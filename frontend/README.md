# 🏊‍♂️🚴‍♂️🏃‍♂️ Triathlon Training Frontend

Современный веб-интерфейс для сервиса планирования тренировок триатлетов, построенный на Next.js.

## 🚀 Технологии

- **Next.js 15** - React фреймворк с App Router
- **TypeScript** - Типизированный JavaScript
- **Tailwind CSS** - CSS фреймворк для стилизации
- **Lucide React** - Иконки
- **Recharts** - Графики и диаграммы
- **SWR** - Кэширование данных и состояние
- **React Hook Form** - Управление формами
- **React Hot Toast** - Уведомления
- **Date-fns** - Работа с датами

## 📦 Установка

```bash
# Установка зависимостей
npm install

# Запуск в режиме разработки
npm run dev

# Сборка для продакшена
npm run build

# Запуск продакшн версии
npm start
```

## 🌐 Environment Variables

Создайте файл `.env.local` в корне проекта:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 📁 Структура проекта

```
src/
├── app/                     # App Router страницы
│   ├── globals.css          # Глобальные стили
│   ├── layout.tsx           # Основной layout
│   ├── page.tsx             # Главная страница
│   ├── create-plan/         # Создание плана
│   ├── search-plan/         # Поиск плана
│   └── view-plan/[uin]/     # Просмотр плана
├── components/              # React компоненты
│   ├── ui/                  # Базовые UI компоненты
│   ├── SportIcon.tsx        # Иконки видов спорта
│   ├── DifficultySelector.tsx # Селектор сложности
│   ├── TrainingCalendar.tsx # Календарь тренировок
│   └── TrainingChart.tsx    # Графики
├── lib/                     # Утилиты и конфигурация
│   ├── api.ts              # API клиент
│   ├── types.ts            # TypeScript типы
│   └── utils.ts            # Вспомогательные функции
└── hooks/                   # React хуки
    └── useTrainingPlan.ts   # Хуки для работы с планами
```

## 🎯 Функциональность

### Основные страницы:
- **Главная** (`/`) - Обзор сервиса и методологии
- **Создание плана** (`/create-plan`) - Форма создания нового плана
- **Поиск плана** (`/search-plan`) - Поиск существующего плана
- **Просмотр плана** (`/view-plan/[uin]`) - Детальный просмотр с календарем и статистикой

### Компоненты:
- **TrainingCalendar** - Интерактивный календарь с тренировками
- **TrainingChart** - Графики распределения нагрузки по видам спорта
- **DifficultySelector** - Выбор уровня сложности (0-1000)
- **SportIcon** - Иконки для плавания, велосипеда и бега

### Интеграция с API:
- Создание планов тренировок
- Получение планов по UIN
- Удаление планов
- Обработка ошибок и уведомления

## 🎨 Дизайн система

### Цветовая схема:
- **Плавание**: `#0ea5e9` (синий)
- **Велосипед**: `#10b981` (зеленый) 
- **Бег**: `#f59e0b` (оранжевый)

### Уровни сложности:
- **Начинающий** (0-300): Зеленый
- **Средний** (301-700): Желтый
- **Продвинутый** (701-1000): Красный

## 🔧 API Интеграция

Фронтенд интегрируется с FastAPI backend через REST API:

```typescript
// Создание плана
POST /training-plan
{
  "uin": "user123",
  "competition_date": "2024-06-15", 
  "difficulty": 500
}

// Получение плана
GET /training-plan/{uin}

// Удаление плана
DELETE /training-plan/{uin}
```

## 📱 Адаптивность

- Полностью адаптивный дизайн для всех устройств
- Мобильная навигация
- Touch-friendly интерфейс
- Оптимизированные формы для мобильных устройств

## 🚀 Развертывание

### Vercel (рекомендуется):
```bash
npm run build
# Подключите репозиторий к Vercel
```

### Docker:
```dockerfile
FROM node:18-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:18-alpine AS builder
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000
CMD ["npm", "start"]
```

## 🧪 Разработка

### Линтинг:
```bash
npm run lint
```

### Типы TypeScript:
```bash
npm run type-check
```

## 📈 Производительность

- Server-side rendering с Next.js
- Автоматическая оптимизация изображений
- Кэширование API запросов с SWR
- Code splitting и lazy loading
- Оптимизированные bundle размеры

## 🤝 Методология Джо Фрила

Интерфейс реализует принципы из книги "Библия триатлета":

- **Периодизация**: Автоматическое планирование по фазам подготовки
- **Зоны тренировки**: 6 зон интенсивности для каждого вида спорта
- **Распределение нагрузки**: Плавание 20-40%, Велосипед 30-50%, Бег 25-35%
- **Тейперинг**: Снижение нагрузки перед соревнованием



Для запуска полного стека приложения убедитесь, что backend сервер запущен на `http://localhost:8000`.