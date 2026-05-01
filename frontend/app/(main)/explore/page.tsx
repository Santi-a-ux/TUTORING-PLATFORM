"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
import CompactTutorCard from "@/components/ui/compact-tutor-card";
import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api";

interface Tutor {
  id?: string;
  user_id: string;
  display_name?: string;
  full_name?: string;
  specialties?: string[];
  avatar_url?: string;
}

interface TutorsResponse {
  tutors?: Tutor[];
}

// Importación dinámica obligatoria para Mapbox (depende del objeto window y no debe ser SSR)
const MapboxMap = dynamic(() => import("@/components/map/MapboxMap"), {
  ssr: false,
  loading: () => <Skeleton className="w-full h-full min-h-[500px] rounded-lg flex items-center justify-center">Cargando mapa interactivo...</Skeleton>
});

export default function ExplorePage() {
  const [tutors, setTutors] = useState<Tutor[]>([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetchApi<Tutor[] | TutorsResponse>('/tutors/').catch(() => [] as Tutor[]);
        const list = Array.isArray(res) ? res : res?.tutors ?? [];
        if (mounted) setTutors(list);
      } catch (e) {
        // ignore
      }
    })();
    return () => { mounted = false; };
  }, []);
  return (
    <div className="space-y-6 h-full flex flex-col">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Explorar</h1>
        <p className="text-muted-foreground">
          Encuentra tutores cercanos a tu ubicación usando nuestro mapa interactivo en tiempo real.
        </p>
      </div>
      <div className="flex-1 w-full h-full flex">
        <aside className="hidden md:block w-80 border-r bg-card p-3 overflow-auto">
          <h3 className="text-sm font-semibold mb-2">Tutores cerca</h3>
          <div className="space-y-2">
            {tutors.length === 0 ? (
              <Skeleton className="h-10 w-full" />
            ) : (
              tutors.slice(0, 20).map((t) => (
                <CompactTutorCard key={t.id || t.user_id} user_id={t.user_id} name={t.display_name || t.full_name} specialty={t.specialties?.[0]} avatar_url={t.avatar_url} />
              ))
            )}
          </div>
        </aside>

        <div className="flex-1 relative">
          <div className="absolute left-1/2 -translate-x-1/2 top-6 z-20 w-[min(720px,90%)]">
            <div className="backdrop-blur-sm bg-white/40 border border-white/30 rounded-full p-2 flex items-center gap-3 px-4">
              <input className="flex-1 bg-transparent outline-none" placeholder="Buscar tutores, materias o ubicación" />
              <button className="px-3 py-1 rounded-md bg-[var(--primary)] text-white">Buscar</button>
            </div>
          </div>
          <MapboxMap />
        </div>
      </div>
    </div>
  );
}