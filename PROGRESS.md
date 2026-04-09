# Registro de Progreso y Resolución de Errores (TTP)

Este documento mantiene un registro de los pasos de desarrollo, los errores encontrados y las soluciones aplicadas para referencia futura.

## Paso 2: Auth Service
**Estado:** Completado
**Objetivo:** Crear el servicio de autenticación con FastAPI, JWT y PostgreSQL en su propio esquema (`auth`).

### Errores y Soluciones

1. **Alembic intentando eliminar tablas de PostGIS (Extensiones)**
   - **Error Puntual:** Al ejecutar `alembic revision --autogenerate`, Alembic detectaba las tablas internas de PostGIS (como `zip_lookup_all`, `cousub`, `edges`, etc.) en el esquema `public` y creaba migraciones intentando eliminarlas (`DROP TABLE zip_lookup_all`), lo que provocaba el error `DependentObjectsStillExistError`.
   - **Causa:** El flag `include_schemas=True` en `env.py` hacía que Alembic escaneara toda la base de datos, ignorando que el microservicio solo es dueño del esquema `auth`.
   - **Solución:** Se implementó una función `include_object` en `alembic/env.py` que filtra explícitamente los objetos de la base de datos. Si el tipo de objeto es tabla, solo genera migraciones si `object.schema == "auth"`.

2. **Incompatibilidad de la librería `passlib` con `bcrypt`**
   - **Error Puntual:** Al enviar un POST a `/auth/register`, el servidor devolvía Error 500. Los logs mostraban: `AttributeError: module 'bcrypt' has no attribute '__about__'`.
   - **Causa:** `passlib` versión 1.7.4 usa una API antigua de la librería `bcrypt`. Las versiones recientes de `bcrypt` (4.x superior) eliminaron el atributo `__about__`, rompiendo internamente la generación de hashes.
   - **Solución:** Se forzó la instalación de `bcrypt==4.0.1` en el `requirements.txt` del Auth Service para mantener compatibilidad con `passlib`.

3. **Configuración de rutas de FastAPI en Docker Compose**
   - **Error Puntual:** Al configurar el Gateway o al llamar directamente al microservicio por el puerto 8001, las rutas de `/health` y `/register` no coincidían con los mapeos esperados del proxy/Gateway, dando error 404 o 405.
   - **Causa:** Faltaba unificación en los prefijos de las rutas expuestas por la API (`""` vs `"/auth"` o no usar correctamente `app.include_router(router, prefix="/auth")`).
   - **Solución:** Se estandarizaron las rutas bajo el prefijo `/auth` en `main.py` para cumplir con la arquitectura orientada al API Gateway.

## Paso 3: User Service
**Estado:** Completado
**Objetivo:** Crear el servicio de perfiles de usuario y gestión básica en PostgreSQL bajo el esquema `users`.

### Notas y Observaciones

1. **Inicialización exitosa de migraciones Alembic**
   - Aprendiendo del Paso 2, desde el origen se configuró `alembic/env.py` para ignorar los recursos públicos y extensiones como PostGIS implementando el filtro `include_object` apuntando a `schema == "users"`. La migración autogenerada únicamente incluyó la creación de la tabla `profiles`.
2. **Validación Unificada de Tokens (JWT)**
   - El Auth Service emite tokens firmados, el User Service los verifica exitosamente gracias al uso unificado de `JWT_SECRET` inyectado mediante `docker-compose.yml`. Se aislaron las responsabilidades sin acoplamiento estrecho de base de datos.
3. **Mapeo de Rutas Directo**
   - El mapeo de rutas inicia desde `/users`, creando `/users/profiles` y logrando operaciones CRUD funcionales con inyección de JWT.


## Paso 4: Tutor Service

### Problemas enfrentados
- GeoAlchemy2 con Alembic: GeoAlchemy2 genera auto-índices (idx_profiles_coordinates) en la base de datos usando eventos DDL. Alembic intentó crear un índice que ya existía al mismo tiempo.
- Conexiones de base de datos desde los microservicios hacia ttp-postgres no funcionaban localmente en localhost, hubo que ejecutarlas mapeando hacia la red ttp-network con los contenedores corriendo.

