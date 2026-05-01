"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchApi } from "@/lib/api";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { MapPin, Star } from "lucide-react";
import Link from "next/link";

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
}

interface TutorsResponse {
  tutors?: Tutor[];
}

export default function DashboardPage() {
  const { data: tutors, isLoading, error } = useQuery<Tutor[]>({
    queryKey: ["tutors"],
    queryFn: async () => {
      const response = await fetchApi<Tutor[] | TutorsResponse>("/tutors/").catch(() => [] as Tutor[]);
      const tutorList = Array.isArray(response)
        ? response
        : response && Array.isArray(response.tutors)
          ? response.tutors
          : [];

      const enriched = await Promise.all(
        tutorList.map(async (tutor) => {
          try {
            const profile = await fetchApi<{
              display_name?: string;
              bio?: string;
              avatar_url?: string;
              location_name?: string;
            }>(`/users/profiles/${tutor.user_id}`);

            return {
              ...tutor,
              display_name: profile.display_name,
              bio: profile.bio ?? tutor.bio,
              avatar_url: profile.avatar_url,
              location_name: profile.location_name ?? tutor.location_name,
            };
          } catch {
            return tutor;
          }
        })
      );

      return enriched.sort((left, right) => {
        const leftName = left.display_name || left.full_name || "";
        const rightName = right.display_name || right.full_name || "";
        const leftPriority = left.display_name ? 1 : 0;
        const rightPriority = right.display_name ? 1 : 0;

        if (leftPriority !== rightPriority) {
          return rightPriority - leftPriority;
        }

        return leftName.localeCompare(rightName, "es");
      });
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Encuentra al tutor perfecto para ti entre nuestra selección de profesionales.
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader className="flex flex-row items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-37.5" />
                  <Skeleton className="h-4 w-25" />
                </div>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : error ? (
        <Card className="bg-destructive/10 border-destructive">
          <CardContent className="pt-6">
            <p className="text-destructive text-center">Error al cargar los tutores. Por favor intenta más tarde.</p>
          </CardContent>
        </Card>
      ) : tutors?.length === 0 ? (
         <div className="text-center py-20 border 2 rounded-lg bg-muted/50 border-dashed">
           <h3 className="text-lg font-semibold">No hay tutores disponibles</h3>
           <p className="text-muted-foreground mt-1">Vuelve más tarde o sé el primero en registrarte como tutor.</p>
         </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tutors?.map((tutor) => (
            <Card key={tutor.id} className="flex flex-col h-full hover:border-primary/50 transition-colors">
              <CardHeader className="flex flex-row items-start gap-4 space-y-0">
                <Avatar className="h-12 w-12">
                  <AvatarImage
                    src={tutor.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${tutor.user_id}`}
                    alt={tutor.display_name || tutor.full_name || "Tutor"}
                  />
                  <AvatarFallback>{(tutor.display_name || tutor.full_name)?.substring(0, 2).toUpperCase() || 'TU'}</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <CardTitle className="text-base line-clamp-1">
                    {tutor.display_name || tutor.full_name || "Tutor Anónimo"}
                  </CardTitle>
                  <CardDescription className="line-clamp-1 text-xs">
                    {tutor.headline || tutor.bio || "Tutor Profesional"}
                  </CardDescription>
                  <div className="flex items-center gap-3 justify-start text-xs text-muted-foreground mt-1.5">
                    <span className="flex items-center">
                      <Star className="h-3 w-3 mr-1 text-amber-500 fill-amber-500" />
                      {tutor.rating?.toFixed(1) || "5.0"}
                    </span>
                    {tutor.location_name && (
                      <span className="flex items-center text-muted-foreground">
                        <MapPin className="h-3 w-3 mr-1" />
                        <span className="line-clamp-1 max-w-25">{tutor.location_name}</span>
                      </span>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                  {tutor.bio || "Este tutor aún no ha proporcionado una descripción de su biografía o metodología de enseñanza."}
                </p>
                <div className="flex flex-wrap gap-1">
                  {tutor.skills?.slice(0, 3).map((skill, index) => (
                    <Badge key={index} variant="secondary" className="text-[10px] px-1.5 py-0">
                      {skill}
                    </Badge>
                  ))}
                  {tutor.skills && tutor.skills.length > 3 && (
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                      +{tutor.skills.length - 3}
                    </Badge>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex items-center justify-between border-t pt-4">
                <div className="font-semibold text-sm">
                  ${tutor.hourly_rate || 20} <span className="text-muted-foreground font-normal">/ hr</span>
                </div>
                <Link href={`/profile/${tutor.user_id}`}>
                  <Button size="sm">Ver Perfil</Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}