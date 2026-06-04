import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  type User,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import type { AuthUser } from "@/types/user";

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

export function mapFirebaseUser(user: User): AuthUser {
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
  };
}

export async function signInWithGoogle(): Promise<AuthUser> {
  const result = await signInWithPopup(auth, googleProvider);
  return mapFirebaseUser(result.user);
}

export async function logout(): Promise<void> {
  await signOut(auth);
}

export function listenToAuthChanges(
  callback: (user: AuthUser | null) => void,
): () => void {
  return onAuthStateChanged(auth, (firebaseUser) => {
    callback(firebaseUser ? mapFirebaseUser(firebaseUser) : null);
  });
}
