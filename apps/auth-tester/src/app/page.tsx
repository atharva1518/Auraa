"use client";

import { useAuth } from "@/hooks/useAuth";
import { AuthProviders } from "@/components/AuthProviders";
import { AuthStateCard } from "@/components/AuthStateCard";
import { ApiPlayground } from "@/components/ApiPlayground";
import { DeveloperPanel } from "@/components/DeveloperPanel";
import { ShieldCheck } from "lucide-react";

export default function AuthTesterDashboard() {
  const {
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
    addLog,
    clearLogs,
  } = useAuth();

  return (
    <main className="min-h-screen p-4 md:p-8 max-w-6xl mx-auto flex flex-col">
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-[var(--color-aura-500)] p-2 rounded-xl">
          <ShieldCheck className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Aura Auth Tester</h1>
          <p className="text-sm text-gray-400">Internal Firebase & API testing client</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <div className="flex flex-col">
          <AuthStateCard user={user} token={token} />

          <div className="glass-card rounded-2xl p-6">
            <h2 className="text-xl font-bold mb-6 gradient-text">Authentication</h2>
            
            {isLoading ? (
              <div className="flex justify-center p-8">
                <div className="animate-spin w-8 h-8 border-2 border-[var(--color-aura-500)] border-t-transparent rounded-full" />
              </div>
            ) : !user ? (
              <AuthProviders
                onGoogleLogin={loginWithGoogle}
                onSetupRecaptcha={setupRecaptcha}
                onClearRecaptcha={clearRecaptcha}
                onSendOtp={sendOtp}
                onVerifyOtp={verifyOtp}
                hasConfirmationResult={!!confirmationResult}
                isLoading={isLoading}
              />
            ) : (
              <div className="text-center text-sm text-gray-400">
                You are authenticated. Check the Developer Panel to manage your session.
              </div>
            )}
          </div>

          <ApiPlayground token={token} addLog={addLog} />
        </div>

        <div className="h-full flex flex-col">
          <DeveloperPanel 
            logs={logs} 
            user={user}
            token={token}
            onClear={clearLogs} 
            onRefresh={refreshToken}
            onLogout={logout}
          />
        </div>
      </div>
    </main>
  );
}
