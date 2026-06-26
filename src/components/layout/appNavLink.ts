import type { ComponentType, ReactNode } from "react";

export type AppNavLinkProps = {
  to: string;
  children: ReactNode;
  className?: string;
  "aria-label"?: string;
  "aria-current"?: "page" | undefined;
};

export type AppNavLinkComponent = ComponentType<AppNavLinkProps>;
