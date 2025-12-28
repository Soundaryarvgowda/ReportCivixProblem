
import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface TimerDisplayProps {
  startTime: Date;
  duration: number; // in hours
  label: string;
  onExpire?: () => void;
  className?: string;
}

export const TimerDisplay: React.FC<TimerDisplayProps> = ({ 
  startTime, 
  duration, 
  label, 
  onExpire, 
  className = '' 
}) => {
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const elapsed = now.getTime() - startTime.getTime();
      const totalDuration = duration * 60 * 60 * 1000; // Convert hours to milliseconds
      const remaining = totalDuration - elapsed;

      if (remaining <= 0) {
        setTimeLeft('00:00:00');
        setIsExpired(true);
        if (onExpire && !isExpired) {
          onExpire();
        }
      } else {
        const hours = Math.floor(remaining / (1000 * 60 * 60));
        const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((remaining % (1000 * 60)) / 1000);
        
        setTimeLeft(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
        setIsExpired(false);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime, duration, onExpire, isExpired]);

  return (
    <div className={`flex items-center gap-2 ${isExpired ? 'text-red-500' : 'text-orange-500'} ${className}`}>
      <Clock size={16} />
      <span className="font-mono text-sm">
        {label}: {timeLeft}
      </span>
      {isExpired && (
        <span className="text-xs font-semibold bg-red-100 text-red-800 px-2 py-1 rounded">
          EXPIRED
        </span>
      )}
    </div>
  );
};
