import { DISPLAY_TITLE_CLASS } from "@/components/title.layout";

/** Shared max-width and horizontal padding shell for auth screens. */
export const AUTH_CONTENT_SHELL =
  "mx-auto w-full max-w-[430px] px-4 sm:px-6 lg:max-w-lg lg:px-8 xl:max-w-xl";

/** White header shape with torn-paper bottom edge (replaces CSS bg-white). */
export const AUTH_HEADER_TORN_BG = "/assets/bg-auth-header-torn.svg";

/** Hand-drawn EMOOT wordmark. */
export const AUTH_LOGO = "/assets/logo-emoot.svg";

/** Tagline on the auth header brush — shared marker scale + auth uppercase tracking. */
export const AUTH_TAGLINE_CLASS = `${DISPLAY_TITLE_CLASS} uppercase tracking-[0.04em]`;

/** Textured grey login background (Figma #E5E5E5). */
export const AUTH_SURFACE_BG = "/assets/bg-auth-surface.svg";

/** Fallback fill while the surface image loads. */
export const AUTH_SURFACE_CLASS = "bg-[#E5E5E5]";

/** Centered auth column width — keeps decorations aligned on desktop. */
export const AUTH_COLUMN_MAX_CLASS = "mx-auto w-full max-w-[430px] lg:max-w-lg xl:max-w-xl";

/** Grey body zone below the torn edge; scales gently on desktop. */
export const AUTH_MAIN_MIN_CLASS = "min-h-[18.75rem] lg:min-h-[21rem] xl:min-h-[23rem]";

/** Figma sign-in card (342×270 at frame width) with proportional desktop growth. */
export const AUTH_SIGN_IN_CARD_CLASS =
  "flex w-full max-w-[21.375rem] min-h-[16.875rem] flex-col bg-white px-6 py-8 text-center shadow-md sm:px-8 sm:py-10 lg:min-h-[18rem] xl:min-h-[19rem]";
