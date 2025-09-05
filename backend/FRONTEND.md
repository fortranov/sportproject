# 🖥️ Frontend Documentation - Next.js для Triathlon Training Service

## 📋 Обзор

Документация по созданию современного веб-интерфейса на Next.js для сервиса планирования тренировок триатлетов.

## 🎯 Функциональные требования

### Основные страницы:
- 🏠 **Главная страница** - обзор сервиса
- 📝 **Создание плана** - форма для создания нового плана тренировок
- 📊 **Просмотр плана** - детальный просмотр плана с календарем
- 👤 **Профиль пользователя** - управление планами
- 📈 **Статистика** - аналитика тренировок

### Компоненты:
- 📅 **TrainingCalendar** - интерактивный календарь тренировок
- 📊 **TrainingChart** - графики распределения нагрузки
- 🏃‍♂️ **SportIcon** - иконки видов спорта
- ⚡ **DifficultySelector** - выбор уровня сложности
- 📋 **PlanCard** - карточка плана тренировок

## 🚀 Установка и настройка

### 1. Создание проекта Next.js

```bash
# Создание нового проекта Next.js
npx create-next-app@latest triathlon-frontend --typescript --tailwind --eslint --app

# Переход в директорию проекта
cd triathlon-frontend

# Установка дополнительных зависимостей
npm install @headlessui/react @heroicons/react
npm install recharts date-fns
npm install axios swr
npm install react-hook-form @hookform/resolvers yup
npm install react-hot-toast
npm install lucide-react
```

### 2. Структура проекта

```
triathlon-frontend/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx
│   ├── create-plan/
│   │   └── page.tsx
│   ├── view-plan/
│   │   └── [uin]/
│   │       └── page.tsx
│   └── profile/
│       └── page.tsx
├── components/
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   └── Modal.tsx
│   ├── TrainingCalendar.tsx
│   ├── TrainingChart.tsx
│   ├── PlanCard.tsx
│   ├── SportIcon.tsx
│   └── DifficultySelector.tsx
├── lib/
│   ├── api.ts
│   ├── types.ts
│   └── utils.ts
├── hooks/
│   ├── useTrainingPlan.ts
│   └── useApi.ts
└── public/
    └── icons/
        ├── swimming.svg
        ├── cycling.svg
        └── running.svg
```

## 📱 Дизайн система

### Цветовая схема:
```css
:root {
  /* Основные цвета */
  --primary-blue: #0ea5e9;      /* Плавание */
  --primary-green: #10b981;     /* Велосипед */
  --primary-orange: #f59e0b;    /* Бег */
  
  /* Уровни сложности */
  --beginner: #22c55e;          /* Начинающий */
  --intermediate: #f59e0b;      /* Средний */
  --advanced: #ef4444;          /* Продвинутый */
  
  /* UI цвета */
  --background: #ffffff;
  --surface: #f8fafc;
  --border: #e2e8f0;
  --text-primary: #1e293b;
  --text-secondary: #64748b;
}
```

### Типографика:
- **Заголовки**: Inter, sans-serif
- **Основной текст**: Inter, sans-serif
- **Моноширинный**: JetBrains Mono

## 🔧 API Integration

### Типы данных (lib/types.ts):

```typescript
export interface User {
  uin: string;
}

export interface TrainingPlan {
  id: number;
  competition_date: string;
  difficulty: number;
  training_days: TrainingDay[];
}

export interface TrainingDay {
  date: string;
  swimming_hours: number;
  cycling_hours: number;
  running_hours: number;
  total_hours: number;
}

export interface CreatePlanRequest {
  uin: string;
  competition_date: string;
  difficulty: number;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}
```

### API клиент (lib/api.ts):

```typescript
import axios from 'axios';
import { TrainingPlan, CreatePlanRequest } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const trainingApi = {
  // Создание плана тренировок
  createPlan: async (data: CreatePlanRequest): Promise<TrainingPlan> => {
    const response = await api.post('/training-plan', data);
    return response.data;
  },

  // Получение плана тренировок
  getPlan: async (uin: string): Promise<TrainingPlan> => {
    const response = await api.get(`/training-plan/${uin}`);
    return response.data;
  },

  // Удаление плана тренировок
  deletePlan: async (uin: string): Promise<void> => {
    await api.delete(`/training-plan/${uin}`);
  },
};
```

### Хуки для работы с API (hooks/useTrainingPlan.ts):

