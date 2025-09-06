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

export default api;

