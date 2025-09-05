'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { DifficultySelector } from '@/components/DifficultySelector';
import { useCreatePlan } from '@/hooks/useTrainingPlan';
import { CreatePlanRequest } from '@/lib/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

function CreatePlanForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { createPlan, loading } = useCreatePlan();
  const [difficulty, setDifficulty] = useState(500);

  const { register, handleSubmit, formState: { errors } } = useForm<CreatePlanRequest>({
    defaultValues: {
      uin: searchParams.get('uin') || '',
    }
  });

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
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-center">
                Создать план тренировок
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* UIN пользователя */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Идентификатор пользователя (UIN)
                  </label>
                  <Input
                    type="text"
                    {...register('uin', { required: 'UIN обязателен' })}
                    placeholder="Введите ваш UIN"
                    error={!!errors.uin}
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
                  <Input
                    type="date"
                    {...register('competition_date', { required: 'Дата соревнования обязательна' })}
                    min={new Date().toISOString().split('T')[0]}
                    error={!!errors.competition_date}
                  />
                  {errors.competition_date && (
                    <p className="text-red-500 text-sm mt-1">{errors.competition_date.message}</p>
                  )}
                </div>

                {/* Селектор сложности */}
                <div>
                  <DifficultySelector value={difficulty} onChange={setDifficulty} />
                </div>

                {/* Информация о плане */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-medium text-blue-900 mb-2">ℹ️ Что включает план:</h3>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Ежедневное расписание тренировок до даты соревнования</li>
                    <li>• Автоматическое распределение нагрузки между видами спорта</li>
                    <li>• Периодизация на основе методологии Джо Фрила</li>
                    <li>• Тейперинг перед соревнованием</li>
                  </ul>
                </div>

                {/* Кнопка отправки */}
                <Button
                  type="submit"
                  loading={loading}
                  className="w-full"
                  size="lg"
                >
                  {loading ? 'Создание плана...' : 'Создать план тренировок'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function CreatePlanPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Загрузка...</p>
        </div>
      </div>
    }>
      <CreatePlanForm />
    </Suspense>
  );
}

