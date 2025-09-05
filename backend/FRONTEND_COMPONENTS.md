# 🧩 Frontend Components - Дополнительные компоненты и утилиты

## 📦 Дополнительные компоненты

### 1. SportIcon Component (components/SportIcon.tsx)

```typescript
'use client';

import { Swimming, Bike, Run } from 'lucide-react';

interface SportIconProps {
  sport: 'swimming' | 'cycling' | 'running';
  size?: number;
  className?: string;
}

export const SportIcon: React.FC<SportIconProps> = ({ sport, size = 24, className = '' }) => {
  const iconProps = {
    size,
    className: `${className} ${getSportColor(sport)}`,
  };

  switch (sport) {
    case 'swimming':
      return <Swimming {...iconProps} />;
    case 'cycling':
      return <Bike {...iconProps} />;
    case 'running':
      return <Run {...iconProps} />;
    default:
      return null;
  }
};

const getSportColor = (sport: string): string => {
  switch (sport) {
    case 'swimming':
      return 'text-blue-500';
    case 'cycling':
      return 'text-green-500';
    case 'running':
      return 'text-orange-500';
    default:
      return 'text-gray-500';
  }
};
```

### 2. PlanCard Component (components/PlanCard.tsx)

```typescript
'use client';

import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { TrainingPlan } from '@/lib/types';
import { SportIcon } from './SportIcon';
import { getDifficultyLevel, getDifficultyColor } from '@/lib/utils';

interface PlanCardProps {
  plan: TrainingPlan;
  onView?: () => void;
  onDelete?: () => void;
}

export const PlanCard: React.FC<PlanCardProps> = ({ plan, onView, onDelete }) => {
  const totalHours = plan.training_days.reduce((acc, day) => ({
    swimming: acc.swimming + day.swimming_hours,
    cycling: acc.cycling + day.cycling_hours,
    running: acc.running + day.running_hours,
    total: acc.total + day.total_hours,
  }), { swimming: 0, cycling: 0, running: 0, total: 0 });

  const avgWeeklyHours = totalHours.total / (plan.training_days.length / 7);
  const difficultyLevel = getDifficultyLevel(plan.difficulty);
  const difficultyColor = getDifficultyColor(plan.difficulty);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      {/* Заголовок */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            План тренировок
          </h3>
          <p className="text-sm text-gray-500">
            {format(new Date(plan.competition_date), 'dd MMMM yyyy', { locale: ru })}
          </p>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-medium ${difficultyColor}`}>
          {difficultyLevel} ({plan.difficulty})
        </div>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-500">Общее время</p>
          <p className="text-lg font-semibold">{totalHours.total.toFixed(1)}ч</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">В неделю</p>
          <p className="text-lg font-semibold">{avgWeeklyHours.toFixed(1)}ч</p>
        </div>
      </div>

      {/* Распределение по видам спорта */}
      <div className="space-y-2 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <SportIcon sport="swimming" size={16} />
            <span className="text-sm">Плавание</span>
          </div>
          <span className="text-sm font-medium">
            {totalHours.swimming.toFixed(1)}ч ({((totalHours.swimming / totalHours.total) * 100).toFixed(0)}%)
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <SportIcon sport="cycling" size={16} />
            <span className="text-sm">Велосипед</span>
          </div>
          <span className="text-sm font-medium">
            {totalHours.cycling.toFixed(1)}ч ({((totalHours.cycling / totalHours.total) * 100).toFixed(0)}%)
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <SportIcon sport="running" size={16} />
            <span className="text-sm">Бег</span>
          </div>
          <span className="text-sm font-medium">
            {totalHours.running.toFixed(1)}ч ({((totalHours.running / totalHours.total) * 100).toFixed(0)}%)
          </span>
        </div>
      </div>

      {/* Прогресс бар */}
      <div className="mb-4">
        <div className="flex rounded-full overflow-hidden h-2">
          <div 
            className="bg-blue-500" 
            style={{ width: `${(totalHours.swimming / totalHours.total) * 100}%` }}
          />
          <div 
            className="bg-green-500" 
            style={{ width: `${(totalHours.cycling / totalHours.total) * 100}%` }}
          />
          <div 
            className="bg-orange-500" 
            style={{ width: `${(totalHours.running / totalHours.total) * 100}%` }}
          />
        </div>
      </div>

      {/* Действия */}
      <div className="flex space-x-3">
        <button
          onClick={onView}
          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          Посмотреть план
        </button>
        <button
          onClick={onDelete}
          className="px-4 py-2 border border-red-300 text-red-600 rounded-md text-sm font-medium hover:bg-red-50 transition-colors"
        >
          Удалить
        </button>
      </div>
    </div>
  );
};
```

### 3. TrainingDayModal Component (components/TrainingDayModal.tsx)

```typescript
'use client';

