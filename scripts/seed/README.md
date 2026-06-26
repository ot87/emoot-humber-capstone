# Emoot seed

Populates the editable content collections - `personalityTypes`, `quizzes` (+ `questions`), and `bingoChallenges`. User data is never seeded.

`scripts/seed/` uses `firebase-admin`, which is server-only and must not be bundled into the client.

## Files

- `schema.ts` - Zod schemas + inferred types. Single source of truth for the shape.
- `quiz-data.ts` - `personalityTypes` + the quiz questions.
- `bingo-data.ts` - `bingoChallenges`, filled from the clients's spreadsheet.
- `seed.ts` - validates, then writes idempotently to the emulator or prod.

## One-time setup

The Firestore emulator is configured in the committed `firebase.json`, so there is nothing to `init` - a plain `npm install` brings the Firebase CLI and the rest. See the project README for starting it locally. Auth is not emulated; the app signs in against the real project in dev and prod alike.

`.npmrc` is commited at the repo root so npm runs package.json scripts through bash on every machine:

```
script-shell=bash
```

This makes the `VAR=value` script syntax behave the same everywhere - a no-op on Mac, Git Bash on Windows - so no `cross-env` is needed. CI on Ubuntu has bash natively, so it is unaffected. On the Windows machine, make sure `bash` resolves on PATH (`where bash` from cmd should find Git's `bash.exe`; running npm from Git Bash already satisfies that).

## Fill the content

Placeholders are marked `FLAG` (search both data files). The seeder warns about any remaining `FLAG` values but seeds anyway, so you can populate the emulator with partial content and fill the rest later.

- `quiz-data.ts`: the 5 questions' `text` and option `label`s, and confirm each option's `personalityType` - done.
- `bingo-data.ts`: filled from the sheet; a few cells need attention - search `FLAG` (Planner "Reach 25% of your goal" is blank; the "automate a bill" Why-it-Matters is truncated; Planner's "automate a bill" rationale is pasted from the wrong type).

## Seed the emulator (sandbox)

Start the Firestore emulator first (see the project README). The emulator and the seed both read the project id from the `.firebaserc` default, so set it once - either write `.firebaserc` by hand (no login needed):

```json
{ "projects": { "default": "<your VITE_FIREBASE_PROJECT_ID>" } }
```

or run `npx firebase login && npx firebase use --add` if you prefer the interactive picker. Then, in a second terminal:

```bash
npm run seed:emulator
```

Re-run as often as you like; `set()` overwrites, so it always converges to what is in the data files. Emulator data is in-memory unless you start with `--import`/`--export-on-exit`.

## Seed prod

These are terminal commands, run from the repo root, only when you intend to write to the live database. First get a service-account key: Firebase console -> Project settings -> Service accounts -> Generate new private key. Save it at `./secrets/serviceAccount.json` and add `secrets/` to `.gitignore`. Then:

```bash
export GOOGLE_APPLICATION_CREDENTIALS=./secrets/serviceAccount.json   # points firebase-admin at the key, this shell session only
SEED_CONFIRM=yes npm run seed:prod
```

The target is the `.firebaserc` default (the service-account key must be for that same project). Prod refuses to run without `SEED_CONFIRM=yes`, so it cannot fire by accident.

## package.json scripts

With the `.npmrc` above, plain bash-style scripts work on every machine (no `cross-env`):

```json
"seed:emulator": "SEED_TARGET=emulator tsx scripts/seed/seed.ts",
"seed:prod": "SEED_TARGET=prod tsx scripts/seed/seed.ts"
```

`seed:prod` deliberately omits `SEED_CONFIRM` and the key, so a bare `npm run seed:prod` still refuses; you supply them at call time (see "Seed prod" above).

## Notes

- Numbers (`position`, `displayOrder`, `version`, `questionCount`) store as doubles in Firestore - expected.
- The emulator needs no credentials; only prod uses the service-account key.
- This lives outside `src/`, so add `scripts/` to your lint/typecheck globs (or give it a small `tsconfig`) if you want it covered by CI.
