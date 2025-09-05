# 📄 Frontend Pages - Полные примеры страниц

## 🏗️ Layout и навигация

### 1. Основной Layout (app/layout.tsx)

```typescript
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import './globals.css';

const inter = Inter({ subsets: ['latin', 'cyrillic'] });

export const metadata: Metadata = {
  title: 'Triathlon Training Service',
  description: 'Персонализированные планы тренировок на основе методологии Джо Фрила',
  keywords: ['триатлон', 'тренировки', 'план', 'плавание', 'велосипед', 'бег'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-50">
          <header className="bg-white shadow-sm border-b">
            <div className="container mx-auto px-4">
              <div className="flex items-center justify-between h-16">
                <div className="flex items-center space-x-4">
                  <h1 className="text-xl font-bold text-gray-900">
                    🏊‍♂️🚴‍♂️🏃‍♂️ Triathlon Training
                  </h1>
                </div>
                <nav className="hidden md:flex items-center space-x-6">
                  <a href="/" className="text-gray-700 hover:text-blue-600 transition-colors">
                    Главная
                  </a>
                  <a href="/create-plan" className="text-gray-700 hover:text-blue-600 transition-colors">
                    Создать план
                  </a>
                  <a href="/profile" className="text-gray-700 hover:text-blue-600 transition-colors">
                    Мои планы
                  </a>
                </nav>
                <div className="md:hidden">
                  {/* Мобильное меню */}
                </div>
              </div>
            </div>
          </header>
          
          <main>{children}</main>
          
          <footer className="bg-white border-t mt-auto">
            <div className="container mx-auto px-4 py-8">
              <div className="text-center text-gray-600">
                <p>&copy; 2024 Triathlon Training Service. Основано на методологии Джо Фрила.</p>
              </div>
            </div>
          </footer>
        </div>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
```

### 2. Глобальные стили (app/globals.css)

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  /* Цвета видов спорта */
  --swimming-color: #0ea5e9;
  --cycling-color: #10b981;
  --running-color: #f59e0b;
  
  /* Уровни сложности */
  --beginner-color: #22c55e;
  --intermediate-color: #f59e0b;
  --advanced-color: #ef4444;
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}

@layer components {
  .sport-swimming {
    @apply text-blue-500;
  }
  
  .sport-cycling {
    @apply text-green-500;
  }
  
  .sport-running {
    @apply text-orange-500;
  }
  
  .difficulty-beginner {
    @apply bg-green-100 text-green-800;
  }
  
  .difficulty-intermediate {
    @apply bg-yellow-100 text-yellow-800;
  }
  
  .difficulty-advanced {
    @apply bg-red-100 text-red-800;
  }
}

/* Анимации для календаря */
.calendar-day {
  @apply transition-all duration-200 ease-in-out;
}

.calendar-day:hover {
  @apply scale-105 shadow-md;
}

/* Прогресс бары */
.progress-bar {
  @apply transition-all duration-500 ease-out;
}

