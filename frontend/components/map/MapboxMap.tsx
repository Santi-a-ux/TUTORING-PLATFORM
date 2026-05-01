"use client";

import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { fetchApi } from "@/lib/api";
import Link from "next/link";
import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Tutor {
  id: string;
  user_id: string;
  full_name?: string;
  display_name?: string;
  avatar_url?: string;
  specialties?: string[];
  lat?: number;
  lng?: number;
  latitude?: number;
  longitude?: number;
  hourly_rate?: number;
}

interface TutorsResponse {
  tutors?: Tutor[];
}

const getTutorAvatar = (tutor: Tutor) => {
  if (tutor.avatar_url && tutor.avatar_url.trim()) {
    return tutor.avatar_url.trim();
  }

  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${tutor.user_id}`;
};

const createAvatarIcon = (avatarUrl: string, name: string) => {
  const safeUrl = avatarUrl.replace(/"/g, "");
  const safeName = name.replace(/"/g, "");

  return L.divIcon({
    className: "avatar-map-marker",
    html: `
      <div style="
        width: 42px;
        height: 42px;
        border-radius: 9999px;
        border: 3px solid white;
        box-shadow: 0 6px 20px rgba(0,0,0,0.28);
        background-image: url('${safeUrl}');
        background-size: cover;
        background-position: center;
        overflow: hidden;
      " aria-label="${safeName}"></div>
    `,
    iconSize: [42, 42],
    iconAnchor: [21, 42],
    popupAnchor: [0, -34],
  });
};

export default function MapboxMap() {
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [loading, setLoading] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    let mounted = true;
    const radii = [1000, 3000, 10000, 30000, 100000];

    const getPosition = () => new Promise<GeolocationPosition | null>((resolve) => {
      if (typeof navigator === "undefined" || !navigator.geolocation) return resolve(null);
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve(pos),
        () => resolve(null),
        { enableHighAccuracy: true, timeout: 10000 }
      );
    });

    const loadNearby = async () => {
      setLoading(true);
      try {
        let resolvedLocation: { lat: number; lng: number } | null = null;

        // 1) Prefer server-side stored location from session
        try {
          const sessionRes = await fetch('/api/session');
          if (sessionRes.ok) {
            const sessionData = await sessionRes.json();
            if (sessionData.lat && sessionData.lng) {
              resolvedLocation = { lat: sessionData.lat, lng: sessionData.lng };
            }
          }
        } catch (e) {
          // ignore
        }

        // 2) If no stored location, ask browser
        if (!resolvedLocation) {
          const pos = await getPosition();
          if (pos && pos.coords) {
            resolvedLocation = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          }
        }

        if (resolvedLocation) {
          setUserLocation(resolvedLocation);
        }

        // If we still don't have location, try to use default center
        const loc = resolvedLocation;
        const lat = loc?.lat ?? 6.2442;
        const lng = loc?.lng ?? -75.5898;

        // Progressive search: increase radius until we have a useful set of tutors.
        const foundMap = new Map<string, Tutor>();
        for (const r of radii) {
          try {
            const res = await fetchApi<TutorsResponse | Tutor[]>(`/tutors?lat=${lat}&lng=${lng}&radius=${r}&limit=50`);
            let list: Tutor[] = [];
            if (Array.isArray(res)) list = res as Tutor[];
            else if (res && Array.isArray((res as TutorsResponse).tutors)) list = (res as TutorsResponse).tutors as Tutor[];
            for (const tutor of list) {
              const key = `${tutor.user_id}-${tutor.id}`;
              foundMap.set(key, tutor);
            }
            if (foundMap.size >= 8) {
              break;
            }
          } catch (e) {
            // ignore and try larger radius
          }
        }

        const merged = Array.from(foundMap.values());
        if (mounted) setTutors(merged.length > 0 ? merged : []);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadNearby();
    return () => { mounted = false; };
  }, []);

  const tutorsWithCoords = (tutors || []).filter((tutor) => {
    const longitude = tutor.lng ?? tutor.longitude;
    const latitude = tutor.lat ?? tutor.latitude;
    return typeof longitude === "number" && typeof latitude === "number";
  });

  const center: [number, number] = userLocation ? [userLocation.lat, userLocation.lng] : [6.2442, -75.5898];
  const zoom = userLocation ? 13 : 12;

  return (
    <div className="w-full h-full min-h-125 rounded-lg overflow-hidden border shadow-sm">
      <MapContainer center={center} zoom={zoom} className="h-full w-full" scrollWheelZoom>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {tutorsWithCoords.map((tutor) => {
          const longitude = (tutor.lng ?? tutor.longitude) as number;
          const latitude = (tutor.lat ?? tutor.latitude) as number;
          const name = tutor.display_name || tutor.full_name || "Tutor";
          const initials = name.substring(0, 2).toUpperCase();
          const avatarUrl = getTutorAvatar(tutor);
          const markerIcon = createAvatarIcon(avatarUrl, name);
          
          return (
            <Marker key={`${tutor.user_id}-${tutor.id}`} position={[latitude, longitude]} icon={markerIcon}>
              <Popup className="custom-popup" maxWidth={300}>
                <div className="p-3 min-w-48">
                  <div className="flex items-center gap-3 mb-3">
                    <Avatar className="h-12 w-12 border-2 border-primary">
                      <AvatarImage src={avatarUrl} alt={name} />
                      <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-bold text-sm">{name}</h3>
                      <p className="text-xs text-muted-foreground">${tutor.hourly_rate || 20}/h</p>
                    </div>
                  </div>

                  {Array.isArray(tutor.specialties) && tutor.specialties.length > 0 && (
                    <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                      {tutor.specialties.slice(0, 3).join(" • ")}
                    </p>
                  )}
                  
                  <div className="flex gap-2">
                    <Link href={`/profile/${tutor.user_id}`} className="flex-1">
                      <Button size="sm" variant="outline" className="w-full">
                        Ver Perfil
                      </Button>
                    </Link>
                    <Link href={`/messages?userId=${tutor.user_id}`} className="flex-1">
                      <Button size="sm" className="w-full gap-2">
                        <MessageSquare className="h-4 w-4" />
                        Mensaje
                      </Button>
                    </Link>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}