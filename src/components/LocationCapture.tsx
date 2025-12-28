
import React, { useState } from 'react';
import { MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';

interface LocationCaptureProps {
  onLocationCapture: (location: { latitude: number; longitude: number }) => void;
  className?: string;
}

export const LocationCapture: React.FC<LocationCaptureProps> = ({ onLocationCapture, className = '' }) => {
  const [isCapturing, setIsCapturing] = useState(false);
  const [error, setError] = useState<string>('');
  const { t } = useTheme();

  const captureLocation = () => {
    setIsCapturing(true);
    setError('');

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        function(position) {
          console.log("Latitude:", position.coords.latitude);
          console.log("Longitude:", position.coords.longitude);
          console.log("Accuracy:", position.coords.accuracy, "meters");
          
          onLocationCapture({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
          setIsCapturing(false);
        },
        function(error) {
          let errorMessage = '';
          switch(error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = "User denied the request for Geolocation.";
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = "Location information is unavailable.";
              break;
            case error.TIMEOUT:
              errorMessage = "The request to get user location timed out.";
              break;
            default:
              errorMessage = "An unknown error occurred.";
              break;
          }
          setError(errorMessage);
          setIsCapturing(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
      setIsCapturing(false);
    }
  };

  return (
    <div className={className}>
      <Button
        onClick={captureLocation}
        disabled={isCapturing}
        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
      >
        <MapPin size={18} />
        {isCapturing ? 'Capturing Location...' : 'Capture Current Location'}
      </Button>
      {error && (
        <p className="text-red-500 text-sm mt-2">{error}</p>
      )}
    </div>
  );
};
