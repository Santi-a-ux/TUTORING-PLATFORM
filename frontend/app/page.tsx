import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function Home() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  if (token) redirect('/dashboard');

  return (
    <div className="min-h-screen bg-[#0a0a14] text-white 
      overflow-x-hidden landing-dark">

      {/* ── NAVBAR ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 
        flex items-center justify-between px-6 py-4
        bg-[#0a0a14]/80 backdrop-blur-md 
        border-b border-white/5">

        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-full bg-primary 
            text-white font-bold text-sm 
            flex items-center justify-center shadow-lg
            shadow-primary/30">
            TM
          </div>
          <span className="font-bold text-lg tracking-tight">
            TutorMatch
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8 
          text-sm text-white/60">
          <a href="#features" 
            className="hover:text-white transition-colors">
            Características
          </a>
          <a href="#how" 
            className="hover:text-white transition-colors">
            Cómo funciona
          </a>
          <a href="#tutors" 
            className="hover:text-white transition-colors">
            Tutores
          </a>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/login"
            className="text-sm text-white/70 
              hover:text-white transition-colors px-3 py-1.5">
            Iniciar sesión
          </Link>
          <Link href="/register"
            className="text-sm bg-primary hover:bg-primary/90 
              transition-colors text-white px-4 py-2 
              rounded-lg font-medium shadow-lg shadow-primary/30">
            Registrarse
          </Link>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative flex flex-col items-center 
        justify-center min-h-screen px-4 pt-20 text-center
        overflow-hidden">

        {/* Glow de fondo — efecto luz desde abajo */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 
          w-225 h-125 rounded-full
          bg-primary/20 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 
          w-100 h-75 rounded-full
          bg-violet-500/15 blur-[80px] pointer-events-none" />

        {/* Estrellas / partículas decorativas */}
        <div className="absolute inset-0 pointer-events-none">
          {[
            { top: '15%', left: '10%', size: 2 },
            { top: '25%', left: '20%', size: 1 },
            { top: '10%', left: '70%', size: 2 },
            { top: '35%', left: '85%', size: 1 },
            { top: '60%', left: '5%',  size: 1 },
            { top: '70%', left: '90%', size: 2 },
            { top: '80%', left: '15%', size: 1 },
            { top: '20%', left: '50%', size: 1 },
          ].map((s, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white/40"
              style={{
                top: s.top,
                left: s.left,
                width: s.size,
                height: s.size,
              }}
            />
          ))}
        </div>

        {/* Badge superior */}
        <div className="relative z-10 inline-flex items-center gap-2 
          bg-white/5 border border-white/10 rounded-full 
          px-4 py-1.5 text-sm text-white/70 mb-8
          backdrop-blur-sm">
          <span className="h-1.5 w-1.5 rounded-full 
            bg-green-400 animate-pulse" />
          Ya disponible en Medellín, Colombia
        </div>

        {/* Título principal */}
        <h1 className="relative z-10 text-5xl md:text-7xl 
          font-bold leading-tight max-w-4xl mb-6
          tracking-tight">
          Aprende con el mejor
          <br />
          <span className="bg-linear-to-r from-violet-400 
            via-primary to-purple-300 bg-clip-text 
            text-transparent">
            tutor cerca de ti
          </span>
        </h1>

        <p className="relative z-10 text-lg md:text-xl 
          text-white/50 max-w-2xl mb-10 leading-relaxed">
          Conecta con tutores expertos en matemáticas, idiomas,
          programación y más. Búscalos en el mapa, chatea en tiempo
          real y empieza a aprender hoy.
        </p>

        {/* CTA — cajón de email estilo GitHub */}
        <div className="relative z-10 flex flex-col sm:flex-row 
          items-center gap-3 w-full max-w-md mb-4">
          <input
            type="email"
            placeholder="Ingresa tu correo electrónico"
            className="w-full sm:flex-1 bg-white/8 border 
              border-white/15 rounded-xl px-4 py-3 text-sm
              text-white placeholder:text-white/30 outline-none
              focus:border-primary/50 focus:bg-white/10
              transition-all backdrop-blur-sm"
          />
          <Link href="/register"
            className="w-full sm:w-auto shrink-0 bg-primary 
              hover:bg-primary/90 text-white font-semibold 
              px-6 py-3 rounded-xl text-sm transition-all
              shadow-lg shadow-primary/40 
              hover:shadow-primary/60 hover:scale-[1.02]
              active:scale-[0.98]">
            Comenzar gratis
          </Link>
        </div>

        <p className="relative z-10 text-xs text-white/30">
          ¿Ya tienes cuenta?{' '}
          <Link href="/login" 
            className="text-primary hover:underline">
            Inicia sesión
          </Link>
        </p>

        {/* Preview del dashboard — "ventana" al producto */}
        <div className="relative z-10 mt-16 w-full max-w-5xl">
          {/* Marco de ventana */}
          <div className="rounded-2xl border border-white/10 
            bg-white/5 backdrop-blur-sm overflow-hidden
            shadow-2xl shadow-black/50">

            {/* Barra de título del browser */}
            <div className="flex items-center gap-2 px-4 py-3 
              bg-white/5 border-b border-white/5">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full 
                  bg-red-500/70" />
                <div className="h-3 w-3 rounded-full 
                  bg-yellow-500/70" />
                <div className="h-3 w-3 rounded-full 
                  bg-green-500/70" />
              </div>
              <div className="flex-1 flex justify-center">
                <div className="bg-white/5 border border-white/10 
                  rounded-md px-3 py-1 text-xs text-white/30
                  flex items-center gap-2 w-48">
                  <span className="h-2 w-2 rounded-full 
                    bg-green-400/60" />
                  tutormatch.app/dashboard
                </div>
              </div>
            </div>

            {/* Contenido del preview — simulación del dashboard */}
            <div className="p-4 bg-[#0f0f1f] min-h-70 
              flex gap-4">
              
              {/* Sidebar simulado */}
              <div className="w-12 flex flex-col items-center 
                gap-4 py-2">
                {['🏠', '🗺️', '💬', '👤'].map((icon, i) => (
                  <div key={i}
                    className={`h-9 w-9 rounded-xl flex items-center
                      justify-center text-sm
                      ${i === 0 
                        ? 'bg-primary/20 text-primary' 
                        : 'text-white/20 hover:bg-white/5'}`}>
                    {icon}
                  </div>
                ))}
              </div>

              {/* Feed simulado */}
              <div className="flex-1 space-y-3">
                {[
                  { 
                    name: 'Carlos M.', 
                    time: '2m',
                    text: '¿Alguien que explique cálculo diferencial? Tengo examen el viernes 📐',
                    likes: 4
                  },
                  { 
                    name: 'Ana García', 
                    time: '15m',
                    text: 'Tutor de Python disponible este fin de semana. ¡Primeras 2 horas con descuento! 🐍',
                    likes: 12
                  },
                ].map((post, i) => (
                  <div key={i} 
                    className="bg-white/3 border border-white/5 
                      rounded-xl p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-6 w-6 rounded-full 
                        bg-primary/30 flex items-center 
                        justify-center text-xs">
                        {post.name[0]}
                      </div>
                      <span className="text-xs font-medium 
                        text-white/70">
                        {post.name}
                      </span>
                      <span className="text-xs text-white/20">
                        · {post.time}
                      </span>
                    </div>
                    <p className="text-xs text-white/50 
                      leading-relaxed">
                      {post.text}
                    </p>
                    <div className="flex items-center gap-3 
                      mt-2 text-xs text-white/20">
                      <span>❤️ {post.likes}</span>
                      <span>💬 Comentar</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Sidebar derecho simulado */}
              <div className="hidden md:block w-44 space-y-2">
                <p className="text-xs text-white/30 font-medium 
                  mb-3">
                  Tutores cerca
                </p>
                {['Julia R.', 'Marco A.', 'Sofia L.'].map(
                  (name, i) => (
                  <div key={i} 
                    className="flex items-center gap-2 
                      bg-white/3 rounded-lg p-2">
                    <div className="h-6 w-6 rounded-full 
                      bg-violet-500/30 flex items-center 
                      justify-center text-xs shrink-0">
                      {name[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-white/60 
                        truncate">
                        {name}
                      </p>
                      <div className="h-1.5 w-1.5 rounded-full 
                        bg-green-400 inline-block" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Glow debajo del preview */}
          <div className="absolute -bottom-10 left-1/2 
            -translate-x-1/2 w-3/4 h-20
            bg-primary/20 blur-3xl pointer-events-none" />
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" 
        className="relative py-32 px-6 max-w-6xl mx-auto">

        <div className="text-center mb-16">
          <p className="text-primary text-sm font-semibold 
            tracking-widest uppercase mb-3">
            Por qué TutorMatch
          </p>
          <h2 className="text-4xl md:text-5xl font-bold 
            tracking-tight mb-4">
            Todo lo que necesitas
            <br />
            para aprender mejor
          </h2>
          <p className="text-white/40 text-lg max-w-xl mx-auto">
            Una plataforma construida para estudiantes y tutores
            que quieren resultados reales.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: '🗺️',
              color: 'from-violet-500/20 to-transparent',
              border: 'border-violet-500/20',
              glow: 'shadow-violet-500/10',
              title: 'Mapa interactivo',
              desc: 'Encuentra tutores disponibles ahora mismo cerca de tu ubicación. Radio de búsqueda inteligente que se expande automáticamente.',
            },
            {
              icon: '💬',
              color: 'from-blue-500/20 to-transparent',
              border: 'border-blue-500/20',
              glow: 'shadow-blue-500/10',
              title: 'Chat en tiempo real',
              desc: 'Habla directamente con tu tutor. Sin intermediarios, sin esperas. Mensajería con WebSockets para respuesta instantánea.',
            },
            {
              icon: '📚',
              color: 'from-emerald-500/20 to-transparent',
              border: 'border-emerald-500/20',
              glow: 'shadow-emerald-500/10',
              title: 'Feed de la comunidad',
              desc: 'Comparte avances, busca tutores y conecta con otros estudiantes. Una red social enfocada en el aprendizaje.',
            },
            {
              icon: '⭐',
              color: 'from-yellow-500/20 to-transparent',
              border: 'border-yellow-500/20',
              glow: 'shadow-yellow-500/10',
              title: 'Perfiles verificados',
              desc: 'Cada tutor tiene un perfil completo con especialidades, experiencia y disponibilidad en tiempo real.',
            },
            {
              icon: '🎯',
              color: 'from-pink-500/20 to-transparent',
              border: 'border-pink-500/20',
              glow: 'shadow-pink-500/10',
              title: 'Búsqueda por materia',
              desc: 'Filtra por la materia que necesitas y el mapa muestra solo los tutores que la enseñan en tu área.',
            },
            {
              icon: '🔔',
              color: 'from-orange-500/20 to-transparent',
              border: 'border-orange-500/20',
              glow: 'shadow-orange-500/10',
              title: 'Notificaciones al instante',
              desc: 'Recibe alertas cuando un tutor responde, cuando hay uno disponible cerca o cuando alguien comenta tu post.',
            },
          ].map((f) => (
              <div key={f.title}
              className={`relative p-6 rounded-2xl border 
                ${f.border} bg-white/3 
                hover:bg-white/6 transition-all
                shadow-lg ${f.glow}
                group cursor-default`}>
              <div className={`absolute inset-0 rounded-2xl 
                bg-linear-to-b ${f.color} 
                opacity-0 group-hover:opacity-100 
                transition-opacity pointer-events-none`} />
              <div className="relative z-10">
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className="font-semibold text-lg mb-2 
                  text-white/90">
                  {f.title}
                </h3>
                <p className="text-sm text-white/40 
                  leading-relaxed">
                  {f.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how" 
        className="py-24 px-6 border-t border-white/5">
        <div className="max-w-4xl mx-auto text-center">

          <p className="text-primary text-sm font-semibold 
            tracking-widest uppercase mb-3">
            Cómo funciona
          </p>
          <h2 className="text-4xl font-bold tracking-tight mb-16">
            En 3 pasos simples
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 
            relative">
            {/* Línea conectora */}
            <div className="hidden md:block absolute top-8 
              left-1/4 right-1/4 h-px bg-linear-to-r 
              from-transparent via-primary/40 to-transparent" />

            {[
              {
                step: '01',
                icon: '📝',
                title: 'Crea tu cuenta',
                desc: 'Regístrate como estudiante o tutor en menos de 1 minuto.',
              },
              {
                step: '02',
                icon: '🔍',
                title: 'Busca tu tutor',
                desc: 'Escribe la materia y el mapa te muestra tutores disponibles cerca.',
              },
              {
                step: '03',
                icon: '🚀',
                title: 'Empieza a aprender',
                desc: 'Contacta a tu tutor por chat y agenda tu primera sesión.',
              },
            ].map((s) => (
              <div key={s.step} className="flex flex-col 
                items-center text-center">
                <div className="relative mb-4">
                  <div className="h-16 w-16 rounded-2xl 
                    bg-primary/10 border border-primary/20
                    flex items-center justify-center text-3xl
                    shadow-lg shadow-primary/10">
                    {s.icon}
                  </div>
                  <div className="absolute -top-2 -right-2 
                    h-6 w-6 rounded-full bg-primary 
                    flex items-center justify-center 
                    text-xs font-bold text-white">
                    {s.step[1]}
                  </div>
                </div>
                <h3 className="font-semibold text-lg mb-2">
                  {s.title}
                </h3>
                <p className="text-sm text-white/40 
                  leading-relaxed">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section className="py-24 px-6">
        <div className="relative max-w-3xl mx-auto text-center 
          rounded-3xl border border-primary/20 
          bg-primary/5 p-12 overflow-hidden">

          {/* Glow interno */}
          <div className="absolute inset-0 bg-linear-to-b 
            from-primary/10 to-transparent 
            pointer-events-none rounded-3xl" />
          <div className="absolute bottom-0 left-1/2 
            -translate-x-1/2 w-64 h-32
            bg-primary/20 blur-3xl pointer-events-none" />

          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold 
              tracking-tight mb-4">
              Empieza hoy mismo
            </h2>
            <p className="text-white/50 text-lg mb-8 max-w-xl 
              mx-auto">
              Únete a estudiantes y tutores que ya están
              conectando en TutorMatch.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 
              justify-center">
              <Link href="/register"
                className="bg-primary hover:bg-primary/90 
                  text-white font-semibold px-8 py-3.5 
                  rounded-xl transition-all shadow-lg 
                  shadow-primary/40 hover:shadow-primary/60
                  hover:scale-[1.02] active:scale-[0.98]
                  text-sm">
                Crear cuenta gratis
              </Link>
              <Link href="/login"
                className="bg-white/5 hover:bg-white/10 
                  border border-white/10 text-white/80 
                  font-medium px-8 py-3.5 rounded-xl 
                  transition-all text-sm">
                Ya tengo cuenta
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-white/5 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row 
          items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-full bg-primary 
              text-white font-bold text-xs 
              flex items-center justify-center">
              TM
            </div>
            <span className="text-sm font-semibold 
              text-white/70">
              TutorMatch
            </span>
          </div>
          <p className="text-xs text-white/20 text-center">
            Medellín, Colombia · 2025
          </p>
          <div className="flex gap-6 text-xs text-white/30">
            <Link href="/login" 
              className="hover:text-white/60 transition-colors">
              Iniciar sesión
            </Link>
            <Link href="/register" 
              className="hover:text-white/60 transition-colors">
              Registrarse
            </Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
