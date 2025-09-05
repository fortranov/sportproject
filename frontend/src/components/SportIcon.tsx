'use client';

import { Waves, Bike, Run } from 'lucide-react';
import { SportType } from '../lib/types';

interface SportIconProps {
  sport: SportType;
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
      return <Waves {...iconProps} />;
    case 'cycling':
      return <Bike {...iconProps} />;
    case 'running':
      return <Run {...iconProps} />;
    default:
      return null;
  }
};

const getSportColor = (sport: SportType): string => {
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

