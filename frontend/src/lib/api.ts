export type Transaction = {
  id: string;
  amount: number;
  category: string;
  date: string;
  description: string;
};

const BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8080";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  });
  if (!res.ok) {
    let msg = `Request failed (${res.status})`;
    try {
      const err = await res.json();
      msg = err?.error || msg;
    } catch {}
    throw new Error(msg);
  }
  return res.json();
}

export const api = {
  addTransaction: (body: { amount: number; category: string; date: string; description?: string }) =>
    request<Transaction>("/api/transactions", { method: "POST", body: JSON.stringify(body) }),
  getAllTransactions: () => request<Transaction[]>("/api/transactions"),
  getByCategory: (category: string) => request<Transaction[]>(`/api/transactions/category/${encodeURIComponent(category)}`),
  getTotalsByCategory: () => request<Record<string, number>>("/api/summary/category"),
};