import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X } from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { TrainingDay } from '@/lib/types';
import { SportIcon } from './SportIcon';

interface TrainingDayModalProps {
  isOpen: boolean;
  onClose: () => void;
  trainingDay: TrainingDay | null;
}

export const TrainingDayModal: React.FC<TrainingDayModalProps> = ({
  isOpen,
  onClose,
  trainingDay,
}) => {
  if (!trainingDay) return null;

  const trainingSessions = [
    {
      sport: 'swimming' as const,
      hours: trainingDay.swimming_hours,
      name: 'Плавание',
      description: 'Техническая работа, развитие выносливости',
    },
    {
      sport: 'cycling' as const,
      hours: trainingDay.cycling_hours,
      name: 'Велосипед',
      description: 'Аэробная база, работа на мощности',
    },
    {
      sport: 'running' as const,
      hours: trainingDay.running_hours,
      name: 'Бег',
      description: 'Развитие скорости и выносливости',
    },
  ].filter(session => session.hours > 0);

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex justify-between items-center mb-4">
                  <Dialog.Title className="text-lg font-medium text-gray-900">
                    Тренировка на {format(new Date(trainingDay.date), 'dd MMMM', { locale: ru })}
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-4">
                  {trainingSessions.length > 0 ? (
                    <>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="text-sm text-gray-600">Общее время тренировки</div>
                        <div className="text-xl font-semibold text-gray-900">
                          {trainingDay.total_hours.toFixed(1)} часов
                        </div>
                      </div>

                      {trainingSessions.map((session) => (
                        <div key={session.sport} className="border rounded-lg p-4">
                          <div className="flex items-center space-x-3 mb-2">
                            <SportIcon sport={session.sport} size={20} />
                            <div>
                              <h4 className="font-medium text-gray-900">{session.name}</h4>
                              <p className="text-sm text-gray-500">{session.description}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-lg font-semibold text-gray-900">
                              {session.hours.toFixed(1)} ч
                            </span>
                          </div>
                        </div>
                      ))}
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <div className="text-gray-400 mb-2">😴</div>
                      <p className="text-gray-600">День отдыха</p>
                    </div>
                  )}
                </div>

                <div className="mt-6">
                  <button
                    onClick={onClose}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md font-medium hover:bg-blue-700 transition-colors"
                  >
                    Закрыть
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
```

### 4. LoadingSpinner Component (components/ui/LoadingSpinner.tsx)

```typescript
'use client';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className={`inline-block animate-spin rounded-full border-2 border-solid border-current border-r-transparent ${sizeClasses[size]} ${className}`}>
      <span className="sr-only">Loading...</span>
    </div>
  );
};
```

## 🛠️ Утилиты (lib/utils.ts)

```typescript
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getDifficultyLevel(difficulty: number): string {
  if (difficulty <= 300) return 'Начинающий';
  if (difficulty <= 700) return 'Средний';
  return 'Продвинутый';
}

export function getDifficultyColor(difficulty: number): string {
  if (difficulty <= 300) return 'bg-green-100 text-green-800';
  if (difficulty <= 700) return 'bg-yellow-100 text-yellow-800';
  return 'bg-red-100 text-red-800';
}

export function formatHours(hours: number): string {
  if (hours === 0) return '0ч';
  if (hours < 1) return `${(hours * 60).toFixed(0)}мин`;
  return `${hours.toFixed(1)}ч`;
}

export function calculateWeeksUntil(date: string): number {
  const targetDate = new Date(date);
  const today = new Date();
  const diffTime = targetDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, Math.ceil(diffDays / 7));
}

