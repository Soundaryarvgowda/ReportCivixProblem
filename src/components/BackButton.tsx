
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';

interface BackButtonProps {
  onClick: () => void;
  className?: string;
}

export const BackButton: React.FC<BackButtonProps> = ({ onClick, className = '' }) => {
  const { t } = useTheme();

  return (
    <Button
      variant="ghost"
      onClick={onClick}
      className={`mb-4 flex items-center gap-2 text-primary hover:bg-primary/10 ${className}`}
    >
      <ArrowLeft size={18} />
      {t('back')}
    </Button>
  );
};
