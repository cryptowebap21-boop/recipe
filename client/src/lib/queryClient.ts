import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    try {
      const json = await res.json();
      // Check if it's our standardized error envelope
      if (json.ok === false && json.error) {
        const error: any = new Error(json.error.message || 'An error occurred');
        error.code = json.error.code;
        throw error;
      }
      // Fallback for non-standard JSON errors - extract message field if available
      const message = json.message || json.error?.message || res.statusText || 'Request failed';
      const error: any = new Error(message);
      if (json.error?.code || json.code) {
        error.code = json.error?.code || json.code;
      }
      throw error;
    } catch (e) {
      // If it's already our formatted error, rethrow it
      if (e instanceof Error && e.message && !e.message.includes('JSON')) {
        throw e;
      }
      // If JSON parsing failed (SyntaxError), use a user-friendly message
      throw new Error(res.statusText || `Request failed with status ${res.status}`);
    }
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
  signal?: AbortSignal
): Promise<Response> {
  const res = await fetch(url, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
    signal,
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const res = await fetch(queryKey.join("/") as string, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
