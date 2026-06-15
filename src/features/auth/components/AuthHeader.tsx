import { TitleBanner } from "@/components/TitleBanner";
import {
  AUTH_COLUMN_MAX_CLASS,
  AUTH_CONTENT_SHELL,
  AUTH_HEADER_TORN_BG,
  AUTH_LOGO,
  AUTH_TAGLINE_CLASS,
} from "@/features/auth/auth.layout";
import { AuthProductIcons } from "@/features/auth/components/AuthProductIcons";
import { cn } from "@/lib/utils";

export function AuthHeader() {
  return (
    <header className="relative">
      <img
        src={AUTH_HEADER_TORN_BG}
        alt=""
        aria-hidden="true"
        width={390}
        height={260}
        decoding="async"
        fetchPriority="high"
        className="pointer-events-none absolute inset-0 size-full object-cover object-bottom select-none"
      />

      <div className={cn("relative pb-10 sm:pb-11", AUTH_COLUMN_MAX_CLASS)}>
        <img
          src="/assets/decoration-auth-zigzag.svg"
          alt=""
          aria-hidden="true"
          width={68}
          height={45}
          decoding="async"
          className="pointer-events-none absolute right-3 top-3 z-10 select-none"
        />

        <div
          className={cn(
            AUTH_CONTENT_SHELL,
            "relative flex flex-col items-center pt-8 text-center sm:pt-10",
          )}
        >
          <h1 className="leading-none">
            <img
              src={AUTH_LOGO}
              alt="EMOOT"
              width={115}
              height={60}
              decoding="async"
              className="h-[2.5rem] w-auto sm:h-[2.75rem]"
            />
          </h1>

          <TitleBanner variant="auth" className="mt-4 max-w-[min(100%,20rem)] sm:mt-5">
            <p className={AUTH_TAGLINE_CLASS}>Emotion-First Cash Transfer</p>
          </TitleBanner>

          <p className="mt-2 font-quiz-body text-[0.65rem] font-normal leading-snug text-foreground sm:mt-3 sm:text-xs">
            Powered by Interac e-Transfer®
          </p>

          <AuthProductIcons className="relative z-10 mt-3 translate-y-1/2 sm:mt-4" />
        </div>
      </div>
    </header>
  );
}
