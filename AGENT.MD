# SPEC — Plataforma de Tutores y Estudiantes (TTP)
# Arquitectura Objetivo: Microservicios orientados al dominio
# Fecha límite: Jueves 20 de marzo de 2025
# Stack: Next.js 14 + FastAPI + PostgreSQL/PostGIS + Redis + Supabase Storage + Mapbox

---

## ROL DEL AGENTE

Actúa como un arquitecto de software senior con experiencia en:
- Microservicios con FastAPI y Python 3.12
- Next.js 14 con App Router, TypeScript, Tailwind CSS y shadcn/ui
- PostgreSQL con PostGIS para datos geoespaciales
- Redis para cache y rate limiting
- Supabase Storage para archivos multimedia
- Mapbox GL JS para mapas interactivos
- Docker y docker-compose para entorno local

Cuando implementes código:
- Usa siempre Python 3.12 + FastAPI + Pydantic v2
- Usa SQLAlchemy 2.0 con sintaxis async
- Usa Alembic para migraciones
- Usa pytest para tests
- Usa TypeScript estricto en el frontend, nunca `any`
- Usa App Router de Next.js 14, nunca Pages Router
- Todos los componentes de UI usan shadcn/ui como base
- Sigue el principio de responsabilidad única por servicio
- Cada servicio tiene su propio esquema en PostgreSQL
- Nunca llames directamente de un servicio a otro en queries de DB

---

## CONTEXTO DEL PROYECTO

### Qué es
Una plataforma web tipo red social / marketplace educativo donde:

**Tutores pueden:**
- Registrarse y crear perfil con especialidades
- Indicar disponibilidad y ubicación geográfica
- Subir foto de perfil y contenido multimedia
- Aparecer en un mapa según su ubicación
- Chatear con estudiantes interesados

**Estudiantes pueden:**
- Buscar tutores por categoría, habilidad o texto
- Ver tutores cercanos en un mapa interactivo
- Ver perfiles completos de tutores
- Enviar mensajes en tiempo real
- Recibir notificaciones de nuevos mensajes

### Roles del sistema
- `student` — usuario que busca tutores
- `tutor` — usuario que ofrece sus conocimientos
- `admin` — administrador del sistema

---

## ESTRUCTURA DEL REPOSITORIO
```
tutoring-platform/
├── AGENT.md                    # Este archivo — contexto del proyecto
├── docker-compose.yml          # Todos los servicios + infra
├── .env.example                # Variables de entorno de referencia
├── frontend/                   # Next.js 14
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx
│   │   │   └── register/page.tsx
│   │   ├── (main)/
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── explore/page.tsx
│   │   │   ├── profile/[id]/page.tsx
│   │   │   ├── tutor/setup/page.tsx
│   │   │   └── messages/
│   │   │       ├── page.tsx
│   │   │       └── [id]/page.tsx
│   │   ├── layout.tsx
│   │   └── middleware.ts
│   ├── components/
│   │   ├── ui/                 # shadcn/ui components
│   │   ├── map/                # Componentes de Mapbox
│   │   ├── tutor/              # Cards, perfiles
│   │   └── chat/               # Chat UI
│   ├── lib/
│   │   ├── api.ts              # Cliente HTTP centralizado
│   │   ├── auth.ts             # Manejo de JWT
│   │   └── hooks/              # Custom hooks
│   └── package.json
├── services/
│   ├── auth-service/
│   │   ├── app/
│   │   │   ├── main.py
│   │   │   ├── models.py
│   │   │   ├── schemas.py
│   │   │   ├── routes.py
│   │   │   ├── database.py
│   │   │   └── security.py
│   │   ├── alembic/
│   │   ├── requirements.txt
│   │   └── Dockerfile
│   ├── user-service/           # misma estructura
│   ├── tutor-service/          # misma estructura
│   ├── geo-service/            # misma estructura
│   ├── chat-service/           # misma estructura
│   └── media-service/          # misma estructura
└── gateway/
    ├── main.py                 # FastAPI gateway
    ├── requirements.txt
    └── Dockerfile
```

---

