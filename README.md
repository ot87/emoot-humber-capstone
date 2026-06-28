# Emoot - My Savings Goal: Engagement Tools

Standalone web app for two engagement features in Emoot's My Savings Goal module: the Money Personality Quiz and Emoot Bingo. Built by the Humber Capstone team.

The app is developed and deployed as a standalone instance; the Emoot team integrates it into the main app later. For product detail, see the Scope & Requirements (v2.1). [TODO: link the scope doc]

Working in this repo with an AI agent (Cursor, Claude)? The rules live in [AGENTS.md](AGENTS.md). That file is the authoritative version of our conventions, for humans too - this README is the narrative companion; if the two ever disagree, AGENTS.md wins.

## Tech stack

- Vite, React, TypeScript - app foundation
- Tailwind CSS, Shadcn UI (Radix-based primitives) - styling and accessible components
- React Router - routing
- Firebase - Authentication (Google sign-in) and Cloud Firestore
- Vitest, React Testing Library - testing
- ESLint, Prettier - linting and formatting

## Prerequisites

- Node.js v24.16.0
- npm
- A Firebase project with Authentication and Firestore enabled (see Environment setup)

## Getting started

### Prerequisites

- Node.js 20+ (with npm).
- A Java JDK 11+ on your PATH - the Firestore emulator runs on the JVM.
- A Google account added to the Firebase project - the emulator is pinned to the real project id, so it needs you logged in.
  Verify the toolchain with `node -v` and `java -version`.

### One-time setup

```
git clone https://github.com/ot87/emoot-humber-capstone.git
cd emoot-humber-capstone
npm install
cp .env.example .env.local        # fill in the real Firebase web config (see Firebase below)
npx firebase login                # sign in with your Google account (the one added to the project)
```

The emulator is pinned to the real project id, so it will not start until you have logged in. `.firebaserc` is already committed, so there is nothing to write by hand.

### Running locally

```
npm run emulators        # terminal 1: local Firestore on 8080 (pinned to the project id)
npm run seed:emulator    # terminal 2: load content into the emulator
npm run dev              # terminal 3: app
```

In dev the app signs in against the real Firebase project but reads and writes Firestore in the local emulator, so you never touch production data. You need the emulator running (and seeded) for the app to have content. To inspect or edit the seeded data, open the Emulator UI at `http://127.0.0.1:4000/firestore`.

**Two emulator scripts - which to use.**

- `npm run emulators` starts empty, so you re-seed each time (`npm run seed:emulator`). Use it for a clean slate, or to seed exactly what the repo defines right now.
- `npm run emulators:persist` imports and re-exports `./.emulator-data`, so seeded data survives restarts and you can skip re-seeding. The export only writes on a clean **Ctrl-C** exit (closing the terminal skips it).
  `.emulator-data` is gitignored, so on a fresh clone it does not exist yet. Bootstrap it in one go: run `npm run emulators:persist`, `npm run seed:emulator`, then Ctrl-C - the export-on-exit creates `.emulator-data`, and every start after that imports it. (The pinned firebase-tools warns and continues when the import folder is missing rather than erroring, so the first `:persist` run works before the folder exists. If a future firebase-tools bump changes that, bootstrap instead with `npm run emulators` + `npx firebase emulators:export ./.emulator-data --project emoot-my-savings-goal`.)

## Scripts

- `npm run dev` - start the dev server
- `npm run build` - production build
- `npm run lint` - lint
- `npm run typecheck` - type-check without emitting
- `npm run preview` - preview the production build
- `npm run test` - run the unit test suite only (the security-rules tests are a separate command, `npm run test:rules`)
- `npm run test:rules` - run the Firestore security-rules tests against the emulator. Separate from `npm run test` (which excludes them); needs the emulator and a Java JDK, and starts its own emulator via `emulators:exec`
- `npm run emulators` - start the local Firestore emulator, pinned with `--project` so the Emulator UI shows the same namespace the seed writes
- `npm run emulators:persist` - same, but imports/exports `./.emulator-data` so seeded data survives restarts
- `npm run seed:emulator` - load content into the local Firestore emulator (see [`scripts/seed/README.md`](scripts/seed/README.md))
- `npm run seed:prod` - one-time content seed to the real project (guarded; see the seed README)

