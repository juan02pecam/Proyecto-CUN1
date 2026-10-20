# HemoRed Expo verification

## Implemented

- Added `app/` with Expo Router, React Native primitives and React Native Web.
- Added `shared/` with typed API contracts, routes and fetch client.
- Reused the Fastify API and event boundary; no authentication or production clinical claims were added.
- Wired dashboard, inventory, new-unit, requests and donors routes.
- Added configurable `EXPO_PUBLIC_API_URL` for physical devices.
- Connected visible operational actions and the new blood-unit form to navigation/API submission.

## Verification evidence

- `pnpm --filter hemored-app test`: 2 passing.
- `pnpm --filter hemored-shared test`: 2 passing.
- `pnpm --filter hemored-shared build`: passed.
- `pnpm --filter hemored-server test`: 5 passing.
- `pnpm --filter hemored-server build`: passed.
- `pnpm --filter hemored-app build`: passed; Expo exported 7 static web routes.

## Device handoff

The web export and tests were verified locally. Android/iOS simulator or Expo Go hardware validation requires the corresponding runtime/device. A physical device must use the computer's LAN IP instead of `localhost` in `app/.env`.
