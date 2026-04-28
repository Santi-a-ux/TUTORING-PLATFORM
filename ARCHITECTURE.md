# Guía de Arquitectura y Componentes de TutorMatch

Este documento explica en detalle cada uno de los apartados y módulos que conforman la plataforma **TutorMatch**. El sistema está diseñado bajo una **Arquitectura de Microservicios**, lo que significa que el backend está dividido en pequeñas aplicaciones independientes que se comunican entre sí y con el frontend a través de un API Gateway.

---

## 🖥️ 1. Frontend (Interfaz de Usuario)
**Directorio:** `/frontend`

El frontend es la cara visible de la plataforma donde interactúan estudiantes y tutores. 

- **Tecnologías actuales:** React 18, Tailwind CSS, Leaflet (Mapas).
- **Cómo funciona:** Actualmente está construido como una *Single Page Application (SPA)* simplificada que carga React y Babel directamente desde un CDN (`index.html`). Esto permite tener componentes React (`App.jsx`) sin necesidad de un bundler complejo como Webpack o Vite en esta etapa.
- **Servidor:** Se sirve utilizando un servidor estático ligero de Python (`python -m http.server 3000`) dentro de su propio contenedor de Docker.
- **Comunicación:** Todas las peticiones desde el frontend viajan directamente hacia el **API Gateway** (Puerto 8000), nunca interactúan directamente con la base de datos o los microservicios individuales.

---

## 🚪 2. API Gateway (Puerta de Enlace)
**Directorio:** `/gateway`

El API Gateway es el único punto de entrada público para todo el ecosistema del backend.
- **Tecnologías:** FastAPI (Python), WebSockets, httpx.
- **Responsabilidades:**
  1. **Enrutamiento (Routing):** Recibe las peticiones del frontend (ej. `/auth/login`) y las redirige internamente a la dirección del microservicio correspondiente (ej. contenedor `auth-service:8001`).
  2. **Validación de Seguridad:** Puede verificar tokens JWT antes de dejar pasar la petición a un servicio que requiera autenticación, rechazando accesos no autorizados en la misma puerta.
  3. **Rate Limiting:** Controlar la cantidad de peticiones para evitar abusos.
  4. **Orquestación:** Para ciertas vistas combinadas del frontend, puede solicitar datos a múltiples microservicios (ej. Tutors y Geo) y unificarlos en una sola respuesta.

---

## ⚙️ 3. Microservicios (Backend)
**Directorio:** `/services/*`

Cada microservicio es una pequeña aplicación **FastAPI** independiente. Tienen su propia lógica de negocio, su propio Dockerfile, sus propias dependencias (`requirements.txt`), y gestionan **exclusivamente su propio esquema (Schema) en la base de datos**.

### 🔐 Auth Service (`/services/auth-service`)
- **Propósito:** Manejar todo lo relacionado con la seguridad y el inicio de sesión.
- **Funcionalidad:** Registro de nuevos usuarios, validación de contraseñas (hashing), y emisión y verificación de Tokens JWT.

### 👤 User Service (`/services/user-service`)
- **Propósito:** Gestión básica de cuentas y perfiles.
- **Funcionalidad:** Guardar nombres, roles (estudiante o tutor), fotos de perfil y configuración básica de la cuenta.

### 🎓 Tutor Service (`/services/tutor-service`)
- **Propósito:** Lógica de negocio exclusiva de los tutores.
- **Funcionalidad:** Gestión de tarifas (hourly_rate), disponibilidad, años de experiencia y especialidades. Guarda toda la información que conforma el "perfil público" del tutor.

### 🗺️ Geo Service (`/services/geo-service`)
- **Propósito:** Búsquedas por ubicación.
- **Funcionalidad:** Usando PostGIS, este servicio permite buscar tutores que se encuentren en un radio cercano al estudiante, calcular distancias y devolver coordenadas (lat/lng) para renderizar en el mapa del frontend (Leaflet).

### 💬 Chat Service (`/services/chat-service`)
- **Propósito:** Mensajería en tiempo real entre estudiante y tutor.
- **Funcionalidad:** Mantiene conexiones WebSockets abiertas. Utiliza **Redis** como sistema Pub/Sub para distribuir los mensajes instantáneamente, y guarda el historial en PostgreSQL.

### 📅 Booking Service (`/services/booking-service`)
- **Propósito:** Gestión de citas y reservas.
- **Funcionalidad:** Permite a los estudiantes agendar franjas de tiempo con un tutor, manejar estados de la reserva (Pendiente, Confirmada, Cancelada) y evitar choques de horarios.

### 📁 Media Service (`/services/media-service`)
- **Propósito:** Subida y procesamiento de archivos.
- **Funcionalidad:** Procesar subida de avatares, fotos o documentos (archivos adjuntos del chat), usualmente integrado con un proveedor de Storage (como Supabase Storage o AWS S3).

---

## 🗄️ 4. Infraestructura de Base de Datos y Caché

### PostgreSQL + PostGIS (`htp-postgres`)
- **Arquitectura de Base de Datos:** Emplea un patrón llamado *"Database-per-Service" lógico*. Solo existe **1 Servidor y 1 Base de Datos** llamada `ttp`, pero internamente está particionada con esquemas (Schemas: `auth`, `users`, `tutors`, `chat`, etc.). 
- **Regla de oro:** El `user-service` solo puede leer y escribir en el esquema `users`. Si necesita datos del tutor, debe preguntarle al `tutor-service` por red (API local), no hacer un *JOIN*SQL a la tabla de tutores.
- **PostGIS:** La base de datos tiene instalada esta extensión, que otorga superpoderes espaciales (poder guardar puntos GPS y trazar radios de búsqueda).
- **Alembic:** Es la herramienta en cada servicio encargada de crear las tablas de base de datos de manera automática a través de archivos de "migración".

### Redis (`ttp-redis`)
- Sistema de almacenamiento en memoria ultrarrápido.
- **Usos en el proyecto:**
  1. Caché rápido para consultas que se repiten mucho (ej. lista pública de tutores destacados).
  2. Sistema "Pub/Sub" (Publicador/Suscriptor) para el Chat, logrando que los mensajes fluyan en tiempo real entre distintos contenedores.

---

## 🔄 Flujo de Trabajo Típico (Ejemplo)

**Escenario: Un estudiante quiere ver los tutores de matemáticas cercanos.**
1. El estudiante abre el **Frontend** (Puerto 3000) y busca "Matemáticas en un radio de 5km".
2. El Frontend envía la petición GET al **API Gateway** (Puerto 8000).
3. El API Gateway valida que el token del usuario sea válido. Al serlo, pide al **Geo Service** que busque tutores cercanos y cruza (filtra) esa información consultando al **Tutor Service** los que dan "Matemáticas".
4. El API Gateway junta la información, le da formato JSON y la envía de vuelta al Frontend.
5. El Frontend toma el JSON y dibuja los puntos en el mapa con Leaflet.