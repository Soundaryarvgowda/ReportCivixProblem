
import React, { createContext, useContext, useState, useEffect } from 'react';

interface ThemeContextType {
  isDark: boolean;
  language: 'en' | 'kn';
  toggleTheme: () => void;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

const translations = {
  en: {
    // Common
    login: 'Login',
    register: 'Register',
    logout: 'Logout',
    back: 'Back',
    submit: 'Submit',
    cancel: 'Cancel',
    accept: 'Accept',
    resolve: 'Resolve',
    escalate: 'Escalate',
    
    // Authentication
    loginTitle: 'Login to Civix',
    registerTitle: 'Register for Civix',
    mobileOrEmail: 'Mobile Number or Email',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    name: 'Full Name',
    address: 'Address',
    wardNumber: 'Ward Number',
    selectRole: 'Select Role',
    citizen: 'Citizen',
    corporator: 'Municipal Corporator',
    president: 'Municipal President',
    
    // Dashboard
    dashboard: 'Dashboard',
    reportIssue: 'Report Issue',
    ongoingIssues: 'Ongoing Issues',
    resolvedIssues: 'Resolved Issues',
    complaints: 'My Complaints',
    profile: 'Profile',
    
    // Issue Types
    drainage: 'Drainage Issues',
    water: 'Water Issues',
    potholes: 'Potholes',
    waste: 'Waste Issues',
    
    // Status
    pending: 'Pending',
    accepted: 'Accepted',
    resolved: 'Resolved',
    escalated: 'Escalated',
    
    // Error Messages
    invalidContact: 'Invalid mobile number or email address',
    invalidEmail: 'Email must end with @gmail.com',
    loginFailed: 'Login failed. Please check your credentials.',
    registrationFailed: 'Registration failed. User may already exist.',
  },
  kn: {
    // Common
    login: 'ಲಾಗಿನ್',
    register: 'ನೋಂದಣಿ',
    logout: 'ಲಾಗೌಟ್',
    back: 'ಹಿಂದೆ',
    submit: 'ಸಲ್ಲಿಸಿ',
    cancel: 'ರದ್ದುಮಾಡಿ',
    accept: 'ಸ್ವೀಕರಿಸಿ',
    resolve: 'ಪರಿಹರಿಸಿ',
    escalate: 'ಮೇಲ್ದರ್ಜೆಗೆ ಕಳುಹಿಸಿ',
    
    // Authentication
    loginTitle: 'ಸಿವಿಕ್ಸ್‌ಗೆ ಲಾಗಿನ್',
    registerTitle: 'ಸಿವಿಕ್ಸ್‌ಗೆ ನೋಂದಣಿ',
    mobileOrEmail: 'ಮೊಬೈಲ್ ಸಂಖ್ಯೆ ಅಥವಾ ಇಮೇಲ್',
    password: 'ಗುಪ್ತಪದ',
    confirmPassword: 'ಗುಪ್ತಪದವನ್ನು ದೃಢೀಕರಿಸಿ',
    name: 'ಪೂರ್ಣ ಹೆಸರು',
    address: 'ವಿಳಾಸ',
    wardNumber: 'ವಾರ್ಡ್ ಸಂಖ್ಯೆ',
    selectRole: 'ಪಾತ್ರವನ್ನು ಆಯ್ಕೆಮಾಡಿ',
    citizen: 'ನಾಗರಿಕ',
    corporator: 'ಪುರಸಭಾ ಸದಸ್ಯ',
    president: 'ಪುರಸಭಾ ಅಧ್ಯಕ್ಷ',
    
    // Dashboard
    dashboard: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
    reportIssue: 'ಸಮಸ್ಯೆಯನ್ನು ವರದಿ ಮಾಡಿ',
    ongoingIssues: 'ನಡೆಯುತ್ತಿರುವ ಸಮಸ್ಯೆಗಳು',
    resolvedIssues: 'ಪರಿಹರಿಸಿದ ಸಮಸ್ಯೆಗಳು',
    complaints: 'ನನ್ನ ದೂರುಗಳು',
    profile: 'ಪ್ರೊಫೈಲ್',
    
    // Issue Types
    drainage: 'ಒಳಚರಂಡಿ ಸಮಸ್ಯೆಗಳು',
    water: 'ನೀರಿನ ಸಮಸ್ಯೆಗಳು',
    potholes: 'ಪಾಟ್‌ಹೋಲ್‌ಗಳು',
    waste: 'ತ್ಯಾಜ್ಯ ಸಮಸ್ಯೆಗಳು',
    
    // Status
    pending: 'ಬಾಕಿ',
    accepted: 'ಸ್ವೀಕರಿಸಲಾಗಿದೆ',
    resolved: 'ಪರಿಹರಿಸಲಾಗಿದೆ',
    escalated: 'ಮೇಲ್ದರ್ಜೆಗೆ ಕಳುಹಿಸಲಾಗಿದೆ',
    
    // Error Messages
    invalidContact: 'ಅಮಾನ್ಯ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ ಅಥವಾ ಇಮೇಲ್ ವಿಳಾಸ',
    invalidEmail: 'ಇಮೇಲ್ @gmail.com ನೊಂದಿಗೆ ಕೊನೆಗೊಳ್ಳಬೇಕು',
    loginFailed: 'ಲಾಗಿನ್ ವಿಫಲವಾಗಿದೆ. ದಯವಿಟ್ಟು ನಿಮ್ಮ ರುಜುವಾತುಗಳನ್ನು ಪರಿಶೀಲಿಸಿ.',
    registrationFailed: 'ನೋಂದಣಿ ವಿಫಲವಾಗಿದೆ. ಬಳಕೆದಾರ ಈಗಾಗಲೇ ಅಸ್ತಿತ್ವದಲ್ಲಿರಬಹುದು.',
  }
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDark, setIsDark] = useState(false);
  const [language, setLanguage] = useState<'en' | 'kn'>('en');

  useEffect(() => {
    const savedTheme = localStorage.getItem('civix_theme');
    const savedLanguage = localStorage.getItem('civix_language');
    
    if (savedTheme) setIsDark(savedTheme === 'dark');
    if (savedLanguage) setLanguage(savedLanguage as 'en' | 'kn');
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem('civix_theme', newTheme ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', newTheme);
  };

  const toggleLanguage = () => {
    const newLanguage = language === 'en' ? 'kn' : 'en';
    setLanguage(newLanguage);
    localStorage.setItem('civix_language', newLanguage);
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  return (
    <ThemeContext.Provider value={{
      isDark,
      language,
      toggleTheme,
      toggleLanguage,
      t,
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
