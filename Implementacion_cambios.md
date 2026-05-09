# SPRINT DE MEJORAS — TutorMatch Frontend
# Implementar en orden exacto, un bloque a la vez

## CONTEXTO DEL PROYECTO
Next.js 14 App Router, shadcn/ui con @base-ui/react (NO Radix),
TypeScript estricto, Tailwind CSS v4, sonner para toasts.
Backend FastAPI en localhost:8000, autenticación con cookies httpOnly.

## REGLAS GLOBALES (aplicar en TODOS los cambios)
- NUNCA usar `any` en TypeScript — tipar todo explícitamente
- NUNCA usar localStorage ni sessionStorage
- 'use client' solo cuando haya hooks, estado o eventos del browser
- Todos los fetches al backend van por fetchApi de @/lib/api.ts
- Feedback al usuario siempre con toast de sonner
- Loading states siempre con Skeleton de shadcn/ui
- Mapas siempre con dynamic import y ssr: false

---

# BLOQUE 1 — BUGS CRÍTICOS

## Tarea 1.1: Fix WebSocket cleanup (messages/page.tsx)

PROBLEMA: El cleanup del useEffect usa `socket` del closure inicial
(siempre es null cuando se ejecuta el cleanup).

SOLUCIÓN: Agregar useRef para guardar la referencia del WebSocket.

Cambios en frontend/app/(main)/messages/page.tsx:

1. Agregar al inicio del componente MessagesPageContent:
   const wsRef = useRef<WebSocket | null>(null);

2. Dentro del useEffect donde se crea el WebSocket, después de
   `const ws = new WebSocket(...)`:
   wsRef.current = ws;
   setSocket(ws);

3. En el return del cleanup del useEffect:
   return () => {
     wsRef.current?.close();
     wsRef.current = null;
   };

4. Eliminar la línea `if (socket) socket.close();` del cleanup anterior.

Verificar que el componente sigue compilando sin errores de TypeScript.

---

## Tarea 1.2: Eliminar datos falsos del perfil (profile/[id]/page.tsx)

PROBLEMA: Hay dos métricas con datos inventados que cambian en cada render.

CAMBIO 1 — Clases dadas (línea con Math.random):
ANTES:
  <span className="font-semibold">{Math.floor(Math.random() * 200)}</span>

DESPUÉS:
  <span className="font-semibold text-muted-foreground">—</span>

CAMBIO 2 — Rating calculado desde hourly_rate:
ANTES:
  {(tutor.hourly_rate ? (Math.min(5, (tutor.hourly_rate % 5) + 4)).toFixed(1) : '5.0')}

DESPUÉS:
  <span className="text-sm text-muted-foreground">Sin valoraciones</span>

Eliminar también el import de Star de lucide-react si queda sin usar
tras este cambio.

---

## Tarea 1.3: Fix botón "Contactar" en TutorCard
(components/ui/tutor-card.tsx)

PROBLEMA: El botón "Contactar" navega a /profile en vez del chat.

SOLUCIÓN: Reemplazar el área de acciones del card por dos botones.

ANTES (sección del footer del card):
  <Link href={`/profile/${user_id}`}>
    <Button className="bg-[var(--primary)] text-white
      hover:bg-[var(--primary)]">
      Contactar
    </Button>
  </Link>

DESPUÉS:
  <div className="flex gap-2">
    <Link href={`/profile/${user_id}`}>
      <Button variant="outline" size="sm">
        Ver Perfil
      </Button>
    </Link>
    <Link href={`/messages?userId=${user_id}`}>
      <Button size="sm"
        className="bg-primary text-primary-foreground
          hover:bg-primary/90">
        Contactar
      </Button>
    </Link>
  </div>

---

# BLOQUE 2 — MEJORAS DE NAVEGACIÓN Y UX

## Tarea 2.1: Fix sidebar estado activo
(components/sidebar/app-sidebar.tsx)

PROBLEMA: isActive se aplica solo como clase CSS al Link interior,
en lugar de usar el prop nativo isActive del SidebarMenuButton.

SOLUCIÓN COMPLETA — reemplazar el map de items:

ANTES:
  <SidebarMenuItem key={item.title}>
    <SidebarMenuButton>
      <Link href={item.url} className={`flex items-center gap-2 w-full
        ${isActive ? 'text-[var(--primary)]' : ''}`}>
        <item.icon className={`${isActive ? 'text-[var(--primary)]' : ''}`} />
        <span>{item.title}</span>
      </Link>
    </SidebarMenuButton>
  </SidebarMenuItem>

DESPUÉS:
  <SidebarMenuItem key={item.title}>
    <SidebarMenuButton asChild isActive={isActive} tooltip={item.title}>
      <Link href={item.url}>
        <item.icon />
        <span>{item.title}</span>
      </Link>
    </SidebarMenuButton>
  </SidebarMenuItem>

