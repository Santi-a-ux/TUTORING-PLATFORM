# Guía de Instalación y Ejecución - TutorMatch

Esta guía detalla los pasos necesarios para desplegar y ejecutar el proyecto completo de manera local usando contenedores. Toda la arquitectura está dockerizada, separada por microservicios y comunicada mediante un API Gateway.

---

## 📋 1. Requisitos Previos

Asegúrate de contar con las siguientes herramientas instaladas en tu equipo:
- **Docker** y **Docker Compose**
- **Git**
- **Python 3.11+** (para ejecutar el script de seed - carga de datos iniciales)

---

## ⚙️ 2. Configuración Inicial

1. **Clonar el Repositorio**
   Si aún no lo has hecho, clona este repositorio en tu máquina:
   ```bash
   git clone <URL_DEL_REPOSITORIO>
   cd tutoring-platform
   ```

2. **Variables de Entorno**
   El proyecto utiliza un archivo `.env` principal para configurar todos los servicios y conexiones. Si existe un archivo de ejemplo (`.env.example`), duplícalo y renómbralo a `.env`. 
   
   Asegúrate de configurar, como mínimo, las contraseñas, URLs de base de datos (PostgreSQL), conexión a Redis y JWT Secret.
   > **Nota:** Puedes verificar la infraestructura base ejecutando `bash scripts/verify-step1.sh` (opcional, solo Linux/Mac/WSL).

---

## 🚀 3. Levantando los Servicios (Backend + Frontend)

Todo el proyecto (bases de datos, cache, todos los microservicios, el gateway y el frontend) está orquestado mediante `docker-compose.yml`.

1. **Ejecutar el despliegue completo**
   ```bash
   docker-compose up --build -d
   ```
   > El flag `-d` levanta los contenedores en segundo plano. La primera vez tomará algo de tiempo mientras se descargan las imágenes (`postgres`, `redis`, `python`) y se instalan las dependencias (`requirements.txt`) para cada microservicio.

2. **Verificar el estado**
   Asegúrate de que no haya contenedores fallando o en reinicio constante usando:
   ```bash
   docker-compose ps
   ```

---

## 🗄️ 4. Migraciones de Base de Datos

Cada microservicio gestiona su propio "schema" dentro de PostgreSQL y depende de `alembic` (herramienta de migraciones de SQLAlchemy) para construir sus tablas.

Ejecuta las migraciones en cada contenedor para inicializar su esquema:

```bash
docker-compose exec auth-service alembic upgrade head
docker-compose exec user-service alembic upgrade head
docker-compose exec tutor-service alembic upgrade head
docker-compose exec media-service alembic upgrade head
# Repite para los demás servicios que tengan directorio de migraciones activo
```

---

## 🌱 5. Poblar Datos de Prueba (Seeding)

Para facilitar las fases de prueba o validaciones manuales, el proyecto incluye el utilitario `seed_db.py` que crea cuentas de estudiantes y perfiles de tutores de manera automática consumiendo el API Gateway.

> **Importante:** Necesitas tener la librería `requests` instalada localmente o dentro del entorno virtual pertinente. Si no la tienes, instálala usando `pip install requests`.

```bash
python seed_db.py
```

Al terminar, deberías visualizar en la terminal el mensaje confirmando el registro de los usuarios y de sus perfiles.

---

## 🌐 6. Acceso a las Aplicaciones

Ahora el sistema está arriba y poblado, y puede ser accedido de la siguiente forma:

1. **Frontend (App Web)**
   El cliente para interactuar con la plataforma se expone mediante un servidor HTTP sencillo en el puerto `3000`.
   👉 **URL:** [http://localhost:3000](http://localhost:3000)

2. **API Gateway**
   El punto central de acceso a todo el backend se levanta en el puerto `8000`. Si tienes herramientas como Insomnia, Bruno o Postman, apunta tus peticiones allí. (Ej: `http://localhost:8000/auth/login`)
   👉 **Base URL:** [http://localhost:8000](http://localhost:8000)

3. **Acceso directo a Microservicios (Desarrollo)**
   Para labores de debug o acceso en crudo, cada servicio tiene el servidor FastAPI mapeado a puertos locales (e.g. Auth en `:8001`, User en `:8002`, Tutors en `:8003`, etc.). A sus documentaciones Open API (Swagger) se accede a través de la ruta `/docs`. (Ej: `http://localhost:8001/docs`).

## 🛑 Detener la Aplicación

Para apagar y remover los contenedores y mantener las configuraciones intactas de la red:
```bash
docker-compose down
```
> Si necesitas borrar también los volúmenes correspondientes a la Base de Datos o Redis (esto elimina TODOS los datos guardados) agrega la directiva `-v`: `docker-compose down -v`.