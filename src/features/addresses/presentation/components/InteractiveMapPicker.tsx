import React, { useState } from 'react';
import { MapPin, Navigation, LocateFixed, Check } from 'lucide-react';
import { LocationCoordinates } from '../../domain/entities/address.entity';

interface InteractiveMapPickerProps {
  initialCoords?: LocationCoordinates;
  cityName: string;
  areaName: string;
  onCoordsChange: (coords: LocationCoordinates) => void;
}

// Preset approximate coordinates for Yemeni hubs
const CITY_COORDINATES: Record<string, LocationCoordinates> = {
  'صنعاء': { lat: 15.3694, lng: 44.1910 },
  'عدن': { lat: 12.7855, lng: 45.0187 },
  'تعز': { lat: 13.5776, lng: 44.0178 },
  'إب': { lat: 13.9667, lng: 44.1667 },
  'الحديدة': { lat: 14.7978, lng: 42.9545 },
  'المكلا': { lat: 14.5425, lng: 49.1242 }
};

export const InteractiveMapPicker: React.FC<InteractiveMapPickerProps> = ({
  initialCoords,
  cityName,
  areaName,
  onCoordsChange
}) => {
  const defaultCityCoord = CITY_COORDINATES[cityName] || CITY_COORDINATES['صنعاء'];
  const [coords, setCoords] = useState<LocationCoordinates>(initialCoords || defaultCityCoord);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [pinMoved, setPinMoved] = useState<boolean>(false);

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('خدمة تحديد الموقع غير مدعومة في متصفحك.');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const newCoords: LocationCoordinates = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy
        };
        setCoords(newCoords);
        setPinMoved(true);
        onCoordsChange(newCoords);
        setIsLocating(false);
      },
      (err) => {
        console.warn('Geolocation prompt error or denied:', err.message);
        // Fallback to Yemeni city center
        const fallback = CITY_COORDINATES[cityName] || CITY_COORDINATES['صنعاء'];
        setCoords(fallback);
        onCoordsChange(fallback);
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Normalized offset from map center
    const deltaLat = ((rect.height / 2) - y) * 0.0005;
    const deltaLng = (x - (rect.width / 2)) * 0.0005;

    const base = CITY_COORDINATES[cityName] || coords;
    const newCoords: LocationCoordinates = {
      lat: Number((base.lat + deltaLat).toFixed(6)),
      lng: Number((base.lng + deltaLng).toFixed(6))
    };

    setCoords(newCoords);
    setPinMoved(true);
    onCoordsChange(newCoords);
  };

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-gray-300 shadow-inner bg-slate-200">
      
      {/* Map Interactive Canvas / Simulation */}
      <div 
        onClick={handleMapClick}
        className="h-56 sm:h-64 w-full relative cursor-crosshair select-none overflow-hidden"
      >
        {/* Background Grid Pattern resembling road maps */}
        <div className="absolute inset-0 bg-[radial-gradient(#1D327B_1.5px,transparent_1.5px)] [background-size:24px_24px] opacity-20" />
        
        {/* Simulated Streets */}
        <div className="absolute top-1/2 left-0 right-0 h-5 bg-white/70 -translate-y-1/2 border-y border-gray-300/80 shadow-xs" />
        <div className="absolute top-0 bottom-0 left-1/3 w-5 bg-white/70 border-x border-gray-300/80 shadow-xs" />
        <div className="absolute top-0 bottom-0 right-1/4 w-3.5 bg-amber-100/60 border-x border-amber-200/80" />
        <div className="absolute top-1/4 left-0 right-0 h-3 bg-blue-100/50 border-y border-blue-200/60" />

        {/* Pin Marker (Centered with animation) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full z-10 flex flex-col items-center pointer-events-none transition-transform duration-200">
          <div className="bg-[#1D327B] text-white p-2.5 rounded-full shadow-2xl ring-4 ring-[#FF4441]/30 animate-bounce">
            <MapPin className="w-6 h-6 fill-[#FF4441] text-white" />
          </div>
          <div className="w-3 h-1.5 bg-black/30 rounded-full mt-0.5 blur-xs" />
          
          <div className="bg-white/95 backdrop-blur-xs text-[#1D327B] text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-md mt-1 border border-gray-200 whitespace-nowrap">
            {areaName || cityName} (اسحب أو انقر لتعديل الدبوس)
          </div>
        </div>

        {/* Floating Controls */}
        <div className="absolute bottom-3 left-3 z-20 flex flex-col gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleGetCurrentLocation();
            }}
            disabled={isLocating}
            className="bg-white hover:bg-gray-50 text-[#1D327B] px-3 py-2 rounded-xl font-extrabold text-xs shadow-md flex items-center gap-1.5 border border-gray-200 cursor-pointer active:scale-95 transition-all"
          >
            {isLocating ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-[#1D327B] border-t-transparent rounded-full animate-spin" />
                <span>جاري تحديد موقعك...</span>
              </>
            ) : (
              <>
                <LocateFixed className="w-4 h-4 text-[#FF4441]" />
                <span>تحديد موقعي التلقائي (GPS)</span>
              </>
            )}
          </button>
        </div>

        {/* Coordinates indicator banner */}
        <div className="absolute top-3 right-3 z-20 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-lg text-[10px] font-bold text-gray-700 border border-gray-200 shadow-2xs">
          📍 {cityName} - {coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}
        </div>
      </div>

    </div>
  );
};
