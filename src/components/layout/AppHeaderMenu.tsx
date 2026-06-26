import { useNavigate } from "react-router-dom";
import { DropdownMenu } from "radix-ui";
import menuHamburgerIcon from "@/assets/icon-menu-hamburger.svg";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { cn } from "@/lib/utils";

const menuItemClassName =
  "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-muted data-disabled:pointer-events-none data-disabled:opacity-50";

export function AppHeaderMenu() {
  const navigate = useNavigate();
  const { user, loading, signOut, isSigningOut } = useAuth();

  if (loading || !user) {
    return <div aria-hidden className="size-7 shrink-0" />;
  }

  async function handleSignOut(): Promise<void> {
    if (await signOut()) {
      navigate("/auth", { replace: true });
    }
  }

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="text-foreground"
          aria-label="Open menu"
        >
          <img src={menuHamburgerIcon} alt="" width={20} height={12} decoding="async" />
        </Button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="start"
          sideOffset={8}
          className={cn(
            "z-50 min-w-32 rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md",
          )}
        >
          <DropdownMenu.Item
            className={menuItemClassName}
            disabled={isSigningOut}
            onSelect={(event) => {
              event.preventDefault();
              void handleSignOut();
            }}
          >
            {isSigningOut ? "Signing out..." : "Sign out"}
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
