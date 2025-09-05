'use client';

// import { useState } from 'react';

interface DifficultySelectorProps {
  value: number;
  onChange: (value: number) => void;
}

const DIFFICULTY_LEVELS = [
  { range: [0, 300], label: 'Начинающий', color: 'bg-green-500', description: 'Первые соревнования, базовая подготовка' },
  { range: [301, 700], label: 'Средний', color: 'bg-yellow-500', description: 'Опытный любитель, регулярные старты' },
  { range: [701, 1000], label: 'Продвинутый', color: 'bg-red-500', description: 'Элитный уровень, серьезные цели' },
];

export const DifficultySelector: React.FC<DifficultySelectorProps> = ({ value, onChange }) => {
  const getCurrentLevel = () => {
    return DIFFICULTY_LEVELS.find(level => value >= level.range[0] && value <= level.range[1]) || DIFFICULTY_LEVELS[0];
  };

  const currentLevel = getCurrentLevel();

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">
        Уровень сложности: {value}
      </label>
      
      {/* Слайдер */}
      <div className="relative">
        <input
          type="range"
          min="0"
          max="1000"
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>0</span>
          <span>300</span>
          <span>700</span>
          <span>1000</span>
        </div>
      </div>

      {/* Текущий уровень */}
      <div className={`p-4 rounded-lg ${currentLevel.color} bg-opacity-10 border border-current`}>
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${currentLevel.color}`}></div>
          <span className="font-medium">{currentLevel.label}</span>
        </div>
        <p className="text-sm text-gray-600 mt-1">{currentLevel.description}</p>
      </div>

      {/* Все уровни */}
      <div className="grid grid-cols-3 gap-2 text-xs">
        {DIFFICULTY_LEVELS.map((level, index) => (
          <button
            key={index}
            onClick={() => onChange(Math.floor((level.range[0] + level.range[1]) / 2))}
            className={`p-2 rounded border text-center transition-colors ${
              currentLevel === level
                ? 'border-current bg-opacity-20'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className={`w-2 h-2 rounded-full ${level.color} mx-auto mb-1`}></div>
            <div className="font-medium">{level.label}</div>
            <div className="text-gray-500">{level.range[0]}-{level.range[1]}</div>
          </button>
        ))}
      </div>
    </div>
  );
};
