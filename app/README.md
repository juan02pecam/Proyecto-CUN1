# HemoRed Universal

Cliente Expo + React Native para Android, iOS y web. Comparte las pantallas y la navegación entre dispositivos.

## Desarrollo

Desde la raíz del proyecto:

```powershell
pnpm install
pnpm --filter hemored-server dev
pnpm --filter hemored-app web
```

Abre `http://localhost:8081` para la versión web.

Para un teléfono físico, copia `.env.example` a `.env` y cambia la URL por la IP LAN del equipo que ejecuta la API, por ejemplo `EXPO_PUBLIC_API_URL=http://192.168.1.20:4000`. Después ejecuta `pnpm --filter hemored-app start` y escanea el QR con Expo Go.

## Validación

```powershell
pnpm --filter hemored-app test
pnpm --filter hemored-app build
```

## Generar APK instalable

```powershell
npx eas-cli login
pnpm --filter hemored-app build:apk
```

El enlace de descarga aparecerá al terminar. El perfil `production` genera un `.aab` para Google Play:

```powershell
pnpm --filter hemored-app build:aab
```
