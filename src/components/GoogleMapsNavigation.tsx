
import React from 'react';
import { Button } from '@/components/ui/button';
import { MapPin, Navigation } from 'lucide-react';

interface GoogleMapsNavigationProps {
  latitude: number;
  longitude: number;
  className?: string;
}

export const GoogleMapsNavigation: React.FC<GoogleMapsNavigationProps> = ({
  latitude,
  longitude,
  className = ''
}) => {
  const handleNavigate = () => {
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
    window.open(mapsUrl, '_blank');
  };

  return (
    <Button
      onClick={handleNavigate}
      className={`bg-green-600 hover:bg-green-700 text-white flex items-center space-x-2 ${className}`}
    >
      <Navigation size={16} />
      <span>Navigate via Google Maps</span>
    </Button>
  );
};

export const LocationDisplay: React.FC<{ latitude: number; longitude: number }> = ({
  latitude,
  longitude
}) => {
  return (
    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
      <MapPin size={16} />
      <span>
        {latitude.toFixed(6)}, {longitude.toFixed(6)}
      </span>
    </div>
  );
};