```typescript
import useSWR from 'swr';
import { useState } from 'react';
import { trainingApi } from '@/lib/api';
import { TrainingPlan, CreatePlanRequest } from '@/lib/types';
import toast from 'react-hot-toast';

export const useTrainingPlan = (uin?: string) => {
  const { data, error, mutate } = useSWR(
    uin ? `/training-plan/${uin}` : null,
    () => trainingApi.getPlan(uin!),
    {
      revalidateOnFocus: false,
    }
  );

  return {
    plan: data,
    loading: !error && !data,
    error,
    refetch: mutate,
  };
};

export const useCreatePlan = () => {
  const [loading, setLoading] = useState(false);

  const createPlan = async (data: CreatePlanRequest): Promise<TrainingPlan | null> => {
    setLoading(true);
    try {
      const plan = await trainingApi.createPlan(data);
      toast.success('План тренировок создан успешно!');
      return plan;
    } catch (error) {
      toast.error('Ошибка при создании плана');
      console.error('Error creating plan:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { createPlan, loading };
};
```

## 🎨 Компоненты UI

### 1. Календарь тренировок (components/TrainingCalendar.tsx):

```typescript
'use client';

import { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday } from 'date-fns';
import { ru } from 'date-fns/locale';
import { TrainingDay } from '@/lib/types';
import { SportIcon } from './SportIcon';

interface TrainingCalendarProps {
  trainingDays: TrainingDay[];
  onDayClick?: (day: TrainingDay) => void;
}

export const TrainingCalendar: React.FC<TrainingCalendarProps> = ({
  trainingDays,
  onDayClick,
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getTrainingForDay = (date: Date): TrainingDay | undefined => {
    return trainingDays.find(
      (day) => format(new Date(day.date), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    );
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">
          {format(currentMonth, 'LLLL yyyy', { locale: ru })}
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
            className="p-2 hover:bg-gray-100 rounded"
          >
            ←
          </button>
          <button
            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
            className="p-2 hover:bg-gray-100 rounded"
          >
            →
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map((day) => (
          <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
            {day}
          </div>
        ))}

        {monthDays.map((day) => {
          const training = getTrainingForDay(day);
          const isCurrentMonth = isSameMonth(day, currentMonth);
          const isTodayDate = isToday(day);

          return (
            <div
              key={day.toISOString()}
              onClick={() => training && onDayClick?.(training)}
              className={`
                p-2 min-h-[80px] border border-gray-200 cursor-pointer transition-colors
                ${isCurrentMonth ? 'bg-white hover:bg-gray-50' : 'bg-gray-50 text-gray-400'}
                ${isTodayDate ? 'ring-2 ring-blue-500' : ''}
                ${training ? 'hover:bg-blue-50' : ''}
              `}
            >
              <div className="text-sm font-medium">{format(day, 'd')}</div>
              {training && (
                <div className="mt-1 space-y-1">
                  {training.swimming_hours > 0 && (
                    <div className="flex items-center text-xs">
                      <SportIcon sport="swimming" size={12} />
                      <span className="ml-1">{training.swimming_hours}ч</span>
                    </div>
                  )}
                  {training.cycling_hours > 0 && (
                    <div className="flex items-center text-xs">
                      <SportIcon sport="cycling" size={12} />
                      <span className="ml-1">{training.cycling_hours}ч</span>
                    </div>
                  )}
                  {training.running_hours > 0 && (
                    <div className="flex items-center text-xs">
                      <SportIcon sport="running" size={12} />
                      <span className="ml-1">{training.running_hours}ч</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
```

### 2. График распределения нагрузки (components/TrainingChart.tsx):

