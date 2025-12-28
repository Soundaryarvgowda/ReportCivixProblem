import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { BackButton } from './BackButton';
import { LocationCapture } from './LocationCapture';
import { Plus, FileText, Clock, CheckCircle, User, Upload } from 'lucide-react';

interface CitizenDashboardProps {
  onLogout: () => void;
}

export const CitizenDashboard: React.FC<CitizenDashboardProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'report' | 'ongoing' | 'resolved' | 'complaints' | 'profile'>('dashboard');
  const [reportData, setReportData] = useState({
    type: '',
    description: '',
    photo: '',
    location: null as { latitude: number; longitude: number } | null,
  });
  const [profileData, setProfileData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { user, reportIssue, getUserIssues } = useAuth();
  const { t, isDark, toggleTheme, toggleLanguage, language } = useTheme();

  const userIssues = getUserIssues(user?.id || '');
  const ongoingIssues = userIssues.filter(issue => issue.status === 'accepted');
  const resolvedIssues = userIssues.filter(issue => issue.status === 'resolved');
  const allComplaints = userIssues; // All reported issues for reference

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'image/jpeg') {
        alert('Only JPEG files are allowed');
        return;
      }
      if (file.size > 7 * 1024 * 1024) {
        alert('File size must be less than 7MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = () => {
        setReportData(prev => ({ ...prev, photo: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLocationCapture = (location: { latitude: number; longitude: number }) => {
    setReportData(prev => ({ ...prev, location }));
  };

  const handleSubmitReport = async () => {
    if (!reportData.type || !reportData.description || !reportData.photo || !reportData.location) {
      alert('Please fill all fields and capture location');
      return;
    }

    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      await reportIssue({
        ...reportData,
        userId: user?.id,
        userName: user?.name,
        userContact: user?.contact,
        wardNumber: user?.wardNumber,
        address: `${user?.houseNumber || ''} ${user?.streetName || ''}, ${user?.city || ''}`.trim(),
      });

      setReportData({ type: '', description: '', photo: '', location: null });
      alert('Issue reported successfully!');
      setActiveTab('dashboard');
    } catch (error) {
      console.error('Error submitting report:', error);
      alert('Failed to submit report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'accepted': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'resolved': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'escalated': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-600 dark:text-blue-400">Ongoing Issues</CardTitle>
            <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">{ongoingIssues.length}</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-600 dark:text-green-400">Resolved Issues</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700 dark:text-green-300">{resolvedIssues.length}</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-600 dark:text-purple-400">Total Complaints</CardTitle>
            <FileText className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">{allComplaints.length}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Button
          onClick={() => setActiveTab('report')}
          className="h-20 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white flex flex-col items-center justify-center space-y-2"
        >
          <Plus size={24} />
          <span className="font-semibold">{t('reportIssue')}</span>
        </Button>

        <Button
          onClick={() => setActiveTab('ongoing')}
          variant="outline"
          className="h-20 border-2 border-blue-200 hover:bg-blue-50 dark:border-blue-800 dark:hover:bg-blue-900/20 flex flex-col items-center justify-center space-y-2"
        >
          <Clock size={24} className="text-blue-600 dark:text-blue-400" />
          <span className="font-semibold text-blue-600 dark:text-blue-400">{t('ongoingIssues')}</span>
        </Button>

        <Button
          onClick={() => setActiveTab('resolved')}
          variant="outline"
          className="h-20 border-2 border-green-200 hover:bg-green-50 dark:border-green-800 dark:hover:bg-green-900/20 flex flex-col items-center justify-center space-y-2"
        >
          <CheckCircle size={24} className="text-green-600 dark:text-green-400" />
          <span className="font-semibold text-green-600 dark:text-green-400">{t('resolvedIssues')}</span>
        </Button>

        <Button
          onClick={() => setActiveTab('complaints')}
          variant="outline"
          className="h-20 border-2 border-purple-200 hover:bg-purple-50 dark:border-purple-800 dark:hover:bg-purple-900/20 flex flex-col items-center justify-center space-y-2"
        >
          <FileText size={24} className="text-purple-600 dark:text-purple-400" />
          <span className="font-semibold text-purple-600 dark:text-purple-400">{t('complaints')}</span>
        </Button>
      </div>
    </div>
  );

  const renderReportIssue = () => (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          {t('reportIssue')}
        </CardTitle>
        <CardDescription className="text-center">
          Fill in the details to report a civic issue
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium">Issue Type</Label>
          <Select value={reportData.type} onValueChange={(value) => setReportData(prev => ({ ...prev, type: value }))}>
            <SelectTrigger className="h-11 border-2 focus:border-blue-500">
              <SelectValue placeholder="Select issue type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="drainage">{t('drainage')}</SelectItem>
              <SelectItem value="water">{t('water')}</SelectItem>
              <SelectItem value="potholes">{t('potholes')}</SelectItem>
              <SelectItem value="waste">{t('waste')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Description</Label>
          <Textarea
            value={reportData.description}
            onChange={(e) => setReportData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Describe the issue in detail..."
            className="min-h-24 border-2 focus:border-blue-500"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Upload Photo (JPEG only, max 7MB)</Label>
          <div className="flex items-center space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center space-x-2"
              disabled={isSubmitting}
            >
              <Upload size={18} />
              <span>Choose File</span>
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg"
              onChange={handleFileUpload}
              className="hidden"
            />
            {reportData.photo && (
              <span className="text-sm text-green-600 dark:text-green-400">✓ Photo uploaded</span>
            )}
          </div>
          {reportData.photo && (
            <img src={reportData.photo} alt="Issue" className="w-32 h-32 object-cover rounded-lg border-2" />
          )}
        </div>

        <LocationCapture onLocationCapture={handleLocationCapture} />
        {reportData.location && (
          <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
            <p className="text-green-700 dark:text-green-300 text-sm">
              ✓ Location captured: {reportData.location.latitude.toFixed(6)}, {reportData.location.longitude.toFixed(6)}
            </p>
          </div>
        )}

        <Button
          onClick={handleSubmitReport}
          disabled={isSubmitting}
          className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold disabled:opacity-50"
        >
          {isSubmitting ? 'Submitting...' : `${t('submit')} Report`}
        </Button>
      </CardContent>
    </Card>
  );

  const renderIssuesList = (issues: any[], title: string, emptyMessage: string) => (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        {title}
      </h2>
      {issues.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">{emptyMessage}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {issues.map((issue) => (
            <Card key={issue.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-lg capitalize">{t(issue.type)}</h3>
                  <Badge className={getStatusColor(issue.status)}>
                    {t(issue.status)}
                  </Badge>
                </div>
                <p className="text-muted-foreground mb-2">{issue.description}</p>
                <div className="flex justify-between items-center text-sm text-muted-foreground">
                  <span>Ward {issue.wardNumber}</span>
                  <span>{new Date(issue.createdAt).toLocaleDateString()}</span>
                </div>
                {issue.workReport && (
                  <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
                    <p className="text-sm text-green-700 dark:text-green-300">
                      <strong>Work Report:</strong> {issue.workReport}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700">
      <div className="container mx-auto p-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg p-4 shadow-lg">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <User className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800 dark:text-gray-200">Welcome, {user?.name}</h1>
              <p className="text-sm text-muted-foreground">Ward {user?.wardNumber}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
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
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActiveTab('profile')}
              className="bg-white/50 dark:bg-gray-700/50"
            >
              {t('profile')}
            </Button>
            <Button onClick={onLogout} variant="destructive" size="sm">
              {t('logout')}
            </Button>
          </div>
        </div>

        {/* Navigation */}
        {activeTab !== 'dashboard' && (
          <BackButton onClick={() => setActiveTab('dashboard')} className="mb-4" />
        )}

        {/* Content */}
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'report' && renderReportIssue()}
        {activeTab === 'ongoing' && renderIssuesList(ongoingIssues, t('ongoingIssues'), 'No ongoing issues found')}
        {activeTab === 'resolved' && renderIssuesList(resolvedIssues, t('resolvedIssues'), 'No resolved issues found')}
        {activeTab === 'complaints' && renderIssuesList(allComplaints, t('complaints'), 'No complaints found')}
      </div>
    </div>
  );
};
