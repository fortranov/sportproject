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

