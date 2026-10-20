# HemoRed Expo Universal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an Expo + React Native Web client that runs HemoRed on Android, iOS, tablets, and desktop browsers while keeping the existing Node.js API.

**Architecture:** Create a new `app` workspace package using Expo Router and React Native primitives. Move reusable API types and client functions into `shared`, keep `web` as a fallback during migration, and build mobile/tablet/desktop layouts from the same screen components with responsive hooks.

**Tech Stack:** Expo, React Native, React Native Web, Expo Router, TypeScript, Vitest or Node test runner, existing Fastify API, pnpm workspaces.

**Spec:** `docs/superpowers/specs/2026-10-19-hemored-expo-universal-design.md`

## Global Constraints

- Use Expo with React Native and React Native Web.
- Use TypeScript for the universal client.
- Keep the backend API and event contracts as the integration boundary.
- Use `View`, `Text`, `Pressable`, `ScrollView`, `FlatList`, `TextInput` and `StyleSheet` for cross-platform UI.
- The first increment supports Android/iOS development through Expo Go and browser execution through Expo Web.
- Do not add authentication, push notifications, sensors or store publication in this increment.
- Every visible button must navigate, submit, cancel, or execute a clearly defined action.

## Review Focus

- A device must not call `localhost` for a backend running on the developer computer; test configurable API base URLs in Task 2.
- A narrow viewport must keep primary actions reachable and lists scrollable without horizontal page overflow; test in Task 4.
- Back navigation and direct deep links must resolve to the correct screen after reload; test in Task 3.
- Failed API requests must show an actionable error instead of a blank screen; test in Task 2.
- Form submission must prevent duplicate requests while saving and show confirmation or field errors; test in Task 5.

### Task 1: Workspace scaffold and shared contracts

**Files:**
- Create: `shared/package.json`, `shared/src/contracts.ts`, `shared/src/routes.ts`
- Create: `app/package.json`, `app/app.json`, `app/babel.config.js`, `app/tsconfig.json`
- Modify: `package.json`, `pnpm-workspace.yaml`
- Test: `shared/src/routes.test.ts`

**Interfaces:**
- Produces `ApiConfig`, entity types, `Action`, `routeFor(action)`, and shared API response types.

- [ ] Write a failing test asserting all dashboard actions map to `/`, `/inventory`, `/inventory/new`, `/requests`, and `/donors` as specified.
- [ ] Run `pnpm --filter hemored-shared test`; expect failure because the shared package and route function do not exist.
- [ ] Create the Expo package, shared package, workspace entries, and typed route contracts.
- [ ] Run the targeted test and `pnpm install`; expect PASS and a valid workspace lockfile.

### Task 2: Shared API client and configuration

**Files:**
- Create: `shared/src/api.ts`, `shared/src/api.test.ts`
- Modify: `shared/src/contracts.ts`
- Test: `shared/src/api.test.ts`

**Interfaces:**
- Consumes the domain types from Task 1.
- Produces `createApiClient(config): ApiClient` with `getSummary`, `getUnits`, `getRequests`, `getDonors`, `getEvents`, and `createBloodUnit` methods.

- [ ] Write failing tests for configurable base URLs, successful JSON parsing, API errors, and a device URL such as `http://192.168.1.20:4000`.
- [ ] Run tests and confirm failure because `createApiClient` is absent.
- [ ] Implement the fetch-based typed client with normalized error objects and no hardcoded `localhost` inside shared code.
- [ ] Run shared tests and confirm PASS.

### Task 3: Expo Router navigation shell

**Files:**
- Create: `app/app/_layout.tsx`, `app/app/index.tsx`, `app/app/inventory.tsx`, `app/app/inventory/new.tsx`, `app/app/requests.tsx`, `app/app/donors.tsx`
- Create: `app/src/navigation/actions.ts`, `app/src/navigation/actions.test.ts`
- Create: `app/src/theme/tokens.ts`, `app/src/theme/responsive.ts`

