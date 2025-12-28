
import React from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { User, Settings } from 'lucide-react';

interface CorporatorHeaderProps {
  onShowProfile: () => void;
  onLogout: () => void;
}

export const CorporatorHeader: React.FC<CorporatorHeaderProps> = ({
  onShowProfile,
  onLogout
}) => {
  const { user } = useAuth();
  const { t, isDark, toggleTheme, toggleLanguage, language } = useTheme();

  return (
    <div className="flex justify-between items-center mb-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg p-4 shadow-lg">
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-blue-600 rounded-full flex items-center justify-center">
          <User className="text-white" size={24} />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-800 dark:text-gray-200">Corporator Dashboard</h1>
          <p className="text-sm text-muted-foreground">{user?.name} - Ward {user?.wardNumber}</p>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onShowProfile}
          className="bg-white/50 dark:bg-gray-700/50"
        >
          <Settings size={16} className="mr-1" />
          Profile
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={toggleLanguage}
          className="bg-white/50 dark:bg-gray-700/50"
        >
          {language === 'en' ? 'ಕನ್ನಡ' : 'English'}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={toggleTheme}
          className="bg-white/50 dark:bg-gray-700/50"
        >
          {isDark ? '☀️' : '🌙'}
        </Button>
        <Button onClick={onLogout} variant="destructive" size="sm">
          {t('logout')}
        </Button>
      </div>
    </div>
  );
};
