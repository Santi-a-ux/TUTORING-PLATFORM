"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { fetchApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2, ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";

export default function TutorOnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    bio: "",
    hourly_rate: "",
    subjects: "",
    latitude: "",
    longitude: "",
  });

  const handleNext = () => setStep((s) => s + 1);
  const handleBack = () => setStep((s) => s - 1);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      // Try to get browser geolocation if fields are empty
      const getPosition = () => new Promise<GeolocationPosition | null>((resolve) => {
        if (typeof navigator === "undefined" || !navigator.geolocation) return resolve(null);
        navigator.geolocation.getCurrentPosition(
          (pos) => resolve(pos),
          () => resolve(null),
          { enableHighAccuracy: true, timeout: 10000 }
        );
      });

      let lat: number | null = formData.latitude ? Number(formData.latitude) : null;
      let lng: number | null = formData.longitude ? Number(formData.longitude) : null;

      if ((!lat || !lng)) {
        const pos = await getPosition();
        if (pos && pos.coords) {
          lat = pos.coords.latitude;
          lng = pos.coords.longitude;
        }
      }

      const payload: any = {
        // backend expects `specialties` (array) and top-level `lat`/`lng`
        specialties: formData.subjects ? formData.subjects.split(",").map((s) => s.trim()) : [],
        categories: [],
        hourly_rate: Number(formData.hourly_rate) || null,
        lat: lat,
        lng: lng,
      };

      await fetchApi("/tutors/profiles", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      toast.success("¡Perfil de tutor creado exitosamente!");
      router.push("/dashboard");
    } catch (error) {
      toast.error("Error al crear el perfil de tutor.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-6rem)] items-center justify-center p-4">
      <Card className="w-full max-w-lg shadow-lg">
        <CardHeader>
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Paso {step} de 3
            </span>
            <div className="flex gap-1">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`h-2 w-8 rounded-full ${
                    step >= i ? "bg-primary" : "bg-muted"
                  }`}
                />
              ))}
            </div>
          </div>
          <CardTitle className="text-2xl">Conviértete en Tutor</CardTitle>
          <CardDescription>
            {step === 1 && "Cuéntanos sobre ti y tu experiencia."}
            {step === 2 && "Configura tus temas y tarifas."}
            {step === 3 && "Revisa y confirma tu información."}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="space-y-2">
                <Label htmlFor="bio">Biografía Profesional</Label>
                <Textarea
                  id="bio"
                  name="bio"
                  placeholder="Hola, soy experto en matemáticas con 5 años de experiencia..."
                  className="h-32"
                  value={formData.bio}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="latitude">Latitud (Opcional)</Label>
                  <Input
                    id="latitude"
                    name="latitude"
                    placeholder="-34.6037"
                    value={formData.latitude}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="longitude">Longitud (Opcional)</Label>
                  <Input
                    id="longitude"
                    name="longitude"
                    placeholder="-58.3816"
                    value={formData.longitude}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="space-y-2">
                <Label htmlFor="subjects">Materias (separadas por coma)</Label>
                <Input
                  id="subjects"
                  name="subjects"
                  placeholder="Matemáticas, Física, Programación"
                  value={formData.subjects}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hourly_rate">Tarifa por Hora (USD)</Label>
                <Input
                  id="hourly_rate"
                  name="hourly_rate"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="15.00"
                  value={formData.hourly_rate}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="rounded-lg bg-muted/50 p-4 space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground font-medium">Biografía</p>
                  <p className="text-sm">{formData.bio || "No especificada"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground font-medium">Materias</p>
                  <p className="text-sm">{formData.subjects || "No especificadas"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground font-medium">Tarifa</p>
                  <p className="text-sm">${formData.hourly_rate || "0"}/hora</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-between border-t p-6">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={step === 1 || isLoading}
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Atrás
          </Button>
          
          {step < 3 ? (
            <Button onClick={handleNext}>
              Siguiente <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <CheckCircle2 className="w-4 h-4 mr-2" />
              )}
              Confirmar y Crear Perfil
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}