## VARIABLES DE ENTORNO REQUERIDAS
```env
# Base de datos
DATABASE_URL=postgresql+asyncpg://postgres:postgres@localhost:5432/ttp
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=ttp

# JWT
JWT_SECRET=super-secret-key-change-in-production
JWT_ALGORITHM=HS256
JWT_ACCESS_TOKEN_EXPIRE_MINUTES=30
JWT_REFRESH_TOKEN_EXPIRE_DAYS=7

# Redis
REDIS_URL=redis://localhost:6379

# Supabase
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_KEY=your-supabase-anon-key
SUPABASE_BUCKET=ttp-media

# Mapbox
NEXT_PUBLIC_MAPBOX_TOKEN=pk.eyJ1...

# Resend
RESEND_API_KEY=re_xxxx
RESEND_FROM_EMAIL=noreply@tuplatforma.com

# Servicios internos (URLs Docker)
AUTH_SERVICE_URL=http://auth-service:8001
USER_SERVICE_URL=http://user-service:8002
TUTOR_SERVICE_URL=http://tutor-service:8003
GEO_SERVICE_URL=http://geo-service:8004
CHAT_SERVICE_URL=http://chat-service:8005
MEDIA_SERVICE_URL=http://media-service:8006
```

---

## ARQUITECTURA DE MICROSERVICIOS

### Comunicación entre servicios
- **Síncrona (HTTP/REST):** Frontend → API Gateway → Servicios
- **Asíncrona (eventos):** [Fase 2] RabbitMQ event bus
- **WebSocket:** Frontend ↔ API Gateway ↔ Chat Service
- **Regla:** Ningún servicio hace queries directas a la DB de otro servicio

### API Gateway
- Puerto: 8000
- Responsabilidades:
  - Validar JWT en cada request (excepto /auth/register y /auth/login)
  - Rutear requests al servicio correcto
  - Rate limiting: máx 100 req/min por IP usando Redis
  - Proxy WebSocket hacia Chat Service
- Rutas:
  - `/auth/*` → auth-service:8001
  - `/users/*` → user-service:8002
  - `/tutors/*` → tutor-service:8003
  - `/geo/*` → geo-service:8004
  - `/chat/*` → chat-service:8005
  - `/media/*` → media-service:8006
  - `/feed/*` → feed-service:8007

---

## MODELOS DE BASE DE DATOS

### Auth Service — schema: `auth`
```sql
-- auth.users
id          UUID PRIMARY KEY DEFAULT gen_random_uuid()
email       VARCHAR(255) UNIQUE NOT NULL
password_hash VARCHAR(255) NOT NULL
role        VARCHAR(20) NOT NULL -- 'student', 'tutor', 'admin'
is_active   BOOLEAN DEFAULT true
created_at  TIMESTAMP DEFAULT NOW()
updated_at  TIMESTAMP DEFAULT NOW()

-- auth.refresh_tokens
id          UUID PRIMARY KEY DEFAULT gen_random_uuid()
user_id     UUID NOT NULL REFERENCES auth.users(id)
token_hash  VARCHAR(255) NOT NULL
expires_at  TIMESTAMP NOT NULL
created_at  TIMESTAMP DEFAULT NOW()
```

### User Service — schema: `users`
```sql
-- users.profiles
id           UUID PRIMARY KEY DEFAULT gen_random_uuid()
user_id      UUID UNIQUE NOT NULL  -- FK lógica a auth.users.id
display_name VARCHAR(100) NOT NULL
bio          TEXT
avatar_url   VARCHAR(500)
location_name VARCHAR(200)
created_at   TIMESTAMP DEFAULT NOW()
updated_at   TIMESTAMP DEFAULT NOW()
```

