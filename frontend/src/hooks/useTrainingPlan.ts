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
      shouldRetryOnError: false,
    }
  );

  return {
    plan: data,
    loading: !error && !data && uin,
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

export const useDeletePlan = () => {
  const [loading, setLoading] = useState(false);

  const deletePlan = async (uin: string): Promise<boolean> => {
    setLoading(true);
    try {
      await trainingApi.deletePlan(uin);
      toast.success('План тренировок удален');
      return true;
    } catch (error) {
      toast.error('Ошибка при удалении плана');
      console.error('Error deleting plan:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { deletePlan, loading };
};

