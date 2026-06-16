import { splitTaglineInitialCaps } from "@/features/auth/auth.logic";

const AUTH_TAGLINE = "Emotion-First Cash Transfer";

export function AuthTagline() {
  const segments = splitTaglineInitialCaps(AUTH_TAGLINE);

  return (
    <div className="px-5">
      <p className="font-quiz-display text-[1.125rem] font-normal leading-none text-foreground uppercase -tracking-widest whitespace-nowrap">
        {segments.map((segment, index) => (
          <span key={index}>
            <span className="inline-block text-[1.12em] leading-none">{segment.initial}</span>
            {segment.rest}
            {segment.separator}
          </span>
        ))}
      </p>
    </div>
  );
}