### Tutor Service — schema: `tutors`
```sql
-- tutors.profiles
id               UUID PRIMARY KEY DEFAULT gen_random_uuid()
user_id          UUID UNIQUE NOT NULL
specialties      TEXT[]        -- ['Python', 'Machine Learning', 'FastAPI']
categories       TEXT[]        -- ['programming', 'mathematics', 'languages']
is_available     BOOLEAN DEFAULT true
hourly_rate      DECIMAL(10,2)
years_experience INTEGER
verification_status VARCHAR(20) DEFAULT 'pending'
coordinates      GEOGRAPHY(POINT, 4326)  -- PostGIS
created_at       TIMESTAMP DEFAULT NOW()
updated_at       TIMESTAMP DEFAULT NOW()

-- tutors.availability_slots
id         UUID PRIMARY KEY DEFAULT gen_random_uuid()
tutor_id   UUID NOT NULL REFERENCES tutors.profiles(id)
day_of_week INTEGER NOT NULL  -- 0=Monday, 6=Sunday
start_time TIME NOT NULL
end_time   TIME NOT NULL
```

### Chat Service — schema: `chat`
```sql
-- chat.conversations
id           UUID PRIMARY KEY DEFAULT gen_random_uuid()
tutor_id     UUID NOT NULL
student_id   UUID NOT NULL
created_at   TIMESTAMP DEFAULT NOW()
last_message_at TIMESTAMP DEFAULT NOW()
UNIQUE(tutor_id, student_id)

-- chat.messages
id              UUID PRIMARY KEY DEFAULT gen_random_uuid()
conversation_id UUID NOT NULL REFERENCES chat.conversations(id)
sender_id       UUID NOT NULL
content         TEXT NOT NULL
is_read         BOOLEAN DEFAULT false
created_at      TIMESTAMP DEFAULT NOW()
```

### Media Service — schema: `media`
```sql
-- media.files
id          UUID PRIMARY KEY DEFAULT gen_random_uuid()
user_id     UUID NOT NULL
file_url    VARCHAR(500) NOT NULL
file_type   VARCHAR(50) NOT NULL  -- 'image/jpeg', 'video/mp4'
file_size   INTEGER NOT NULL      -- bytes
bucket_path VARCHAR(500) NOT NULL
created_at  TIMESTAMP DEFAULT NOW()
```

### Feed Service — schema: `feed`
```sql
-- feed.posts
id          UUID PRIMARY KEY DEFAULT gen_random_uuid()
author_id   UUID NOT NULL       -- user_id del autor
content     TEXT NOT NULL
image_url   VARCHAR(500)        -- opcional, URL de Supabase
created_at  TIMESTAMP DEFAULT NOW()
updated_at  TIMESTAMP DEFAULT NOW()
```

---

## ENDPOINTS POR SERVICIO

### Auth Service (:8001)
```
POST /auth/register
  body: { email, password, role: 'student'|'tutor' }
  response: { access_token, refresh_token, user: { id, email, role } }

POST /auth/login
  body: { email, password }
  response: { access_token, refresh_token, user: { id, email, role } }

POST /auth/refresh
  body: { refresh_token }
  response: { access_token, refresh_token }

POST /auth/logout
  header: Authorization: Bearer <token>
  response: { message: 'logged out' }

GET /auth/me
  header: Authorization: Bearer <token>
  response: { id, email, role, is_active }

POST /auth/verify-token  (uso interno del gateway)
  body: { token }
  response: { valid: bool, user_id, role }
```

### User Service (:8002)
```
GET  /users/me
  response: { id, user_id, display_name, bio, avatar_url, location_name }

PUT  /users/me
  body: { display_name?, bio?, avatar_url?, location_name? }
  response: UserProfile

GET  /users/:user_id
  response: UserProfile (público)

POST /users/me (crear perfil inicial post-registro)
  body: { display_name }
  response: UserProfile
```

### Tutor Service (:8003)
```
POST /tutors/profile
  body: { specialties[], categories[], hourly_rate?, years_experience?, lat?, lng? }
  response: TutorProfile

PUT  /tutors/profile
  body: (mismos campos, todos opcionales)
  response: TutorProfile

GET  /tutors/profile/me
  response: TutorProfile del tutor autenticado

GET  /tutors/:user_id
  response: TutorProfile (público) + datos de UserProfile

GET  /tutors/
  query: category?, is_available?, search?, limit=20, offset=0
  response: { tutors: TutorProfile[], total: int }

PUT  /tutors/availability
  body: { is_available: bool }
  response: { is_available: bool }

POST /tutors/slots
  body: { day_of_week, start_time, end_time }
  response: AvailabilitySlot

GET  /tutors/:user_id/slots
  response: AvailabilitySlot[]
```

