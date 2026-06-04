# ADR-0001: Use Google sign-in instead of email/password

- **Status:** Accepted
- **Date:** 2026-05-29

## Context

The scope originally specified email/password authentication. In the standalone app, authentication serves two purposes: providing a `uid` to key each user's data (quiz result, bingo progress), and giving the app a complete, production-like impression. In the eventual integrated version, Emoot's own authentication handles identity, and the standalone app would not own the login experience. Emoot's actual internal authentication method is not yet confirmed.

## Decision

Use Firebase Authentication's Google sign-in provider for the standalone app, instead of email/password.

## Consequences

Positive:

- No login or registration form to build and validate, which removes screens and reduces scope.
- Faster sign-in flow for the demo and for testing per-user data.
- Still provides the `uid` needed to key per-user documents.

Negative and open:

- Adds a dependency on Google sign-in.
- Integration with Emoot's user identity remains an open question until Emoot's authentication method is confirmed; this decision may need revisiting at that point.

This decision is revisitable once Emoot's authentication method is confirmed (see the integration points doc, KAN-19).
