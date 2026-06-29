import { useState } from "react";
import { executeApi } from "@/lib/api";

interface ApiPlaygroundProps {
  token: string | null;
  addLog: (method: string, endpoint: string, res: any) => void;
}

export function ApiPlayground({ token, addLog }: ApiPlaygroundProps) {
  const [method, setMethod] = useState("GET");
  const [endpoint, setEndpoint] = useState("/student/profile");
  const [body, setBody] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    setIsLoading(true);
    let parsedBody = undefined;
    if (body && (method === "POST" || method === "PUT" || method === "PATCH")) {
      try {
        parsedBody = JSON.parse(body);
      } catch (e) {
        parsedBody = body; // Send as string if invalid JSON (backend might catch it)
      }
    }

    const res = await executeApi({
      method,
      endpoint,
      body: parsedBody,
      token,
    });
    addLog(method, endpoint, res);
    setIsLoading(false);
  };

  return (
    <div className="glass-card rounded-2xl p-6 mt-6">
      <h2 className="text-xl font-bold mb-4 gradient-text">API Playground</h2>
      <div className="flex flex-col gap-4">
        <div className="flex gap-2">
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            className="bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-aura-500)]"
          >
            <option>GET</option>
            <option>POST</option>
            <option>PUT</option>
            <option>DELETE</option>
            <option>PATCH</option>
          </select>
          <input
            type="text"
            value={endpoint}
            onChange={(e) => setEndpoint(e.target.value)}
            placeholder="/api/endpoint"
            className="flex-1 bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-aura-500)]"
          />
        </div>
        {(method === "POST" || method === "PUT" || method === "PATCH") && (
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="JSON Request Body"
            className="bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm font-mono h-24 focus:outline-none focus:border-[var(--color-aura-500)]"
          />
        )}
        <button
          onClick={handleSend}
          disabled={isLoading || !endpoint}
          className="bg-white/10 hover:bg-white/20 text-white font-medium py-2 rounded-lg transition-colors text-sm disabled:opacity-50"
        >
          {isLoading ? "Sending..." : "Send Request"}
        </button>
      </div>
    </div>
  );
}
