import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function Home() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  
  if (token) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Hero */}
      <section className="flex flex-col items-center justify-center 
        min-h-screen px-4 text-center bg-gradient-to-br 
        from-primary/10 via-background to-accent/20">
        
        <div className="h-16 w-16 rounded-full bg-primary text-white 
          font-bold text-2xl flex items-center justify-center mb-6 
          shadow-lg">
          TM
        </div>
        
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Encuentra tu tutor ideal
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
              icon: "🗺️", 
              title: "Tutores cercanos", 
              desc: "Encuentra tutores en tu zona con nuestro mapa interactivo." 
            },
            { 
              icon: "💬", 
              title: "Chat en tiempo real", 
              desc: "Habla directamente con tu tutor sin intermediarios." 
            },
            { 
              icon: "🎯", 
              title: "Aprende lo que quieras", 
              desc: "Matemáticas, idiomas, programación y mucho más." 
            },
          ].map((f) => (
            <div key={f.title} 
              className="p-6 rounded-xl border bg-card shadow-sm 
                text-center hover:shadow-md transition-shadow">
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
