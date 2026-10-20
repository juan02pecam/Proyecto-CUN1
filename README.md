# HemoRed

MVP responsive para gestión operativa de inventario sanguíneo, solicitudes transfusionales, donantes y actividad basada en eventos.

## Tecnología

- Frontend: React + TypeScript + Vite
- Backend: Node.js + TypeScript + Fastify
- Persistencia preparada: MongoDB/Mongoose
- Arquitectura: monolito modular orientado a eventos
- Modelo de desarrollo: incremental

## Ejecutar

Requisitos: Node.js 20+ y pnpm.

```powershell
pnpm install
pnpm --filter hemored-server dev
pnpm --filter hemored-web dev
```

Abre `http://localhost:5173`. La API corre en `http://localhost:4000` y usa datos sintéticos en modo demo por defecto.

### Cliente universal Native

También está disponible `app/`, una aplicación Expo + React Native Web que reutiliza la API y funciona en web, Android e iOS:

```powershell
pnpm --filter hemored-server dev
pnpm --filter hemored-app web
```

Abre `http://localhost:8081`. Para teléfono físico, configura `app/.env` con la IP LAN del equipo como `EXPO_PUBLIC_API_URL` y ejecuta `pnpm --filter hemored-app start`.

Para levantar MongoDB local:

```powershell
docker compose up -d mongodb
```

La conexión queda preparada con `MONGODB_URI`; el MVP mantiene el store demo como fuente activa para que la interfaz sea usable sin infraestructura externa.

## Verificación

```powershell
pnpm --filter hemored-server test
pnpm --filter hemored-server build
pnpm --filter hemored-web build
```

## Funcionalidades incluidas

- Dashboard con inventario disponible, alertas, solicitudes y donantes.
- Inventario demo por grupo sanguíneo y componentes.
- API para registrar unidades, donantes y solicitudes.
- Eventos `BloodUnitRegistered`, `DonorRegistered` y `TransfusionRequestCreated`.
- Dedupe de eventos por identificador.
- Diseño responsive con navegación adaptable a móvil.

Los datos del MVP son sintéticos y no deben usarse como sistema clínico productivo sin añadir autenticación, autorización, auditoría regulatoria e interoperabilidad HL7/FHIR.

Para crear un APK instalable directamente en Android:

```powershell
npx eas-cli login
pnpm --filter hemored-app build:apk
```

El perfil `production` genera un AAB para Google Play.