/* Кастомные скроллбары */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  @apply bg-gray-100 rounded-full;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  @apply bg-gray-300 rounded-full;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  @apply bg-gray-400;
}
```

## 📄 Страницы приложения

### 3. Страница просмотра плана (app/view-plan/[uin]/page.tsx)

```typescript
'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Calendar, BarChart3, Trash2 } from 'lucide-react';
import { useTrainingPlan } from '@/hooks/useTrainingPlan';
import { TrainingCalendar } from '@/components/TrainingCalendar';
import { TrainingChart } from '@/components/TrainingChart';
import { TrainingDayModal } from '@/components/TrainingDayModal';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { trainingApi } from '@/lib/api';
import { TrainingDay } from '@/lib/types';
import { getDifficultyLevel, getDifficultyColor, calculateWeeksUntil } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function ViewPlanPage() {
  const params = useParams();
  const router = useRouter();
  const uin = params.uin as string;
  
  const { plan, loading, error, refetch } = useTrainingPlan(uin);
  const [selectedDay, setSelectedDay] = useState<TrainingDay | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'calendar' | 'statistics'>('calendar');
  const [deleting, setDeleting] = useState(false);

  const handleDayClick = (day: TrainingDay) => {
    setSelectedDay(day);
    setIsModalOpen(true);
  };

  const handleDeletePlan = async () => {
    if (!confirm('Вы уверены, что хотите удалить этот план тренировок?')) {
      return;
    }

    setDeleting(true);
    try {
      await trainingApi.deletePlan(uin);
      toast.success('План тренировок удален');
      router.push('/');
    } catch (error) {
      toast.error('Ошибка при удалении плана');
      console.error('Delete error:', error);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" className="mb-4" />
          <p className="text-gray-600">Загрузка плана тренировок...</p>
        </div>
      </div>
    );
  }

  if (error || !plan) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            План не найден
          </h1>
          <p className="text-gray-600 mb-6">
            План тренировок для пользователя {uin} не существует
          </p>
          <Button onClick={() => router.push('/create-plan')}>
            Создать новый план
          </Button>
        </div>
      </div>
    );
  }

  const totalHours = plan.training_days.reduce((acc, day) => ({
    swimming: acc.swimming + day.swimming_hours,
    cycling: acc.cycling + day.cycling_hours,
    running: acc.running + day.running_hours,
    total: acc.total + day.total_hours,
  }), { swimming: 0, cycling: 0, running: 0, total: 0 });

  const avgWeeklyHours = totalHours.total / (plan.training_days.length / 7);
  const weeksUntilCompetition = calculateWeeksUntil(plan.competition_date);
  const difficultyLevel = getDifficultyLevel(plan.difficulty);
  const difficultyColor = getDifficultyColor(plan.difficulty);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Заголовок */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              План тренировок
            </h1>
            <p className="text-gray-600">
              Пользователь: <span className="font-medium">{uin}</span>
            </p>
          </div>
          <div className="flex items-center space-x-3 mt-4 md:mt-0">
            <Button
              variant="outline"
              onClick={() => router.push(`/create-plan?uin=${uin}`)}
            >
              Обновить план
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeletePlan}
              loading={deleting}
            >
              <Trash2 size={16} className="mr-2" />
              Удалить
            </Button>
          </div>
        </div>

        {/* Информация о плане */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-gray-500">Соревнование</div>
              <div className="text-lg font-semibold">
                {format(new Date(plan.competition_date), 'dd MMMM yyyy', { locale: ru })}
              </div>
              <div className="text-sm text-gray-500">
                Через {weeksUntilCompetition} недель
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-gray-500">Уровень сложности</div>
              <div className={`inline-block px-2 py-1 rounded text-sm font-medium ${difficultyColor}`}>
                {difficultyLevel} ({plan.difficulty})
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-gray-500">Общее время</div>
              <div className="text-lg font-semibold">
                {totalHours.total.toFixed(1)} часов
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-gray-500">В неделю</div>
              <div className="text-lg font-semibold">
                {avgWeeklyHours.toFixed(1)} часов
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Табы */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('calendar')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'calendar'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Calendar size={16} className="inline mr-2" />
              Календарь
            </button>
            <button
              onClick={() => setActiveTab('statistics')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'statistics'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <BarChart3 size={16} className="inline mr-2" />
              Статистика
            </button>
          </nav>
        </div>
      </div>

      {/* Контент табов */}
      {activeTab === 'calendar' && (
        <TrainingCalendar
          trainingDays={plan.training_days}
          onDayClick={handleDayClick}
        />
      )}

      {activeTab === 'statistics' && (
        <TrainingChart trainingDays={plan.training_days} />
      )}

      {/* Модальное окно дня тренировки */}
      <TrainingDayModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        trainingDay={selectedDay}
      />
    </div>
  );
}
```

### 4. Страница профиля (app/profile/page.tsx)

```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { PlanCard } from '@/components/PlanCard';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useDebounce } from '@/hooks/useDebounce';

interface SavedPlan {
  uin: string;
  lastViewed: string;
  planData?: any;
}

