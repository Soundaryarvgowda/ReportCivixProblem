
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { X, User } from 'lucide-react';

const MANDYA_WARDS = Array.from({ length: 35 }, (_, i) => `Ward ${i + 1}`);

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const { user, updateUserProfile } = useAuth();
  const { t } = useTheme();
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    contact: user?.contact || '',
    wardNumber: user?.wardNumber || '',
    houseNumber: user?.houseNumber || '',
    buildingName: user?.buildingName || '',
    streetName: user?.streetName || '',
    city: user?.city || 'Mandya',
    pincode: user?.pincode || '571401',
  });

  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      updateUserProfile(formData);
      alert('Profile updated successfully!');
      onClose();
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl bg-white dark:bg-gray-800 max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <User size={24} className="text-blue-600" />
              <CardTitle className="text-xl font-bold">Edit Profile</CardTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X size={16} />
            </Button>
          </div>
          <CardDescription>
            Update your personal information and contact details
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
                  className="h-11 border-2 focus:border-blue-500 transition-colors"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact" className="text-sm font-medium">{t('mobileOrEmail')}</Label>
                <Input
                  id="contact"
                  type="text"
                  value={formData.contact}
                  onChange={(e) => handleInputChange('contact', e.target.value)}
                  className="h-11 border-2 focus:border-blue-500 transition-colors"
                  required
                  disabled
                />
                <p className="text-xs text-muted-foreground">Contact cannot be changed after registration</p>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">{t('wardNumber')}</Label>
                <Select value={formData.wardNumber} onValueChange={(value) => handleInputChange('wardNumber', value)}>
                  <SelectTrigger className="h-11 border-2 focus:border-blue-500">
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
                  className="h-11 border-2 focus:border-blue-500 transition-colors"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="buildingName" className="text-sm font-medium">Building Name</Label>
                <Input
                  id="buildingName"
                  type="text"
                  value={formData.buildingName}
                  onChange={(e) => handleInputChange('buildingName', e.target.value)}
                  className="h-11 border-2 focus:border-blue-500 transition-colors"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="streetName" className="text-sm font-medium">Street Name</Label>
                <Input
                  id="streetName"
                  type="text"
                  value={formData.streetName}
                  onChange={(e) => handleInputChange('streetName', e.target.value)}
                  className="h-11 border-2 focus:border-blue-500 transition-colors"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="city" className="text-sm font-medium">City</Label>
                <Input
                  id="city"
                  type="text"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  className="h-11 border-2 focus:border-blue-500 transition-colors"
                  disabled
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pincode" className="text-sm font-medium">Pincode</Label>
                <Input
                  id="pincode"
                  type="text"
                  value={formData.pincode}
                  onChange={(e) => handleInputChange('pincode', e.target.value)}
                  className="h-11 border-2 focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {loading ? 'Updating...' : 'Update Profile'}
              </Button>
              <Button
                type="button"
                onClick={onClose}
                variant="outline"
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
