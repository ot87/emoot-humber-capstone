import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "../hooks/useAuth";

export default function SignOutButton() {
  const navigate = useNavigate();
  const { signOut, isSigningOut } = useAuth();
  async function handleSignOut() {
    if (await signOut()) {
      navigate("/auth", { replace: true });
    }
  }
  return (
    <Button type="button" variant="outline" onClick={handleSignOut} disabled={isSigningOut}>
      {isSigningOut ? "Signing out..." : "Sign out"}
    </Button>
  );
}