export default function ProfilePage() {
  const router = useRouter();
  const [savedPlans, setSavedPlans] = useLocalStorage<SavedPlan[]>('saved-plans', []);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'recent' | 'uin' | 'difficulty'>('recent');
  
  const debouncedSearch = useDebounce(searchQuery, 300);

  // Фильтрация и сортировка планов
  const filteredPlans = savedPlans
    .filter(plan => 
      plan.uin.toLowerCase().includes(debouncedSearch.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return new Date(b.lastViewed).getTime() - new Date(a.lastViewed).getTime();
        case 'uin':
          return a.uin.localeCompare(b.uin);
        case 'difficulty':
          return (b.planData?.difficulty || 0) - (a.planData?.difficulty || 0);
        default:
          return 0;
      }
    });

  const handleViewPlan = (uin: string) => {
    // Обновляем время последнего просмотра
    setSavedPlans(plans => 
      plans.map(plan => 
        plan.uin === uin 
          ? { ...plan, lastViewed: new Date().toISOString() }
          : plan
      )
    );
    router.push(`/view-plan/${uin}`);
  };

  const handleDeletePlan = (uin: string) => {
    setSavedPlans(plans => plans.filter(plan => plan.uin !== uin));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Заголовок */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Мои планы тренировок
          </h1>
          <p className="text-gray-600">
            Управляйте своими планами тренировок
          </p>
        </div>
        <Button onClick={() => router.push('/create-plan')}>
          <Plus size={16} className="mr-2" />
          Создать новый план
        </Button>
      </div>

      {/* Поиск и фильтры */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Поиск по UIN..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Filter size={16} className="text-gray-400" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="recent">Недавние</option>
            <option value="uin">По UIN</option>
            <option value="difficulty">По сложности</option>
          </select>
        </div>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">
              {savedPlans.length}
            </div>
            <div className="text-sm text-gray-500">Всего планов</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">
              {savedPlans.filter(p => p.planData?.difficulty <= 300).length}
            </div>
            <div className="text-sm text-gray-500">Начинающий уровень</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">
              {savedPlans.filter(p => p.planData?.difficulty > 700).length}
            </div>
            <div className="text-sm text-gray-500">Продвинутый уровень</div>
          </CardContent>
        </Card>
      </div>

      {/* Список планов */}
      {filteredPlans.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {savedPlans.length === 0 ? 'Нет планов тренировок' : 'Планы не найдены'}
            </h3>
            <p className="text-gray-600 mb-6">
              {savedPlans.length === 0 
                ? 'Создайте свой первый план тренировок для начала работы'
                : 'Попробуйте изменить параметры поиска'
              }
            </p>
            <Button onClick={() => router.push('/create-plan')}>
              Создать план тренировок
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlans.map((savedPlan) => (
            <div key={savedPlan.uin} className="relative">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>UIN: {savedPlan.uin}</span>
                    {savedPlan.planData && (
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        savedPlan.planData.difficulty <= 300 
                          ? 'bg-green-100 text-green-800'
                          : savedPlan.planData.difficulty <= 700
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {savedPlan.planData.difficulty}
                      </span>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    <div className="text-sm text-gray-500">
                      Последний просмотр: {new Date(savedPlan.lastViewed).toLocaleDateString('ru-RU')}
                    </div>
                    {savedPlan.planData && (
                      <div className="text-sm text-gray-500">
                        Соревнование: {new Date(savedPlan.planData.competition_date).toLocaleDateString('ru-RU')}
                      </div>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      className="flex-1"
                      onClick={() => handleViewPlan(savedPlan.uin)}
                    >
                      Открыть
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeletePlan(savedPlan.uin)}
                    >
                      Удалить
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

### 5. Страница поиска плана (app/search-plan/page.tsx)

```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import toast from 'react-hot-toast';

export default function SearchPlanPage() {
  const router = useRouter();
  const [uin, setUin] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!uin.trim()) {
      toast.error('Введите UIN пользователя');
      return;
    }

    setLoading(true);
    
    try {
      // Проверяем существование плана
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/training-plan/${uin}`);
      
      if (response.ok) {
        router.push(`/view-plan/${uin}`);
      } else if (response.status === 404) {
        toast.error('План тренировок не найден');
      } else {
        toast.error('Ошибка при поиске плана');
      }
    } catch (error) {
      toast.error('Ошибка подключения к серверу');
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">
            <Search size={24} className="mx-auto mb-2" />
            Найти план тренировок
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                UIN пользователя
              </label>
              <Input
                type="text"
                value={uin}
                onChange={(e) => setUin(e.target.value)}
                placeholder="Введите UIN"
                className="w-full"
              />
            </div>
            
            <Button
              type="submit"
              className="w-full"
              loading={loading}
            >
              {loading ? 'Поиск...' : 'Найти план'}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500 mb-4">
              Нет плана тренировок?
            </p>
            <Button
              variant="outline"
              onClick={() => router.push('/create-plan')}
              className="w-full"
            >
              Создать новый план
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
```

## ⚙️ Конфигурационные файлы

### 6. Next.js конфигурация (next.config.js)

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['localhost'],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
```

### 7. Tailwind конфигурация (tailwind.config.js)

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Цвета видов спорта
        swimming: '#0ea5e9',
        cycling: '#10b981',
        running: '#f59e0b',
        
        // Уровни сложности
        beginner: '#22c55e',
        intermediate: '#f59e0b',
        advanced: '#ef4444',
        
        // UI цвета
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
};
```

### 8. TypeScript конфигурация (tsconfig.json)

```json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

---

**Примечание**: Эти примеры страниц обеспечивают полную функциональность фронтенда с современным UI/UX, адаптивным дизайном и интеграцией с backend API. Каждая страница оптимизирована для производительности и удобства использования.