### Soluciones
- Se ejecutó el \lembic --autogenerate\ y \lembic upgrade\ diréctamente desde el contenedor (\docker exec -it ttp-tutors...\) y usando \	tp-postgres\ en lugar de \localhost\.
- Se borró la instrucción \op.create_index\ y \op.drop_index\ del archivo de migración de alembic ya que \sa.Column(..., geoalchemy2.types.Geometry(...))\ lo hace automáticamente.
- Aislamiento exitoso de este microservicio con el Auth Guard y dependencias.

## Paso 4: Tutor Service
### Desafíos Enfrentados
- Geoalchemy2 generó índices automáticamente colisionando con el índice autogenerado por Alembic.
- Configuración de Alembic local usando localhost vs conexión Docker usando ttp-postgres.

### Resoluciones
- Ejecutadas las migraciones directamente en el contenedor ttp-tutors.
- Editada la migración de Alembic para eliminar op.create_index de attributes geográficos (Gist).
- Servicio Tutor levantado exitosamente en el puerto 8003.

## Paso 5: Geo Service
### Resumen
- Creado el microservicio \geo-service\ usando FastAPI.
- Implementados endpoints \/geo/geocode\ y \/geo/reverse-geocode\ consumiendo la API de Nominatim (OpenStreetMap) usando \httpx\ de forma asíncrona.
- Integrado el \uth_guard\ (JWT) para asegurar ambos endpoints.
- El contenedor \	tp-geo\ fue levantado correctamente y está \Healthy\ en el puerto 8004.

## Paso 6: API Gateway
### Resumen
- Creado el microservicio \gateway\ como un Reverse Proxy usando FastAPI y \httpx\ de forma asíncrona.
- Removidas temporalmente las dependencias de \chat\ y \media\ en el \docker-compose.yml\ para permitir el despliegue del gateway sin bloqueos \depends_on\.
- Mapeadas las rutas hacia los 4 microservicios principales base: Auth, Users, Tutors, Geo.
- Gateway corriendo correctamente en el puerto 8000.

## Paso 7: Media Service
### Resumen
- Creado el microservicio \media-service\ usando FastAPI con conexión a PostgreSQL en su propio esquema (\media\).
- Aislados los registros de Storage empleando SQLAlchemy Async y la tabla \media.files\.
- Creación programática de UUIDs para asignación al subservicio Supabase para Storage.
- Configuración completa de la autenticación mediante JWT para asegurar las subidas.
- Contenedor \	tp-media\ expuesto y sano en puerto 8006.

## Paso 8 y 9: Chat Service
### Resumen
- Finalizada la implementación del Chat Service con FastAPI, SQLAlchemy (Async) y WebSockets.
- Creados los modelos \Conversation\ y \Message\ bajo el esquema aislado \chat\.
- Configurado \RedisPubSubManager\ para manejar los mensajes en tiempo real mediante canales de Redis, permitiendo escalar el chat en futuras instancias.
- Solucionado error de sintaxis en el archivo \lembic/env.py\ (paréntesis sin cerrar durante el copiar y pegar) y añadidas las exclusiones de esquemas para evitar afectar a PostGIS.
- Las migraciones de Alembic se aplicaron exitosamente dentro del contenedor \	tp-chat\.
- \docker-compose.yml\ fue actualizado para restaurar las dependencias (\chat-service\ y \media-service\) en el API Gateway y añadir \edis\ al Chat Service.
- Con esto concluye el Sprint 1 (Backend Core). Todos los microservicios están listos y sanos detrás del API Gateway (puerto 8000).


## Flujo Frontend & Refinamiento de Endpoints
### Resumen
- Se estandarizaron las rutas del servicio de Tutores (/tutors/profiles) y Chat (/chat/conversations).
- Se configuro CORSMiddleware en el API Gateway para poder aceptar peticiones desde cualquier origen (Frontend testing).
- Se levantó un micro-frontend en el puerto 3000 construido con HTML Vanilla, TailwindCSS y Javascript, lo que permite testear el flujo visual de Autenticación, Creación de Perfil, Geolocalización y Listado de tutores.


