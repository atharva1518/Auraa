import { Copy, UserCircle } from "lucide-react";
import type { User } from "firebase/auth";

interface TokenViewerProps {
  user: User;
  token: string;
  onGetMe: () => void;
  onLogout: () => void;
}

export function TokenViewer({ user, token, onGetMe, onLogout }: TokenViewerProps) {
  const copyToken = () => {
    navigator.clipboard.writeText(token);
    alert("Token copied to clipboard!");
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4 bg-black/20 p-4 rounded-xl border border-white/5">
        {user.photoURL ? (
          <img src={user.photoURL} alt="Avatar" className="w-12 h-12 rounded-full" />
        ) : (
          <UserCircle className="w-12 h-12 text-gray-400" />
        )}
        <div>
          <h3 className="font-semibold">{user.displayName || "Anonymous User"}</h3>
          <p className="text-sm text-gray-400">{user.email || user.phoneNumber}</p>
        </div>
      </div>

      <div className="bg-black/20 p-4 rounded-xl border border-white/5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-400 font-semibold uppercase">Firebase ID Token</span>
          <button onClick={copyToken} className="text-[var(--color-aura-500)] hover:text-[var(--color-aura-100)] flex items-center gap-1 text-xs">
            <Copy className="w-3 h-3" /> Copy
          </button>
        </div>
        <div className="font-mono text-xs text-gray-300 break-all bg-black/40 p-3 rounded-lg max-h-32 overflow-y-auto">
          {token}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={onGetMe}
          className="bg-[var(--color-aura-600)] hover:bg-[var(--color-aura-500)] text-white font-medium py-2.5 px-4 rounded-lg transition-colors"
        >
          Test GET /auth/me
        </button>
        <button
          onClick={onLogout}
          className="bg-white/10 hover:bg-white/20 text-white font-medium py-2.5 px-4 rounded-lg transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
