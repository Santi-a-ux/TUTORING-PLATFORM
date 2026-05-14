"use client";

import { useActionState, useEffect } from "react";
import { loginAction } from "@/lib/auth";
import { toast } from "sonner";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { IconMail, IconLock } from "@/components/icons/TmIcons";

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, null);

  useEffect(() => {
    if (state?.error) {
      toast.error(state.error);
    }
  }, [state]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="mb-1 text-2xl font-bold tracking-tight text-white">Bienvenido de vuelta</h1>
        <p className="text-sm text-white/40">Ingresa tus datos para continuar</p>
      </div>

      <form action={formAction} className="space-y-4">
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
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium uppercase tracking-wider text-white/50">Contraseña</label>
          </div>
          <div className="relative">
            <IconLock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/20" />
            <input
              name="password"
              type="password"
              placeholder="••••••••"
              required
              disabled={isPending}
              className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-4 text-sm text-white outline-none transition-all placeholder:text-white/20 focus:border-primary/50 focus:bg-white/8 disabled:opacity-50"
            />
          </div>
        </div>

        {state?.error && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-xs text-red-400">
            {state.error}
          </div>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-white shadow-lg shadow-primary/30 transition-all hover:bg-primary/90 hover:shadow-primary/50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          {isPending ? "Entrando..." : "Entrar"}
        </button>
      </form>

      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-white/8" />
        <span className="text-xs text-white/20">o</span>
        <div className="h-px flex-1 bg-white/8" />
      </div>

      <Link
        href="/register"
        className="inline-flex h-12 w-full items-center justify-center rounded-xl border border-white/10 bg-white/5 px-3 text-sm font-medium text-white/70 transition-all hover:bg-white/8 hover:text-white"
      >
        Crear cuenta nueva
      </Link>

      <p className="mt-6 text-center text-xs text-white/20">
        ¿No tienes cuenta?{" "}
        <Link href="/register" className="font-medium text-primary transition-colors hover:text-primary/80">
          Regístrate gratis
        </Link>
      </p>
    </div>
  );
}