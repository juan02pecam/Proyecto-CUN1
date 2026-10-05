# HemoRed Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a responsive HemoRed MVP with inventory, donors, transfusion requests, dashboard metrics, and an internal event-driven backend.

**Architecture:** Use a TypeScript monorepo with `server` and `web` packages. Keep domain rules and event contracts independent from MongoDB and HTTP; use MongoDB when configured and a clearly labeled demo repository when it is not. The event bus starts in memory behind an interface so a durable broker can be introduced later.

**Tech Stack:** Node.js, TypeScript, Fastify, MongoDB/Mongoose, React, Vite, Vitest, Testing Library, CSS modules or scoped styles.

**Spec:** `docs/superpowers/specs/2026-09-27-hemored-design.md`

## Global Constraints

- Use TypeScript in both frontend and backend.
- Use React for the frontend and Node.js for the backend.
- Use MongoDB as the production persistence adapter.
- Keep the first delivery incremental and runnable with demo data.
- Keep domain changes observable through typed events.
- Do not expose real clinical or personally identifiable data in demo fixtures.
- Keep the responsive UI usable on desktop, tablet, and mobile.

## Review Focus

- Invalid blood-group/component input must return a validation error and never enter inventory; test in the domain/API task.
- Expired or inactive units must not count toward available inventory; test in the inventory summary task.
- Duplicate event delivery must not create duplicate activity records; test in the event task.
- MongoDB unavailable must produce an explicit demo-mode state rather than a misleading healthy production state; test in infrastructure/API task.
- Narrow mobile widths must not create horizontal overflow or hide primary actions; test in the frontend task.

### Task 1: Project scaffold and shared contracts

**Files:**
- Create: `package.json`, `tsconfig.base.json`, `.env.example`, `README.md`
- Create: `server/package.json`, `server/tsconfig.json`, `server/src/domain/contracts.ts`
- Create: `web/package.json`, `web/tsconfig.json`, `web/vite.config.ts`
- Test: `server/src/domain/contracts.test.ts`

**Interfaces:**
- Produces `BloodGroup`, `BloodComponent`, `BloodUnitStatus`, `RequestPriority`, entity types, and `DomainEvent` discriminated unions for later tasks.

- [ ] Write a failing test asserting the event factory creates an event with `id`, `type`, `aggregateId`, `occurredAt`, and payload.
- [ ] Run `npm test --workspace server -- contracts.test.ts`; expect failure because the contract factory is absent.
- [ ] Implement the shared domain types and `createDomainEvent<T>()` in `server/src/domain/contracts.ts`.
- [ ] Run the targeted test and then the server test suite; expect PASS.

### Task 2: Domain services and event bus

**Files:**
- Create: `server/src/domain/inventory.ts`, `server/src/domain/requests.ts`, `server/src/domain/donors.ts`
- Create: `server/src/application/event-bus.ts`
- Test: `server/src/domain/inventory.test.ts`, `server/src/application/event-bus.test.ts`

**Interfaces:**
- Consumes contracts from Task 1.
- Produces `calculateInventorySummary(units)`, validation functions, and `EventBus.publish/subscribe`.

- [ ] Write failing tests for valid unit registration, invalid group rejection, expired-unit exclusion, and idempotent event handling.
- [ ] Run targeted tests and confirm they fail for missing domain behavior.
- [ ] Implement the minimal pure domain functions and in-memory event bus with event-id deduplication.
- [ ] Run domain tests and confirm PASS.

### Task 3: Persistence adapters and demo mode

**Files:**
- Create: `server/src/infrastructure/mongo.ts`, `server/src/infrastructure/repositories.ts`
- Create: `server/src/infrastructure/demo-data.ts`, `server/src/infrastructure/demo-repositories.ts`
- Test: `server/src/infrastructure/repositories.test.ts`

**Interfaces:**
- Consumes domain types and repository contracts from Tasks 1–2.
- Produces repositories for blood units, donors, requests, and events with the same async interface in MongoDB and demo implementations.

- [ ] Write failing repository contract tests for listing, inserting, updating status, and event activity.
- [ ] Run repository tests and confirm the adapters are absent.
- [ ] Implement MongoDB schemas/indexes and demo repositories seeded with synthetic data; expose a `dataMode` value of `mongo` or `demo`.
- [ ] Run repository tests in demo mode and confirm PASS.

### Task 4: HTTP API and application services

**Files:**
- Create: `server/src/application/services.ts`
- Create: `server/src/interfaces/http.ts`, `server/src/index.ts`
- Test: `server/src/interfaces/http.test.ts`

**Interfaces:**
- Consumes repositories and event bus from Tasks 2–3.
- Produces REST endpoints from the spec, including `/api/health`, `/api/dashboard/summary`, inventory, donors, requests, and events.

- [ ] Write failing API tests for health/data mode, creating a unit, creating a request, registering a donor, validation errors, and summary metrics.
- [ ] Run the API tests and confirm expected failures.
- [ ] Implement Fastify routes, application service orchestration, JSON error shape `{ code, message, details }`, and CORS configuration for the web app.
- [ ] Run API tests and confirm PASS.

### Task 5: React shell and dashboard

**Files:**
- Create: `web/src/main.tsx`, `web/src/App.tsx`, `web/src/styles.css`
- Create: `web/src/lib/api.ts`, `web/src/lib/types.ts`
- Create: `web/src/components/StatCard.tsx`, `web/src/components/AlertList.tsx`, `web/src/components/ActivityFeed.tsx`
- Test: `web/src/App.test.tsx`

**Interfaces:**
- Consumes API contracts from Task 4.
- Produces a responsive dashboard showing mode, inventory metrics, alerts, pending requests, and event activity.

- [ ] Write failing component tests for loading dashboard data, showing demo mode, rendering alert severity, and displaying empty states.
- [ ] Run the frontend targeted tests and confirm failure.
- [ ] Implement the React shell, typed API client, dashboard components, responsive navigation, and visual system.
- [ ] Run frontend tests and confirm PASS.

### Task 6: Forms and operational views

**Files:**
- Create: `web/src/components/InventoryForm.tsx`, `web/src/components/DonorForm.tsx`, `web/src/components/RequestForm.tsx`
- Create: `web/src/components/InventoryTable.tsx`, `web/src/components/RequestList.tsx`
- Modify: `web/src/App.tsx`, `web/src/lib/api.ts`
- Test: `web/src/components/forms.test.tsx`

**Interfaces:**
- Consumes API client and domain value options from Tasks 1, 4, and 5.
- Produces create/update workflows with loading, success, validation, and error states.

- [ ] Write failing tests for required fields, successful submissions, API errors, and mobile action visibility.
- [ ] Run targeted tests and confirm failure.
- [ ] Implement forms, operational lists, and responsive layout changes without duplicating validation rules unnecessarily.
- [ ] Run component tests and confirm PASS.

### Task 7: End-to-end verification and documentation

**Files:**
- Create: `server/src/fixtures/seed.ts`, `server/.env.example`, `docker-compose.yml`
- Modify: `README.md`
- Test: `server/src/integration/app.integration.test.ts`

- [ ] Write an integration test that starts the API in demo mode and verifies the create-unit → event → summary flow.
- [ ] Run the integration test and confirm it fails before wiring the final app composition.
- [ ] Add the seed command, optional MongoDB Docker service, startup scripts, and environment documentation.
- [ ] Run the full test suite, type checks, and production builds for both packages.
- [ ] Use a browser or local UI harness to verify desktop and narrow mobile layouts, including no horizontal overflow.
- [ ] Report any unavailable external dependency, especially MongoDB, separately from application test results.
