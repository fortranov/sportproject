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

export type SportType = 'swimming' | 'cycling' | 'running';

export interface TrainingStats {
  totalHours: number;
  swimmingHours: number;
  cyclingHours: number;
  runningHours: number;
  avgWeeklyHours: number;
}

