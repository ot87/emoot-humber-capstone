export type TaglineSegment = {
  initial: string;
  rest: string;
  separator: "" | " " | "-";
};

/** Split tagline text so each word (and hyphen segment) gets an enlarged initial. */
export function splitTaglineInitialCaps(text: string): TaglineSegment[] {
  const segments: TaglineSegment[] = [];
  const words = text.trim().split(/\s+/);

  words.forEach((word, wordIndex) => {
    const parts = word.split("-");

    parts.forEach((part, partIndex) => {
      if (part.length === 0) {
        return;
      }

      segments.push({
        initial: part[0],
        rest: part.slice(1),
        separator: partIndex < parts.length - 1 ? "-" : wordIndex < words.length - 1 ? " " : "",
      });
    });
  });

  return segments;
}