## Firebase

The app talks to Firebase directly (serverless: the client connects to Firestore, protected by security rules). `src/lib/firebase.ts` initializes the SDK from `.env.local` and, when `import.meta.env.DEV` is set, points Firestore at the local emulator while leaving Auth on the real project.

**Local development.** Auth uses real Google sign-in against the real project; Firestore runs in the emulator. Two ids must agree: `VITE_FIREBASE_PROJECT_ID` in `.env.local` (what the app uses) and the `default` in `.firebaserc` (what the emulator and the seed read). Both point at the same real project. If they drift, the app connects to a different emulator namespace than the seed wrote and you get an empty Firestore with no error.

`.firebaserc` is committed with `default` set to the project id, so there is nothing to write by hand.

**Login is required once.** The emulator is pinned to the real project id (`emoot-my-savings-goal`), and firebase-tools authenticates to resolve a real project, so `npm run emulators` will not start until you have run `npx firebase login`. `seed:emulator` and the app's reads do not call login themselves, but the emulator they depend on does; `seed:prod` uses a service-account key, not login.

**Connecting to the real Firebase project.** The web config in `.env.local` is the real project's:

```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

`.env.example` is the tracked template with placeholders only. Local development reads the real values from `.env.local`, which git ignores. Production builds read them from `.env.production`, which **is** committed: the Firebase web config is not a secret - it identifies the project but authorizes nothing (access is gated by Firestore Security Rules and the Auth authorized-domains list), and it is already public in the deployed bundle anyone can view-source, so committing it adds no exposure while letting a fresh clone or CI build with no setup. See [Deploying to production](#deploying-to-production).

Security rules ([firestore.rules](firestore.rules)) enforce the access model described in the data model's ["Security model and indexes"](docs/data-model/README.md#security-model-and-indexes) section:

- Quiz content (`quizzes`/`questions`, `personalityTypes`) is publicly readable; client writes are denied.
- `bingoChallenges` is readable by signed-in users; client writes are denied.
- Per-user documents (`userQuizResults/{uid}`, `bingoBoards/{uid}`) are owner-only (`request.auth.uid == uid`).
- `feedback` lets a signed-in user create their own document (`userId == request.auth.uid`); client reads are denied (admin/analytics only).

Content writes are seed/admin-only (`allow write: if false`); the Admin SDK bypasses the rules.

## Troubleshooting

Issues the team hit during first setup, with fixes:

- **`firebase: command not found`.** The Firebase CLI is a dev dependency, not a global install. Prefix commands with `npx` (`npx firebase ...`) or use the `npm run` scripts.
- **Emulator won't start: "Failed to authenticate, have you run firebase login?"** The emulator is pinned to the real project id, and a real project needs an authenticated CLI. Run `npx firebase login` once - it is a one-time step per machine.
- **Emulator won't start: "Could not spawn `java`" / "java not found".** The Firestore emulator runs on the JVM and needs a Java JDK 11+ on your PATH. Install one (e.g. Temurin), reopen the terminal, then confirm with `java -version`.
- **Seed fails with "No project id" (or seems to write nothing).** `.firebaserc` needs a `default` entry equal to `VITE_FIREBASE_PROJECT_ID`. An alias like `staging` on its own is not enough - the seed reads `projects.default`. Correct shape:

```json
{ "projects": { "default": "emoot-my-savings-goal" } }
```

- **Emulator UI (`:4000/firestore`) shows no collections even though the seed printed "Done".** The seed succeeded; the UI was pointed at a different project namespace. The Emulator UI shows only the project the emulator was _launched_ with, and it can fall back to a literal `default` namespace even when `.firebaserc` is set correctly. Start the emulator pinned to the id (`npm run emulators` does this via `--project emoot-my-savings-goal`), then re-seed and refresh. Verify the data independently with:

```
  curl "http://127.0.0.1:8080/v1/projects/emoot-my-savings-goal/databases/(default)/documents/personalityTypes"
