# HemoRed Expo Universal — Especificación de diseño

## 1. Propósito

HemoRed tendrá una interfaz universal basada en Expo, React Native y React Native Web para ejecutarse en teléfonos, tabletas y navegadores de escritorio. El backend actual en Node.js/TypeScript conservará sus endpoints, MongoDB preparado y bus de eventos.

El objetivo es compartir la mayor parte de la interfaz, navegación, validaciones y cliente API sin perder una experiencia adecuada en pantallas pequeñas o grandes.

## 2. Alcance

### Incluido

- Nuevo paquete `app` con Expo, React Native, TypeScript y Expo Router.
- Ejecución con `expo start`, Android/iOS mediante Expo Go o build nativa y navegador mediante React Native Web.
- Dashboard, inventario, solicitudes, donantes y formulario de registro de unidades.
- Navegación funcional entre todas las secciones y rutas parametrizadas básicas.
- Componentes adaptables para móvil, tableta y escritorio web.
- Cliente API y tipos compartidos entre el frontend actual y la app universal cuando sea posible.
- Estado de carga, error de API y modo demo.
- Pruebas unitarias de rutas, transformaciones de datos y componentes críticos.

### Fuera del alcance inicial

- Publicación en Google Play o App Store.
- Notificaciones push nativas.
- Autenticación biométrica.
- Integración con cámara, Bluetooth, sensores o ubicación.
- Escritorio instalable como `.exe`; para eso se evaluará Tauri o Electron en una iteración posterior.

## 3. Decisiones de arquitectura

### Cliente universal

Se usará Expo con React Native y React Native Web. Las pantallas se construirán con primitives multiplataforma: `View`, `Text`, `Pressable`, `ScrollView`, `FlatList`, `TextInput` y `StyleSheet`. Los estilos se definirán con tokens compartidos y breakpoints derivados del ancho disponible.

Expo Router gestionará rutas basadas en archivos:

- `/` — resumen/dashboard.
- `/inventory` — inventario.
- `/inventory/new` — registro de unidad.
- `/requests` — solicitudes transfusionales.
- `/donors` — donantes.

La navegación usará `Link` y `router.push`, evitando botones visualmente activos sin acción.

### Paquetes del proyecto

- `app`: cliente Expo universal.
- `server`: API existente, sin cambios de contrato salvo mejoras explícitas.
- `shared`: tipos de dominio, rutas y cliente HTTP reutilizable.
- `web`: se conservará temporalmente como fallback mientras se valida el cliente universal.

## 4. Diseño de interfaz

La interfaz conservará la identidad de HemoRed, pero se adaptará a un patrón universal:

- En escritorio web: barra lateral fija y contenido en dos columnas.
- En móvil: encabezado compacto, navegación inferior o menú horizontal y tarjetas apiladas.
- En tablet: navegación compacta y grillas de dos columnas cuando el ancho lo permita.
- Colores: azul petróleo para navegación, coral para acciones principales y rojo solo para urgencias.
- Listados largos: `FlatList` o `ScrollView` horizontal contenido, sin desbordamiento de pantalla.
- Formularios: campos grandes, labels visibles, validación accesible y acciones persistentes al final.

## 5. Datos y estado

La app consumirá:

- `GET /api/dashboard/summary`
- `GET /api/blood-units`
- `POST /api/blood-units`
- `GET /api/transfusion-requests`
- `POST /api/transfusion-requests`
- `GET /api/donors`
- `POST /api/donors`
- `GET /api/events`

Se usará un cliente API tipado con `fetch`, un estado local por pantalla y un hook de carga común. No se agregará un gestor global complejo mientras el MVP tenga pocas entidades.

## 6. Compatibilidad

- Navegador: Expo Web con React Native Web.
- Android/iOS: Expo Go durante desarrollo y builds EAS en una fase posterior.
- Escritorio: navegador responsive. La instalación nativa para Windows/macOS queda fuera del primer incremento.
- API local: el navegador y el dispositivo deben poder acceder al host donde corre Node.js; se documentarán `localhost` para web y la IP local para dispositivos físicos.

## 7. Errores y estados

- Estado inicial de carga visible.
- Error de conexión con mensaje accionable.
- Modo demo identificado cuando la API lo indique.
- Formularios con errores por campo.
- Botones deshabilitados durante envíos para evitar duplicados.
- Confirmación visual después de registrar una unidad o solicitud.

## 8. Verificación

- Pruebas unitarias de cada ruta y de la construcción de URLs.
- Pruebas de validación de formularios.
- Build web de Expo sin errores.
- Inicio de Expo en modo web.
- Verificación visual en un viewport móvil y uno de escritorio.
- Comprobación de que cada botón visible navega, envía un formulario o ejecuta una acción explícita.
- Backend existente continúa pasando sus pruebas y build.

## 9. Evolución

Después del cliente universal se podrán añadir autenticación, notificaciones push, almacenamiento offline, sincronización eventual y builds publicables. El contrato API y los eventos actuales permanecen como frontera estable para futuras aplicaciones nativas.
