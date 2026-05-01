import { fetchApi } from "@/lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";

interface UserProfile {
  user_id: string;
  display_name?: string;
  bio?: string;
  avatar_url?: string;
  location_name?: string;
}

interface AuthUser {
  id: string;
  email?: string;
  role?: string;
  display_name?: string;
}

interface TutorProfile {
  specialties?: string[];
  categories?: string[];
  hourly_rate?: number;
  years_experience?: number;
  is_available?: boolean;
}

export default async function MyProfilePage() {
  const userProfile = await fetchApi<UserProfile>("/users/me").catch(() => null);
  const authUser = await fetchApi<AuthUser>("/auth/me").catch(() => null);
  const tutorProfile = await fetchApi<TutorProfile>("/tutors/profiles/me").catch(() => null);

  if (!userProfile && !authUser) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-2xl font-bold mb-2">Perfil no disponible</h2>
        <p className="text-muted-foreground mb-4">No se pudo cargar tu perfil de usuario.</p>
        <Link href="/dashboard">
          <Button>Volver al Dashboard</Button>
        </Link>
      </div>
    );
  }

  const resolvedUserId = userProfile?.user_id || authUser?.id || "";
  const fallbackName = authUser?.display_name || authUser?.email?.split("@")[0] || "Mi Perfil";
  const resolvedDisplayName = userProfile?.display_name || fallbackName;
  const resolvedLocation = userProfile?.location_name || "Sin ubicación";
  const resolvedBio = userProfile?.bio || "Aún no has agregado una biografía.";
  const avatarSeed = resolvedUserId || resolvedDisplayName;

  const skills = [...(tutorProfile?.specialties || []), ...(tutorProfile?.categories || [])];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={userProfile?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${avatarSeed}`} alt={resolvedDisplayName} />
            <AvatarFallback>{(resolvedDisplayName || "US").substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle>{resolvedDisplayName}</CardTitle>
            <CardDescription>{resolvedLocation}</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">{resolvedBio}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 rounded-md border p-4 bg-muted/30">
            <div>
              <p className="text-xs text-muted-foreground">Correo</p>
              <p className="font-medium">{authUser?.email || "No disponible"}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Rol</p>
              <p className="font-medium capitalize">{authUser?.role || "No disponible"}</p>
            </div>
          </div>

          {!userProfile && (
            <div className="rounded-md border p-4 bg-amber-50 text-amber-900">
              <p className="text-sm font-medium mb-1">Tu perfil básico está activo</p>
              <p className="text-sm">Aún no has completado la información extendida del perfil, pero ya puedes usar la plataforma.</p>
            </div>
          )}

          {tutorProfile ? (
            <div className="space-y-3">
              <div className="text-sm">
                <span className="font-medium">Disponibilidad: </span>
                {tutorProfile.is_available ? "Disponible" : "No disponible"}
              </div>
              <div className="text-sm">
                <span className="font-medium">Tarifa por hora: </span>
                ${tutorProfile.hourly_rate || 0}
              </div>
              {skills.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, index) => (
                    <Badge key={index} variant="secondary">{skill}</Badge>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-md border p-4 bg-muted/40">
              <p className="text-sm text-muted-foreground mb-3">Aún no tienes perfil de tutor.</p>
              <Link href="/tutor/onboarding">
                <Button size="sm">Crear perfil de tutor</Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
