"use client";

import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface Props {
  user_id: string;
  name?: string;
  specialty?: string;
  avatar_url?: string;
}

export default function CompactTutorCard({ user_id, name, specialty, avatar_url }: Props) {
  const display = name || "Tutor";

  return (
    <div className="flex items-center gap-3 p-2 rounded-md hover:bg-[var(--accent)]">
      <Avatar className="h-10 w-10">
        <AvatarImage src={avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user_id}`} alt={display} />
        <AvatarFallback>{display.substring(0,2).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium truncate">{display}</div>
        <div className="text-xs text-muted-foreground truncate">{specialty || "General"}</div>
      </div>
      <Link href={`/profile/${user_id}`} className="shrink-0">
        <Button size="sm" className="bg-[var(--primary)] text-white">Ir al perfil</Button>
      </Link>
    </div>
  );
}
