"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchApi } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { TutorCard } from "@/components/ui/tutor-card";
import { useState } from "react";

interface Tutor {
  id: string;
  user_id: string;
  full_name?: string;
  display_name?: string;
  headline?: string;
  bio?: string;
  hourly_rate?: number;
  rating?: number;
  location_name?: string;
  skills?: string[];
  avatar_url?: string;
  is_available?: boolean;
}

export default function DashboardPage() {
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const { data: tutors, isLoading, error } = useQuery<Tutor[]>({
    queryKey: ["tutors"],
    queryFn: async () => {
      const response = await fetchApi<Tutor[] | { tutors?: Tutor[] }>("/tutors/").catch(() => [] as Tutor[]);
      const tutorList = Array.isArray(response) ? response : response && Array.isArray(response.tutors) ? response.tutors : [];

      const enriched = await Promise.all(
        tutorList.map(async (tutor) => {
          try {
            const profile = await fetchApi<{
              display_name?: string;
              bio?: string;
              avatar_url?: string;
              location_name?: string;
              is_available?: boolean;
            }>(`/users/profiles/${tutor.user_id}`);

            return {
              ...tutor,
              display_name: profile.display_name,
              bio: profile.bio ?? tutor.bio,
              avatar_url: profile.avatar_url,
              location_name: profile.location_name ?? tutor.location_name,
              is_available: profile.is_available,
            };
          } catch {
            return tutor;
          }
        })
      );

      return enriched.sort((a, b) => (b.display_name ? 1 : 0) - (a.display_name ? 1 : 0));
    },
  });

  const tags = ["Java", "Inglés", "Matemáticas", "Diseño Web", "Python"];

  const filtered = tutors?.filter((t) => {
    if (!t) return false;
    if (query && !(t.display_name || t.full_name || t.headline || t.bio || "").toLowerCase().includes(query.toLowerCase())) return false;
    if (activeTag && !(t.skills || []).map((s) => s.toLowerCase()).includes(activeTag.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="rounded-lg overflow-hidden bg-gradient-to-r from-[var(--primary)]/90 to-[var(--primary)]/60 p-8 text-white">
        <h1 className="text-3xl font-bold">Bienvenido a TutorMatch</h1>
        <p className="mt-2 max-w-xl">Encuentra tutores cerca de ti y empieza a aprender hoy mismo.</p>
        <div className="mt-6 max-w-xl">
          <div className="flex items-center gap-2 bg-white rounded-md p-2">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 px-3 py-2 outline-none text-sm"
              placeholder="¿Qué quieres aprender hoy?"
            />
            <Button size="sm">Buscar</Button>
          </div>
          <div className="mt-3 flex gap-2 overflow-auto">
            {tags.map((t) => (
              <button
                key={t}
                onClick={() => setActiveTag(activeTag === t ? null : t)}
                className={`px-3 py-1 rounded-full text-sm ${activeTag === t ? 'bg-[var(--primary)] text-white' : 'bg-[#EDE7F6] text-[var(--primary)]'}`}>
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="p-4">
              <Skeleton className="h-40 w-full rounded-lg" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="p-6 bg-destructive/10 rounded-lg">Error al cargar los tutores.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered?.map((t) => (
            <TutorCard key={t.id} {...t} />
          ))}
        </div>
      )}
    </div>
  );
}