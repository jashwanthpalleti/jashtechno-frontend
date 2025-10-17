// app/api/contact/route.ts
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* ------------------------- Helpers ------------------------- */
function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
function clampLen(s: string, max: number) {
  return s.length > max ? s.slice(0, max) : s;
}
async function safeJson<T = any>(req: Request): Promise<T | null> {
  try { return (await req.json()) as T; } catch { return null; }
}

/* --------------------------- CORS --------------------------- */
export async function OPTIONS() {
  const res = new NextResponse(null, { status: 204 });
  res.headers.set("Access-Control-Allow-Origin", "*");
  res.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.headers.set("Access-Control-Allow-Headers", "content-type, authorization");
  res.headers.set("Access-Control-Max-Age", "86400");
  return res;
}

/* --------------------------- GET --------------------------- */
export async function GET() {
  const envOk =
    !!process.env.SMTP_HOST &&
    !!process.env.SMTP_USER &&
    !!process.env.SMTP_PASS &&
    !!process.env.CONTACT_TO_EMAIL;

  return NextResponse.json({
    service: "contact-api",
    ok: envOk,
    version: "smtp-v3", // 👈 new tag so we can confirm it’s the right file
  });
}


/* --------------------------- POST --------------------------- */
type Payload = {
  name?: string;
  email?: string;
  category?: string;
  message?: string;
  website?: string; // honeypot
};

export async function POST(req: Request) {
  const body = (await safeJson<Payload>(req)) || {};
  const name = clampLen((body.name ?? "").trim(), 100);
  const email = clampLen((body.email ?? "").trim(), 120);
  const category = clampLen((body.category ?? "").trim(), 60);
  const message = clampLen((body.message ?? "").trim(), 3000);
  const website = (body.website ?? "").trim();

  if (website) return NextResponse.json({ ok: true }, { status: 200 });
  if (!name || !email || !category || !message) {
    return NextResponse.json({ detail: "Missing required fields." }, { status: 400 });
  }
  if (!isValidEmail(email)) {
    return NextResponse.json({ detail: "Invalid email address." }, { status: 400 });
  }

  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;         // jash@jashtechno.com
  const pass = process.env.SMTP_PASS;
  const to   = process.env.CONTACT_TO_EMAIL;  // where you receive mail

  if (!host || !user || !pass || !to) {
    return NextResponse.json(
      { detail: "Server misconfigured: missing SMTP envs." },
      { status: 500 }
    );
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: false,        // 587 = STARTTLS (not SMTPS)
    requireTLS: true,     // enforce TLS upgrade
    auth: { user, pass },
  });

  // Verify in dev only (saves latency in prod)
  if (process.env.NODE_ENV !== "production") {
    try { await transporter.verify(); }
    catch (e: any) {
      console.error("SMTP verify failed:", e?.message || e);
      return NextResponse.json(
        { detail: "SMTP connection failed. Check host/port/user/pass." },
        { status: 500 }
      );
    }
  }

  const subject = `New inquiry (${category}) from ${name}`;
  const html = `
    <h2>New Contact Inquiry</h2>
    <p><strong>Name:</strong> ${escapeHtml(name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(email)}</p>
    <p><strong>Category:</strong> ${escapeHtml(category)}</p>
    <p><strong>Message:</strong></p>
    <pre style="white-space:pre-wrap;font-family:system-ui,Segoe UI,Roboto,Arial,sans-serif;">${escapeHtml(message)}</pre>
  `;

  try {
    await transporter.sendMail({
      from: `"Jash Techno" <${user}>`,  // Zoho requires From = authenticated mailbox or approved alias
      to,
      replyTo: email,
      subject,
      html,
      text: `New Contact Inquiry

Name: ${name}
Email: ${email}
Category: ${category}

Message:
${message}`,
    });

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (e: any) {
    console.error("sendMail failed:", e?.message || e);
    return NextResponse.json(
      { detail: "Email send failed. If using Zoho, ensure From equals SMTP_USER and password is an App Password." },
      { status: 500 }
    );
  }
}

/* ------------------------- Utils ------------------------- */
function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}