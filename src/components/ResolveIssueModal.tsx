
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { LocationCapture } from './LocationCapture';
import { Upload } from 'lucide-react';

interface ResolveIssueModalProps {
  issue: any;
  onResolve: (workReport: string, photo: string, location: { latitude: number; longitude: number }) => void;
  onClose: () => void;
}

export const ResolveIssueModal: React.FC<ResolveIssueModalProps> = ({
  issue,
  onResolve,
  onClose
}) => {
  const [workReport, setWorkReport] = useState('');
  const [resolvedPhoto, setResolvedPhoto] = useState('');
  const [resolvedLocation, setResolvedLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
        setResolvedPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResolve = () => {
    if (!workReport || !resolvedPhoto || !resolvedLocation) {
      alert('Please provide work report, photo, and location');
      return;
    }
    onResolve(workReport, resolvedPhoto, resolvedLocation);
  };

  if (!issue) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl bg-white dark:bg-gray-800 max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle>Resolve Issue</CardTitle>
          <CardDescription>Provide work report, photo evidence, and location</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Work Report</Label>
            <Textarea
              value={workReport}
              onChange={(e) => setWorkReport(e.target.value)}
              placeholder="Describe the work done to resolve this issue..."
              className="min-h-24"
            />
          </div>

          <div className="space-y-2">
            <Label>Upload Photo (JPEG only, max 7MB)</Label>
            <div className="flex items-center space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center space-x-2"
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
              {resolvedPhoto && (
                <span className="text-sm text-green-600 dark:text-green-400">✓ Photo uploaded</span>
              )}
            </div>
            {resolvedPhoto && (
              <img src={resolvedPhoto} alt="Resolved" className="w-32 h-32 object-cover rounded-lg border-2" />
            )}
          </div>

          <LocationCapture onLocationCapture={(location) => setResolvedLocation(location)} />
          {resolvedLocation && (
            <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
              <p className="text-green-700 dark:text-green-300 text-sm">
                ✓ Location captured: {resolvedLocation.latitude.toFixed(6)}, {resolvedLocation.longitude.toFixed(6)}
              </p>
            </div>
          )}

          <div className="flex gap-2">
            <Button
              onClick={handleResolve}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Mark as Resolved
            </Button>
            <Button
              onClick={onClose}
              variant="outline"
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