### Geo Service (:8004)
```
GET  /geo/tutors/nearby
  query: lat, lng, radius_km=10, limit=50
  response: { tutors: [{ user_id, display_name, avatar_url,
              specialties[], is_available, distance_km, lat, lng }] }

GET  /geo/tutors/map
  query: bounds? (sw_lat, sw_lng, ne_lat, ne_lng)
  response: GeoJSON FeatureCollection con tutores como Features

PUT  /geo/tutors/location
  body: { lat, lng }
  response: { updated: true }
```

### Feed Service (:8007)
```
POST /feed/posts
  body: { content, image_url? }
  response: Post

GET  /feed/posts
  query: limit=20, offset=0
  response: { posts: Post[], total: int }

GET  /feed/posts/:id
  response: Post

GET  /feed/posts/user/:user_id
  query: limit=20, offset=0
  response: { posts: Post[], total: int }
```

### Chat Service (:8005)
```
POST /chat/conversations
  body: { tutor_id }
  response: Conversation

GET  /chat/conversations
  response: Conversation[] (del usuario autenticado, ordenadas por last_message_at)

GET  /chat/conversations/:id
  response: Conversation + últimos 50 mensajes

GET  /chat/conversations/:id/messages
  query: before_id?, limit=50
  response: Message[]

POST /chat/conversations/:id/messages
  body: { content }
  response: Message

WS   /chat/ws/:conversation_id
  header: Authorization: Bearer <token>
  eventos enviados: { type: 'message', data: Message }
  eventos recibidos: { type: 'message', content: string }

GET  /chat/unread-count
  response: { count: int }
```

### Media Service (:8006)
```
POST /media/upload
  form-data: { file, type: 'avatar'|'post'|'document' }
  response: { url, file_id, file_type, file_size }

DELETE /media/:file_id
  response: { deleted: true }

GET  /media/:file_id
  response: FileMetadata
```

---

## CONVENCIONES DE CÓDIGO

### Backend (FastAPI)

Estructura de cada servicio:
```python
# app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import router
from app.database import create_tables

app = FastAPI(title="Auth Service", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, prefix="/auth")

@app.on_event("startup")
async def startup():
    await create_tables()

@app.get("/health")
async def health():
    return {"status": "ok", "service": "auth-service"}
```

Dependencia de autenticación reutilizable:
```python
# app/dependencies.py
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
import os

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Token inválido o expirado",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(
            token,
            os.getenv("JWT_SECRET"),
            algorithms=[os.getenv("JWT_ALGORITHM", "HS256")]
        )
        user_id: str = payload.get("sub")
        role: str = payload.get("role")
        if user_id is None:
            raise credentials_exception
        return {"user_id": user_id, "role": role}
    except JWTError:
        raise credentials_exception

async def require_role(role: str):
    async def checker(current_user = Depends(get_current_user)):
        if current_user["role"] != role:
            raise HTTPException(status_code=403, detail="Rol insuficiente")
        return current_user
    return checker
```

### Frontend (Next.js)

Cliente API centralizado:
```typescript
// lib/api.ts
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = typeof window !== 'undefined'
    ? localStorage.getItem('access_token')
    : null

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })

  if (res.status === 401) {
    // intentar refresh y reintentar
    const refreshed = await refreshToken()
    if (!refreshed) {
      localStorage.removeItem('access_token')
      window.location.href = '/login'
      throw new Error('Session expired')
    }
    return request<T>(endpoint, options)
  }

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.detail || 'Request failed')
  }

  return res.json()
}

export const api = {
  get: <T>(url: string) => request<T>(url),
  post: <T>(url: string, data: unknown) =>
    request<T>(url, { method: 'POST', body: JSON.stringify(data) }),
  put: <T>(url: string, data: unknown) =>
    request<T>(url, { method: 'PUT', body: JSON.stringify(data) }),
  delete: <T>(url: string) =>
    request<T>(url, { method: 'DELETE' }),
}
```

