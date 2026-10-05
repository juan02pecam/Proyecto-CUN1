# HemoRed — Especificación de diseño

## 1. Propósito

HemoRed será una aplicación web responsive para apoyar la operación de bancos de sangre y hospitales universitarios. El MVP permitirá consultar inventario de componentes sanguíneos, registrar unidades, gestionar solicitudes transfusionales, registrar donantes y visualizar alertas operativas.

La aplicación se construirá con TypeScript en frontend y backend, React para la interfaz, Node.js para el servidor, MongoDB como persistencia y una arquitectura orientada a eventos. El desarrollo será incremental: primero se entrega un flujo demostrable y después se habilitan capacidades de integración, sensores, analítica y hemovigilancia.

## 2. Alcance del MVP

### Incluido

- Dashboard operativo con métricas de inventario, alertas, solicitudes y actividad reciente.
- Inventario de unidades por grupo sanguíneo, componente, estado, ubicación y fecha de caducidad.
- Registro y consulta de donantes.
- Creación y seguimiento de solicitudes transfusionales.
- Alertas de stock bajo y unidades próximas a vencer.
- Actividad de eventos de dominio visible en la interfaz.
- Datos demo para ejecutar la aplicación sin una carga inicial manual.
- Diseño responsive para escritorio, tableta y móvil.

### Fuera del MVP

- Autenticación y autorización multirol.
- Integración real con HL7/FHIR o historias clínicas.
- Sensores IoT de temperatura.
- Predicción estadística de demanda.
- Notificaciones SMS, correo o push.
- Cumplimiento regulatorio como sistema clínico productivo.

Estas capacidades quedarán documentadas como extensiones futuras y no se simularán como funcionalidades terminadas.

## 3. Usuarios y flujos principales

Los usuarios iniciales son personal de bancos de sangre, personal clínico de IPS y coordinadores operativos.

1. El usuario abre el dashboard y visualiza existencias, alertas y solicitudes pendientes.
2. Registra una unidad de sangre indicando grupo, componente, volumen, ubicación y vencimiento.
3. El sistema publica un evento de unidad registrada y recalcula el resumen del inventario.
4. El usuario crea una solicitud transfusional con prioridad y tipo de componente.
5. El sistema publica el evento de solicitud creada y muestra la solicitud en la bandeja operativa.
6. El usuario registra un donante y opcionalmente una cita.
7. El sistema publica el evento correspondiente y actualiza la actividad reciente.

## 4. Arquitectura

La solución será un monolito modular preparado para evolucionar a microservicios. Esta decisión mantiene el MVP ejecutable y simple, pero separa dominio, persistencia, API y consumidores de eventos para facilitar la evolución.

### Capas

- `domain`: entidades, tipos, reglas y eventos tipados.
- `application`: casos de uso y puertos de repositorio/event bus.
- `infrastructure`: MongoDB, repositorios, bus en memoria y configuración.
- `interfaces`: rutas HTTP, serialización y manejo de errores.
- `web`: React, vistas, componentes y cliente HTTP.

### Flujo de eventos

Los casos de uso persisten el cambio y publican un evento de dominio. En el MVP, un bus interno en memoria entrega el evento a consumidores locales. El contrato del bus permitirá reemplazarlo posteriormente por RabbitMQ, Kafka o un servicio administrado sin cambiar las reglas del dominio.

Eventos iniciales:

- `BloodUnitRegistered`
- `BloodUnitStatusChanged`
- `TransfusionRequestCreated`
- `DonorRegistered`
- `DonorAppointmentScheduled`
- `InventoryAlertRaised`

Cada evento tendrá `id`, `type`, `occurredAt`, `aggregateId` y `payload`.

## 5. Modelo de datos MongoDB

- `blood_units`: código, grupo ABO/Rh, componente, volumen, estado, ubicación, fecha de extracción, fecha de caducidad y auditoría básica.
- `donors`: nombre, documento enmascarado, grupo sanguíneo, contacto, última donación y estado.
- `transfusion_requests`: institución, componente, grupo requerido, cantidad, prioridad, estado, solicitante y fechas.
- `domain_events`: tipo, agregado, payload, fecha y estado de procesamiento para trazabilidad del MVP.

Se crearán índices para `blood_units.expiresAt`, `blood_units.bloodGroup`, `blood_units.status` y `transfusion_requests.status`.

## 6. API inicial

- `GET /api/health`
- `GET /api/dashboard/summary`
- `GET /api/blood-units`
- `POST /api/blood-units`
- `PATCH /api/blood-units/:id/status`
- `GET /api/donors`
- `POST /api/donors`
- `GET /api/transfusion-requests`
- `POST /api/transfusion-requests`
- `PATCH /api/transfusion-requests/:id/status`
- `GET /api/events`

Las respuestas usarán JSON consistente, códigos HTTP convencionales y errores con `code`, `message` y `details`.

## 7. Interfaz y experiencia responsive

La aplicación usará una navegación lateral en escritorio y navegación compacta en móvil. La pantalla principal priorizará:

- inventario total y distribución por grupo;
- tarjetas de alertas críticas;
- solicitudes pendientes;
- tabla/lista de unidades próximas a vencer;
- línea de actividad de eventos.

Los formularios serán reutilizables, con validación visible, estados de carga, confirmación de guardado y mensajes de error. El color rojo se reservará para riesgo o urgencia; no se usará como decoración general.

## 8. Manejo de errores y consistencia

- Validación en cliente y servidor.
- Errores de dominio diferenciados de errores de infraestructura.
- Respuestas de error estables para el frontend.
- Fallback de datos demo cuando MongoDB no esté disponible, claramente identificado en la interfaz.
- Eventos con identificador único para permitir deduplicación futura.
- Consistencia eventual aceptada para métricas derivadas; los cambios de inventario y solicitudes se validan antes de confirmar.

## 9. Seguridad y privacidad del MVP

No se manejarán historias clínicas ni datos clínicos identificables. Los datos de ejemplo serán sintéticos. El documento de identidad de donantes se mostrará enmascarado en la interfaz. La configuración sensible se leerá desde variables de entorno y no se guardarán secretos en el repositorio.

## 10. Verificación y criterios de aceptación

- La app inicia con comandos documentados para servidor y cliente.
- El dashboard carga datos demo y muestra métricas coherentes.
- Crear una unidad actualiza inventario y genera un evento.
- Crear una solicitud actualiza la bandeja y genera un evento.
- Registrar un donante actualiza la actividad.
- Las alertas de stock bajo y vencimiento próximo aparecen con datos demo.
- La interfaz se adapta sin desbordamiento horizontal a móvil.
- Las pruebas de dominio, API y build frontend pasan.

## 11. Evolución incremental

La segunda iteración podrá agregar autenticación y roles; la tercera, integración de inventarios entre instituciones y una cola persistente; posteriormente, sensores de temperatura, analítica predictiva y adaptadores HL7/FHIR. Cada incremento conservará los contratos de eventos y API definidos aquí.
