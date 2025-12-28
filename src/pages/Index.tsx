
import React, { useState } from 'react';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { LoginForm } from '@/components/LoginForm';
import { RegisterForm } from '@/components/RegisterForm';
import { CitizenDashboard } from '@/components/CitizenDashboard';
import { CorporatorDashboard } from '@/components/CorporatorDashboard';
import { PresidentDashboard } from '@/components/PresidentDashboard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const CIVIX_LOGO = "🏛️";

const WelcomeScreen: React.FC<{ onShowLogin: () => void; onShowRegister: () => void }> = ({ onShowLogin, onShowRegister }) => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 flex items-center justify-center p-4">
    <Card className="w-full max-w-4xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-2xl">
      <CardHeader className="text-center space-y-4 py-8">
        <div className="text-8xl mb-4">{CIVIX_LOGO}</div>
        <CardTitle className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent">
          CIVIX
        </CardTitle>
        <CardDescription className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Your Voice for a Better City - Empowering Citizens, Corporators, and Municipal Presidents
        </CardDescription>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          Report civic issues, track their resolution, and foster accountability across all levels of municipal governance in Mandya, Karnataka.
        </p>
      </CardHeader>
      <CardContent className="space-y-6 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="text-4xl mb-4">👥</div>
            <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-300 mb-2">Citizens</h3>
            <p className="text-sm text-blue-600 dark:text-blue-400">Report civic issues with photos and precise location tracking</p>
          </div>
          
          <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg border border-green-200 dark:border-green-800">
            <div className="text-4xl mb-4">🏛️</div>
            <h3 className="text-lg font-semibold text-green-700 dark:text-green-300 mb-2">Corporators</h3>
            <p className="text-sm text-green-600 dark:text-green-400">Manage and resolve ward-specific issues efficiently</p>
          </div>
          
          <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg border border-purple-200 dark:border-purple-800">
            <div className="text-4xl mb-4">👑</div>
            <h3 className="text-lg font-semibold text-purple-700 dark:text-purple-300 mb-2">President</h3>
            <p className="text-sm text-purple-600 dark:text-purple-400">Oversee city-wide issues and manage escalations</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
          <Button
            onClick={onShowLogin}
            className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold transition-all duration-200 transform hover:scale-[1.02]"
          >
            Login to Continue
          </Button>
          <Button
            onClick={onShowRegister}
            variant="outline"
            className="flex-1 h-12 border-2 border-gradient-to-r from-blue-600 to-purple-600 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20 font-semibold transition-all duration-200"
          >
            Create Account
          </Button>
        </div>

        <div className="text-center pt-4">
          <p className="text-sm text-muted-foreground">
            🌟 Real-time tracking • ⏰ Timer-based escalation • 📱 Mobile responsive • 🌙 Dark mode support
          </p>
        </div>
      </CardContent>
    </Card>
  </div>
);

const AppContent: React.FC = () => {
  const [screen, setScreen] = useState<'welcome' | 'login' | 'register'>('welcome');
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    setScreen('welcome');
  };

  if (user) {
    switch (user.role) {
      case 'citizen':
        return <CitizenDashboard onLogout={handleLogout} />;
      case 'corporator':
        return <CorporatorDashboard onLogout={handleLogout} />;
      case 'president':
        return <PresidentDashboard onLogout={handleLogout} />;
      default:
        return <div>Invalid user role</div>;
    }
  }

  switch (screen) {
    case 'login':
      return (
        <LoginForm
          onBack={() => setScreen('welcome')}
          onSwitchToRegister={() => setScreen('register')}
        />
      );
    case 'register':
      return (
        <RegisterForm
          onBack={() => setScreen('welcome')}
          onSwitchToLogin={() => setScreen('login')}
        />
      );
    default:
      return (
        <WelcomeScreen
          onShowLogin={() => setScreen('login')}
          onShowRegister={() => setScreen('register')}
        />
      );
  }
};

const Index: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
};

export default Index;