export function getTrainingIntensity(totalHours: number): {
  level: string;
  color: string;
  description: string;
} {
  if (totalHours === 0) {
    return {
      level: 'Отдых',
      color: 'text-gray-500',
      description: 'День восстановления',
    };
  }
  
  if (totalHours <= 1) {
    return {
      level: 'Легкая',
      color: 'text-green-500',
      description: 'Восстановительная тренировка',
    };
  }
  
  if (totalHours <= 2.5) {
    return {
      level: 'Средняя',
      color: 'text-yellow-500',
      description: 'Базовая аэробная работа',
    };
  }
  
  if (totalHours <= 4) {
    return {
      level: 'Высокая',
      color: 'text-orange-500',
      description: 'Интенсивная тренировка',
    };
  }
  
  return {
    level: 'Очень высокая',
    color: 'text-red-500',
    description: 'Максимальная нагрузка',
  };
}
```

## 🎨 Дополнительные UI компоненты

### 1. Button Component (components/ui/Button.tsx)

```typescript
'use client';

import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { LoadingSpinner } from './LoadingSpinner';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading = false, children, disabled, ...props }, ref) => {
    const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background';
    
    const variants = {
      primary: 'bg-blue-600 text-white hover:bg-blue-700',
      secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
      outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50',
      ghost: 'text-gray-700 hover:bg-gray-100',
      destructive: 'bg-red-600 text-white hover:bg-red-700',
    };

    const sizes = {
      sm: 'h-8 px-3 text-sm',
      md: 'h-10 px-4',
      lg: 'h-12 px-6 text-lg',
    };

    return (
      <button
        className={cn(baseClasses, variants[variant], sizes[size], className)}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <LoadingSpinner size="sm" className="mr-2" />}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
```

### 2. Input Component (components/ui/Input.tsx)

```typescript
'use client';

import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          error && 'border-red-500 focus-visible:ring-red-500',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';

export { Input };
```

### 3. Card Component (components/ui/Card.tsx)

```typescript
'use client';

import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('rounded-lg border border-gray-200 bg-white shadow-sm', className)}
      {...props}
    />
  )
);

const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex flex-col space-y-1.5 p-6', className)}
      {...props}
    />
  )
);

const CardTitle = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn('text-lg font-semibold leading-none tracking-tight', className)}
      {...props}
    />
  )
);

const CardDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn('text-sm text-gray-500', className)}
      {...props}
    />
  )
);

const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
  )
);

const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex items-center p-6 pt-0', className)}
      {...props}
    />
  )
);

Card.displayName = 'Card';
CardHeader.displayName = 'CardHeader';
CardTitle.displayName = 'CardTitle';
CardDescription.displayName = 'CardDescription';
CardContent.displayName = 'CardContent';
CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
```

## 📱 Мобильные компоненты

### 1. MobileMenu Component (components/MobileMenu.tsx)

```typescript
'use client';

import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';

const navigation = [
  { name: 'Главная', href: '/' },
  { name: 'Создать план', href: '/create-plan' },
  { name: 'Мои планы', href: '/profile' },
];

export const MobileMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden p-2 text-gray-600 hover:text-gray-900"
      >
        <Menu size={24} />
      </button>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={setIsOpen}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-start justify-end">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-x-full"
                enterTo="opacity-100 translate-x-0"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-x-0"
                leaveTo="opacity-0 translate-x-full"
              >
                <Dialog.Panel className="w-full max-w-sm transform bg-white shadow-xl transition-all">
                  <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-lg font-semibold">Меню</h2>
                    <button
                      onClick={() => setIsOpen(false)}
                      className="p-2 text-gray-400 hover:text-gray-600"
                    >
                      <X size={20} />
                    </button>
                  </div>
                  
                  <nav className="p-4">
                    <ul className="space-y-4">
                      {navigation.map((item) => (
                        <li key={item.name}>
                          <Link
                            href={item.href}
                            onClick={() => setIsOpen(false)}
                            className="block py-2 text-gray-700 hover:text-blue-600 transition-colors"
                          >
                            {item.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </nav>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};
```

## 🔧 Дополнительные хуки

### 1. useLocalStorage Hook (hooks/useLocalStorage.ts)

```typescript
'use client';

import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setStoredValue(JSON.parse(item));
      }
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
    }
  }, [key]);

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue] as const;
}
```

### 2. useDebounce Hook (hooks/useDebounce.ts)

```typescript
'use client';

import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
```

---

**Примечание**: Эти компоненты и утилиты обеспечивают полную функциональность для создания современного и интуитивного пользовательского интерфейса. Каждый компонент разработан с учетом лучших практик React и Next.js.