---

## DOCKER COMPOSE
```yaml
# docker-compose.yml
version: '3.9'

services:
  postgres:
    image: postgis/postgis:16-3.4
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: ttp
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 5s
      timeout: 3s
      retries: 5

  gateway:
    build: ./gateway
    ports:
      - "8000:8000"
    env_file: .env
    depends_on:
      - redis
      - auth-service
      - user-service
      - tutor-service
      - geo-service
      - chat-service
      - media-service

  auth-service:
    build: ./services/auth-service
    ports:
      - "8001:8001"
    env_file: .env
    depends_on:
      postgres:
        condition: service_healthy

  user-service:
    build: ./services/user-service
    ports:
      - "8002:8002"
    env_file: .env
    depends_on:
      postgres:
        condition: service_healthy

  tutor-service:
    build: ./services/tutor-service
    ports:
      - "8003:8003"
    env_file: .env
    depends_on:
      postgres:
        condition: service_healthy

  geo-service:
    build: ./services/geo-service
    ports:
      - "8004:8004"
    env_file: .env
    depends_on:
      postgres:
        condition: service_healthy

  chat-service:
    build: ./services/chat-service
    ports:
      - "8005:8005"
    env_file: .env
    depends_on:
      postgres:
        condition: service_healthy

  media-service:
    build: ./services/media-service
    ports:
      - "8006:8006"
    env_file: .env

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    env_file: .env
    depends_on:
      - gateway

volumes:
  postgres_data:
```

---

## REQUIREMENTS BASE (todos los servicios)
```txt
# requirements.txt base para cada servicio FastAPI
fastapi==0.111.0
uvicorn[standard]==0.29.0
sqlalchemy[asyncio]==2.0.29
asyncpg==0.29.0
alembic==1.13.1
pydantic[email]==2.7.0
pydantic-settings==2.2.1
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
python-multipart==0.0.9
httpx==0.27.0
redis==5.0.3
```

Extras por servicio:
- `geo-service`: `geoalchemy2==0.15.1`, `shapely==2.0.4`
- `media-service`: `supabase==2.4.1`, `python-magic==0.4.27`
- `chat-service`: `websockets==12.0`

---

## ORDEN DE IMPLEMENTACIÓN

Implementar en este orden exacto, un servicio a la vez:

### Paso 1 — Infraestructura base
1. Crear `docker-compose.yml`
2. Crear `.env.example`
3. Verificar que `docker-compose up postgres redis` levanta sin errores

### Paso 2 — Auth Service
1. Modelos SQLAlchemy + migración Alembic
2. Endpoint register
3. Endpoint login (devuelve JWT)
4. Endpoint refresh token
5. Endpoint verify-token (uso interno)
6. Tests: register, login, token inválido

### Paso 3 — User Service
1. Modelos + migración
2. CRUD de perfil
3. Tests básicos

### Paso 4 — Tutor Service
1. Modelos + migración (con columna PostGIS)
2. CRUD de perfil de tutor
3. Endpoint de listado con filtros
4. Endpoint update disponibilidad
5. Tests básicos

### Paso 5 — API Gateway
1. Routing a los 4 servicios anteriores
2. Middleware JWT (llama a verify-token de auth-service)
3. Rate limiting con Redis
4. Tests de integración básicos

### Paso 6 — Geo Service
1. Queries PostGIS ST_DWithin para nearby
2. Endpoint GeoJSON para mapa
3. Endpoint update location del tutor
4. Tests con datos de ejemplo
Feed Service
1. Modelos de posts
2. Endpoints REST (crear post, listar feed, ver detalle, listar por usuario)
3. Tests básicos

### Paso 8 — Media Service
1. Upload a Supabase Storage
2. Retornar URL pública
3. Tests con imagen de prueba

### Paso 9 — Chat Service
1. Modelos de conversación y mensaje
2. Endpoints REST (crear conv, historial)
3. WebSocket endpoint
4. Tests de WebSocket

