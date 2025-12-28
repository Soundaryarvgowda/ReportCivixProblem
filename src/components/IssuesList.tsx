
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TimerDisplay } from './TimerDisplay';
import { GoogleMapsNavigation, LocationDisplay } from './GoogleMapsNavigation';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { User, MapPin } from 'lucide-react';

interface IssuesListProps {
  issues: any[];
  title: string;
  showTimers?: boolean;
  onAcceptIssue: (issueId: string) => void;
  onResolveIssue: (issue: any) => void;
  onEscalateIssue: (issueId: string) => void;
}

export const IssuesList: React.FC<IssuesListProps> = ({
  issues,
  title,
  showTimers = false,
  onAcceptIssue,
  onResolveIssue,
  onEscalateIssue
}) => {
  const { t } = useTheme();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'accepted': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'resolved': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'escalated': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        {title}
      </h2>
      {issues.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">No {title.toLowerCase()} found</p>
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
                
                {showTimers && issue.status === 'pending' && (
                  <TimerDisplay
                    startTime={new Date(issue.createdAt)}
                    duration={2}
                    label="Accept within"
                    className="mb-2"
                  />
                )}
                
                {showTimers && issue.status === 'accepted' && issue.acceptedAt && (
                  <TimerDisplay
                    startTime={new Date(issue.acceptedAt)}
                    duration={8}
                    label="Resolve within"
                    className="mb-2"
                  />
                )}

                <p className="text-muted-foreground mb-2">{issue.description}</p>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <User size={16} />
                    <span><strong>Reported by:</strong> {issue.userName} ({issue.userContact})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={16} />
                    <span><strong>Location:</strong> {issue.address}</span>
                  </div>
                  <LocationDisplay 
                    latitude={issue.location.latitude} 
                    longitude={issue.location.longitude} 
                  />
                  <div className="text-muted-foreground">
                    <span>Reported: {new Date(issue.createdAt).toLocaleString()}</span>
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
                  
                  {issue.status === 'pending' && (
                    <Button
                      onClick={() => onAcceptIssue(issue.id)}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      Accept Issue
                    </Button>
                  )}
                  
                  {issue.status === 'accepted' && (
                    <Button
                      onClick={() => onResolveIssue(issue)}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Mark as Resolved
                    </Button>
                  )}
                  
                  {(issue.status === 'pending' || issue.status === 'accepted') && (
                    <Button
                      onClick={() => onEscalateIssue(issue.id)}
                      variant="destructive"
                    >
                      Escalate
                    </Button>
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
};