**Interfaces:**
- Consumes route contracts from `shared` and API/configuration interfaces from Task 2.
- Produces screens reachable by Expo Router and `navigate(action)` behavior for every primary navigation button.

- [ ] Write failing tests for direct route resolution, dashboard-to-inventory navigation, inventory-to-new-unit navigation, and returning to dashboard.
- [ ] Run navigation tests and confirm failure.
- [ ] Implement the Expo Router layout, screen registration, navigation actions, theme tokens, and responsive breakpoint hook.
- [ ] Run navigation tests and confirm PASS.

### Task 4: Universal dashboard and data screens

**Files:**
- Create: `app/src/components/MetricCard.tsx`, `app/src/components/SectionHeader.tsx`, `app/src/components/StatusBadge.tsx`, `app/src/components/LoadingState.tsx`, `app/src/components/ErrorState.tsx`
- Create: `app/src/screens/DashboardScreen.tsx`, `app/src/screens/InventoryScreen.tsx`, `app/src/screens/RequestsScreen.tsx`, `app/src/screens/DonorsScreen.tsx`
- Create: `app/src/hooks/useHemoRedData.ts`
- Test: `app/src/screens/screens.test.tsx`

**Interfaces:**
- Consumes `ApiClient` from Task 2 and navigation from Task 3.
- Produces responsive screens with `FlatList`/`ScrollView`, loading/error/demo states, and action buttons with explicit handlers.

- [ ] Write failing component tests for dashboard metrics, inventory rows, request cards, donor cards, empty state, and API error state.
- [ ] Run tests and confirm failure because screens are missing.
- [ ] Implement shared components, data hook, and platform-neutral screens using React Native primitives and `StyleSheet`.
- [ ] Run component tests and confirm PASS.
- [ ] Verify a desktop viewport, tablet viewport, and narrow mobile viewport have no horizontal overflow.

### Task 5: Forms and operational actions

**Files:**
- Create: `app/src/components/BloodUnitForm.tsx`, `app/src/components/RequestForm.tsx`, `app/src/components/DonorForm.tsx`
- Create: `app/src/screens/NewUnitScreen.tsx`
- Test: `app/src/components/forms.test.tsx`

**Interfaces:**
- Consumes `createBloodUnit` and shared validation options from Tasks 1–2.
- Produces form submission states: idle, submitting, success, and field-level error.

- [ ] Write failing tests for required fields, valid submission, duplicate-submit prevention, cancel navigation, and API failure feedback.
- [ ] Run tests and confirm failure.
- [ ] Implement forms with accessible labels, disabled submit while saving, success feedback, and navigation actions.
- [ ] Run form tests and confirm PASS.

### Task 6: Device configuration, scripts, and documentation

**Files:**
- Create: `app/.env.example`, `app/src/config.ts`, `app/README.md`
- Modify: `package.json`, `README.md`
- Create: `app/scripts/check-platform.mjs`

- [ ] Write a platform configuration test proving web uses `http://localhost:4000` by default while physical-device instructions can supply a LAN URL.
- [ ] Run the test and confirm failure before configuration is implemented.
- [ ] Implement Expo scripts for `start`, `web`, `android`, and `ios`, environment parsing, LAN URL documentation, and the platform check script.
- [ ] Run `pnpm --filter hemored-app web` and verify Expo Web starts.
- [ ] Run the existing backend tests/build and the shared/app tests/build.

### Task 7: Migration verification and handoff

**Files:**
- Modify: `README.md`
- Create: `docs/superpowers/reports/2026-10-19-hemored-expo-verification.md`

- [ ] Run the complete workspace test suite and production web builds.
- [ ] Verify dashboard, inventory, new unit, requests, and donors through Expo Web.
- [ ] Verify navigation actions from each screen and browser back/deep-link behavior.
- [ ] Record Android/iOS testing requirements and any unavailable simulator/device limitations.
- [ ] Update README with exact commands for web, Android emulator, iOS simulator, and physical devices.
