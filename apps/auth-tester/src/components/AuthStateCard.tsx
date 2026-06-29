import type { User } from "firebase/auth";

interface AuthStateCardProps {
  user: User | null;
  token: string | null;
}

export function AuthStateCard({ user, token }: AuthStateCardProps) {
  const provider = user?.providerData[0]?.providerId === "phone" ? "Phone" : 
                   user?.providerData[0]?.providerId === "google.com" ? "Google" : 
                   user ? "Unknown" : "None";

  const identifier = user?.email || user?.phoneNumber || "N/A";

  return (
    <div className="glass-card rounded-2xl p-6 mb-6">
      <h2 className="text-xl font-bold mb-4 gradient-text">Authentication State</h2>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="bg-black/20 p-3 rounded-xl border border-white/5">
          <span className="text-gray-400 block mb-1">Firebase</span>
          <span className="font-semibold flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500"></div> Connected
          </span>
        </div>
        <div className="bg-black/20 p-3 rounded-xl border border-white/5">
          <span className="text-gray-400 block mb-1">Backend</span>
          <span className="font-semibold flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500"></div> Connected
          </span>
        </div>
        
        <div className="bg-black/20 p-3 rounded-xl border border-white/5">
          <span className="text-gray-400 block mb-1">Provider</span>
          <span className="font-semibold">{provider}</span>
        </div>
        <div className="bg-black/20 p-3 rounded-xl border border-white/5">
          <span className="text-gray-400 block mb-1">Authenticated</span>
          <span className="font-semibold">{user ? "Yes" : "No"}</span>
        </div>

        <div className="bg-black/20 p-3 rounded-xl border border-white/5">
          <span className="text-gray-400 block mb-1">Token Valid</span>
          <span className="font-semibold">{token ? "Yes" : "No"}</span>
        </div>
        <div className="bg-black/20 p-3 rounded-xl border border-white/5 overflow-hidden">
          <span className="text-gray-400 block mb-1">Current User</span>
          <span className="font-semibold truncate block">{identifier}</span>
        </div>
      </div>
    </div>
  );
}