### Frontend y Docker (Sincronización de Volúmenes)
- **Problema:** Se creó la interfaz de usuario `dashboard.html` (con el mapa de Leaflet), pero el contenedor de frontend no lo servía, devolviendo un error 404.
- **Causa:** El archivo `frontend/Dockerfile` tenía la instrucción `COPY index.html /app`, copiando únicamente la pantalla de login e ignorando el resto del proyecto. Además, no había volúmenes montados para desarrollo local.
- **Solución:** Se actualizó a `COPY . /app` en el Dockerfile para empaquetar toda la UI, y se sugirió hacer _rebuilds_ o usar volúmenes para ver cambios en tiempo real.

### Autenticación (Login y Content-Type)
- **Problema:** Al enviar el formulario de login, la API devolvía un error HTTP 422 Unprocessable Entity (`"detail": "Field required"`).
- **Causa:** El código JS del frontend usaba `FormData` enviando el campo `username`, y la API de FastAPI esperaba recibir un JSON (`application/json`) con el campo `email`.
- **Solución:** Se refactorizó la función de fetch en Javascript para enviar un bloque JSON con las llaves `email` y `password`.

### Enrutamiento de API (Trailing Slashes y DNS Interno)
- **Problema:** Las peticiones desde el navegador a `/tutors/profiles/?limit=100` fallaban con `net::ERR_NAME_NOT_RESOLVED`.
- **Causa:** El Gateway recibía la petición pero el microservicio de tutores devolvía una redirección 307 (Temporary Redirect) porque la ruta estricta no coincidía, reescribiendo la URL al hostname interno de Docker (`http://tutor-service:8003/...`) que el navegador no puede resolver.
- **Solución:** Se corrigió el endpoint consultado desde la UI a `/tutors/?limit=100` alineándolo exactamente con las rutas definidas sin redirecciones.

### Base de Datos Espacial (Error 500 en Tutor Service)
- **Problema:** Obtener el listado de tutores lanzaba `500 Internal Server Error`. Los logs mostraban `missing FROM-clause entry for table "anon_2"`.
- **Causa:** Un bug conocido al usar funciones espaciales (`func.ST_X`, `func.ST_Y`) de GeoAlchemy2 junto con reglas de paginación (`.limit().offset()`). SQLAlchemy generaba una subconsulta alias (`anon_2`) para la paginación pero manejaba mal el join con las proyecciones geométricas.
- **Solución:** Se dividió la lógica en Python: la primera consulta busca únicamente los `id` de los tutores aplicando los filtros y la paginación, y un segundo query (`where(TutorProfile.id.in_(...))`) extrae los perfiles completos junto con la geometría, esquivando el error del ORM.

### Geolocalización (401 Unauthorized en Búsqueda)
- **Problema:** El mapa intentaba convertir texto (ej. "Madrid") a coordenadas, pero fallaba con `HTTP 401 Unauthorized`.
- **Causa:** El servicio `geo-service` exigía validación JWT (`Depends(verify_token)`) para su endpoint `/geocode`, lo cual fallaba o era bloqueado durante peticiones de navegadores cuando el token expiraba o el header CORS se perdía.
- **Solución:** Dado que la API interna solo actúa como proxy sobre Nominatim (público), se eliminó la dependencia de seguridad de este endpoint para permitir que el frontend o usuarios anónimos busquen direcciones libremente.
- **Dato extra - Seeding:** Se ajustaron los datos de prueba (`seed_db.py`) y la posición por defecto del mapa para apuntar a Medellín, Colombia (U de Medellín, Belén, etc.), arreglando algunos problemas de indentación en Python durante la inserción.

### Frontend y Docker (Sincronizacion de Volumenes)
- **Problema:** Se creo la interfaz de usuario dashboard.html (con el mapa de Leaflet), pero el contenedor de frontend no lo servia, devolviendo un error 404.
- **Causa:** El archivo frontend/Dockerfile tenia la instruccion COPY index.html /app, copiando unicamente la pantalla de login e ignorando el resto del proyecto.
- **Solucion:** Se actualizo a COPY . /app en el Dockerfile para empaquetar toda la UI.

### Autenticacion (Login y Content-Type)
- **Problema:** Al enviar el formulario de login, la API devolvia un error HTTP 422 Unprocessable Entity.
- **Causa:** El codigo JS enviaba FormData con username, y FastAPI esperaba un JSON con email.
- **Solucion:** Se refactorizo la funcion fetch en Javascript para enviar JSON con email y password.

