# 5. Styling reuse via cva/components/tokens, not constant files; assets imported from src/assets

Status: Accepted
Date: 2026-06-15

## Context

Styling in the app is Tailwind utilities plus Shadcn primitives. As screens were built, a pattern emerged of extracting recurring className strings - and image-URL strings - into free-floating named exports in `*.layout.ts` files (`quiz.layout.ts`, `auth.layout.ts`, `title.layout.ts`). This was never recorded as a decision, and AGENTS.md requires conventions to be recorded as ADRs rather than introduced silently.

Two problems surfaced on review.

**Reuse of class sets.** When a set of utility classes recurs, there are four ways to share it:

1. A **theme token** in `src/index.css` - for a cross-cutting design value (a colour, a spacing step).
2. A **cva variant** - a typed, named set of classes that returns a string, so it applies to any element; this is already the repo's pattern (`button.tsx`).
3. A **wrapper component** - when the recurring unit is a consistent container wrapping children.
4. A **free-floating className constant** - a bare exported string.

Options 1-3 are the idiomatic React/Tailwind tools, and the repo already uses them well. Option 4 is the weakest: it competes with the other three, splits the style from the markup it changes with, and a name like `AUTH_CONTENT_SHELL` usually carries less information than the literal it hides. In practice most of the `*.layout.ts` className constants are single-use, which is pure indirection with no reuse payoff.

**Asset URLs.** Image and icon paths are stored as raw `public/...` strings, referenced inconsistently (in `*.layout.ts` constants, in component config objects, and inline in JSX). `public/` string paths get no build-time verification: a renamed or missing asset ships as a runtime 404 with green CI, and the files are not fingerprinted. Importing app-owned assets from `src/assets/` makes the build verify and fingerprint them, and removes the need for asset-path constants. `public/` remains correct for assets that need a stable predictable URL, are very large, or are referenced outside the build.

A few constants are deliberate: they hold Figma-exact values with `reconcile with KAN-14` comments, parked for the KAN-14 design pass. Those are legitimate and are not addressed here.

## Decision

- Reuse a recurring set of utility classes through a **cva variant** or a **wrapper component**, and put cross-cutting design values in **theme tokens** in `src/index.css`. A one-off stays an inline Tailwind utility, preferring canonical utilities (`h-15`, `-tracking-widest`) over arbitrary `[...]`; reach for `[...]` only when no canonical value exists (Figma-exact numbers). Do **not** use free-floating className-string constants, single-use custom theme tokens, or `@apply` rules for one-off classes.
- Component placement: `src/components/ui/` holds presentational primitives (Shadcn, `LoadingSpinner`); `src/components/layout/` holds structural composition, including `AppContentShell` and `TitleBanner`. A variant-driven banner or content shell is structural, so it lives in `layout/`.
- Store app-owned images and icons in `src/assets/` and `import` them so the build verifies and fingerprints them. Use `public/` only for assets that need a stable URL, are very large, or are referenced outside the build. Do not keep asset paths in shared constant files.
- Drop the `*.layout.ts` file type: its className role moves to cva/components/tokens, its asset-path role to imports.
- Figma-exact constants carrying `reconcile with KAN-14` stay parked for that design pass and are out of scope here.

## Consequences

- There is one styling-reuse model (cva, components, tokens) instead of a fourth competing string-constant mechanism, and styles live with the markup they change with.
- App-owned assets gain build-time verification: a renamed or missing asset becomes a build failure rather than a silent runtime 404.
- The `*.layout.ts` files are removed and their contents moved to cva variants, components, tokens, and imports. The change is behavior-preserving and the gates hold across it.
- `public/` versus `src/assets/` becomes a deliberate per-asset choice - a small additional rule for contributors.
- The Figma-exact parked constants are untouched; if the KAN-14 pass changes their values, that work owns the reconciliation.
- If a shared className fragment ever genuinely needs to be composed via `cn()` onto many different element types where neither a cva variant nor a wrapper component fits, this decision can be revisited for that narrow case - but the default remains cva, components, and tokens.
