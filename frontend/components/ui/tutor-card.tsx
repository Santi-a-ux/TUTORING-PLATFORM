"use client";

import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

export interface TutorCardProps {
  id: string;
  user_id: string;
  display_name?: string;
  full_name?: string;
  headline?: string;
  bio?: string;
  hourly_rate?: number;
  rating?: number;
  location_name?: string;
  skills?: string[];
  avatar_url?: string;
  is_available?: boolean;
}

export function TutorCard({
  user_id,
  display_name,
  full_name,
  headline,
  bio,
  hourly_rate,
  rating,
  skills,
  avatar_url,
  is_available,
}: TutorCardProps) {
  const name = display_name || full_name || "Tutor Anónimo";

  return (
    <article className="card group overflow-hidden rounded-lg bg-card border border-border shadow-sm hover:shadow-md transition-transform transform hover:-translate-y-1">
      <div className="p-4 flex gap-4">
        <div className="relative">
          <Avatar className="h-14 w-14">
            <AvatarImage src={avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user_id}`} alt={name} />
            <AvatarFallback>{name.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          {is_available ? (
            <span className="absolute right-0 bottom-0 h-3 w-3 rounded-full bg-green-500 ring-2 ring-white" />
          ) : null}
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold line-clamp-1">{name}</h3>
          <p className="text-xs text-muted-foreground line-clamp-1">{headline || bio || "Tutor Profesional"}</p>
          <div className="mt-2 flex items-center gap-2">
            <Star className="h-4 w-4 text-amber-400" />
            <span className="text-sm font-medium">{rating?.toFixed(1) || "5.0"}</span>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {skills?.slice(0, 4).map((s) => (
              <Badge key={s} className="bg-[#EDE7F6] text-[var(--primary)]">{s}</Badge>
            ))}
          </div>
        </div>
      </div>
      <div className="p-3 border-t flex items-center justify-between bg-card">
        <div className="font-semibold">${hourly_rate || 20} <span className="text-muted-foreground font-normal">/ hr</span></div>
        <Link href={`/profile/${user_id}`}>
          <Button className="bg-[var(--primary)] text-white hover:bg-[var(--primary)]">Contactar</Button>
        </Link>
      </div>
    </article>
  );
}
