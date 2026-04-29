# Guía de Instalación y Ejecución — TutorMatch

TutorMatch es una plataforma de tutorías diseñada con una arquitectura de microservicios en Python (FastAPI) y un frontend moderno (ahora en proceso de migración a Next.js 14).

## Requisitos Previos
- Docker y Docker Compose
- Node.js 20+ (para el frontend local en Next.js)
- npm o pnpm

## Estructura del Proyecto
El proyecto está dividido en varios microservicios (users, tutors, chat, matching, geo, notification, analytics) interactuando a través de un API Gateway y un entorno centralizado de PostgreSQL, Redis y almacenamiento S3 simulado (MinIO/Supabase).

## 1. Instalar y Levantar el Backend (Microservicios)
El entorno completo de desarrollo del backend se levanta usando Docker Compose. Esto incluye las bases de datos (PostgreSQL), la cache en Redis y cada uno de los microservicios, así como el gateway.

1. Clona el repositorio.
2. Posiciónate en la raíz del proyecto:
   \\\ash
   cd tutoring-platform
   \\\
3. (Opcional pero recomendado) Detén cualquier contenedor previo:
   \\\ash
   docker-compose down
   \\\
4. Construye y levanta los servicios en segundo plano:
   \\\ash
   docker-compose up -d --build
   \\\

Todo el sistema de backend estará disponible a través del **API Gateway** en \http://localhost:8000\.

## 2. Preparar la Base de Datos
El proyecto requiere ejecutar los scripts de inicialización SQL para crear el esquema en la base de datos PostgreSQL. Esta inicialización corre de manera automática mediante montajes en el volumen de Docker que leen \init-db.sql\ o cualquier otro script DDL en la ruta adecuada. Si experimentas problemas, espera un par de minutos en lo que la base arranca o reinicia el contenedor \db\.

## 3. Frontend (Migración a Next.js 14)
Actualmente en progreso. Cuando el step inicial esté hecho:
1. Posiciónate en la carpeta \rontend/\:
   \\\ash
   cd frontend
   \\\
2. Instala dependencias:
   \\\ash
   npm install
   \\\
3. Levanta el servidor de desarrollo en Next.js:
   \\\ash
   npm run dev
   \\\
El frontend estará operando en \http://localhost:3000\.

## Flujo de Trabajo y Pruebas
1. Abre \http://localhost:3000\ en tu navegador para ver la interfaz.
2. Registra un tutor (la plataforma automáticamente consumirá el endpoint en \http://localhost:8000/auth/register\).
3. Prueba el Feed / Dashboard, la búsqueda geolocalizada en el Mapa.
4. Para tests directos de backend, utiliza la interfaz interactiva de Swagger autogenerada en: \http://localhost:8000/docs\.

¡Disfruta construyendo o experimentando con TutorMatch!
