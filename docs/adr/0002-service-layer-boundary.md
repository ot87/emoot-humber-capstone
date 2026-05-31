# ADR-0002: Service-layer boundary for all data access

- **Status:** Accepted
- **Date:** 2026-05-29

## Context

The app talks to Cloud Firestore directly: a serverless setup where the client connects to Firestore, protected by security rules. If feature components call the Firebase SDK directly, data-access logic scatters across the UI. That makes the code hard to test (every component test has to mock Firestore), hard to change (a schema or query change touches many files), and harder to integrate later with Emoot, whose data access may differ from the standalone app's.

## Decision

All Firestore reads and writes go through a service layer:

- Data-access functions live in `services/*.service.ts` (`quiz.service.ts`, `bingo.service.ts`, `auth.service.ts`).
- Only files under `services/` and `lib/firebase.ts` import the Firebase SDK.
- Feature code (components, hooks) calls service functions and never touches Firestore directly.

## Consequences

Positive:

- Feature code is testable by mocking the service layer rather than Firestore.
- Data-access changes are localized to `services/`.
- Service function signatures form a typed contract that consumer hooks (for example KAN-28, KAN-31) build against.
- The boundary is the natural seam for adapting to Emoot's data access during integration.

Negative:

- A small amount of indirection and boilerplate (one service function per operation) versus calling Firestore inline.
