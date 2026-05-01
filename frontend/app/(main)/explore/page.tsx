"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

// Importación dinámica obligatoria para Mapbox (depende del objeto window y no debe ser SSR)
const MapboxMap = dynamic(() => import("@/components/map/MapboxMap"), {
  ssr: false,
  loading: () => <Skeleton className="w-full h-full min-h-[500px] rounded-lg flex items-center justify-center">Cargando mapa interactivo...</Skeleton>
});

export default function ExplorePage() {
  return (
    <div className="space-y-6 h-full flex flex-col">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Explorar</h1>
        <p className="text-muted-foreground">
          Encuentra tutores cercanos a tu ubicación usando nuestro mapa interactivo en tiempo real.
        </p>
      </div>
      <div className="flex-1 w-full h-full">
        <MapboxMap />
      </div>
    </div>
  );
}