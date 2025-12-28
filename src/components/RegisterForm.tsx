
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { BackButton } from './BackButton';

const MANDYA_WARDS = Array.from({ length: 35 }, (_, i) => `Ward ${i + 1}`);

interface RegisterFormProps {
  onBack: () => void;
  onSwitchToLogin: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onBack, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    role: '',
    wardNumber: '',
    address: '',
    houseNumber: '',
    buildingName: '',
    streetName: '',
    city: 'Mandya',
    pincode: '571401',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const { t } = useTheme();

  const validateContact = (contact: string): boolean => {
    const mobileRegex = /^[6-9]\d{9}$/;
    const emailRegex = /^[^\s@]+@gmail\.com$/;
    return mobileRegex.test(contact) || emailRegex.test(contact);
  };

  const validatePassword = (password: string): boolean => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    return passwordRegex.test(password);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!validateContact(formData.contact)) {
      setError(t('invalidContact'));
      setLoading(false);
      return;
    }

    if (formData.contact.includes('@') && !formData.contact.endsWith('@gmail.com')) {
      setError(t('invalidEmail'));
      setLoading(false);
      return;
    }

    if (!validatePassword(formData.password)) {
      setError('Password must contain at least 1 uppercase, 1 lowercase, 1 number, 1 special character and be at least 8 characters long.');
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const success = await register(formData);
      if (!success) {
        setError(t('registrationFailed'));
      } else {
        alert('Registration successful! Please login with your credentials.');
        onSwitchToLogin();
      }
    } catch (error: any) {
      setError(error.message || t('registrationFailed'));
    }
    setLoading(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[\W_]/.test(password)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength(formData.password);
  const strengthColors = ['bg-red-500', 'bg-red-400', 'bg-yellow-500', 'bg-yellow-400', 'bg-green-500'];
  const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-2xl">
        <CardHeader className="space-y-1">
          <BackButton onClick={onBack} />
          <CardTitle className="text-2xl font-bold text-center bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            {t('registerTitle')}
          </CardTitle>
          <CardDescription className="text-center text-muted-foreground">
            Create your account to get started
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">{t('name')}</Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="h-11 border-2 focus:border-green-500 transition-colors"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact" className="text-sm font-medium">{t('mobileOrEmail')}</Label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-sm text-muted-foreground">+91</span>
                  <Input
                    id="contact"
                    type="text"
                    value={formData.contact}
                    onChange={(e) => handleInputChange('contact', e.target.value)}
                    placeholder="Mobile or email@gmail.com"
                    className="pl-12 h-11 border-2 focus:border-green-500 transition-colors"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">{t('selectRole')}</Label>
                <Select value={formData.role} onValueChange={(value) => handleInputChange('role', value)}>
                  <SelectTrigger className="h-11 border-2 focus:border-green-500">
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="citizen">{t('citizen')}</SelectItem>
                    <SelectItem value="corporator">{t('corporator')}</SelectItem>
                    <SelectItem value="president">{t('president')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">{t('wardNumber')}</Label>
                <Select value={formData.wardNumber} onValueChange={(value) => handleInputChange('wardNumber', value)}>
                  <SelectTrigger className="h-11 border-2 focus:border-green-500">
                    <SelectValue placeholder="Select ward" />
                  </SelectTrigger>
                  <SelectContent>
                    {MANDYA_WARDS.map(ward => (
                      <SelectItem key={ward} value={ward}>{ward}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="houseNumber" className="text-sm font-medium">House Number</Label>
                <Input
                  id="houseNumber"
                  type="text"
                  value={formData.houseNumber}
                  onChange={(e) => handleInputChange('houseNumber', e.target.value)}
                  className="h-11 border-2 focus:border-green-500 transition-colors"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="streetName" className="text-sm font-medium">Street Name</Label>
                <Input
                  id="streetName"
                  type="text"
                  value={formData.streetName}
                  onChange={(e) => handleInputChange('streetName', e.target.value)}
                  className="h-11 border-2 focus:border-green-500 transition-colors"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">{t('password')}</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="h-11 border-2 focus:border-green-500 transition-colors"
                  required
                />
                {formData.password && (
                  <div className="space-y-2">
                    <div className="flex space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className={`h-2 flex-1 rounded ${
                            i < passwordStrength ? strengthColors[passwordStrength - 1] : 'bg-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Password strength: {strengthLabels[passwordStrength - 1] || 'Very Weak'}
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium">{t('confirmPassword')}</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  className="h-11 border-2 focus:border-green-500 transition-colors"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">
                Password requirements:
              </p>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li className={formData.password.length >= 8 ? 'text-green-600' : ''}>
                  ✓ At least 8 characters
                </li>
                <li className={/[a-z]/.test(formData.password) ? 'text-green-600' : ''}>
                  ✓ One lowercase letter
                </li>
                <li className={/[A-Z]/.test(formData.password) ? 'text-green-600' : ''}>
                  ✓ One uppercase letter
                </li>
                <li className={/\d/.test(formData.password) ? 'text-green-600' : ''}>
                  ✓ One number
                </li>
                <li className={/[\W_]/.test(formData.password) ? 'text-green-600' : ''}>
                  ✓ One special character
                </li>
              </ul>
            </div>

            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold transition-all duration-200 transform hover:scale-[1.02]"
            >
              {loading ? 'Creating Account...' : t('register')}
            </Button>

            <div className="text-center">
              <button
                type="button"
                onClick={onSwitchToLogin}
                className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 text-sm font-medium transition-colors"
              >
                Already have an account? Login here
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
