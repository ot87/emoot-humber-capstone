import { cn } from "@/lib/utils";

type AuthProductIconsProps = {
  className?: string;
};

export function AuthProductIcons({ className }: AuthProductIconsProps) {
  return (
    <img
      src="/assets/icon-emoot-product-icons.svg"
      alt=""
      width={172}
      height={91}
      decoding="async"
      aria-hidden="true"
      className={cn("h-auto w-[10.75rem] max-w-full sm:w-[11.5rem]", className)}
    />
  );
}
