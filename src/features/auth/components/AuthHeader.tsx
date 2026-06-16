import authHeaderTornBg from "@/assets/bg-auth-header-torn.svg";
import authZigzag from "@/assets/decoration-auth-zigzag.svg";
import emootLogo from "@/assets/logo-emoot.svg";
import productIcons from "@/assets/icon-emoot-product-icons.svg";
import { TitleBanner } from "@/components/layout/TitleBanner";
import { AUTH_INTERAC_ATTRIBUTION } from "@/features/auth/auth.logic";
import { AuthTagline } from "@/features/auth/components/AuthTagline";
import { cn } from "@/lib/utils";

export function AuthHeader() {
  return (
    <header className="relative">
      <img
        src={authHeaderTornBg}
        alt=""
        aria-hidden="true"
        width={390}
        height={260}
        decoding="async"
        fetchPriority="high"
        className="pointer-events-none absolute inset-0 size-full object-cover object-bottom select-none"
      />

      <img
        src={authZigzag}
        alt=""
        aria-hidden="true"
        width={68}
        height={45}
        decoding="async"
        className="pointer-events-none absolute right-0 top-3 z-10 select-none"
      />

      <div
        className={cn(
          "relative mx-auto w-full max-w-[430px] px-4 pb-10 sm:px-6 sm:pb-11 lg:max-w-lg xl:max-w-xl",
        )}
      >
        <div className="relative flex flex-col items-center pt-8 text-center sm:pt-10">
          <h1 className="leading-none">
            <img
              src={emootLogo}
              alt="EMOOT"
              width={114.59}
              height={60}
              decoding="async"
              className="h-auth-logo w-auto"
            />
          </h1>

          <TitleBanner variant="auth" className="mt-4 sm:mt-5">
            <AuthTagline />
          </TitleBanner>

          <p className={cn("auth-interac-attribution mt-2 sm:mt-3")}>{AUTH_INTERAC_ATTRIBUTION}</p>

          <img
            src={productIcons}
            alt=""
            width={172}
            height={91}
            decoding="async"
            aria-hidden="true"
            className="relative z-10 mt-3 h-auto w-[10.75rem] max-w-full translate-y-1/2 sm:mt-4 sm:w-[11.5rem]"
          />
        </div>
      </div>
    </header>
  );
}