```typescript
'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { TrainingDay } from '@/lib/types';

interface TrainingChartProps {
  trainingDays: TrainingDay[];
}

const COLORS = {
  swimming: '#0ea5e9',
  cycling: '#10b981',
  running: '#f59e0b',
};

export const TrainingChart: React.FC<TrainingChartProps> = ({ trainingDays }) => {
  // Данные для круговой диаграммы
  const totalHours = trainingDays.reduce((acc, day) => ({
    swimming: acc.swimming + day.swimming_hours,
    cycling: acc.cycling + day.cycling_hours,
    running: acc.running + day.running_hours,
  }), { swimming: 0, cycling: 0, running: 0 });

  const pieData = [
    { name: 'Плавание', value: totalHours.swimming, color: COLORS.swimming },
    { name: 'Велосипед', value: totalHours.cycling, color: COLORS.cycling },
    { name: 'Бег', value: totalHours.running, color: COLORS.running },
  ].filter(item => item.value > 0);

  // Данные для недельного графика
  const weeklyData = trainingDays.reduce((acc, day, index) => {
    const weekIndex = Math.floor(index / 7);
    if (!acc[weekIndex]) {
      acc[weekIndex] = {
        week: `Неделя ${weekIndex + 1}`,
        swimming: 0,
        cycling: 0,
        running: 0,
      };
    }
    acc[weekIndex].swimming += day.swimming_hours;
    acc[weekIndex].cycling += day.cycling_hours;
    acc[weekIndex].running += day.running_hours;
    return acc;
  }, [] as any[]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Круговая диаграмма */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Распределение по видам спорта</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Столбчатая диаграмма по неделям */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Недельная нагрузка</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={weeklyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="week" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="swimming" stackId="a" fill={COLORS.swimming} name="Плавание" />
            <Bar dataKey="cycling" stackId="a" fill={COLORS.cycling} name="Велосипед" />
            <Bar dataKey="running" stackId="a" fill={COLORS.running} name="Бег" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
```

### 3. Селектор сложности (components/DifficultySelector.tsx):

