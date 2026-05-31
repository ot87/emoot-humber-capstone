# ADR-0003: Split quiz result UI (KAN-30) from result persistence (KAN-31)

- **Status:** Accepted
- **Date:** 2026-05-29

## Context

Showing the user's personality result and saving or loading that result are two different concerns: one is presentation, the other is data access that depends on the service layer and a signed-in user. A single ticket covering both mixes those concerns, muddies ownership, and prevents the UI from being built and tested before persistence is ready.

## Decision

Split the work into two tickets:

- **KAN-30** is the result page UI (presentation only): render the personality type and its explanation.
- **KAN-31** is result persistence: save the result to Firestore on quiz completion and load it on return. It depends on the service layer (KAN-34) for `saveQuizResult` / `getSavedQuizResult`, and on authentication (KAN-21) for the signed-in uid.

## Consequences

Positive:

- Single concern per ticket; clearer ownership and testing.
- The result UI can be built and tested against mock data before persistence lands.
- Persistence can be built against the service-layer contract independently of the UI.

Negative:

- Two tickets to coordinate, and the end-to-end result flow spans both.
