import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";

const GoogleSignInButton = ({
  textType = "signin_with", // "signin_with" | "signup_with" | "continue_with"
  onSuccess,
  onError,
}) => {
  const { googleLogin } = useAuth();
  const buttonRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [scriptLoaded, setScriptLoaded] = useState(false);

  const clientId =
    import.meta.env.VITE_GOOGLE_CLIENT_ID ||
    "498419590377-k4087pu2ugns2s9nsvt24bes6kf3696r.apps.googleusercontent.com";

  // Callback executed by Google Identity Services when user finishes login
  const handleCredentialResponse = async (response) => {
    if (!response?.credential) {
      setErrorMsg("Google login failed: No credential received.");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      const data = await googleLogin(response.credential);
      if (onSuccess) {
        onSuccess(data);
      }
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Google authentication failed. Please try again or verify your internet connection.";
      setErrorMsg(message);
      if (onError) {
        onError(err);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // 1. Check if Google Identity script is already present
    const existingScript = document.getElementById("google-gsi-client");

    const initializeGSI = () => {
      if (window.google?.accounts?.id && buttonRef.current) {
        try {
          window.google.accounts.id.initialize({
            client_id: clientId,
            callback: handleCredentialResponse,
            auto_select: false,
            cancel_on_tap_outside: true,
          });

          // Render official Google button inside ref
          buttonRef.current.innerHTML = "";
          window.google.accounts.id.renderButton(buttonRef.current, {
            type: "standard",
            theme: "outline",
            size: "large",
            text: textType,
            shape: "rectangular",
            logo_alignment: "left",
            width: 320,
          });
          setScriptLoaded(true);
        } catch (e) {
          console.error("Error initializing Google Identity Services:", e);
        }
      }
    };

    if (window.google?.accounts?.id) {
      initializeGSI();
    } else if (!existingScript) {
      const script = document.createElement("script");
      script.id = "google-gsi-client";
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = () => {
        initializeGSI();
      };
      script.onerror = () => {
        setErrorMsg("Failed to load Google Sign-In SDK. Check network or ad-blocker.");
      };
      document.body.appendChild(script);
    } else {
      existingScript.addEventListener("load", initializeGSI);
      return () => {
        existingScript.removeEventListener("load", initializeGSI);
      };
    }
  }, [clientId, textType]);

  return (
    <div className="w-full flex flex-col items-center">
      {errorMsg && (
        <div className="w-full mb-3 p-2.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg text-center">
          {errorMsg}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center gap-2 py-2.5 px-4 w-full max-w-[320px] bg-white border border-gray-300 rounded-lg shadow-sm text-sm text-gray-700 font-medium">
          <svg
            className="animate-spin h-4 w-4 text-amber-700"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            ></path>
          </svg>
          <span>Authenticating with Google...</span>
        </div>
      ) : (
        <div className="flex justify-center w-full min-h-[44px]">
          <div ref={buttonRef} className="flex justify-center" />
        </div>
      )}
    </div>
  );
};

export default GoogleSignInButton;

