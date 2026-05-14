import { fetchApi } from "@/lib/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IconMessages, IconMap } from "@/components/icons/TmIcons";
import { Clock } from "lucide-react";
import Link from "next/link";

interface TutorProfile {
  user_id: string;
  specialties?: string[];
  categories?: string[];
  headline?: string;
  hourly_rate?: number;
  years_experience?: number;
  lat?: number;
  lng?: number;
  is_available?: boolean;
}

interface UserProfile {
  display_name?: string;
  bio?: string;
  avatar_url?: string;
  location_name?: string;
}

export default async function ProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let tutor: TutorProfile | null = null;
  let userProfile: UserProfile | null = null;
  let errorMsg = null;

  try {
    tutor = await fetchApi<TutorProfile>(`/tutors/${id}`);
    userProfile = await fetchApi<UserProfile>(`/users/profiles/${id}`).catch(() => null);
} catch (error: unknown) {
      const err = error as Error;
      errorMsg = err.message || "No se pudo cargar el perfil del tutor";
  }

  if (errorMsg || !tutor) {
    return (
      <div className="p-6 text-center">
        <h2 className="mb-2 text-2xl font-bold text-white">Tutor no encontrado</h2>
        <p className="mb-4 text-white/50">{errorMsg}</p>
        <Link href="/dashboard"><Button>Volver al inicio</Button></Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="relative">
        <div className="relative h-40 w-full overflow-hidden rounded-2xl bg-linear-to-br from-primary/40 via-violet-900/30 to-[#0a0a14]">
          <div className="absolute inset-0 bg-linear-to-r from-primary/20 to-transparent" />
        </div>
        <div className="absolute left-6 -bottom-8">
          <Avatar className="h-32 w-32 border-4 border-[#0d0d1a] shadow-lg">
            <AvatarImage
              src={userProfile?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${tutor.user_id}`}
              alt={userProfile?.display_name || "Perfil disponible"}
            />
            <AvatarFallback>{(userProfile?.display_name || "PD").substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
        </div>
      </div>

      <div className="rounded-2xl border border-white/8 bg-white/5 p-6 pt-10 shadow-sm">
        <div className="flex flex-col md:flex-row items-start gap-6">
          <div className="flex-1 pl-2">
            <div className="ml-0 md:ml-0">
              <h1 className="text-2xl font-bold text-white">{userProfile?.display_name || "Perfil disponible"}</h1>
              <p className="text-sm text-white/50">{tutor.headline || userProfile?.bio || 'Especialista disponible'}</p>
            </div>

            <div className="mt-4 flex gap-4">
              <div className="flex flex-col">
                <span className="text-sm text-white/40">Clases dadas</span>
                <span className="font-semibold text-white/80">—</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-white/40">Rating</span>
                <span className="text-sm text-white/80">Sin valoraciones</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-white/40">Años exp.</span>
                <span className="font-semibold text-white/80">{tutor.years_experience ?? 1}</span>
              </div>
            </div>
          </div>

          <div className="shrink-0 w-full md:w-auto">
            <Link href={`/messages?userId=${tutor.user_id}`}>
              <Button size="lg" className="w-full md:w-auto bg-primary text-white">
                <IconMessages className="mr-2 h-4 w-4" />
                Enviar Mensaje
              </Button>
            </Link>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="mb-2 text-sm font-semibold text-white/80">Habilidades</h3>
          <div className="flex flex-wrap gap-2">
            {((tutor.specialties || []).concat(tutor.categories || [])).map((s: string, i: number) => (
              <span key={i} className="rounded-full border border-primary/20 bg-primary/15 px-3 py-1 text-sm text-primary">{s}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Navegación por Pestañas */}
      <Tabs defaultValue="about" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-3 bg-white/5">
          <TabsTrigger value="about">Sobre Mí</TabsTrigger>
          <TabsTrigger value="skills">Habilidades</TabsTrigger>
          <TabsTrigger value="reviews">Reseñas</TabsTrigger>
        </TabsList>
        
        <TabsContent value="about" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-white">Biografía</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap leading-relaxed text-white/50">
                {userProfile?.bio || "Este tutor aún no ha añadido una biografía."}
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="skills" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-white">Habilidades y Especialidades</CardTitle>
              <CardDescription className="text-white/40">Materias y tecnologías que enseña este tutor</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {((tutor.specialties?.length || 0) > 0 || (tutor.categories?.length || 0) > 0) ? (
                  [...(tutor.specialties || []), ...(tutor.categories || [])].map((skill, index) => (
                    <Badge key={index} variant="secondary" className="border border-primary/20 bg-primary/15 px-3 py-1 text-sm text-primary">
                      {skill}
                    </Badge>
                  ))
                ) : (
                  <p className="text-white/50">No ha especificado habilidades.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviews" className="mt-4">
          <Card>
            <CardContent className="py-10 text-center text-white/50">
              <p>Aún no hay reseñas para mostrar.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
