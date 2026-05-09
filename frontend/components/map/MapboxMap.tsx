'use client';

import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { fetchApi } from '@/lib/api';

interface Tutor {
  id?: string;
  user_id: string;
  display_name?: string;
  full_name?: string;
  specialties?: string[];
  hourly_rate?: number;
  lat?: number;
  lng?: number;
  latitude?: number;
  longitude?: number;
  avatar_url?: string;
}

interface TutorsResponse {
  tutors?: Tutor[];
}

const RADII = [2, 5, 10, 20, 50]; // km — expansión progresiva tipo Didi
const DEFAULT_CENTER: [number, number] = [-75.5898, 6.2442]; // Medellín

export default function MapboxMap() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  const [isSearching, setIsSearching] = useState(false);
  const [foundCount, setFoundCount] = useState(0);
  const [currentRadius, setCurrentRadius] = useState(0);

  const clearMarkers = () => {
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];
  };

  const drawSearchRadius = (center: [number, number], radiusKm: number) => {
    if (!map.current) return;

    const points = 64;
    const coords: [number, number][] = [];
    const distanceX =
      radiusKm / (111.32 * Math.cos((center[1] * Math.PI) / 180));
    const distanceY = radiusKm / 110.574;

    for (let i = 0; i < points; i++) {
      const angle = (i / points) * (2 * Math.PI);
      coords.push([
        center[0] + distanceX * Math.cos(angle),
        center[1] + distanceY * Math.sin(angle),
      ]);
    }
    coords.push(coords[0]);

    const geojson: GeoJSON.Feature = {
      type: 'Feature',
      geometry: { type: 'Polygon', coordinates: [coords] },
      properties: {},
    };

    if (map.current.getSource('search-radius')) {
      (map.current.getSource('search-radius') as mapboxgl.GeoJSONSource)
        .setData(geojson);
    } else {
      map.current.addSource('search-radius', {
        type: 'geojson',
        data: geojson,
      });
      map.current.addLayer({
        id: 'search-radius-fill',
        type: 'fill',
        source: 'search-radius',
        paint: { 'fill-color': '#6C63FF', 'fill-opacity': 0.08 },
      });
      map.current.addLayer({
        id: 'search-radius-line',
        type: 'line',
        source: 'search-radius',
        paint: {
          'line-color': '#6C63FF',
          'line-width': 2,
          'line-dasharray': [2, 2],
        },
      });
    }
  };

  const searchTutors = async (center: [number, number]) => {
    setIsSearching(true);
    clearMarkers();

    for (const radius of RADII) {
      setCurrentRadius(radius);
      drawSearchRadius(center, radius);

      map.current?.easeTo({
        center,
        zoom: radius <= 5 ? 13 : radius <= 15 ? 11 : 9,
        duration: 800,
      });

      try {
        const res = await fetchApi<TutorsResponse | Tutor[]>(
          `/tutors?lat=${center[1]}&lng=${center[0]}&radius=${radius}&limit=50`
        );
        const list: Tutor[] = Array.isArray(res)
          ? res
          : (res as TutorsResponse).tutors ?? [];

        const withCoords = list.filter(t => {
          const lat = t.lat ?? t.latitude;
          const lng = t.lng ?? t.longitude;
          return typeof lat === 'number' && typeof lng === 'number';
        });

        if (withCoords.length >= 3) {
          withCoords.forEach(tutor => {
            const lat = (tutor.lat ?? tutor.latitude) as number;
            const lng = (tutor.lng ?? tutor.longitude) as number;
            const name = tutor.display_name ?? tutor.full_name ?? 'Tutor';
            const avatar =
              tutor.avatar_url ??
              `https://api.dicebear.com/7.x/avataaars/svg?seed=${tutor.user_id}`;

            const el = document.createElement('div');
            el.style.cssText = `
              width:42px;height:42px;border-radius:50%;
              border:3px solid white;
              box-shadow:0 4px 12px rgba(0,0,0,0.3);
              background-image:url('${avatar}');
              background-size:cover;cursor:pointer;
            `;

            const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
              <div style="padding:8px;min-width:180px;font-family:sans-serif">
                <strong>${name}</strong><br/>
                <span style="color:#666;font-size:12px">
                  ${tutor.specialties?.slice(0, 2).join(' • ') ?? 'Tutor'}
                </span><br/>
                <span style="font-weight:600">
                  $${tutor.hourly_rate ?? 20}/hr
                </span>
                <div style="display:flex;gap:6px;margin-top:8px">
                  <a href="/profile/${tutor.user_id}"
                    style="flex:1;text-align:center;padding:4px 8px;
                    border:1px solid #ddd;border-radius:6px;
                    font-size:12px;text-decoration:none;color:#333">
                    Perfil
                  </a>
                  <a href="/messages?userId=${tutor.user_id}"
                    style="flex:1;text-align:center;padding:4px 8px;
                    background:#6C63FF;color:white;border-radius:6px;
                    font-size:12px;text-decoration:none">
                    Contactar
                  </a>
                </div>
              </div>
            `);

            const marker = new mapboxgl.Marker(el)
              .setLngLat([lng, lat])
              .setPopup(popup)
              .addTo(map.current!);

            markersRef.current.push(marker);
          });

          setFoundCount(withCoords.length);
          setIsSearching(false);
          return;
        }
      } catch {
        // ignorar y probar radio mayor
      }

      await new Promise(r => setTimeout(r, 900));
    }

    setFoundCount(0);
    setIsSearching(false);
  };

  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? '';

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: DEFAULT_CENTER,
      zoom: 12,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    map.current.on('load', () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          ({ coords }) => {
            const center: [number, number] = [
              coords.longitude,
              coords.latitude,
            ];
            map.current?.flyTo({ center, zoom: 13, duration: 1500 });
            searchTutors(center);
          },
          () => {
            searchTutors(DEFAULT_CENTER);
          },
          { enableHighAccuracy: true, timeout: 8000 }
        );
      } else {
        searchTutors(DEFAULT_CENTER);
      }
    });

    return () => {
      clearMarkers();
      map.current?.remove();
      map.current = null;
    };
  }, []);

  return (
    <div className="relative w-full h-full min-h-[500px]">
      <div ref={mapContainer} className="w-full h-full rounded-lg" />

      {isSearching && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2
          bg-white/90 backdrop-blur-sm border rounded-full px-4 py-2
          shadow-md text-sm flex items-center gap-2 z-10">
          <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
          Buscando tutores en {currentRadius} km...
        </div>
      )}

      {!isSearching && foundCount > 0 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2
          bg-white/90 backdrop-blur-sm border rounded-full px-4 py-2
          shadow-md text-sm z-10">
          ✅ {foundCount} tutores encontrados en {currentRadius} km
        </div>
      )}

      {!isSearching && foundCount === 0 && currentRadius > 0 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2
          bg-white/90 backdrop-blur-sm border rounded-full px-4 py-2
          shadow-md text-sm z-10 text-muted-foreground">
          No se encontraron tutores en tu zona
        </div>
      )}
    </div>
  );
}