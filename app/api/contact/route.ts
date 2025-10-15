// app/api/contact/route.ts
import { NextResponse } from "next/server";

export const runtime = "nodejs";          // avoid Edge limits
export const dynamic = "force-dynamic";   // never cache this route

// --- config ---
const API_BASE = process.env.API_BASE_URL; // MUST be set on Vercel
const REQUEST_TIMEOUT_MS = 10000;
const MAX_BODY_BYTES = 16 * 1024;

// --- utils ---
function requireApiBase() {
  if (!API_BASE) {
    const err: any = new Error("Missing API_BASE_URL (server env)");
    err.status = 500;
    throw err;
  }
  return API_BASE;
}

function fetchWithTimeout(url: string, init: RequestInit = {}, ms = REQUEST_TIMEOUT_MS) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), ms);
  const p = fetch(url, { ...init, signal: controller.signal });
  return p.finally(() => clearTimeout(id));
}

async function readJsonSafe(res: Response) {
  const raw = await res.text();
  try { return { parsed: raw ? JSON.parse(raw) : null, raw }; }
  catch { return { parsed: null, raw }; }
}

function isValidEmail(s: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

async function readBodyLimited(req: Request, limit = MAX_BODY_BYTES) {
  const len = Number(req.headers.get("content-length") || 0);
  if (len && len > limit) {
    const e: any = new Error(`Payload too large (${len} > ${limit})`);
    e.status = 413;
    throw e;
  }
  // If Content-Length is missing, still guard by actually measuring
  const text = await req.text();
  if (!len && text.length > limit) {
    const e: any = new Error(`Payload too large (${text.length} > ${limit})`);
    e.status = 413;
    throw e;
  }
  try {
    return JSON.parse(text || "{}");
  } catch {
    const e: any = new Error("Invalid JSON body");
    e.status = 400;
    throw e;
  }
}

function noStore(json: any, init?: { status?: number }) {
  return NextResponse.json(json, {
    status: init?.status ?? 200,
    headers: { "cache-control": "no-store" },
  });
}

// --- GET: probe backend & show which base is active ---
export async function GET() {
  try {
    const base = requireApiBase();
    const r = await fetchWithTimeout(`${base}/`, {
      cache: "no-store",
      headers: { "User-Agent": "jashtechno-contact-probe" },
    });
    const { parsed, raw } = await readJsonSafe(r);
    return noStore(
      { ok: r.ok, base, health: parsed ?? raw ?? "ok" },
      { status: r.status }
    );
  } catch (e: any) {
    return noStore(
      { detail: "Health check failed", error: String(e?.message || e) },
      { status: Number(e?.status) || 502 }
    );
  }
}

// Optional: HEAD for uptime monitors
export async function HEAD() {
  try {
    const base = requireApiBase();
    const r = await fetchWithTimeout(`${base}/`, { cache: "no-store", method: "GET" });
    return new NextResponse(null, {
      status: r.ok ? 200 : r.status,
      headers: { "cache-control": "no-store" },
    });
  } catch {
    return new NextResponse(null, { status: 502, headers: { "cache-control": "no-store" } });
  }
}

// --- POST: proxy to Django /api/contact/ ---
export async function POST(req: Request) {
  try {
    const base = requireApiBase();

    const body = await readBodyLimited(req);
    const payload = {
      name: String(body?.name ?? "").trim(),
      email: String(body?.email ?? "").trim(),
      category: String(body?.category ?? "").trim(),
      message: String(body?.message ?? "").trim(),
    };

    // Validate _before_ calling upstream
    const fieldErrors: Record<string, string> = {};
    if (!payload.name) fieldErrors.name = "This field is required.";
    if (!payload.email) fieldErrors.email = "This field is required.";
    else if (!isValidEmail(payload.email)) fieldErrors.email = "Enter a valid email.";
    if (!payload.category) fieldErrors.category = "This field is required.";
    if (!payload.message) fieldErrors.message = "This field is required.";
    if (Object.keys(fieldErrors).length) return noStore(fieldErrors, { status: 400 });

    const upstream = await fetchWithTimeout(`${base}/api/contact/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "jashtechno-contact-proxy",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    const { parsed, raw } = await readJsonSafe(upstream);

    if (!upstream.ok) {
      // Surface upstream error as-is (status preserved)
      return noStore(parsed ?? { detail: raw || "Upstream error" }, { status: upstream.status });
    }

    // Success: return upstream JSON (or raw text) with same status
    if (parsed) return noStore(parsed, { status: upstream.status });
    return new NextResponse(raw, {
      status: upstream.status,
      headers: { "content-type": upstream.headers.get("content-type") ?? "text/plain", "cache-control": "no-store" },
    });
  } catch (e: any) {
    return noStore(
      { detail: "Proxy error: fetch failed", error: String(e?.message || e) },
      { status: Number(e?.status) || 502 }
    );
  }
}
