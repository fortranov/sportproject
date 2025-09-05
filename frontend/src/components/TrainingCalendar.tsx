'use client';

import { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, startOfWeek, endOfWeek } from 'date-fns';
import { ru } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { TrainingDay } from '@/lib/types';
import { SportIcon } from './SportIcon';
import { Button } from './ui/Button';

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
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const getTrainingForDay = (date: Date): TrainingDay | undefined => {
    return trainingDays.find(
      (day) => format(new Date(day.date), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    );
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      if (direction === 'prev') {
        newMonth.setMonth(prev.getMonth() - 1);
      } else {
        newMonth.setMonth(prev.getMonth() + 1);
      }
      return newMonth;
    });
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">
          {format(currentMonth, 'LLLL yyyy', { locale: ru })}
        </h2>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateMonth('prev')}
          >
            <ChevronLeft size={16} />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateMonth('next')}
          >
            <ChevronRight size={16} />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map((day) => (
          <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
            {day}
          </div>
        ))}

        {calendarDays.map((day) => {
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

