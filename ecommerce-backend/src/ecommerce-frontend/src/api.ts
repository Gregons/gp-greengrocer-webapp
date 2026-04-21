const BASE = "/api";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface UserInfo {
  id: number;
  name: string;
  email: string;
  token: string;
}

export interface ApiOrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

export interface ApiOrder {
  orderId: string;
  date: string;
  items: ApiOrderItem[];
  total: number;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function getToken(): string | null {
  return localStorage.getItem("session-token");
}

function authHeader(): Record<string, string> {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function handleError(res: Response, fallback: string): Promise<never> {
  let message = fallback;
  try {
    const body = await res.json();
    if (body?.message) message = body.message;
  } catch {
    // ignore parse errors
  }
  throw new Error(message);
}

// ── Auth ──────────────────────────────────────────────────────────────────────

export async function registerUser(payload: {
  name: string;
  email: string;
  password: string;
}): Promise<UserInfo> {
  const res = await fetch(`${BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (res.status === 409)
    throw new Error("That email address is already registered");
  if (!res.ok) await handleError(res, "Registration failed. Please try again.");
  return res.json();
}

export async function loginUser(payload: {
  email: string;
  password: string;
}): Promise<UserInfo> {
  const res = await fetch(`${BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (res.status === 401) throw new Error("Incorrect email or password");
  if (!res.ok) await handleError(res, "Login failed. Please try again.");
  return res.json();
}

// ── Orders ────────────────────────────────────────────────────────────────────

export async function fetchOrders(): Promise<ApiOrder[]> {
  const res = await fetch(`${BASE}/orders`, {
    headers: { ...authHeader() },
  });
  if (res.status === 401) throw new Error("Please log in to view your orders");
  if (!res.ok) await handleError(res, "Failed to load orders");
  return res.json();
}

export async function placeOrder(payload: {
  items: ApiOrderItem[];
  total: number;
}): Promise<ApiOrder> {
  const res = await fetch(`${BASE}/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeader() },
    body: JSON.stringify(payload),
  });
  if (res.status === 401) throw new Error("Please log in to place an order");
  if (!res.ok) await handleError(res, "Failed to place order");
  return res.json();
}
