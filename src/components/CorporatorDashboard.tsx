
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { BackButton } from './BackButton';
import { ProfileModal } from './ProfileModal';
import { CorporatorHeader } from './CorporatorHeader';
import { CorporatorStats } from './CorporatorStats';
import { CorporatorNavigation } from './CorporatorNavigation';
import { IssuesList } from './IssuesList';
import { ResolveIssueModal } from './ResolveIssueModal';

interface CorporatorDashboardProps {
  onLogout: () => void;
}

export const CorporatorDashboard: React.FC<CorporatorDashboardProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'pending' | 'accepted' | 'resolved' | 'escalated'>('dashboard');
  const [selectedIssue, setSelectedIssue] = useState<any>(null);
  const [showProfile, setShowProfile] = useState(false);
  
  const { user, getCorporatorIssues, acceptIssue, resolveIssue, escalateIssue } = useAuth();

  const allIssues = getCorporatorIssues(user?.wardNumber || '');
  const pendingIssues = allIssues.filter(issue => issue.status === 'pending');
  const acceptedIssues = allIssues.filter(issue => issue.status === 'accepted');
  const resolvedIssues = allIssues.filter(issue => issue.status === 'resolved');
  const escalatedIssues = allIssues.filter(issue => issue.status === 'escalated');

  const handleAcceptIssue = (issueId: string) => {
    acceptIssue(issueId, user?.id || '');
    setSelectedIssue(null);
  };

  const handleResolveIssue = (workReport: string, photo: string, location: { latitude: number; longitude: number }) => {
    if (selectedIssue) {
      resolveIssue(selectedIssue.id, workReport, photo, location);
      setSelectedIssue(null);
    }
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      <CorporatorStats
        pendingCount={pendingIssues.length}
        acceptedCount={acceptedIssues.length}
        resolvedCount={resolvedIssues.length}
        escalatedCount={escalatedIssues.length}
      />
      <CorporatorNavigation onNavigate={setActiveTab} />
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700">
      <div className="container mx-auto p-4">
        {/* Header */}
        <CorporatorHeader
          onShowProfile={() => setShowProfile(true)}
          onLogout={onLogout}
        />

        {/* Navigation */}
        {activeTab !== 'dashboard' && (
          <BackButton onClick={() => setActiveTab('dashboard')} className="mb-4" />
        )}

        {/* Content */}
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'pending' && (
          <IssuesList
            issues={pendingIssues}
            title="Pending Issues"
            showTimers={true}
            onAcceptIssue={handleAcceptIssue}
            onResolveIssue={setSelectedIssue}
            onEscalateIssue={escalateIssue}
          />
        )}
        {activeTab === 'accepted' && (
          <IssuesList
            issues={acceptedIssues}
            title="Accepted Issues"
            showTimers={true}
            onAcceptIssue={handleAcceptIssue}
            onResolveIssue={setSelectedIssue}
            onEscalateIssue={escalateIssue}
          />
        )}
        {activeTab === 'resolved' && (
          <IssuesList
            issues={resolvedIssues}
            title="Resolved Issues"
            onAcceptIssue={handleAcceptIssue}
            onResolveIssue={setSelectedIssue}
            onEscalateIssue={escalateIssue}
          />
        )}
        {activeTab === 'escalated' && (
          <IssuesList
            issues={escalatedIssues}
            title="Escalated Issues"
            onAcceptIssue={handleAcceptIssue}
            onResolveIssue={setSelectedIssue}
            onEscalateIssue={escalateIssue}
          />
        )}

        {/* Resolve Modal */}
        {selectedIssue && (
          <ResolveIssueModal
            issue={selectedIssue}
            onResolve={handleResolveIssue}
            onClose={() => setSelectedIssue(null)}
          />
        )}

        {/* Profile Modal */}
        <ProfileModal isOpen={showProfile} onClose={() => setShowProfile(false)} />
      </div>
    </div>
  );
};
