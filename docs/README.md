# Emoot Docs

Documentation for the Emoot My Savings Goal standalone app (Money Personality Quiz and Emoot Bingo).

## Contents

- **[Architecture Decision Records](adr/)** - non-obvious architectural decisions and their reasoning.
- **[Data model](data-model/)** - Firestore collections, document shapes, and the scoring rule (from KAN-17). Quiz section first; bingo to follow.
- **[Integration points](integration/)** - how the app's Firestore maps onto Emoot's existing schema, and open questions (from KAN-19).

## Conventions

- Docs are markdown. Diagrams are written as Mermaid in fenced code blocks so they render on GitHub and diff in pull requests.
- Architecture decisions are recorded as ADRs in [`adr/`](adr/) as part of the definition of done, not as separate tickets.
