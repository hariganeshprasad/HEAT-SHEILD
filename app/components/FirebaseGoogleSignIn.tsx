"use client";

import { useEffect, useState } from "react";
import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../lib/firebase";

export default function FirebaseGoogleSignIn() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!auth) return;

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const payload = {
          googleId: currentUser.uid,
          email: currentUser.email,
          name: currentUser.displayName,
          picture: currentUser.photoURL,
        };
        localStorage.setItem("heatshield_google_user", JSON.stringify(payload));
        window.dispatchEvent(new CustomEvent("heatshield-google-auth-change"));
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSignIn = async () => {
    if (!auth) {
      setErrorMessage("Firebase is not configured yet. Add your Firebase env values.");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error(error);
      setErrorMessage(error instanceof Error ? error.message : "Google login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    if (!auth) return;

    try {
      await signOut(auth);
      localStorage.removeItem("heatshield_google_user");
      window.dispatchEvent(new CustomEvent("heatshield-google-auth-change"));
    } catch (error) {
      console.error(error);
    }
  };

  if (!auth) {
    return (
      <div className="flex items-center gap-2 text-[10px] text-primary-fixed bg-primary-container/20 border border-primary-container rounded px-2 py-1.5 font-mono">
        Firebase config missing
      </div>
    );
  }

  if (user) {
    return (
      <div className="flex items-center gap-2">
        {user.photoURL ? (
          <img src={user.photoURL} alt={user.displayName || "Google user"} className="w-8 h-8 rounded-full object-cover ring-2 ring-secondary/50" />
        ) : (
          <div className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center text-primary font-bold text-xs ring-2 ring-secondary/50">
            {(user.displayName || "U").charAt(0).toUpperCase()}
          </div>
        )}
        <button
          type="button"
          onClick={handleSignOut}
          className="hidden xl:inline-flex items-center justify-center rounded px-2 py-1 text-[10px] font-mono font-bold bg-primary-container/30 text-white hover:bg-primary-container/50"
        >
          Sign out
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={handleSignIn}
      disabled={isLoading}
      className="flex items-center gap-2 px-3 py-1.5 bg-secondary hover:bg-secondary/90 text-white rounded text-xs font-bold font-mono uppercase tracking-wider transition-all shadow-xs active:scale-95 ring-2 ring-secondary/30 disabled:opacity-70"
    >
      <span className="material-symbols-outlined text-sm">login</span>
      <span>{isLoading ? "Signing in..." : "Continue with Google"}</span>
    </button>
  );
}