### Enrutamiento de API (Trailing Slashes)
- **Problema:** Las peticiones desde el navegador a /tutors/profiles/?limit=100 fallaban con net::ERR_NAME_NOT_RESOLVED.
- **Causa:** El Gateway devolvia una redireccion 307 reescribiendo la URL al hostname interno de Docker (http://tutor-service:8003/...).
- **Solucion:** Se corrigio el endpoint a /tutors/?limit=100.

### Base de Datos Espacial (Error 500 en Tutor Service)
- **Problema:** Obtener el listado de tutores lanzaba 500 Internal Server Error (missing FROM-clause entry for table anon_2).
- **Causa:** Bug al usar func.ST_X y func.ST_Y de GeoAlchemy2 junto con paginacion (.limit()). SQLAlchemy generaba una subconsulta corrupta.
- **Solucion:** Se dividio la consulta: primero se buscan los id y luego usando un in_() se extrae la informacion geo-espacial.

### Geolocalizacion (401 Unauthorized)
- **Problema:** El mapa fallaba buscando direcciones lanzando HTTP 401 Unauthorized.
- **Causa:** El servicio geo-service requeria validacion de token JWT para geocodificacion mediante OSM.
- **Solucion:** Se hizo publica la ruta /geocode, ya que no necesita datos de usuario, y se actualizaron los datos semilla (seed_db.py) hacia Medellin.

### Frontend y Flujo de Registro (Doble campo Email)
- **Problema:** En el formulario de registro (`index.html`), el campo "Email" aparecía dos veces y el sistema fallaba si no se proveía el nombre de usuario (`display_name`).
- **Causa:** El HTML y Javascript estaban mal estructurados. El endpoint de autenticación espera email y contraseña, pero el de perfil de usuario espera el nombre.
- **Solución:** Se corrigió el HTML para pedir "Nombre / Username" y se actualizó el Javascript para hacer tres pasos en cadena: 1. `POST /auth/register`, 2. `POST /auth/login` (automático en background) y 3. `POST /users/profiles` (usando el token para guardar el nombre de usuario).
- **Mejora Adicional:** Se modificó `docker-compose.yml` para cargar `frontend` mediante volumes (`./frontend:/app`), permitiendo hot-reload sin necesidad de reconstruir la imagen Docker cada vez.

### Internacionalización y Dominio de Tutores (Español)
- **Problema:** El portal estaba completamente en inglés y los perfiles simulados de tutores ('student1', 'profe1') no tenían sentido lógico con el caso de uso real de profesiones (mecánica, psicología, etc).
- **Causa:** Texto *hardcoded* heredado del diseño inicial, scripts `seed_db.py` genéricos.
- **Solución:** 
  - Se tradujo todo el `index.html` y el `dashboard.html` al español.
  - Se reescribió `seed_db.py` para generar perfiles hiperespecíficos ("Mecánico", "Psicólogo", "Matemáticas", "Software") con sus categorías en español.

### Rediseño de Carga de Mapas y Pricing
- **Problema:** El mapa era muy lento al arrastrar o hacer zoom, y los Popups de tutores mostraban una tarifa dura en bruto (Ej: `$20/hr`), lo cual no encaja con un esquema de servicios profesionales complejos.
- **Causa:** Uso de tiles base de OpenStreetMap pesados y renderización en DOM en lugar de Canvas. El precio venía inyectado desde la base de datos sin lógica de complejidad.
- **Solución:**
  - **Eficiencia del Mapa:** Se cambió el proveedor a CARTO Voyager y se habilitó la bandera `{ preferCanvas: true }` y `keepBuffer: 6` en Leaflet, disparando el rendimiento web.
  - **Popups:** Se ocultó la tarifa estática. Ahora los globos de los tutores priorizan la "Especialidad principal", las "Categorías" y los "Años de Experiencia".
  - **Plan de Pricing Definido:** Se estableció la pauta lógica de cobro que el backend procesará al momento de "Reservar Tutor", dividiéndose en tres variables: Pauta A (Nivel académico, +30% universitario, +60% profesional), Pauta B (Complejidad de sesión/urgencia) y Pauta C (Bloques de tiempo fijos y no pagando por cada minuto).
