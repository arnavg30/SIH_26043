import React, { useEffect, useMemo, useRef } from "react";
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { Navigation, Loader2, AlertCircle, MapPin } from "lucide-react";

export interface LocationPickerMapProps {
  latitude?: string | number;
  longitude?: string | number;
  onLocationChange: (lat: number, lng: number) => void;
  height?: string;
  className?: string;
  onUseCurrentLocation?: () => void;
  isLocating?: boolean;
  locationError?: string | null;
  accuracy?: number | null;
  // TODO: Future saved-address integration — once profile teammate makes user address real and persistent,
  // geocoded coordinates from profile can be passed here as initial/saved coordinates.
  initialLatitude?: string | number;
  initialLongitude?: string | number;
}

// Neutral default center (Jharkhand geographical region) when no location is chosen yet
const DEFAULT_CENTER: [number, number] = [23.6102, 85.2799];
const DEFAULT_ZOOM = 8;
const LOCATED_ZOOM = 15;

/**
 * Creates a crisp, custom SVG divIcon for Leaflet with zero external asset dependencies.
 */
function createMarkerIcon() {
  return L.divIcon({
    className: "navjhar-leaflet-pin",
    html: `
      <div style="
        position: relative;
        width: 34px;
        height: 34px;
        margin-left: -17px;
        margin-top: -34px;
        filter: drop-shadow(0 3px 6px rgba(0,0,0,0.35));
      ">
        <svg viewBox="0 0 24 24" width="34" height="34" fill="#DC2626" stroke="#FFFFFF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
          <circle cx="12" cy="10" r="3.2" fill="#FFFFFF" stroke="none" />
        </svg>
      </div>
    `,
    iconSize: [34, 34],
    iconAnchor: [17, 34],
  });
}

function MapViewController({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom, { animate: true });
  }, [center, zoom, map]);
  return null;
}

function MapClickHandler({
  onLocationSelect,
}: {
  onLocationSelect: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

function DraggableMarker({
  position,
  onDragEnd,
}: {
  position: [number, number];
  onDragEnd: (lat: number, lng: number) => void;
}) {
  const markerRef = useRef<L.Marker>(null);
  const icon = useMemo(() => createMarkerIcon(), []);

  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          const latLng = marker.getLatLng();
          onDragEnd(latLng.lat, latLng.lng);
        }
      },
    }),
    [onDragEnd]
  );

  return (
    <Marker
      draggable={true}
      eventHandlers={eventHandlers}
      position={position}
      ref={markerRef}
      icon={icon}
    />
  );
}

export default function LocationPickerMap({
  latitude,
  longitude,
  onLocationChange,
  height,
  className = "",
  onUseCurrentLocation,
  isLocating = false,
  locationError = null,
  accuracy = null,
}: LocationPickerMapProps) {
  const hasCoords =
    latitude !== undefined &&
    latitude !== "" &&
    longitude !== undefined &&
    longitude !== "" &&
    !isNaN(Number(latitude)) &&
    !isNaN(Number(longitude));

  const currentLat = hasCoords ? Number(latitude) : null;
  const currentLng = hasCoords ? Number(longitude) : null;

  const mapCenter: [number, number] =
    hasCoords && currentLat !== null && currentLng !== null
      ? [currentLat, currentLng]
      : DEFAULT_CENTER;

  const mapZoom = hasCoords ? LOCATED_ZOOM : DEFAULT_ZOOM;

  return (
    <div
      className={`relative rounded-xl overflow-hidden border ${className}`}
      style={{ borderColor: "var(--border)", ...(height ? { height } : {}) }}
    >
      <MapContainer
        center={mapCenter}
        zoom={mapZoom}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapViewController center={mapCenter} zoom={mapZoom} />

        <MapClickHandler onLocationSelect={onLocationChange} />

        {hasCoords && currentLat !== null && currentLng !== null && (
          <DraggableMarker
            position={[currentLat, currentLng]}
            onDragEnd={onLocationChange}
          />
        )}
      </MapContainer>

      {/* Floating GPS Action Button */}
      {onUseCurrentLocation && (
        <div className="absolute top-2.5 right-2.5 z-[1000]">
          <button
            type="button"
            onClick={onUseCurrentLocation}
            disabled={isLocating}
            className="px-3 py-1.5 rounded-lg shadow-md flex items-center gap-1.5 text-xs font-semibold transition-all active:scale-95 bg-white text-gray-800 hover:bg-gray-50 border border-gray-200 cursor-pointer"
            style={{ color: "var(--navy)" }}
            title="Detect GPS location"
          >
            {isLocating ? (
              <>
                <Loader2 size={14} className="animate-spin text-amber-500" />
                <span>Locating…</span>
              </>
            ) : (
              <>
                <Navigation size={14} className="text-emerald-600" />
                <span>GPS Location</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Location Coordinates Badge */}
      <div className="absolute bottom-2 left-2 z-[1000] max-w-[80%] pointer-events-none">
        {hasCoords && currentLat !== null && currentLng !== null ? (
          <div className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-white/95 text-gray-800 shadow-sm border border-gray-200 flex items-center gap-1.5">
            <MapPin size={12} className="text-red-500 flex-shrink-0" />
            <span className="truncate">
              {currentLat.toFixed(5)}° N, {currentLng.toFixed(5)}° E
            </span>
            {accuracy !== null && (
              <span className="text-[10px] text-gray-500 whitespace-nowrap">±{Math.round(accuracy)} m</span>
            )}
            <span className="text-[10px] text-gray-500 hidden sm:inline">(Drag pin to adjust)</span>
          </div>
        ) : (
          <div className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-white/95 text-gray-700 shadow-sm border border-gray-200 flex items-center gap-1">
            <MapPin size={12} className="text-amber-500 flex-shrink-0" />
            <span>Click map or drag pin to select location</span>
          </div>
        )}
      </div>

      {/* Error Banner */}
      {locationError && (
        <div className="absolute top-2 left-2 right-2 z-[1000] bg-red-50 text-red-800 border border-red-200 p-2 rounded-lg text-xs flex items-start gap-1.5 shadow-sm">
          <AlertCircle size={14} className="text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">{locationError}</div>
        </div>
      )}
    </div>
  );
}
