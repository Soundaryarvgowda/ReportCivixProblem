
import React from 'react';
import { Button } from '@/components/ui/button';
import { Clock, CheckCircle, AlertTriangle } from 'lucide-react';

interface CorporatorNavigationProps {
  onNavigate: (tab: 'pending' | 'accepted' | 'resolved' | 'escalated') => void;
}

export const CorporatorNavigation: React.FC<CorporatorNavigationProps> = ({ onNavigate }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Button
        onClick={() => onNavigate('pending')}
        className="h-16 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white flex flex-col items-center justify-center"
      >
        <Clock size={20} />
        <span className="font-semibold">Pending Issues</span>
      </Button>

      <Button
        onClick={() => onNavigate('accepted')}
        className="h-16 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white flex flex-col items-center justify-center"
      >
        <CheckCircle size={20} />
        <span className="font-semibold">Accepted Issues</span>
      </Button>

      <Button
        onClick={() => onNavigate('resolved')}
        className="h-16 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white flex flex-col items-center justify-center"
      >
        <CheckCircle size={20} />
        <span className="font-semibold">Resolved Issues</span>
      </Button>

      <Button
        onClick={() => onNavigate('escalated')}
        className="h-16 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white flex flex-col items-center justify-center"
      >
        <AlertTriangle size={20} />
        <span className="font-semibold">Escalated Issues</span>
      </Button>
    </div>
  );
};
