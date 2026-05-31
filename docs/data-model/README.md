# Data Model

Firestore collections, document shapes, identifiers, relationships, and the scoring rule for the Emoot app.

**Status: placeholder.** Content arrives from KAN-17.

## What will live here

- Collection and subcollection names, document paths, and field types.
- The result-to-challenges relationship and per-challenge status storage (bingo).
- The scoring rule: how the five answers map to one of the four personality types, including aggregation and tie-breaking. The option-to-`personalityType` mapping exists; the resolution rule still needs writing.
- The per-user access model that the Firestore security rules implement.
- An ER diagram as a Mermaid `erDiagram`.

## Source and status

- **Quiz model:** designed (KAN-17), to be extracted here as markdown from the standalone data-model doc.
- **Bingo model:** not yet designed; to follow.
