import { useState, useEffect, useCallback, useRef } from "react";
import { 
  onAuthStateChanged, 
  User, 
  signInWithPopup, 
  signOut,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult
} from "firebase/auth";
import { app, auth, googleProvider } from "@/lib/firebase";
import { executeApi, ApiResponse } from "@/lib/api";

export interface LogEntry {
  id: string;
  method: string;
  endpoint: string;
  status: number;
  timeMs: number;
  response: any;
  timestamp: Date;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  
  const recaptchaVerifierRef = useRef<RecaptchaVerifier | null>(null);

  useEffect(() => {
    // Debug Logging for Firebase Project Check
    console.log("Firebase App Name:", app.name);
    console.log("Firebase Project ID:", app.options.projectId);
    console.log("Firebase Auth App Name:", auth.app.name);
    console.log("Firebase Auth Current Tenant:", auth.tenantId);

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const idToken = await currentUser.getIdToken(true);
        setToken(idToken);
        localStorage.setItem("aura_firebase_token", idToken);
      } else {
        setToken(null);
        localStorage.removeItem("aura_firebase_token");
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const addLog = useCallback((method: string, endpoint: string, res: Partial<ApiResponse> & { status: number, timeMs: number, data?: any, error?: any }) => {
    setLogs((prev) => [
      {
        id: Math.random().toString(36).substring(7),
        method,
        endpoint,
        status: res.status,
        timeMs: res.timeMs,
        response: res.data || { error: res.error },
        timestamp: new Date(),
      },
      ...prev,
    ]);
  }, []);

  const addFirebaseError = useCallback((endpoint: string, error: any) => {
    // Ensure we capture the full Firebase error object (code, message, customData)
    addLog("FIREBASE", endpoint, {
      status: 400,
      timeMs: 0,
      data: {
        code: error?.code,
        message: error?.message,
        customData: error?.customData,
        fullError: JSON.parse(JSON.stringify(error, Object.getOwnPropertyNames(error)))
      }
    });
  }, [addLog]);

  const clearLogs = () => setLogs([]);

  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken(true);
      
      const res = await executeApi({
        method: "POST",
        endpoint: "/auth/login",
        body: { provider: "google", id_token: idToken },
      });
      addLog("POST", "/auth/login", res);
    } catch (error: any) {
      addFirebaseError("signInWithPopup (Google)", error);
    }
  };

  const setupRecaptcha = useCallback((containerId: string) => {
    if (!recaptchaVerifierRef.current) {
      try {
        recaptchaVerifierRef.current = new RecaptchaVerifier(auth, containerId, {
          size: "invisible",
          callback: () => {
            addLog("FIREBASE", "reCAPTCHA", { status: 200, timeMs: 0, data: { message: "reCAPTCHA solved by user" } });
          },
          'expired-callback': () => {
            addLog("FIREBASE", "reCAPTCHA", { status: 400, timeMs: 0, data: { message: "reCAPTCHA expired" } });
          }
        });
        
        addLog("FIREBASE", "setupRecaptcha", { 
          status: 200, 
          timeMs: 0, 
          data: { 
            message: "reCAPTCHA initialized",
            projectId: app.options.projectId,
            containerId: containerId
          } 
        });
      } catch (error: any) {
        addFirebaseError("setupRecaptcha", error);
      }
    }
  }, [addFirebaseError, addLog]);

  const clearRecaptcha = useCallback(() => {
    if (recaptchaVerifierRef.current) {
      try {
        recaptchaVerifierRef.current.clear();
        addLog("FIREBASE", "clearRecaptcha", { status: 200, timeMs: 0, data: { message: "reCAPTCHA cleared" } });
      } catch (e: any) {
        addFirebaseError("clearRecaptcha", e);
      }
      recaptchaVerifierRef.current = null;
    }
  }, [addFirebaseError, addLog]);

  const sendOtp = async (phoneNumber: string) => {
    try {
      const appVerifier = recaptchaVerifierRef.current;
      if (!appVerifier) throw new Error("missing-app-verifier");
      
      addLog("FIREBASE", "signInWithPhoneNumber Init", { 
        status: 0, 
        timeMs: 0, 
        data: { 
          message: "Attempting SMS Send",
          phoneNumber: phoneNumber,
          recaptchaState: "Ready",
          projectId: app.options.projectId
        } 
      });

      const confirmation = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
      setConfirmationResult(confirmation);
      addLog("FIREBASE", "signInWithPhoneNumber Success", { status: 200, timeMs: 0, data: { message: "SMS Sent" } });
    } catch (error: any) {
      addFirebaseError("signInWithPhoneNumber Failed", error);
      throw error;
    }
  };

  const verifyOtp = async (code: string) => {
    if (!confirmationResult) throw new Error("No confirmation result found");
    try {
      const result = await confirmationResult.confirm(code);
      const idToken = await result.user.getIdToken(true);
      
      const res = await executeApi({
        method: "POST",
        endpoint: "/auth/login",
        body: { provider: "phone", id_token: idToken },
      });
      addLog("POST", "/auth/login", res);
      
      clearRecaptcha();
      setConfirmationResult(null);
    } catch (error: any) {
      addFirebaseError("confirmationResult.confirm", error);
      throw error;
    }
  };

  const refreshToken = async () => {
    if (user) {
      try {
        const start = performance.now();
        const idToken = await user.getIdToken(true);
        const timeMs = Math.round(performance.now() - start);
        setToken(idToken);
        localStorage.setItem("aura_firebase_token", idToken);
        addLog("FIREBASE", "getIdToken(true)", { status: 200, timeMs, data: { message: "Token refreshed" } });
      } catch (error: any) {
        addFirebaseError("getIdToken", error);
      }
    }
  };

  const logout = async () => {
    try {
      if (token) {
        const res = await executeApi({
          method: "POST",
          endpoint: "/auth/logout",
          token,
        });
        addLog("POST", "/auth/logout", res);
      }
      await signOut(auth);
      setToken(null);
      localStorage.removeItem("aura_firebase_token");
      addLog("FIREBASE", "signOut", { status: 200, timeMs: 0, data: { message: "Signed out from Firebase" } });
    } catch (error: any) {
      addFirebaseError("signOut", error);
    }
  };

  const testGetMe = async () => {
    if (!token) return;
    const res = await executeApi({
      method: "GET",
      endpoint: "/auth/me",
      token,
    });
    addLog("GET", "/auth/me", res);
  };

  return {
    user,
    token,
    isLoading,
    logs,
    confirmationResult,
    loginWithGoogle,
    setupRecaptcha,
    clearRecaptcha,
    sendOtp,
    verifyOtp,
    refreshToken,
    logout,
    testGetMe,
    addLog,
    clearLogs,
  };
}
