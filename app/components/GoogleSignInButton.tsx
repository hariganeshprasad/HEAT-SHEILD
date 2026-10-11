"use client";

import { useEffect, useState } from "react";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential?: string }) => void;
          }) => void;
          renderButton: (
            element: HTMLElement | null,
            options?: {
              theme?: "outline" | "filled_blue" | "filled_black";
              size?: "large" | "medium" | "small";
              text?: string;
              shape?: "rectangular" | "pill" | "circle" | "square";
              logo_alignment?: "left" | "center";
            }
          ) => void;
          prompt: () => void;
        };
      };
    };
  }
}

export default function GoogleSignInButton() {
  const [isConfigured, setIsConfigured] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

  const persistUser = (user: { email?: string; name?: string; picture?: string; googleId?: string }) => {
    if (typeof window === "undefined") return;

    localStorage.setItem("heatshield_google_user", JSON.stringify(user));
    window.dispatchEvent(new CustomEvent("heatshield-google-auth-change"));
  };

  useEffect(() => {
    if (!clientId) {
      setIsConfigured(false);
      return;
    }

    setIsConfigured(true);

    const scriptId = "google-identity-services";
    const existingScript = document.getElementById(scriptId) as HTMLScriptElement | null;

    const initializeGoogleButton = () => {
      if (!window.google?.accounts?.id) return;

      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleCredentialResponse,
      });

      const target = document.getElementById("google-signin-button");
      if (target) {
        window.google.accounts.id.renderButton(target, {
          theme: "outline",
          size: "large",
          text: "signin_with",
          shape: "rectangular",
          logo_alignment: "left",
        });
      }
    };

    if (existingScript) {
      if (window.google?.accounts?.id) {
        initializeGoogleButton();
      } else {
        existingScript.onload = initializeGoogleButton;
      }
      return;
    }

    const script = document.createElement("script");
    script.id = scriptId;
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = initializeGoogleButton;
    document.head.appendChild(script);
  }, [clientId]);

  const handleCredentialResponse = async (response: { credential?: string }) => {
    const { credential } = response;

    if (!credential) {
      setErrorMessage("Google sign-in did not return a credential.");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ credential }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Google authentication failed");
      }

      persistUser(data.user);
    } catch (error) {
      console.error(error);
      setErrorMessage(error instanceof Error ? error.message : "Authentication failed");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isConfigured) {
    return (
      <div className="flex items-center gap-2 text-[10px] text-primary-fixed bg-primary-container/20 border border-primary-container rounded px-2 py-1.5 font-mono">
        Google login requires NEXT_PUBLIC_GOOGLE_CLIENT_ID
      </div>
    );
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <div id="google-signin-button" className={isLoading ? "pointer-events-none opacity-70" : ""} />
      {errorMessage && (
        <p className="text-[10px] text-error bg-error-container/30 border border-error/30 rounded px-2 py-1">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
