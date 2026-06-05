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

```
git clone https://github.com/ot87/emoot-humber-capstone.git
cd emoot-humber-capstone
npm install
cp .env.example .env.local   # then fill in the Firebase config
npm run dev
```

## Scripts

- `npm run dev` - start the dev server
- `npm run build` - production build
- `npm run lint` - lint
- `npm run typecheck` - type-check without emitting
- `npm run preview` - preview the production build
- `npm run test` - run unit tests

## Environment setup (Firebase)

The app talks to Firebase directly (a serverless setup where the client connects to Firestore, protected by security rules). Create a Firebase project, enable Authentication (Google sign-in provider) and Firestore, and put the web config in `.env.local`:

```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

`.env.example` is the tracked template and contains placeholder keys only; real values live only in `.env.local`, which git ignores.

Security rules enforce per-user access: a user can read and write only their own data. [TODO: link the rules file once written.]

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
    quiz.service.ts        # getQuestions, saveQuizResult, getSavedQuizResult
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
      components/           # SignInCard ("Continue with Google"), SignOutButton
      hooks/                # useAuth (auth state + signIn/signOut actions)

  components/
    ui/                    # Shadcn components (button, dialog, input, ...)
    layout/                # AppHeader, AppFooter, PageShell

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
- Shared UI is Shadcn in `components/ui`; shared layout is in `components/layout`.
- Keep nesting shallow (two to three levels). Add structure only when it earns its place.

## Where does my work go?

- A screen or page -> `features/<feature>/<Feature>Page.tsx` (thin wrapper)
- A feature-specific component -> `features/<feature>/components/`
- Feature state or flow -> `features/<feature>/hooks/`
- Pure logic (scoring, rules) -> `features/<feature>/<feature>.logic.ts`
- Reading or writing data -> add a function to `services/<x>.service.ts`, consume it from a feature hook (components never call services or Firebase directly)
- A reusable UI primitive -> `components/ui/` (Shadcn)
- Shared layout -> `components/layout/`
- A shared domain type -> `types/<domain>.ts`

## Testing

Unit tests use Vitest and React Testing Library, co-located as `*.test.ts(x)`. The pure `*.logic.ts` files are the primary unit-test targets. Tests never touch live Firebase: mock the service layer (`vi.mock("@/services/...")`). Run with `npm run test`; a single file with `npx vitest run src/features/quiz/quiz.logic.test.ts`.

## Deployment

- Standalone (public URL): the team's deployed build, for demo and testing. [TODO: link]
- Production: deployed to the environment designated by the Emoot CTO. [TODO: details once confirmed]

## Integration and handover (for the Emoot team)

- The data layer in `services/` is the integration seam: reimplement these functions against Emoot's Firebase/Firestore and the rest of the app is unchanged.
- The Firestore data structures are designed to map onto Emoot's existing database.
- See the data model and integration-points documents for the mapping. [TODO: link both]
