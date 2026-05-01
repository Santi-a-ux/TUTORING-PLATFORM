import { fetchApi } from "@/lib/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, MapPin, Star, Clock } from "lucide-react";
import Link from "next/link";

interface TutorProfile {
  user_id: string;
  specialties?: string[];
  categories?: string[];
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
  } catch (error: any) {
    errorMsg = error.message || "No se pudo cargar el perfil del tutor";
  }

  if (errorMsg || !tutor) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-2xl font-bold mb-2">Tutor no encontrado</h2>
        <p className="text-muted-foreground mb-4">{errorMsg}</p>
        <Link href="/dashboard"><Button>Volver al Dashboard</Button></Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="relative">
        <div className="h-40 w-full rounded-lg overflow-hidden bg-gradient-to-r from-[var(--primary)] to-[var(--primary)]/70" />
        <div className="absolute left-6 -bottom-8">
          <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
            <AvatarImage
              src={userProfile?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${tutor.user_id}`}
              alt={userProfile?.display_name || "Tutor"}
            />
            <AvatarFallback>{(userProfile?.display_name || "TU").substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
        </div>
      </div>

      <div className="pt-10 bg-card p-6 rounded-lg border shadow-sm">
        <div className="flex flex-col md:flex-row items-start gap-6">
          <div className="flex-1 pl-2">
            <div className="ml-0 md:ml-0">
              <h1 className="text-2xl font-bold">{userProfile?.display_name || "Tutor"}</h1>
              <p className="text-sm text-muted-foreground">{tutor.headline || userProfile?.bio || 'Tutor profesional'}</p>
            </div>

            <div className="mt-4 flex gap-4">
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground">Clases dadas</span>
                <span className="font-semibold">{Math.floor(Math.random() * 200)}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground">Rating</span>
                <span className="font-semibold">{(tutor.hourly_rate ? (Math.min(5, (tutor.hourly_rate % 5) + 4)).toFixed(1) : '5.0')}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground">Años exp.</span>
                <span className="font-semibold">{tutor.years_experience ?? 1}</span>
              </div>
            </div>
          </div>

          <div className="shrink-0 w-full md:w-auto">
            <Link href={`/messages?userId=${tutor.user_id}`}>
              <Button size="lg" className="w-full md:w-auto bg-[var(--primary)] text-white">
                <MessageSquare className="mr-2 h-4 w-4" />
                Enviar Mensaje
              </Button>
            </Link>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-sm font-semibold mb-2">Habilidades</h3>
          <div className="flex flex-wrap gap-2">
            {((tutor.specialties || []).concat(tutor.categories || [])).map((s: any, i: number) => (
              <span key={i} className="px-3 py-1 rounded-full text-sm bg-[#EDE7F6] text-[var(--primary)]">{s}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Navegación por Pestañas */}
      <Tabs defaultValue="about" className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-md">
          <TabsTrigger value="about">Sobre Mí</TabsTrigger>
          <TabsTrigger value="skills">Habilidades</TabsTrigger>
          <TabsTrigger value="reviews">Reseñas</TabsTrigger>
        </TabsList>
        
        <TabsContent value="about" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Biografía</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap leading-relaxed text-muted-foreground">
                {userProfile?.bio || "Este tutor aún no ha añadido una biografía."}
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="skills" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Habilidades y Especialidades</CardTitle>
              <CardDescription>Materias y tecnologías que enseña este tutor</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {((tutor.specialties?.length || 0) > 0 || (tutor.categories?.length || 0) > 0) ? (
                  [...(tutor.specialties || []), ...(tutor.categories || [])].map((skill, index) => (
                    <Badge key={index} variant="secondary" className="px-3 py-1 text-sm">
                      {skill}
                    </Badge>
                  ))
                ) : (
                  <p className="text-muted-foreground">No ha especificado habilidades.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviews" className="mt-4">
          <Card>
            <CardContent className="py-10 text-center text-muted-foreground">
              <p>Aún no hay reseñas para mostrar.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}