```

The app is unaffected by this: it reads through the SDK using `VITE_FIREBASE_PROJECT_ID`, the same namespace the seed writes.

- **`:persist` export lands in the repo root, or data is empty on re-run.** The persist script must give `--export-on-exit` an explicit path (`--export-on-exit=./.emulator-data`), or the export goes to the current directory. It also only writes on a clean Ctrl-C exit. For the bootstrap and the two-script split, see "Two emulator scripts" under Running locally.
- **`npm run test:rules` fails with "port taken" / 8080 already in use.** The rules tests start their own Firestore emulator on the configured port, so they collide with a running `npm run emulators` / `emulators:persist`. Stop the running emulator first, then run `test:rules`.

## Project structure

```
src/
  main.tsx                 # entry point
  App.tsx                  # app shell + providers (auth, router)
  routes.tsx               # route table; default route is /quiz; guards the bingo route on auth

  lib/
    firebase.ts            # Firebase init from env vars
    utils.ts               # cn() and small shared helpers (Shadcn convention)

  types/                   # shared domain model, split by domain
    quiz.ts                # domain types for the quiz
    bingo.ts               # domain types for the bingo board
    user.ts                # domain types for the user profile
    index.ts               # re-exports the domain types

  services/                # DATA LAYER - the only place that calls Firestore/Auth (lib/firebase.ts does init)
    auth.service.ts        # signInWithGoogle, signOut, listenToAuthChanges
    quiz.service.ts        # getQuestions, saveQuizResult, getSavedQuizResult, getResultDefinitions
    bingo.service.ts       # getChallenges, getBoardState, updateChallengeStatus

  features/
    quiz/
      QuizPage.tsx          # thin route-level wrapper
      components/           # QuestionCard, OptionButton, ResultCard
      hooks/                # useQuiz (answers + flow)
      quiz.logic.ts         # pure: answers -> personality result
      quiz.logic.test.ts
    bingo/
      BingoPage.tsx         # thin route-level wrapper
      components/           # BingoBoard, BingoSquare, ChallengeDialog, Celebration
      hooks/                # useBingo (board state, status updates)
      bingo.logic.ts        # pure: three-in-a-row detection, board status
      bingo.logic.test.ts
    auth/
      AuthPage.tsx          # thin route-level wrapper
      components/           # SignInCard (Google sign-in button), SignOutButton
      hooks/                # useAuth (auth state + signIn/signOut actions)

  components/
    ui/                    # Shadcn primitives + small own primitives (e.g. LoadingSpinner)
    layout/                # structural composition: AppContentShell, TitleBanner, app header/footer

  assets/                  # app-owned images and icons, imported so the build verifies them

  styles/
    index.css              # Tailwind entry + globals
