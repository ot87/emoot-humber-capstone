# Agent instructions

Standalone mobile-first web app with two features: a Money Personality Quiz
(5 single-choice questions scoring to one of 4 types: Planner, Worrier, Free
Spirit, Overwhelmed Starter) and Emoot Bingo (3x3 challenge board per type,
fixed centre square, win = 3 in a row). Clarity and convention beat cleverness.

## Stack

Vite + React + TypeScript (strict) + Tailwind v4 + Shadcn + React Router v7
(declarative) + Firebase (Auth + Firestore) + Vitest + React Testing Library.

## Commands

- `npm run dev` / `npm run lint` / `npm run typecheck` / `npm run test` / `npm run build`
- One test file: `npx vitest run src/App.test.tsx`
- One test by name: `npx vitest run -t "<test name>"`

lint, typecheck, test, and build MUST all pass before work is presented as
done. CI runs these on every PR.

## Architecture rules

### Firebase boundary - the most important rule in this file

- The Firebase SDK is imported ONLY in `src/services/*` and `src/lib/firebase.ts`
  (init only). NEVER import `firebase/*` in components, hooks, pages, or logic
  files. If a task seems to require it, stop and say so.
- One service module per domain: `auth.service.ts`, `quiz.service.ts`,
  `bingo.service.ts`. Services export typed async functions, no React code.
- Feature code reaches data only through hooks. Components and pages NEVER
  import from `src/services/*` directly; hooks are the only callers of services.

```ts
// BAD - component imports the service
import { signInWithGoogle } from "@/services/auth.service";
const onClick = async () => {
  await signInWithGoogle();
};

// GOOD - component consumes the hook; the hook calls the service
const { signIn, authAction, error } = useAuth();
const onClick = async () => {
  if (await signIn()) navigate(redirectTo);
};
```

- This layer is the integration seam for the client's own Firebase; keeping it
  clean is a contractual deliverable, not a style preference.

### Structure

- `src/features/<feature>/` owns each feature (quiz, bingo, auth):
  - `<Feature>Page.tsx` - thin route-level wrapper, no business logic.
    Only pages are routed, via `src/routes.tsx`.
  - `components/` - presentation only: typed props in, callbacks out, no fetching.
  - `hooks/` - stateful logic; the only callers of services. Async machinery
    (pending flags, try/catch, user-facing error text) lives here, never in
    components. Hooks expose state plus actions (e.g. useAuth returns
    `user, loading, signIn, signOut`); actions return success/failure. Hooks
    NEVER navigate - navigation is component code, via React Router hooks.
  - `<feature>.logic.ts` - pure domain logic (quiz scoring, three-in-a-row):
    no I/O, no React, fully unit-tested in the co-located `.test.ts`.
- Shared domain types: `src/types/<domain>.ts`. Feature-internal types stay in
  the feature.
- Shared presentational primitives: `src/components/ui/` (Shadcn, plus small
  own primitives like `LoadingSpinner`). Shared structural/layout components:
  `src/components/layout/` (`AppContentShell`, `TitleBanner`, app header/footer).
  A variant-driven banner or content shell is structural composition, so it
  lives in `layout/`, not `ui/`.

### Auth and access

- Google sign-in is the ONLY auth method. Never generate email/password forms,
  password reset, or other providers, even as placeholders.
- The quiz is public (no account). Bingo requires a signed-in user with a
  saved quiz result; its route is guarded in `routes.tsx`.
- The default (index) route is `/quiz`. NEVER make `/auth` the front door;
  it is reached only from the result-screen CTA and the bingo guard redirect.
- Routes: `/quiz` (public, default), `/result` (public, per ADR-0003),
  `/auth`, `/bingo` (guarded).
- User data in Firestore is keyed by the Firebase Auth uid; users read and
  write only their own data.

## Conventions

- TypeScript strict: no `any`, no `@ts-ignore`, no non-null assertions to
  silence errors. Exported functions and component props explicitly typed.
- Declared return types match what is actually produced: never narrow away
  fields the layer below provides (a hook exposing `{ uid }` while the service
  returns a full user hides real data from every consumer).
- Styling: Tailwind utilities + Shadcn primitives only. No inline style objects.
  `src/index.css` is the sole Tailwind entry; add only cross-cutting theme tokens
  to it, never one-off classes.
- Styling decision tree, for any recurring or notable styling:
  - Reused across elements or screens -> a component or a cva variant
    (`AppContentShell`, `TitleBanner`, the `button` variants).
  - A cross-cutting design value -> a semantic theme token in `src/index.css`
    (e.g. `--surface`), consumed as `bg-surface` / `text-...`.
  - A one-off -> an inline Tailwind utility, preferring canonical utilities
    (`h-15`, `-tracking-widest`) over arbitrary `[...]`; reach for `[...]` only
    when no canonical value exists (Figma-exact numbers).
    Do NOT create `*.layout.ts` className-constant files, single-use custom theme
    tokens, or `@apply` rules for one-off classes.
- Idiomatic Shadcn/Tailwind: build on Shadcn primitives and `cva` variants rather
  than re-implementing them, and compose classes with `cn()`. The decision tree
  above is the concrete form of "best practice" here - prefer it over inventing a
  new pattern.
- Use semantic theme tokens (`text-destructive`, `text-muted-foreground`,
  `bg-background`, `bg-surface`), never raw palette classes like `text-red-600`.
- App-owned images and icons live in `src/assets/` and are `import`ed, so the
  build verifies and fingerprints them; never `public/` path strings or path
  constants. Reserve `public/` for assets needing a stable URL, very large
  files, or assets referenced outside the build.
- Routing state comes from React Router hooks (`useLocation`, `useNavigate`,
  `useParams`); never read `window.location`.
- No dead code in committed work: no commented-out blocks, leftover dev
  toggles, or unused variables surviving a rewrite. Export only what has a
  consumer.
- Mobile-first with a proper desktop layout; wider breakpoints are additive.
- Tests NEVER touch live Firebase: `vi.mock` the `src/services/*` module (or
  `src/lib/firebase`, which initializes eagerly at import) before rendering
  anything that transitively imports it. If a test seems to need credentials
  or network, the design is wrong - stop and say so.
- New behavior ships with tests in the same PR. `*.logic.ts` files get a test
  per outcome.

## Workflow

- Source of truth, in order: the ticket's acceptance criteria, then AGENTS.md,
  then the README. If they disagree, follow that order and flag the
  disagreement instead of silently picking.
- One branch and one PR per Jira ticket, named after it (`KAN-NN-...`). Keep
  the diff inside the ticket's scope: no drive-by fixes, no opportunistic
  refactors. Report unrelated problems instead of fixing them.
- Smallest change that satisfies the acceptance criteria.
- NEVER commit credentials. `.env.example` is tracked and contains placeholder
  keys only (`VITE_FIREBASE_*`); real values live only in untracked `.env.local`.
- No new dependencies unless asked; propose and wait. No incidental version
  bumps or `package-lock.json` churn - lockfile changes only when the ticket
  requires them.
- No new documentation files unless the ticket asks. Docs live in `/docs`.
- Architectural decisions are recorded as ADRs in `/docs/adr/` - part of the
  team's definition of done. NEVER decide architecture silently; propose an
  ADR (or flag the decision) instead.
- ASK FIRST before touching any of these, even when a fix seems obvious:
  the CI workflow (`.github/workflows/*`), the keys in `.env.example`,
  Firestore collection or field shapes (the data model is owned work),
  and this file (AGENTS.md).

## When unsure

Stop and ask. "This is ambiguous, here are the options" is always acceptable;
inventing a convention is not.
