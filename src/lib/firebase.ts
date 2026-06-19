import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Reuse the app across HMR reloads instead of re-initializing.
export const firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Auth always targets the real project (Google sign-in), in dev and prod.
export const auth = getAuth(firebaseApp);

// Firestore: real in production, local emulator in development.
export const db = getFirestore(firebaseApp);

if (import.meta.env.DEV) {
  // Route Firestore to the local emulator so dev never touches production data.
  // Guard against a second connectFirestoreEmulator call under HMR.
  const g = globalThis as typeof globalThis & { __fsEmulatorConnected?: boolean };
  if (!g.__fsEmulatorConnected) {
    connectFirestoreEmulator(db, "127.0.0.1", 8080);
    g.__fsEmulatorConnected = true;
  }
}