### Paso 10
### Paso 9 — Frontend
1. Setup Next.js con shadcn/ui
2. Páginas auth (login, register)
3. Middleware de rutas protegidas
4. Dashboard por rol
5. Onboarding tutor
6. Página explore (lista + mapa)
7. Perfil de tutor
8. Chat UI
9. Subida de foto de perfil

---

## REGLAS PARA EL AGENTE

1. **Implementa un paso a la vez.** No avances al siguiente paso hasta que el actual tenga tests pasando.

2. **Siempre crea el Dockerfile del servicio** junto con el código del servicio.

3. **Siempre crea la migración de Alembic** cuando crees modelos nuevos.

4. **Nunca hardcodees credenciales.** Todo va en variables de entorno desde `os.getenv()` o `pydantic-settings`.

5. **El endpoint `/health`** es obligatorio en cada servicio.

6. **Los schemas Pydantic** van en `schemas.py` separados de los modelos SQLAlchemy en `models.py`.

7. **Para PostGIS**, usa siempre SRID 4326 (WGS84 — coordenadas lat/lng estándar).

8. **En el frontend**, todos los componentes de página son Server Components por defecto. Solo marca `'use client'` cuando necesites hooks, estado o eventos del browser.

9. **Para el mapa**, el componente de Mapbox siempre es `'use client'` y se importa con `dynamic` de Next.js con `{ ssr: false }`.

10. **Cuando termines un paso**, muestra el output del health check del servicio y confirma que `docker-compose up` levanta sin errores antes de continuar.

---

## CRITERIOS DE ÉXITO PARA EL JUEVES 20

La demo debe poder mostrar este flujo completo sin errores:

1. Usuario se registra como estudiante → recibe JWT
2. Otro usuario se registra como tutor
3. Tutor completa su perfil (especialidades, ubicación en Medellín, foto)
4. Estudiante abre `/explore` → ve tutores en lista y en mapa
5. Estudiante hace click en un tutor → ve su perfil completo
6. Estudiante hace click en "Contactar" → abre chat
7. Tutor y estudiante intercambian mensajes en tiempo real
8. Tutor puede marcar su disponibilidad como activa/inactiva

---

## DATOS DE SEMILLA (seed.py)

Al finalizar, crear un script `seed.py` que genere:
- 6 tutores con ubicaciones reales en Medellín, Colombia
  - Coordenadas de referencia: lat 6.2442, lng -75.5812
  - Distribución: El Poblado, Laureles, Envigado, Bello, Sabaneta, Centro
- Especialidades variadas: Python, Matemáticas, Inglés, Diseño UX, React, Machine Learning
- Fotos de avatar usando https://i.pravatar.cc/300?u={email}
- 2 estudiantes de ejemplo
- 1 conversación de ejemplo entre tutor y estudiante

---

## TECH STACK RESUMEN

| Capa | Tecnología | Versión |
|------|-----------|---------|
| Frontend | Next.js | 14.x |
| Frontend lang | TypeScript | 5.x |
| Frontend UI | Tailwind CSS + shadcn/ui | latest |
| Frontend mapa | Mapbox GL JS | 3.x |
| Backend | FastAPI | 0.111 |
| Backend lang | Python | 3.12 |
| ORM | SQLAlchemy async | 2.0 |
| Migraciones | Alembic | 1.13 |
| Base de datos | PostgreSQL + PostGIS | 16 + 3.4 |
| Cache | Redis | 7 |
| Storage | Supabase Storage | 2.x SDK |
| Mapas API | Mapbox | - |
| Email | Resend | - |
| Contenedores | Docker + docker-compose | - |
| Auth | JWT (python-jose) + bcrypt | - |

---

## CÓMO USAR ESTE PROMPT

Para empezar, di al agente:

> "Estamos en el Paso 1. Crea el docker-compose.yml completo y el .env.example
> con todos los valores del spec. Luego verifica que postgres y redis levantan."

Para cada paso siguiente:

> "Paso [N] completado. Avanza al Paso [N+1]: [nombre del paso]."

Si hay un error:

