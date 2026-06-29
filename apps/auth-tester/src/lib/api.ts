const BACKEND_URL = "http://localhost:8000";

export interface ApiRequestOptions {
  method?: string;
  endpoint: string;
  body?: any;
  token?: string | null;
}

export interface ApiResponse<T = any> {
  data: T | null;
  status: number;
  timeMs: number;
  error?: string;
}

export const executeApi = async ({ method = "GET", endpoint, body, token }: ApiRequestOptions): Promise<ApiResponse> => {
  const url = `${BACKEND_URL}${endpoint}`;
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const options: RequestInit = {
    method,
    headers,
  };

  if (body && (method === "POST" || method === "PUT" || method === "PATCH")) {
    options.body = typeof body === "string" ? body : JSON.stringify(body);
  }

  const startTime = performance.now();
  
  try {
    const res = await fetch(url, options);
    const timeMs = Math.round(performance.now() - startTime);
    
    let data = null;
    const contentType = res.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      data = await res.json();
    } else {
      const text = await res.text();
      data = text ? { text } : null;
    }

    return {
      data,
      status: res.status,
      timeMs,
    };
  } catch (error: any) {
    const timeMs = Math.round(performance.now() - startTime);
    return {
      data: null,
      status: 0,
      timeMs,
      error: error.message || "Network Error",
    };
  }
};
