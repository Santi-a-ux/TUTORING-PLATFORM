"use client";
import { IconBell } from "@/components/icons/TmIcons";
import { useState, useRef, useEffect } from "react";

export function NotificationsBell() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  
  return (
    <div className="relative" ref={containerRef}>
      <button 
        onClick={() => setOpen(!open)}
        className="p-2 rounded-md hover:bg-muted/30 relative"
      >
        <IconBell className="w-5 h-5 text-muted-foreground" />
      </button>
      
      {open && (
        <div className="absolute right-0 top-10 w-72 bg-card border rounded-lg shadow-lg z-50 p-4">
          <h3 className="text-sm font-semibold mb-3">Notificaciones</h3>
          <div className="flex flex-col items-center justify-center py-6 text-muted-foreground">
            <IconBell className="w-8 h-8 mb-2 opacity-30" />
            <p className="text-sm">No tienes notificaciones</p>
          </div>
        </div>
      )}
    </div>
  );
}