> "El servicio X falla con este error: [pegar error].
> Revisa el spec, encuentra la causa y corrígela."

---
## REGLAS SHADCN/UI

- Instalar con: npx shadcn@latest init (Next.js, TypeScript, Tailwind CSS)
- Componentes a instalar base: button, input, card, avatar, badge, 
  dialog, sheet, tabs, separator, skeleton, sonner, sidebar
- Color theme: violet (se mapea al #6C63FF del diseño actual)
- Siempre importar desde "@/components/ui/..."
- Para el mapa: dynamic import con { ssr: false } SIEMPRE
- 'use client' solo en componentes con hooks o eventos de browser
- El Sidebar usa el componente shadcn/ui Sidebar — NO re-implementar# SPRINT FRONTEND — TutorMatch Next.js + shadcn/ui

## CONTEXTO
El backend de TutorMatch está completamente funcional (microservicios FastAPI en Docker, 
puertos 8001-8007 detrás del gateway en 8000). El problema está en el frontend: 
actualmente es un archivo HTML con React via CDN + Babel, corriendo con python -m http.server. 
Necesitamos reemplazarlo completamente por un frontend real en Next.js 14 + shadcn/ui.

## OBJETIVO
Reemplazar frontend/ con una aplicación Next.js 14 real, con:
- App Router (páginas reales, no SPA con useState)
- shadcn/ui como sistema de diseño
- TypeScript estricto (sin ny)
- Mapbox GL JS con dynamic import y ssr: false
- Autenticación con JWT almacenado en cookies httpOnly (no localStorage)
- WebSockets nativos para chat

## PASO 1 — Setup inicial (hacer primero, verificar antes de continuar)

### 1.1 Eliminar el frontend viejo
Borrar frontend/index.html, frontend/App.jsx, frontend/Dockerfile (el viejo).

### 1.2 Crear el proyecto Next.js
Desde la raíz del repo:
cd frontend
npx create-next-app@latest . --typescript --tailwind --eslint --app --no-src-dir --import-alias "@/*"

### 1.3 Inicializar shadcn/ui
npx shadcn@latest init
Elegir: Style: New York, Base color: Violet, CSS variables: Yes

### 1.4 Instalar componentes shadcn necesarios
npx shadcn@latest add button input card avatar badge dialog sheet tabs separator skeleton sonner sidebar navigation-menu

### 1.5 Instalar dependencias adicionales
npm install mapbox-gl @types/mapbox-gl
npm install jose
npm install @tanstack/react-query
npm install zustand

### 1.6 Crear el nuevo Dockerfile
(Crear Dockerfile con multistage build standalone y configurar next.config.ts)

## PASO 2 — Estructura de archivos y layout base
- app/layout.tsx: Geist Sans, Providers
- app/(main)/layout.tsx: SidebarProvider, AppSidebar, Middleware para auth
- app/(auth)/layout.tsx: Layout centrado, redirect si ya hay token

## PASO 3 — Auth (login + register)
- lib/auth.ts con llamadas al backend y cookies
- Páginas de login y registro usando shadcn

## PASO 4 — Dashboard y Feed
- app/(main)/dashboard/page.tsx: Fetch a /tutors/ y renderizado de cards.

## PASO 5 — Explorar (mapa)
- app/(main)/explore/page.tsx: Mapa Leaflet o Mapbox dynamic import.

## PASO 6 — Perfil de tutor
- app/(main)/profile/[id]/page.tsx: Tabs shadcn.

## PASO 7 — Chat
- app/(main)/messages/page.tsx: WebSockets nativos interactuando con el Gateway.

## PASO 8 — Onboarding tutor
- app/(main)/tutor/setup/page.tsx: Formulario multi-step.

## CONVENCIONES OBLIGATORIAS
1. Nunca usar ny en TypeScript
2. Siempre tipar las respuestas de la API
3. Todos los fetches al backend van por lib/api.ts
4. El token se lee SIEMPRE desde cookies
5. Mapas siempre con dynamic + ssr: false
6. Usar sonner (Toaster) para estado loading/error/success.
7. Skeleton para loading states.
