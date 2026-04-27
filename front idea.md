Crea una aplicación web completa de TutorMatch en React (single JSX file) 
que replique fielmente el siguiente diseño UI/UX. Es una plataforma híbrida 
entre red social y marketplace de tutorías.

═══════════════════════════════════════
🎨 SISTEMA DE DISEÑO
═══════════════════════════════════════

PALETA DE COLORES:
- Fondo global: #E8EAF6 (lavanda muy suave, casi gris-lila)
- Fondo cards/modales: #FFFFFF
- Sidebar: #FFFFFF con sombra suave
- Primario/Acento: #6C63FF (violeta-púrpura)
- Botón primario: #6C63FF con texto blanco, border-radius: 8px
- Botón "Registrate" navbar: #6C63FF
- Íconos activos: #6C63FF
- Íconos inactivos: #9E9E9E
- Texto principal: #1A1A2E
- Texto secundario: #757575
- Online indicator: #4CAF50 (verde)
- Avatar marcador Tutor: azul (#6C63FF) o naranja (#FF6B35)
- Estrellas rating: #FFC107 (amarillo)
- Tags/chips: fondo #EDE7F6, texto #6C63FF

TIPOGRAFÍA:
- Font family: 'Poppins', sans-serif
- Headings: font-weight 600-700
- Body: font-weight 400
- Labels/captions: font-weight 500, font-size 12px

COMPONENTES GLOBALES:
- Cards: border-radius 16px, box-shadow: 0 4px 20px rgba(0,0,0,0.08)
- Inputs: border-radius 8px, border: 1px solid #E0E0E0, padding 12px 16px
- Botones primarios: border-radius 8px, padding 12px 24px, background #6C63FF
- Sidebar izquierda: ancho 80px, iconos centrados verticalmente (Mapa, Buscar, Chat)
- Navbar top: logo circular izquierda, links centro, botones "Iniciar Sesión" + "Regístrate" derecha

═══════════════════════════════════════
📱 VISTAS / PÁGINAS (implementar como tabs o router)
═══════════════════════════════════════

Implementa un sistema de navegación entre las siguientes pantallas:

──────────────────────────────────────
PANTALLA 1: REGISTRO (Crea tu cuenta)
──────────────────────────────────────
Layout: dos columnas
- Columna izquierda (formulario):
  • Título "Crea tu cuenta" en bold grande
  • Campo "Correo Electrónico" (input text)
  • Campo "Contraseña" (input password con ojo toggle)
  • Campo "Confirmar Contraseña" (input password con ojo toggle)
  • Sección "Soy:" con 3 radio buttons: Aprendiz (seleccionado, ícono violeta), Tutor, Ambos
  • Botón primario ancho completo "Registrarse"
  • Link inferior "¿Ya tienes una cuenta? Inicia Sesión"
- Columna derecha: ilustración decorativa de libros/mapas/estudio en tonos azul-violeta

──────────────────────────────────────
PANTALLA 2: INICIO DE SESIÓN
──────────────────────────────────────
- Campo "Correo Electrónico"
- Campo "Contraseña" (con ojo toggle)
- Sección "Continuar como:" radio buttons Aprendiz / Tutor / Ambos
- Botón "Registrarse" (primario, ancho completo)

──────────────────────────────────────
PANTALLA 3: FEED PRINCIPAL (Home)
──────────────────────────────────────
Layout: sidebar izquierda + contenido central + panel derecho

NAVBAR TOP:
- Logo + "Inicio" con flecha back
- Barra de búsqueda central placeholder "¿Qué buscas?"
- Campana notificaciones + avatar usuario derecha

CONTENIDO CENTRAL:
- Card "¿Qué quieres aprender hoy?" con:
  • Input de texto
  • Botón "Publicar" violeta
  • Tags horizontales de materias: Java, Inglés, Matemáticas, Psicología, Diseño Web
- Posts del feed (card cada uno):
  • Avatar + nombre + especialidad + badge rol
  • Texto del post
  • Tags de materias (chips violeta)
  • Contador de likes (corazón) y comentarios

EJEMPLO POST 1:
  Daniel Pérez • Experto en Matemáticas
  "Ofrezco tutorías de cálculo y álgebra para estudiantes de secundaria 
   y universitarios. ¡Contáctame si necesitas ayuda!"
  Tags: Matemáticas, Álgebra | ❤ 25 | 💬 8

EJEMPLO POST 2:
  Laura García
  "¿Alguien puede enseñarme Python? Estoy aprendiendo programación 
   y necesito ayuda para mejorar mis habilidades. 😊"
  Tags: Python, Programación | ❤ 18 | 💬 5

PANEL DERECHO:
- Sección "Tutores Cercanos" con lista:
  • Avatar + nombre + especialidad + botón chat (ícono)
  • Javier Ríos - Inglés
  • Sofia Martinez - Diseño Gráfico y Fotografía
- Sección "Mensajes Recientes" con card:
  • Daniel Pérez - Experto en Matemáticas + botón "Contactar"
- Sección "Tutores cercanos" (segunda instancia con distancias):
  • Daniel Pérez - Inglés - 10 min
  • Sofia Martinez - Diseño Quiltes - 32 min

──────────────────────────────────────
PANTALLA 4: PERFIL DE TUTOR
──────────────────────────────────────
Layout: dos columnas

COLUMNA IZQUIERDA:
- Avatar grande circular con badge verde (online)
- Nombre: "Daniel Pérez"
- Especialidad: "Experto en Matemáticas"  
- Rating: ⭐⭐⭐⭐⭐ 4.8 (55 reseñas)
- Botón "Contactar" (primario)
- Sección "Experiencia" con badges "5 éxito" y "30 horas":
  "5 años enseñando matemáticas y ayudando a estudiantes de secundaria 
   y universitarios a mejorar sus habilidades en álgebra y cálculo."
- Sección "Certificaciones" (con flecha dropdown):
  • Licenciatura en Matemáticas
  • Curso de Didáctica de Enseñanza
- Sección "Availabilidad" con link "Ver todos los horarios":
  • 📍 Escuelas, Bibliotecas + ícono calendario
  • 📍 Cafeterías + ícono calendario
  • ⏰ Lunes: 2:00 PM – 7:00 PM
  • ⏰ Martes: 3:00 PM – 8:00 PM
  • ⏰ Jueves: 2:00 PM – 7:00 PM

──────────────────────────────────────
PANTALLA 5: PERFIL PROPIO (Editar perfil)
──────────────────────────────────────
Layout: dos columnas

COLUMNA IZQUIERDA - Card edición:
- Avatar circular con foto
- Nombre: "Laura Garcia"
- Badge: "Apasionada por la programación"
- Rol: Aprendiz
- Intereses chips: Java ✏, Python, Java, Python, Diseño Web
- Botón "Guardar" (primario, ancho completo)

COLUMNA DERECHA - Card "Ajusta tu perfil":
- Título + descripción "Ajuste tu perfil para conectar con personas cercanas con intereses similares"
- Lista de pasos con íconos (completados/pendientes):
  ✅ Resiste a las etiquetas
  ✅ Avanza por móviles. Badge: "Reordina"
  ⭐ Déjate tu competencia
  ⚪ Completa tu perfil: "eserness"
- Mini mapa de ubicación en la esquina inferior

──────────────────────────────────────
PANTALLA 6: MAPA DE TUTORES
──────────────────────────────────────
- Mapa estilo Google Maps (usar div con fondo de mapa simulado o imagen)
- Marcadores tipo pin con foto circular del tutor (mezcla azul y naranja)
- Popup card al seleccionar tutor:
  • Foto circular + nombre "Daniel Pérez"
  • Subtítulo "Experto en Matemáticas"
  • Botón "Contactar" (azul/primario)
- Barra de búsqueda superior "Buscar"
- Navbar móvil inferior: Buscar | Chat (off) | Perfil | ≡

──────────────────────────────────────
PANTALLA 7: LISTA DE CHATS
──────────────────────────────────────
- Lista de conversaciones recientes:
  • Javier Ríos - Inglés - 13:23
  • Sofia Martinez - Diseño Gráfico y Fotografía - 22ms
  • Paulina Castro - Matemáticas - 33ms
  • (buscador de conversaciones)
  • Daniel Pérez - Experto en Matemáticas - 13:23
- Input de mensaje al fondo con ícono enviar

──────────────────────────────────────
PANTALLA 8: CHAT INDIVIDUAL
──────────────────────────────────────
- Header: avatar + "Daniel Pérez" + badge "En línea" + íconos (teléfono, video)
- Sub-header: "Caride Greca" (ubicación o nota)
- Área de mensajes:
  • Burbuja enviada (derecha, fondo violeta claro): 
    "Hola Daniel! Claro, mañana a las 4:00 PM me queda perfecto. [Excelente experiencia] 13:24 ✓✓"
  • Burbuja recibida (izquierda, fondo gris):
    "Perfecto, entonces nos vemos mañana a las 4:00 PM en la cafetería cerca a tu universidad. ¿Te parece bien? 13:26"
  • Imagen adjunta del lugar (cafetería/espacio)
  • "Hasta mañana. Gracias!" 13:34 ✓
- Barra inferior: 📎 + input "Escribe un mensaje..." + 📷 + botón "Confirmar" violeta

──────────────────────────────────────
PANTALLA 9: AGENDAR TUTORÍA (Modal)
──────────────────────────────────────
Modal overlay con:
- Header: "Agendar Tutoría" + X cerrar
- Info tutor: avatar + "Daniel Pérez" + En línea + "Goupflona · 3× por $M5"
- Calendario mensual:
  • Navegación < Abril 2024 >
  • Grid 7 columnas (Su M Tu WO Th Fr Sa)
  • Día 18 seleccionado (círculo violeta)
- Grid de horarios disponibles (2 columnas, múltiples filas):
  • 2:00, 2:00, 2:39, 4:74
  • 3:00, 3:00, 3:79, 3:39
  • 3:00, 3:00, 4:37, 3:08
  (horario seleccionado en violeta oscuro)
- Botón "Reservar" (primario ancho completo)
- Link "Cancelar"

──────────────────────────────────────
PANTALLA 10: RECOMENDACIONES INTELIGENTES
──────────────────────────────────────
- Título "Recomendaciones Inteligentes"
- Botón "Mostrar Filtros" con ícono
- Lista de tutores recomendados:
  • Daniel Pérez ⭐⭐⭐⭐⭐ $20/hora - Experto en Matemáticas · -3 Hortrad
  • Javier Ríos 🏳 $25/hora - Diseño Gráfico y Fotografía
  • Sofia Martinez $25/hora - Diseño Gráfico y Fotografía
  • Gabriel Torres $22/hora - Diseño Gráfico y Fotógrafo

═══════════════════════════════════════
🗂 NAVEGACIÓN Y ESTRUCTURA
═══════════════════════════════════════

SIDEBAR IZQUIERDA (todas las pantallas desktop):
- Logo circular violeta (40px) arriba
- 📍 Mapa (ícono pin)
- 🔍 Buscar (ícono lupa)
- 💬 Chat (ícono mensaje)
- Ícono estadísticas/analytics abajo

NAVBAR SUPERIOR:
- Logo + nombre app izquierda
- Breadcrumb/sección actual centro
- "Iniciar Sesión" (link) + "Regístrate" (botón violeta) derecha
- Campana + avatar cuando está logueado

NAVBAR MÓVIL INFERIOR (solo vistas mapa/móvil):
- 🔍 Buscar | 💬 Chat (off) | 👤 Perfil | ☰

═══════════════════════════════════════
⚙️ REQUERIMIENTOS TÉCNICOS
═══════════════════════════════════════

- React con hooks (useState para navegación entre pantallas)
- Tailwind CSS para estilos base + CSS variables para el sistema de colores
- Import Google Fonts: Poppins
- Para el mapa: usar un div estilizado con gradiente verde/azul como placeholder 
  con marcadores posicionados absolutamente (NO leaflet ni mapbox, solo simulación visual)
- Los chats deben mostrar burbujas diferenciadas (enviado vs recibido)
- El modal de "Agendar Tutoría" debe aparecer sobre el contenido
- Usar avatares generados con iniciales en círculos de colores si no hay imagen
- Animaciones suaves en hover de cards (transform: translateY(-2px))
- Transiciones de 0.2s en botones e interacciones
- El estado activo del sidebar se marca con el ícono en violeta

ESTADO DE LA DEMO:
- Usuario logueado: Laura García (Aprendiz)
- Chat activo con: Daniel Pérez
- Pantalla inicial: Feed (Home)

Implementa TODO en un único archivo JSX con export default. 
Prioriza la fidelidad visual al diseño sobre la funcionalidad real.