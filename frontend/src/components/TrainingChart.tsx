'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { TrainingDay } from '../lib/types';

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
  }, [] as Array<{week: string; swimming: number; cycling: number; running: number}>);

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