```typescript
'use client';

import { useState } from 'react';

interface DifficultySelectorProps {
  value: number;
  onChange: (value: number) => void;
}

const DIFFICULTY_LEVELS = [
  { range: [0, 300], label: 'Начинающий', color: 'bg-green-500', description: 'Первые соревнования, базовая подготовка' },
  { range: [301, 700], label: 'Средний', color: 'bg-yellow-500', description: 'Опытный любитель, регулярные старты' },
  { range: [701, 1000], label: 'Продвинутый', color: 'bg-red-500', description: 'Элитный уровень, серьезные цели' },
];

export const DifficultySelector: React.FC<DifficultySelectorProps> = ({ value, onChange }) => {
  const getCurrentLevel = () => {
    return DIFFICULTY_LEVELS.find(level => value >= level.range[0] && value <= level.range[1]) || DIFFICULTY_LEVELS[0];
  };

  const currentLevel = getCurrentLevel();

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">
        Уровень сложности: {value}
      </label>
      
      {/* Слайдер */}
      <div className="relative">
        <input
          type="range"
          min="0"
          max="1000"
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>0</span>
          <span>300</span>
          <span>700</span>
          <span>1000</span>
        </div>
      </div>

      {/* Текущий уровень */}
      <div className={`p-4 rounded-lg ${currentLevel.color} bg-opacity-10 border border-current`}>
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${currentLevel.color}`}></div>
          <span className="font-medium">{currentLevel.label}</span>
        </div>
        <p className="text-sm text-gray-600 mt-1">{currentLevel.description}</p>
      </div>

      {/* Все уровни */}
      <div className="grid grid-cols-3 gap-2 text-xs">
        {DIFFICULTY_LEVELS.map((level, index) => (
          <button
            key={index}
            onClick={() => onChange(Math.floor((level.range[0] + level.range[1]) / 2))}
            className={`p-2 rounded border text-center transition-colors ${
              currentLevel === level
                ? 'border-current bg-opacity-20'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className={`w-2 h-2 rounded-full ${level.color} mx-auto mb-1`}></div>
            <div className="font-medium">{level.label}</div>
            <div className="text-gray-500">{level.range[0]}-{level.range[1]}</div>
          </button>
        ))}
      </div>
    </div>
  );
};
```

## 📄 Страницы приложения

### 1. Главная страница (app/page.tsx):

```typescript
import Link from 'next/link';
import { SportIcon } from '@/components/SportIcon';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-16">
        {/* Hero секция */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            🏊‍♂️🚴‍♂️🏃‍♂️ Triathlon Training
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Персонализированные планы тренировок на основе методологии Джо Фрила "Библия триатлета"
          </p>
          <div className="space-x-4">
            <Link
              href="/create-plan"
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Создать план тренировок
            </Link>
            <Link
              href="/view-plan"
              className="inline-block border border-blue-600 text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              Посмотреть план
            </Link>
          </div>
        </div>

        {/* Особенности */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="text-center p-6">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <SportIcon sport="swimming" size={32} />
            </div>
            <h3 className="text-xl font-semibold mb-2">Плавание</h3>
            <p className="text-gray-600">20-40% от общего времени тренировок</p>
          </div>
          <div className="text-center p-6">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <SportIcon sport="cycling" size={32} />
            </div>
            <h3 className="text-xl font-semibold mb-2">Велосипед</h3>
            <p className="text-gray-600">30-50% от общего времени тренировок</p>
          </div>
          <div className="text-center p-6">
            <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <SportIcon sport="running" size={32} />
            </div>
            <h3 className="text-xl font-semibold mb-2">Бег</h3>
            <p className="text-gray-600">25-35% от общего времени тренировок</p>
          </div>
        </div>

        {/* Уровни подготовки */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-center mb-8">Уровни подготовки</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 border border-green-200 rounded-lg">
              <div className="text-3xl mb-2">🔰</div>
              <h3 className="text-xl font-semibold text-green-600 mb-2">Начинающий</h3>
              <p className="text-gray-600 mb-2">0-300 баллов</p>
              <p className="text-sm text-gray-500">4-10 часов в неделю</p>
            </div>
            <div className="text-center p-6 border border-yellow-200 rounded-lg">
              <div className="text-3xl mb-2">🏃‍♂️</div>
              <h3 className="text-xl font-semibold text-yellow-600 mb-2">Средний</h3>
              <p className="text-gray-600 mb-2">301-700 баллов</p>
              <p className="text-sm text-gray-500">8-16 часов в неделю</p>
            </div>
            <div className="text-center p-6 border border-red-200 rounded-lg">
              <div className="text-3xl mb-2">🏆</div>
              <h3 className="text-xl font-semibold text-red-600 mb-2">Продвинутый</h3>
              <p className="text-gray-600 mb-2">701-1000 баллов</p>
              <p className="text-sm text-gray-500">15-25 часов в неделю</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

### 2. Создание плана (app/create-plan/page.tsx):

```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { DifficultySelector } from '@/components/DifficultySelector';
import { useCreatePlan } from '@/hooks/useTrainingPlan';
import { CreatePlanRequest } from '@/lib/types';

export default function CreatePlanPage() {
  const router = useRouter();
  const { createPlan, loading } = useCreatePlan();
  const [difficulty, setDifficulty] = useState(500);

  const { register, handleSubmit, formState: { errors } } = useForm<CreatePlanRequest>();

  const onSubmit = async (data: CreatePlanRequest) => {
    const planData = { ...data, difficulty };
    const result = await createPlan(planData);
    
    if (result) {
      router.push(`/view-plan/${data.uin}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">
              Создать план тренировок
            </h1>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* UIN пользователя */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Идентификатор пользователя (UIN)
                </label>
                <input
                  type="text"
                  {...register('uin', { required: 'UIN обязателен' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Введите ваш UIN"
                />
                {errors.uin && (
                  <p className="text-red-500 text-sm mt-1">{errors.uin.message}</p>
                )}
              </div>

              {/* Дата соревнования */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Дата соревнования
                </label>
                <input
                  type="date"
                  {...register('competition_date', { required: 'Дата соревнования обязательна' })}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.competition_date && (
                  <p className="text-red-500 text-sm mt-1">{errors.competition_date.message}</p>
                )}
              </div>

              {/* Селектор сложности */}
              <div>
                <DifficultySelector value={difficulty} onChange={setDifficulty} />
              </div>

              {/* Кнопка отправки */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-md font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Создание плана...' : 'Создать план тренировок'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
```

## 🚀 Развертывание

### Environment Variables (.env.local):

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Команды для разработки:

```bash
# Запуск в режиме разработки
npm run dev

# Сборка для продакшена
npm run build

# Запуск продакшн версии
npm start

# Линтинг
npm run lint
```

### Docker (опционально):

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

## 📱 Адаптивность и UX

### Мобильная версия:
- Адаптивные компоненты с Tailwind CSS
- Touch-friendly интерфейс
- Оптимизированные формы для мобильных устройств

### Производительность:
- Lazy loading компонентов
- Оптимизация изображений Next.js
- Кэширование API запросов с SWR

### Доступность:
- Семантическая разметка
- ARIA атрибуты
- Поддержка клавиатуры
- Контрастные цвета

## 🧪 Тестирование

### Unit тесты (Jest + Testing Library):

```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom
```

### E2E тесты (Playwright):

```bash
npm install --save-dev @playwright/test
```

## 📊 Аналитика и мониторинг

- Google Analytics 4
- Sentry для отслеживания ошибок
- Vercel Analytics (при развертывании на Vercel)

---

**Примечание**: Данная документация предоставляет полную структуру для создания современного фронтенда на Next.js. Каждый компонент можно дорабатывать и расширять в соответствии с конкретными требованиями проекта.
