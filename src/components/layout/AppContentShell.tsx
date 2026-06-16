import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

type AppContentShellProps<T extends ElementType = "div"> = {
  as?: T;
  children: ReactNode;
  className?: string;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "children" | "className">;

export function AppContentShell<T extends ElementType = "div">({
  as,
  children,
  className,
  ...props
}: AppContentShellProps<T>) {
  const Component = as ?? "div";

  return (
    <Component
      className={cn(
        "mx-auto w-full max-w-[430px] px-4 sm:px-6 lg:max-w-lg lg:px-8 xl:max-w-xl",
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
