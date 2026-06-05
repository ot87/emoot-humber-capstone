# Pre-PR self-review

Review the current branch's changes before a PR is opened. You are reviewing,
not fixing: change no code, commit nothing.

If the ticket's acceptance criteria were not provided with this command, ask
for them first and wait.

## Steps

1. Diff this branch against its merge base with master (`git diff master...HEAD`).
   If there are no commits ahead of master, say so and stop. Otherwise list
   every changed file first, so the PR's footprint is visible.
2. Check the diff against the ticket: every acceptance criterion covered, and
   nothing in the diff outside the ticket's scope. Flag unrelated changes
   explicitly, even one-line ones, including dependency or lockfile churn.
3. Scan the diff for credentials: API keys, tokens, real values in
   `.env.example`, or any `.env*` file added to tracking. Any hit is blocking.
4. Check the diff against every rule in AGENTS.md. Name the rule for each
   violation.
5. Run `npm run lint`, `npm run typecheck`, `npm run test`, `npm run build`
   and report results.
6. Check tests: new or changed behavior covered; service layer mocked; the
   suite green.

## Output

Group findings as:
(a) Blocking - would fail review or CI; must fix before opening the PR.
(b) Should fix - worth fixing now while context is fresh.
(c) Nits - optional.
(d) Done well - name what is correct, so good patterns get reinforced.

For every finding: file and line, one sentence on why it matters, and the
concrete fix. Example of one finding:

> (a) `src/features/quiz/components/QuizCard.tsx:12` - imports `getQuestions`
> from `@/services/quiz.service`; components never call services (AGENTS.md,
> Firebase boundary). Fix: consume it via the `useQuestions` hook.

If a finding suggests a misunderstanding of the architecture
rather than a slip, say so plainly and explain the correct mental model in
two or three sentences.

End with a verdict: "ready to open the PR" or "fix (a) items first".
