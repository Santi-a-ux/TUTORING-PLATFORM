import type { ReactNode } from "react";

export default function AuthLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#0a0a14]">
      <div className="relative hidden overflow-hidden p-12 lg:flex lg:w-1/2 lg:flex-col lg:items-center lg:justify-center">
        <div className="absolute inset-0 bg-linear-to-br from-primary/30 via-[#0a0a14] to-violet-900/20" />
        <div className="absolute -left-20 -top-20 h-96 w-96 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-violet-600/10 blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 h-125 w-125 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-[100px] pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-px bg-linear-to-b from-transparent via-primary/20 to-transparent" />

        <div className="relative z-10 flex max-w-sm flex-col items-center text-center">
          <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-2xl border border-primary/30 bg-primary/20 text-3xl font-bold text-white shadow-xl shadow-primary/20 backdrop-blur-sm">
            TM
          </div>
          <h1 className="mb-3 text-3xl font-bold tracking-tight text-white">TutorMatch</h1>
          <p className="mb-10 text-sm leading-relaxed text-white/50">
            La plataforma que conecta estudiantes con los mejores tutores de tu ciudad
          </p>

          <div className="w-full space-y-3 text-left">
            {[
              { icon: "🗺️", text: "Tutores cerca de ti en el mapa" },
              { icon: "💬", text: "Chat en tiempo real" },
              { icon: "📚", text: "Matemáticas, idiomas, código y más" },
              { icon: "⭐", text: "Reseñas verificadas de estudiantes" },
            ].map((feature) => (
              <div key={feature.text} className="flex items-center gap-3 rounded-xl border border-white/8 bg-white/5 px-4 py-3 backdrop-blur-sm">
                <span className="text-lg">{feature.icon}</span>
                <span className="text-sm text-white/70">{feature.text}</span>
              </div>
            ))}
          </div>

          <div className="mt-10 w-full rounded-2xl border border-white/8 bg-white/5 p-4 text-left">
            <p className="text-xs leading-relaxed italic text-white/50">
              "Encontré mi tutor de cálculo en 5 minutos. Pasé el examen con 4.5."
            </p>
            <div className="mt-3 flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/40 text-xs text-white">M</div>
              <div>
                <p className="text-xs font-medium text-white/60">María R.</p>
                <p className="text-xs text-white/30">Estudiante de Ingeniería</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative flex w-full items-center justify-center p-6 lg:w-1/2">
        <div className="absolute inset-0 bg-linear-to-br from-white/2 to-transparent pointer-events-none" />
        <div className="relative z-10 w-full max-w-sm">
          <div className="mb-10 flex items-center gap-3 lg:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-sm font-bold text-white shadow-lg shadow-primary/30">
              TM
            </div>
            <span className="text-lg font-bold text-white">TutorMatch</span>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}