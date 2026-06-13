# Data Model

Firestore collections, document shapes, identifiers, relationships, and the per-user access model for the Emoot app.

## Documents

- [Quiz](./quiz.md) - the Money Personality Quiz: quiz content, the four personality result definitions, and the user's saved result.
- [Bingo](./bingo.md) - the Emoot Bingo board, challenges per personality type, and feedback. _(to follow)_

## Conventions

- Personality type keys are UPPERCASE (`PLANNER`, `WORRIER`, `FREE_SPIRIT`, `OVERWHELMED_STARTER`); field names are camelCase.
- Per-user documents are keyed by the Firebase Auth UID.
- All data access goes through the service layer ([ADR-0002](../adr/0002-service-layer-boundary.md)). Diagrams are written as Mermaid in fenced code blocks.

## Security model and indexes

Per-user documents (`userQuizResults/{uid}`, and the bingo board) are readable and writable only by their owner; reference and content collections are read-only to signed-in users. The full access model - including the `feedback` collection and the index it needs - is completed in the bingo doc. The implementing `firestore.rules` and `firestore.indexes.json` are tracked as separate deployment tasks.

Integration with Emoot's existing Firestore is documented separately under [integration](../integration/).
