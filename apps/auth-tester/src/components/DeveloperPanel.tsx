import { Trash2, Copy, Clock, Activity, UserCircle, RefreshCw, LogOut } from "lucide-react";
import type { LogEntry } from "@/hooks/useAuth";
import type { User } from "firebase/auth";

interface DeveloperPanelProps {
  logs: LogEntry[];
  user: User | null;
  token: string | null;
  onClear: () => void;
  onRefresh: () => void;
  onLogout: () => void;
}

export function DeveloperPanel({ logs, user, token, onClear, onRefresh, onLogout }: DeveloperPanelProps) {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  const provider = user?.providerData[0]?.providerId === "phone" ? "Phone" : 
                   user?.providerData[0]?.providerId === "google.com" ? "Google" : 
                   "Unknown";

  return (
    <div className="glass-card rounded-2xl overflow-hidden flex flex-col h-[700px]">
      <div className="flex items-center justify-between p-4 border-b border-white/10 bg-black/20">
        <h2 className="font-bold flex items-center gap-2">
          <Activity className="w-5 h-5 text-[var(--color-aura-500)]" />
          Developer Panel
        </h2>
        <button onClick={onClear} className="text-gray-400 hover:text-white flex items-center gap-1 text-xs">
          <Trash2 className="w-3 h-3" /> Clear Logs
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        
        {/* Authentication Context Section */}
        {user && (
          <div className="bg-black/30 border border-white/5 rounded-xl overflow-hidden">
            <div className="p-3 border-b border-white/5 bg-black/20 font-semibold text-sm">
              Firebase User Context
            </div>
            <div className="p-4 space-y-4">
              <div className="flex items-center gap-4">
                {user.photoURL ? (
                  <img src={user.photoURL} alt="Avatar" className="w-12 h-12 rounded-full" />
                ) : (
                  <UserCircle className="w-12 h-12 text-gray-400" />
                )}
                <div className="text-sm">
                  <p><span className="text-gray-400">Provider:</span> {provider}</p>
                  <p><span className="text-gray-400">UID:</span> <span className="font-mono">{user.uid}</span></p>
                  <p><span className="text-gray-400">Email:</span> {user.email || "N/A"}</p>
                  <p><span className="text-gray-400">Phone:</span> {user.phoneNumber || "N/A"}</p>
                  <p><span className="text-gray-400">Name:</span> {user.displayName || "N/A"}</p>
                </div>
              </div>

              {token && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-400 font-semibold">Firebase ID Token</span>
                  </div>
                  <div className="font-mono text-xs text-gray-300 break-all bg-black/40 p-2 rounded-lg max-h-24 overflow-y-auto">
                    {token}
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <button 
                  onClick={() => token && copyToClipboard(token)} 
                  disabled={!token}
                  className="flex-1 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 py-2 rounded-lg text-xs font-medium transition-colors"
                >
                  <Copy className="w-3 h-3" /> Copy Token
                </button>
                <button 
                  onClick={onRefresh} 
                  className="flex-1 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 py-2 rounded-lg text-xs font-medium transition-colors"
                >
                  <RefreshCw className="w-3 h-3" /> Refresh Token
                </button>
                <button 
                  onClick={onLogout} 
                  className="flex-1 flex items-center justify-center gap-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 py-2 rounded-lg text-xs font-medium transition-colors"
                >
                  <LogOut className="w-3 h-3" /> Logout
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Logs Section */}
        <div>
          <div className="font-semibold text-sm mb-3 px-1 text-gray-300">API & Event Logs</div>
          {logs.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">No logs yet.</p>
          ) : (
            <div className="space-y-4">
              {logs.map((log) => (
                <div key={log.id} className="bg-black/30 border border-white/5 rounded-xl overflow-hidden">
                  <div className="flex items-center justify-between p-3 border-b border-white/5 bg-black/20">
                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-bold px-2 py-1 rounded ${
                        log.method === 'FIREBASE' ? 'bg-purple-500/20 text-purple-400' :
                        log.method === 'GET' ? 'bg-blue-500/20 text-blue-400' :
                        log.method === 'POST' ? 'bg-green-500/20 text-green-400' :
                        'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {log.method}
                      </span>
                      <span className="font-mono text-sm break-all">{log.endpoint}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs font-mono whitespace-nowrap ml-2">
                      <span className={`flex items-center ${
                        log.status >= 200 && log.status < 300 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {log.status}
                      </span>
                      <span className="flex items-center gap-1 text-gray-400">
                        <Clock className="w-3 h-3" /> {log.timeMs}ms
                      </span>
                    </div>
                  </div>
                  <div className="p-4 relative group">
                    <button
                      onClick={() => copyToClipboard(JSON.stringify(log.response, null, 2))}
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/10 hover:bg-white/20 p-1.5 rounded"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                    <pre className="font-mono text-xs text-gray-300 overflow-x-auto">
                      {JSON.stringify(log.response, null, 2)}
                    </pre>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
