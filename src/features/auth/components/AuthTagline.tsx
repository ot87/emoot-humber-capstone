import {
  AUTH_TAGLINE_CLASS,
  AUTH_TAGLINE_INITIAL_CLASS,
  AUTH_TAGLINE_INSET_CLASS,
} from "@/features/auth/auth.layout";
import { splitTaglineInitialCaps } from "@/features/auth/auth.logic";

const AUTH_TAGLINE = "Emotion-First Cash Transfer";

export function AuthTagline() {
  const segments = splitTaglineInitialCaps(AUTH_TAGLINE);

  return (
    <div className={AUTH_TAGLINE_INSET_CLASS}>
      <p className={AUTH_TAGLINE_CLASS}>
        {segments.map((segment, index) => (
          <span key={index}>
            <span className={AUTH_TAGLINE_INITIAL_CLASS}>{segment.initial}</span>
            {segment.rest}
            {segment.separator}
          </span>
        ))}
      </p>
    </div>
  );
}