Verificar que el SidebarMenuButton del proyecto acepta prop `asChild` e
`isActive` revisando components/ui/sidebar.tsx antes de implementar.

---

## Tarea 2.2: Onboarding — reemplazar inputs lat/lng por geolocalización
(app/(main)/tutor/onboarding/page.tsx)

PROBLEMA: El formulario pide latitud y longitud como texto libre.
Nadie conoce sus coordenadas exactas.

CAMBIOS en el estado inicial del componente:
- Eliminar los campos `latitude` y `longitude` del objeto formData
- Agregar estado separado:
  const [locationCaptured, setLocationCaptured] = useState(false);
  const [locationCoords, setLocationCoords] =
    useState<{ lat: number; lng: number } | null>(null);

NUEVA FUNCIÓN (agregar antes del handleSubmit):
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Tu navegador no soporta geolocalización");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocationCoords({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setLocationCaptured(true);
        toast.success("Ubicación capturada correctamente");
      },
      () => {
        toast.error("No se pudo obtener tu ubicación");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

CAMBIOS en handleSubmit:
- Usar locationCoords?.lat y locationCoords?.lng en el payload
  en lugar de formData.latitude y formData.longitude
- Eliminar el bloque de geolocalización que estaba al final del submit

CAMBIOS en el JSX del paso 1 — reemplazar los dos inputs de lat/lng por:
  <div className="space-y-2">
    <Label>Ubicación</Label>
    <Button
      type="button"
      variant="outline"
      className="w-full"
      onClick={handleGetLocation}
    >
      {locationCaptured
        ? "✅ Ubicación capturada"
        : "📍 Usar mi ubicación actual"}
    </Button>
    {locationCaptured && (
      <p className="text-xs text-muted-foreground text-center">
        Coordenadas guardadas. Puedes continuar.
      </p>
    )}
  </div>

---

## Tarea 2.3: Mi Perfil — agregar edición
(app/(main)/profile/me/page.tsx)

PROBLEMA: No hay forma de editar el perfil desde la UI.

ESTA PÁGINA ES SERVER COMPONENT — NO convertirla a 'use client'.
En cambio, crear un Client Component separado.

1. Crear nuevo archivo:
   frontend/components/profile/edit-profile-dialog.tsx

   Contenido:

   'use client';

   import { useState } from 'react';
   import { useRouter } from 'next/navigation';
   import { fetchApi } from '@/lib/api';
   import { toast } from 'sonner';
   import { Button } from '@/components/ui/button';
   import { Input } from '@/components/ui/input';
   import { Label } from '@/components/ui/label';
   import { Textarea } from '@/components/ui/textarea';
   import {
     Dialog,
     DialogContent,
     DialogHeader,
     DialogTitle,
     DialogTrigger,
   } from '@/components/ui/dialog';

   interface EditProfileDialogProps {
     initialData: {
       display_name?: string;
       bio?: string;
       location_name?: string;
     };
   }

   export function EditProfileDialog({ initialData }: EditProfileDialogProps) {
     const router = useRouter();
     const [open, setOpen] = useState(false);
     const [isSaving, setIsSaving] = useState(false);
     const [form, setForm] = useState({
       display_name: initialData.display_name ?? '',
       bio: initialData.bio ?? '',
       location_name: initialData.location_name ?? '',
     });

     const handleChange = (
       e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
     ) => {
       setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
     };

     const handleSave = async () => {
       setIsSaving(true);
       try {
         await fetchApi('/users/profiles/me', {
           method: 'PATCH',
           body: JSON.stringify(form),
         });
         toast.success('Perfil actualizado');
         setOpen(false);
         router.refresh();
       } catch {
         toast.error('Error al actualizar el perfil');
       } finally {
         setIsSaving(false);
       }
     };

     return (
       <Dialog open={open} onOpenChange={setOpen}>
         <DialogTrigger asChild>
           <Button variant="outline" size="sm">
             Editar perfil
           </Button>
         </DialogTrigger>
         <DialogContent>
           <DialogHeader>
             <DialogTitle>Editar perfil</DialogTitle>
           </DialogHeader>
           <div className="space-y-4 py-2">
             <div className="space-y-2">
               <Label htmlFor="display_name">Nombre</Label>
               <Input
                 id="display_name"
                 name="display_name"
                 value={form.display_name}
                 onChange={handleChange}
               />
             </div>
             <div className="space-y-2">
               <Label htmlFor="bio">Biografía</Label>
               <Textarea
                 id="bio"
                 name="bio"
                 value={form.bio}
                 onChange={handleChange}
                 className="h-28"
               />
             </div>
             <div className="space-y-2">
               <Label htmlFor="location_name">Ciudad</Label>
               <Input
                 id="location_name"
                 name="location_name"
                 value={form.location_name}
                 onChange={handleChange}
               />
             </div>
             <Button
               onClick={handleSave}
               disabled={isSaving}
               className="w-full"
             >
               {isSaving ? 'Guardando...' : 'Guardar cambios'}
             </Button>
           </div>
         </DialogContent>
       </Dialog>
     );
   }

2. En profile/me/page.tsx (mantener como Server Component),
   importar y agregar el componente junto al título del Card:

   import { EditProfileDialog } from '@/components/profile/edit-profile-dialog';

   Dentro del CardHeader, agregar al lado del nombre:
   <div className="flex items-center justify-between w-full">
     <div>
       <CardTitle>{resolvedDisplayName}</CardTitle>
       <CardDescription>{resolvedLocation}</CardDescription>
     </div>
     <EditProfileDialog initialData={{
       display_name: userProfile?.display_name,
       bio: userProfile?.bio,
       location_name: userProfile?.location_name,
     }} />
   </div>

---

# BLOQUE 3 — MAPA MAPBOX + MEJORAS VISUALES

## Tarea 3.1: Migrar de Leaflet a Mapbox GL JS
(components/map/MapboxMap.tsx)

CONTEXTO: El archivo ya se llama MapboxMap.tsx pero usa Leaflet.
Mapbox GL JS ya está instalado (mapbox-gl: ^3.23.0 en package.json).
Es el stack oficial del proyecto según AGENT.md.

PREREQUISITO OBLIGATORIO antes de implementar:
Agregar en .env.local (y en .env.example como placeholder):
  NEXT_PUBLIC_MAPBOX_TOKEN=tu_token_real_aqui
Obtenerlo gratis en mapbox.com — free tier: 50,000 cargas/mes.

REESCRIBIR components/map/MapboxMap.tsx completo con este contenido:

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

DESPUÉS de reescribir el archivo:
- Eliminar los imports de react-leaflet y leaflet del archivo
- Verificar que el import dinámico en explore/page.tsx sigue apuntando
  a @/components/map/MapboxMap (el nombre del archivo NO cambia)
- Eliminar el import de leaflet/dist/leaflet.css de globals.css
  ya que Mapbox tiene su propio CSS importado directamente en el componente

---

## Tarea 3.2: Notificaciones Bell con dropdown
(app/(main)/layout.tsx)

PROBLEMA: El botón Bell es solo visual, sin funcionalidad.

SOLUCIÓN: Extraer a un Client Component con estado local.

1. Crear frontend/components/layout/notifications-bell.tsx:

   'use client';

   import { useState, useRef, useEffect } from 'react';
   import { Bell } from 'lucide-react';

   export function NotificationsBell() {
     const [open, setOpen] = useState(false);
     const ref = useRef<HTMLDivElement>(null);

     // Cerrar al hacer click fuera
     useEffect(() => {
       const handler = (e: MouseEvent) => {
         if (ref.current && !ref.current.contains(e.target as Node)) {
           setOpen(false);
         }
       };
       document.addEventListener('mousedown', handler);
       return () => document.removeEventListener('mousedown', handler);
     }, []);

     return (
       <div ref={ref} className="relative">
         <button
           onClick={() => setOpen(prev => !prev)}
           className="p-2 rounded-md hover:bg-muted/30 relative"
           aria-label="Notificaciones"
         >
           <Bell className="w-5 h-5 text-muted-foreground" />
           {/* Badge — descomentar cuando haya datos reales */}
           {/* <span className="absolute top-1 right-1 h-2 w-2
               bg-destructive rounded-full" /> */}
         </button>

         {open && (
           <div className="absolute right-0 top-11 w-72 bg-card border
             rounded-xl shadow-lg z-50 overflow-hidden">
             <div className="px-4 py-3 border-b">
               <h3 className="text-sm font-semibold">Notificaciones</h3>
             </div>
             <div className="flex flex-col items-center justify-center
               py-8 px-4 text-muted-foreground">
               <Bell className="w-8 h-8 mb-3 opacity-25" />
               <p className="text-sm">No tienes notificaciones</p>
               <p className="text-xs mt-1 opacity-70">
                 Aquí aparecerán tus mensajes nuevos
               </p>
             </div>
           </div>
         )}
       </div>
     );
   }

2. En app/(main)/layout.tsx reemplazar el botón Bell estático:

   ANTES:
     import { Bell } from "lucide-react";
     ...
     <button className="p-2 rounded-md hover:bg-muted/30">
       <Bell className="w-5 h-5 text-muted-foreground" />
     </button>

   DESPUÉS:
     import { NotificationsBell } from
       "@/components/layout/notifications-bell";
     ...
     <NotificationsBell />

---

## Tarea 3.3: Landing page (app/page.tsx)

PROBLEMA: app/page.tsx hace redirect("/dashboard") sin verificar sesión.
Usuarios no autenticados llegan al dashboard y son redirigidos a /login,
sin ver qué es el producto.

NUEVO CONTENIDO de app/page.tsx:

  import { cookies } from 'next/headers';
  import { redirect } from 'next/navigation';
  import Link from 'next/link';
  import { Button } from '@/components/ui/button';

  export default async function Home() {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (token) redirect('/dashboard');

    return (
      <main className="min-h-screen bg-background">

        {/* Hero */}
        <section className="flex flex-col items-center justify-center
          min-h-screen px-4 text-center bg-gradient-to-br
          from-primary/10 via-background to-accent/20">

          <div className="h-16 w-16 rounded-full bg-primary
            text-primary-foreground font-bold text-2xl
            flex items-center justify-center mb-6 shadow-lg">
            TM
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-4 max-w-2xl">
            Encuentra tu tutor ideal en Medellín
          </h1>

          <p className="text-lg text-muted-foreground max-w-xl mb-8">
            Conecta con tutores expertos cerca de ti.
            Aprende a tu ritmo, donde quieras.
          </p>

          <div className="flex gap-4 flex-wrap justify-center">
            <Link href="/login">
              <Button size="lg" variant="outline">
                Iniciar Sesión
              </Button>
            </Link>
            <Link href="/register">
              <Button size="lg"
                className="bg-primary text-primary-foreground
                  hover:bg-primary/90">
                Comenzar gratis
              </Button>
            </Link>
          </div>
        </section>

        {/* Features */}
        <section className="py-20 px-4 max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            ¿Por qué TutorMatch?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: '🗺️',
                title: 'Tutores cercanos',
                desc: 'Encuentra tutores en tu zona con nuestro mapa interactivo.',
              },
              {
                icon: '💬',
                title: 'Chat en tiempo real',
                desc: 'Habla directamente con tu tutor sin intermediarios.',
              },
              {
                icon: '🎯',
                title: 'Aprende lo que quieras',
                desc: 'Matemáticas, idiomas, programación y mucho más.',
              },
            ].map((f) => (
              <div
                key={f.title}
                className="p-6 rounded-xl border bg-card shadow-sm
                  text-center hover:shadow-md transition-shadow"
              >
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
                <p className="text-muted-foreground text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

      </main>
    );
  }

---

## Tarea 3.4: Tokens de diseño — reemplazar colores hardcoded

Hacer búsqueda y reemplazo global en toda la carpeta frontend/
(excepto node_modules y .next):

| Buscar                                          | Reemplazar con                      |
|-------------------------------------------------|-------------------------------------|
| bg-[#EDE7F6]                                    | bg-accent                           |
| text-[var(--primary)]                           | text-primary                        |
| bg-[var(--primary)]                             | bg-primary                          |
| hover:bg-[var(--primary)]                       | hover:bg-primary/90                 |
| bg-[var(--primary)] text-white                  | bg-primary text-primary-foreground  |
| text-[var(--primary)] font-medium               | text-primary font-medium            |

ARCHIVOS donde aplica principalmente:
- components/ui/tutor-card.tsx
- components/ui/compact-tutor-card.tsx
- app/(main)/dashboard/page.tsx
- app/(main)/profile/[id]/page.tsx
- app/(main)/layout.tsx
- components/sidebar/app-sidebar.tsx

IMPORTANTE: Después del reemplazo, revisar visualmente que los colores
se ven iguales. Si algo se rompe, revertir solo ese caso y dejar un
comentario: // TODO: migrar a token cuando se resuelva conflicto

---

# VERIFICACIÓN FINAL

Después de completar todos los bloques, verificar:

1. `npm run build` pasa sin errores de TypeScript
2. `npm run lint` sin warnings críticos
3. Existe NEXT_PUBLIC_MAPBOX_TOKEN en .env.local
4. Flujo completo funciona:
   - / sin sesión → muestra landing page
   - / con sesión → redirige a /dashboard
   - Sidebar resalta el item activo correctamente
   - TutorCard tiene dos botones: "Ver Perfil" y "Contactar"
   - Perfil de tutor no muestra Math.random ni rating falso
   - Onboarding tiene botón de geolocalización, no inputs de texto
   - Mi Perfil tiene botón "Editar perfil" que abre Dialog funcional
   - Bell abre dropdown con estado vacío y se cierra al hacer click fuera
   - El mapa usa Mapbox GL JS, muestra el radio de búsqueda expandiéndose
     y pins con popup de "Perfil" y "Contactar"
   - WebSocket se cierra correctamente al desmontar el componente de chat
   - globals.css ya no importa leaflet.css

Si alguna tarea genera un error de TypeScript que no es trivial de
resolver, documentarlo con un comentario TODO y continuar con la
siguiente tarea. No bloquear el sprint por un tipo difícil.