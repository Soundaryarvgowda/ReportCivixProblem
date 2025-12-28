import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { BackButton } from './BackButton';
import { ProfileModal } from './ProfileModal';
import { GoogleMapsNavigation, LocationDisplay } from './GoogleMapsNavigation';
import { Crown, Search, AlertTriangle, Clock, CheckCircle, Users, MapPin, User, Settings } from 'lucide-react';

interface PresidentDashboardProps {
  onLogout: () => void;
}

export const PresidentDashboard: React.FC<PresidentDashboardProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'all-issues' | 'escalated' | 'resolved'>('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterWard, setFilterWard] = useState('');
  const [showProfile, setShowProfile] = useState(false);
  
  const { user, getAllIssues, getEscalatedIssues, acceptIssue, resolveIssue } = useAuth();
  const { t, isDark, toggleTheme, toggleLanguage, language } = useTheme();

  const allIssues = getAllIssues();
  const escalatedIssues = getEscalatedIssues();
  const resolvedIssues = allIssues.filter(issue => issue.status === 'resolved');
  const pendingIssues = allIssues.filter(issue => issue.status === 'pending');
  const acceptedIssues = allIssues.filter(issue => issue.status === 'accepted');

  const filteredIssues = (issues: any[]) => {
    return issues.filter(issue => {
      const matchesSearch = issue.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           issue.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           issue.type.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesWard = !filterWard || issue.wardNumber === filterWard;
      return matchesSearch && matchesWard;
    });
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

  const handleReassignIssue = (issueId: string) => {
    // In a real implementation, this would show a modal to select a new corporator
    const newCorporatorId = prompt('Enter new corporator ID:');
    if (newCorporatorId) {
      acceptIssue(issueId, newCorporatorId);
    }
  };

  const handleDirectResolve = (issueId: string) => {
    const workReport = prompt('Enter resolution summary:');
    if (workReport) {
      resolveIssue(issueId, workReport, '', { latitude: 0, longitude: 0 });
    }
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-600 dark:text-purple-400">Total Issues</CardTitle>
            <Users className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">{allIssues.length}</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 border-yellow-200 dark:border-yellow-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-yellow-600 dark:text-yellow-400">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">{pendingIssues.length}</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-600 dark:text-blue-400">Accepted</CardTitle>
            <CheckCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">{acceptedIssues.length}</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border-red-200 dark:border-red-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-red-600 dark:text-red-400">Escalated</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-700 dark:text-red-300">{escalatedIssues.length}</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-600 dark:text-green-400">Resolved</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700 dark:text-green-300">{resolvedIssues.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Button
          onClick={() => setActiveTab('all-issues')}
          className="h-16 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white flex flex-col items-center justify-center"
        >
          <Users size={20} />
          <span className="font-semibold">All Issues</span>
        </Button>

        <Button
          onClick={() => setActiveTab('escalated')}
          className="h-16 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white flex flex-col items-center justify-center"
        >
          <AlertTriangle size={20} />
          <span className="font-semibold">Escalated Issues</span>
        </Button>

        <Button
          onClick={() => setActiveTab('resolved')}
          className="h-16 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white flex flex-col items-center justify-center"
        >
          <CheckCircle size={20} />
          <span className="font-semibold">Resolved Issues</span>
        </Button>
      </div>

      {/* Quick Stats */}
      <Card>
        <CardHeader>
          <CardTitle>City-Wide Performance Overview</CardTitle>
          <CardDescription>Monitor municipal efficiency across all wards</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {((resolvedIssues.length / Math.max(allIssues.length, 1)) * 100).toFixed(1)}%
              </div>
              <p className="text-sm text-blue-600 dark:text-blue-400">Resolution Rate</p>
            </div>
            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {escalatedIssues.length}
              </div>
              <p className="text-sm text-yellow-600 dark:text-yellow-400">Needs Attention</p>
            </div>
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {acceptedIssues.length}
              </div>
              <p className="text-sm text-green-600 dark:text-green-400">In Progress</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderSearchAndFilters = () => (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by description, user name, or issue type..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 h-11"
        />
      </div>
      <Input
        placeholder="Filter by ward..."
        value={filterWard}
        onChange={(e) => setFilterWard(e.target.value)}
        className="md:w-48 h-11"
      />
    </div>
  );

  const renderIssuesList = (issues: any[], title: string, showActions: boolean = false) => (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
        {title}
      </h2>
      
      {renderSearchAndFilters()}
      
      {filteredIssues(issues).length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">No {title.toLowerCase()} found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredIssues(issues).map((issue) => (
            <Card key={issue.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-lg capitalize">{t(issue.type)}</h3>
                  <Badge className={getStatusColor(issue.status)}>
                    {t(issue.status)}
                  </Badge>
                </div>

                <p className="text-muted-foreground mb-2">{issue.description}</p>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <User size={16} />
                    <span><strong>Reported by:</strong> {issue.userName} ({issue.userContact})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={16} />
                    <span><strong>Location:</strong> {issue.address} (Ward {issue.wardNumber})</span>
                  </div>
                  <LocationDisplay 
                    latitude={issue.location.latitude} 
                    longitude={issue.location.longitude} 
                  />
                  {issue.assignedCorporator && (
                    <div className="text-blue-600 dark:text-blue-400">
                      <span><strong>Assigned to:</strong> Corporator {issue.assignedCorporator}</span>
                    </div>
                  )}
                  <div className="text-muted-foreground">
                    <span>Reported: {new Date(issue.createdAt).toLocaleString()}</span>
                    {issue.acceptedAt && (
                      <span className="ml-4">Accepted: {new Date(issue.acceptedAt).toLocaleString()}</span>
                    )}
                    {issue.resolvedAt && (
                      <span className="ml-4">Resolved: {new Date(issue.resolvedAt).toLocaleString()}</span>
                    )}
                  </div>
                </div>

                {issue.photo && (
                  <img src={issue.photo} alt="Issue" className="w-32 h-32 object-cover rounded-lg border-2 mt-2" />
                )}

                <div className="flex gap-2 mt-4 flex-wrap">
                  <GoogleMapsNavigation
                    latitude={issue.location.latitude}
                    longitude={issue.location.longitude}
                    className="text-sm"
                  />

                  {showActions && issue.status === 'escalated' && (
                    <>
                      <Button
                        onClick={() => handleReassignIssue(issue.id)}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        Reassign
                      </Button>
                      <Button
                        onClick={() => handleDirectResolve(issue.id)}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        Direct Resolve
                      </Button>
                    </>
                  )}
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700">
      <div className="container mx-auto p-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg p-4 shadow-lg">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
              <Crown className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800 dark:text-gray-200">Municipal President Dashboard</h1>
              <p className="text-sm text-muted-foreground">{user?.name} - City-Wide Oversight</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowProfile(true)}
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

        {/* Navigation */}
        {activeTab !== 'dashboard' && (
          <BackButton onClick={() => setActiveTab('dashboard')} className="mb-4" />
        )}

        {/* Content */}
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'all-issues' && renderIssuesList(allIssues, 'All Issues')}
        {activeTab === 'escalated' && renderIssuesList(escalatedIssues, 'Escalated Issues', true)}
        {activeTab === 'resolved' && renderIssuesList(resolvedIssues, 'Resolved Issues')}

        {/* Profile Modal */}
        <ProfileModal isOpen={showProfile} onClose={() => setShowProfile(false)} />
      </div>
    </div>
  );
};
