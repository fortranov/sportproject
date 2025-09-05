'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Calendar, BarChart3, Trash2, Edit } from 'lucide-react';
import { useTrainingPlan, useDeletePlan } from '@/hooks/useTrainingPlan';
import { TrainingCalendar } from '@/components/TrainingCalendar';
import { TrainingChart } from '@/components/TrainingChart';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { TrainingDay } from '@/lib/types';
import { getDifficultyLevel, getDifficultyColor, calculateWeeksUntil } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function ViewPlanPage() {
  const params = useParams();
  const router = useRouter();
  const uin = params.uin as string;
  
  const { plan, loading, error } = useTrainingPlan(uin);
  const { deletePlan, loading: deleting } = useDeletePlan();
  // const [selectedDay] = useState<TrainingDay | null>(null);
  const [activeTab, setActiveTab] = useState<'calendar' | 'statistics'>('calendar');

  const handleDayClick = (day: TrainingDay) => {
    // Здесь можно открыть модальное окно или показать детали дня
    toast.success(`Выбран день: ${format(new Date(day.date), 'dd MMMM', { locale: ru })}`);
  };

  const handleDeletePlan = async () => {
    if (!confirm('Вы уверены, что хотите удалить этот план тренировок?')) {
      return;
    }

    const success = await deletePlan(uin);
    if (success) {
      router.push('/');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
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
              <Edit size={16} className="mr-2" />
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
    </div>
  );
}
