# ADR-0006: Service-layer test strategy — observable outcomes over SDK call shape

- **Status:** Accepted
- **Date:** 2026-06-29

## Context

Service modules are unit-tested with the Firebase SDK mocked. This follows from [ADR-0002](./0002-service-layer-boundary.md) and the AGENTS.md rule that tests never touch live Firebase; a Firestore emulator harness is out of scope before
the demo.

The first service test, `quiz.service.test.ts`, asserts the exact arguments of every Firestore query builder — `collection`, `query`, `where`, `orderBy`, `limit` — in addition to the value the function returns. That couples the tests to _how_ the function talks to Firestore, not _what_ it produces: a behavior-preserving refactor (reordering builder calls, swapping an equivalent query) breaks tests that should have stayed green.

This was a de-facto style, accepted but never agreed as a standard. With a second service (`bingo.service.ts`) landing, we set the standard now rather than copy the coupling forward.

## Decision

Service unit tests assert **observable outcomes**, within the existing mocked-SDK setup:

- The returned domain object — the mapping (Firestore field names and `Timestamp`s to the domain shape), the ordering, and the re-read after a write.
- The **essential read/write target**: that the function hit the right collection/document and persisted the right data. Keep one such assertion per read/write.

Tests do **not** pin every query-builder call argument. The exhaustive `collection`/`orderBy`/`where` argument assertions are dropped — but we keep the one essential target assertion per read/write rather than swinging all the way to zero.

This changes only the assertion style. It stays within the mocked-SDK constraint: no live Firebase, no emulator, no in-memory fake — those remain an explicit post-demo concern.

## Consequences

- Tests survive behavior-preserving refactors of the data layer while still proving the mapping (the most bug-prone part) and that the right document was read or written with the right data.
- We lose proof of the exact query shape: a test will not catch an accidentally dropped `orderBy` if the mocked data happens to arrive already ordered. We accept that tradeoff; query-shape fidelity belongs to integration/emulator tests, which are deferred.
- `bingo.service.test.ts` is written to this standard. `quiz.service.test.ts` predates it and still uses call-argument assertions; it converges to this standard in a separate post-demo ticket. The two files differing in the interim is deliberate, not drift.
