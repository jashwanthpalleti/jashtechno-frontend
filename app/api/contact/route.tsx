// app/api/contact/route.ts
import { NextResponse } from "next/server";

// Use a SERVER-ONLY env var (no NEXT_PUBLIC_). In dev, set this in .env.local
const BACKEND_API_BASE = process.env.BACKEND_API_BASE || "http://127.0.0.1:8000";
const CONTACT_URL = `${BACKEND_API_BASE.replace(/\/+$/, "")}/api/contact/`;

export const runtime = "nodejs";         // ensure Node runtime
export const dynamic = "force-dynamic";  // avoid caching during dev

// Quick GET for sanity check in the browser
export async function GET() {
  return NextResponse.json({ ok: true, target: CONTACT_URL }, { status: 200 });
}

// Handle CORS preflight if the browser sends it
export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}

// Proxy POST to Django
export async function POST(req: Request) {
  try {
    const payload = await req.json();

    const upstream = await fetch(CONTACT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    // Read the upstream body ONCE (could be JSON or text)
    const raw = await upstream.text();
    let data: any = raw;
    try { data = raw ? JSON.parse(raw) : null; } catch { /* keep raw string */ }

    if (!upstream.ok) {
      return NextResponse.json(
        typeof data === "string" ? { error: data } : data || { error: "Upstream error" },
        { status: upstream.status }
      );
    }

    // Pass through 201 Created on success
    return NextResponse.json(data ?? { ok: true }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { error: `Proxy error: ${err?.message || "unknown error"}` },
      { status: 502 }
    );
  }
}