```

## Architecture and conventions

- Feature-based. Each feature (quiz, bingo, auth) owns its page, components, hooks, and pure logic, so each lane is self-contained.
- The services layer is the only place that calls Firebase. (`lib/firebase.ts` only initializes the SDK; `services/` is the only place that uses it for data and auth operations.) This is the integration seam: to move onto Emoot's Firebase later, you reimplement the services and the features do not change.
- Features reach the services only through hooks. Components and pages never import service functions directly; each feature's hooks own the async state (pending flags, errors) and call the services. Hooks expose state plus actions; navigation stays in components.
- Pages are thin wrappers: the route table points at `<Feature>Page.tsx`, which composes the feature's components and holds no business logic.
- Pure business logic lives in `*.logic.ts` next to its feature (quiz scoring, three-in-a-row), kept free of React so it is easy to unit-test.
- Shared domain types live in `types/`, split by domain. Types internal to a feature (a component's props, a hook's local shapes) stay in that feature.
- Shared presentational primitives are Shadcn (plus small own ones like `LoadingSpinner`) in `components/ui`; shared structural pieces (`AppContentShell`, `TitleBanner`, header/footer) are in `components/layout`.
- Styling: reuse goes through a cva variant or component; cross-cutting values are theme tokens in `index.css`; one-offs are inline canonical Tailwind utilities (arbitrary `[...]` only when no canonical value exists). No `*.layout.ts` constant files, single-use custom tokens, or `@apply` for one-offs.
- App-owned images and icons live in `src/assets/` and are imported so the build verifies them; `public/` is only for assets that need a stable URL, are very large, or are referenced outside the build.
- Keep nesting shallow (two to three levels). Add structure only when it earns its place.

## Where does my work go?

- A screen or page -> `features/<feature>/<Feature>Page.tsx` (thin wrapper)
- A feature-specific component -> `features/<feature>/components/`
- Feature state or flow -> `features/<feature>/hooks/`
- Pure logic (scoring, rules) -> `features/<feature>/<feature>.logic.ts`
- Reading or writing data -> add a function to `services/<x>.service.ts`, consume it from a feature hook (components never call services or Firebase directly)
- A reusable UI primitive -> `components/ui/` (Shadcn, or a small own primitive like `LoadingSpinner`)
- A structural / layout piece (banner, content shell, header/footer) -> `components/layout/` (e.g. `TitleBanner`, `AppContentShell`)
- An app-owned image or icon -> import it from `src/assets/`, never a `public/` string
- A recurring set of utility classes -> a cva variant or component; cross-cutting values -> a theme token; a one-off -> an inline canonical utility (not a constant, custom token, or `@apply`)
- A shared domain type -> `types/<domain>.ts`

## Testing

Unit tests use Vitest and React Testing Library, co-located as `*.test.ts(x)`. The pure `*.logic.ts` files are the primary unit-test targets. Tests never touch live Firebase: mock the service layer (`vi.mock("@/services/...")`). Run with `npm run test`; a single file with `npx vitest run src/features/quiz/quiz.logic.test.ts`.

Security rules have a separate suite under `test/rules/`, written with `@firebase/rules-unit-testing` and run against the Firestore emulator (not the jsdom unit run). It is excluded from `npm run test` and run with `npm run test:rules` instead - see Scripts and Troubleshooting above.

## Deploying to production

The app is deployed to Firebase Hosting at **https://emoot-my-savings-goal.web.app** - the team's standalone build, for demo, testing, and handover. Deploys are run by hand from a logged-in machine; there is no CI deploy yet.

**Prerequisites.**

- Logged in to the Firebase CLI (`npx firebase login`), with the Google account added to the project.
- The active project resolves to `emoot-my-savings-goal`. Check with `npx firebase use`; a stale local override can point it elsewhere, so reset it once with `npx firebase use emoot-my-savings-goal` if needed.
- The production web config present at build time - it is committed in `.env.production` (see [Firebase](#firebase)), so `npm run build` picks it up with no extra setup.

**Deploy in order - rules and indexes first, hosting second:**

```
npm run build
npx firebase deploy --only firestore:rules,firestore:indexes --project emoot-my-savings-goal
npx firebase deploy --only hosting --project emoot-my-savings-goal
```

Rules and indexes always go up _before_ hosting. Never put the app on a public URL while the live database still has open or unset rules - that would expose every user's data. Protect the data first, then publish the app.

Pass `--project emoot-my-savings-goal` on every deploy command. The CLI deploys to its _active_ project, and a stale `firebase use` override (a past `firebase use staging` stored outside the repo) can default to the wrong - or a non-existent - project and 403. The explicit `--project` removes that ambiguity regardless of local state.

**After deploying.** Open https://emoot-my-savings-goal.web.app and confirm Google sign-in works on the live domain. If it fails with `auth/unauthorized-domain`, add the domain under **Firebase Console -> Authentication -> Settings -> Authorized domains**. The `.web.app` and `.firebaseapp.com` domains are added automatically; a custom domain would need adding by hand.

**Seed the content database.** Hosting serves the app, but the quiz, personality-type, and bingo content lives in Firestore and is seeded separately - see [the prod seed runbook](scripts/seed/README.md#seed-prod). Deploy and seed together are the full ship-to-prod path.

Emoot's own production environment - the one designated by the Emoot CTO - is a separate, later target; see Integration and handover below. [TODO: details once confirmed]

## Integration and handover (for the Emoot team)

- The data layer in `services/` is the integration seam: reimplement these functions against Emoot's Firebase/Firestore and the rest of the app is unchanged.
- The Firestore data structures are designed to map onto Emoot's existing database.
- See the data model and integration-points documents for the mapping. [TODO: link both]
