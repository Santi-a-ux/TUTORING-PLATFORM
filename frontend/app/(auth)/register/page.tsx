"use client";

import { useActionState, useEffect, useState } from "react";
import { registerAction } from "@/lib/auth";
import { toast } from "sonner";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { IconProfile, IconMail, IconLock } from "@/components/icons/TmIcons";

export default function RegisterPage() {
  const [state, formAction, isPending] = useActionState(registerAction, null);
  const [role, setRole] = useState<'student' | 'tutor'>('student');

  useEffect(() => {
    if (state?.error) {
      toast.error(state.error);
    }
  }, [state]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="mb-1 text-2xl font-bold tracking-tight text-white">Crea tu cuenta</h1>
        <p className="text-sm text-white/40">Únete a estudiantes y tutores de Medellín</p>
      </div>

      <form action={formAction} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-medium uppercase tracking-wider text-white/50">Nombre completo</label>
          <div className="relative">
            <IconProfile className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/20" />
            <input
              name="fullName"
              type="text"
              placeholder="Juan Pérez"
              required
              disabled={isPending}
              className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-4 text-sm text-white outline-none transition-all placeholder:text-white/20 focus:border-primary/50 focus:bg-white/8 disabled:opacity-50"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium uppercase tracking-wider text-white/50">Correo electrónico</label>
          <div className="relative">
            <IconMail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/20" />
            <input
              name="email"
              type="email"
              placeholder="correo@ejemplo.com"
              required
              disabled={isPending}
              className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-4 text-sm text-white outline-none transition-all placeholder:text-white/20 focus:border-primary/50 focus:bg-white/8 disabled:opacity-50"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium uppercase tracking-wider text-white/50">Contraseña</label>
          <div className="relative">
            <IconLock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/20" />
            <input
              name="password"
              type="password"
              placeholder="Mínimo 8 caracteres"
              required
              disabled={isPending}
              className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-4 text-sm text-white outline-none transition-all placeholder:text-white/20 focus:border-primary/50 focus:bg-white/8 disabled:opacity-50"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium uppercase tracking-wider text-white/50">Quiero ser...</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setRole("student")}
              className={`flex flex-col items-center gap-1 rounded-xl border p-3.5 text-sm font-medium transition-all ${role === "student" ? "border-primary/50 bg-primary/20 text-white shadow-lg shadow-primary/20" : "border-white/10 bg-white/5 text-white/40 hover:bg-white/8 hover:text-white/60"}`}
            >
              <span className="text-xl">🎓</span>
              <span>Estudiante</span>
            </button>
            <button
              type="button"
              onClick={() => setRole("tutor")}
              className={`flex flex-col items-center gap-1 rounded-xl border p-3.5 text-sm font-medium transition-all ${role === "tutor" ? "border-primary/50 bg-primary/20 text-white shadow-lg shadow-primary/20" : "border-white/10 bg-white/5 text-white/40 hover:bg-white/8 hover:text-white/60"}`}
            >
              <span className="text-xl">📚</span>
              <span>Tutor</span>
            </button>
          </div>
          <input type="hidden" name="role" value={role} />
        </div>

        {state?.error && <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-xs text-red-400">{state.error}</div>}

        <button
          type="submit"
          disabled={isPending}
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-white shadow-lg shadow-primary/30 transition-all hover:bg-primary/90 hover:shadow-primary/50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          {isPending ? "Creando cuenta..." : "Crear cuenta gratis"}
        </button>
      </form>

      <p className="mt-6 text-center text-xs text-white/20">
        ¿Ya tienes cuenta?{" "}
        <Link href="/login" className="font-medium text-primary transition-colors hover:text-primary/80">
          Inicia sesión
        </Link>
      </p>
    </div>
  );
}