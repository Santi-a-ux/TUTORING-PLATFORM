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
      {/* Cabecera del perfil */}
      <div className="flex flex-col md:flex-row items-start gap-6 bg-card p-6 rounded-lg border shadow-sm">
        <Avatar className="w-24 h-24 sm:w-32 sm:h-32 border-4 border-background shadow-sm">
          <AvatarImage
            src={userProfile?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${tutor.user_id}`}
            alt={userProfile?.display_name || "Tutor"}
          />
          <AvatarFallback>{(userProfile?.display_name || "TU").substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        
        <div className="space-y-3 flex-1 w-full">
          <div>
            <h1 className="text-3xl font-bold">{userProfile?.display_name || "Tutor"}</h1>
            <p className="text-xl text-muted-foreground">Tutor Profesional</p>
          </div>
          
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            {userProfile?.location_name && (
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{userProfile.location_name}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 text-amber-500" />
              <span>{tutor.is_available ? "Disponible" : "No disponible"}</span>
            </div>
            <div className="flex items-center gap-1 font-medium text-foreground">
              <Clock className="h-4 w-4" />
              <span>${tutor.hourly_rate || 20} / hora</span>
            </div>
          </div>
        </div>

        <div className="shrink-0 w-full md:w-auto">
          <Link href={`/messages?userId=${tutor.user_id}`}>
            <Button size="lg" className="w-full md:w-auto">
              <MessageSquare className="mr-2 h-4 w-4" />
              Enviar Mensaje
            </Button>
          </Link>
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