# 4. Public read for quiz content; no anonymous auth

Status: Accepted
Date: 2026-06-12

## Context

A visitor takes the Money Personality Quiz **without an account** (user story 1); Google sign-in happens at the end, when the result is saved. This means the quiz content - `quizzes`, `questions`, and the `personalityTypes` definitions - must be readable by requests that carry no authentication.

There are two standard Firebase ways to allow this:

1. **Public read security rules** on the content collections (`allow read: if true`), with writes restricted to seed/admin.
2. **Firebase Anonymous Authentication** - sign the visitor in anonymously at app start so they have an auth context, then link that account to Google on sign-in.

Anonymous auth is the right tool when an unsigned user needs to _write and persist data protected by security rules_ before they have an account, and you want to carry that data over when they upgrade. Our flow does not: the quiz result is held in client state during the unauthenticated run and is only persisted (to `userQuizResults/{uid}`) after Google sign-in. Nothing protected is written before sign-in.

## Decision

- Quiz **content** (`quizzes`, `questions`, `personalityTypes`) is **publicly readable** (`allow read: if true`); writes are seed/admin only.
- The quiz **result** is held in client state during the unauthenticated run and persisted to `userQuizResults/{uid}` only after Google sign-in; that document is readable and writable only by its owner.
- We do **not** use anonymous authentication.

## Consequences

- The security rules stay simple, with no anonymous-session lifecycle or account-linking to manage. Public read is the canonical Firebase pattern for non-sensitive reference content.
- The pre-sign-in result lives only in client state, so closing the tab before signing in loses it. This matches the intended product flow (the result is a teaser; signing in is what saves it).
- The content collections are world-readable. That is acceptable for quiz questions and result copy, which are not sensitive; it is never applied to user data.
- If a future feature needs to persist a visitor's progress server-side before they sign in, this decision should be revisited in favour of anonymous auth with account-linking.
