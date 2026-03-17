export type RsvpRow = {
  ID: string;
  GroupId: string;
  GroupName?: string;
  Name: string;
  Attendance?: string;
  UpdatedAt?: string;
};

export type RsvpListResponse = {
  headers: string[];
  rows: RsvpRow[];
};

export type UpdateAttendancePayload = {
  id: string;
  updates: Partial<Pick<RsvpRow, "Attendance">>;
};

export const ATTENDANCE_OPTIONS = ["Going", "Not Going", "Maybe"] as const;

export const WEB_APP_URL = (import.meta.env.VITE_RSVP_WEB_APP_URL as string) ||
  "https://script.google.com/macros/s/AKfycbzmlnZfHtG3iWn8l6ExmTxze9kvKR_wuK98__xnD_sthc1f1AtVrZjM8_CAtqin9ea-Lg/exec";

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function withRetry<T>(
  action: () => Promise<T>,
  options?: { attempts?: number; baseDelayMs?: number; jitter?: boolean }
): Promise<T> {
  const attempts = options?.attempts ?? 3;
  const baseDelayMs = options?.baseDelayMs ?? 200;
  const useJitter = options?.jitter ?? true;

  let lastError: unknown;
  for (let i = 0; i < attempts; i++) {
    try {
      return await action();
    } catch (err) {
      lastError = err;
      if (i === attempts - 1) break;
      const backoff = baseDelayMs * Math.pow(2, i);
      const jitter = useJitter ? Math.random() * baseDelayMs : 0;
      await sleep(backoff + jitter);
    }
  }
  throw (lastError instanceof Error ? lastError : new Error(String(lastError)));
}

async function jsonFetch<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  // Do not set Content-Type by default; Apps Script returns 405 to OPTIONS preflight.
  // Keeping requests "simple" avoids the browser issuing an OPTIONS preflight.
  const res = await fetch(input, init);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Request failed: ${res.status} ${res.statusText} - ${text}`);
  }
  return (await res.json()) as T;
}

export async function fetchRsvpList(signal?: AbortSignal): Promise<RsvpListResponse> {
  const url = new URL(WEB_APP_URL);
  url.searchParams.set("op", "list");
  // Simple GET: no custom headers to avoid preflight
  return await jsonFetch<RsvpListResponse>(url.toString(), { signal, method: "GET" });
}

export async function updateAttendance(id: string, attendance: string): Promise<{ ok: boolean }> {
  const payload: UpdateAttendancePayload = {
    id,
    updates: { Attendance: attendance },
  };
  // Use text/plain to keep the request "simple" and avoid CORS preflight.
  return await withRetry(
    () =>
      jsonFetch<{ ok: boolean }>(WEB_APP_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload),
      }),
    { attempts: 4, baseDelayMs: 250, jitter: true }
  );
}


