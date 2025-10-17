"use client";

import { useMemo, useState } from "react";
import toast, { Toaster } from "react-hot-toast"; // local Toaster so this file works standalone
import { CheckCircleIcon, XCircleIcon, AlertTriangleIcon } from "lucide-react";

const API_URL = "/api/contact"; // hits your Next.js API route

async function readErrorMessage(res: Response) {
  const raw = await res.text();
  try {
    const data = raw ? JSON.parse(raw) : null;
    if (data && typeof data === "object") {
      if ("detail" in (data as any) && typeof (data as any).detail === "string") {
        return (data as any).detail;
      }
      return (
        Object.entries(data)
          .map(([field, msgs]) =>
            Array.isArray(msgs) ? `${field}: ${msgs.join(", ")}` : `${field}: ${msgs}`
          )
          .join("\n") || "Unknown error."
      );
    }
    if (typeof data === "string") return data;
  } catch {
    /* fall through */
  }
  return raw || "Unknown error.";
}

export default function ContactForm() {
  const [contactFullName, setContactFullName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  // simple honeypot (bots often fill hidden fields)
  const [website, setWebsite] = useState<string>("");

  const validEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  // stricter client-side checks & length guards (protect your API a bit)
  const isValid = useMemo(() => {
    const n = contactFullName.trim();
    const e = email.trim();
    const c = category.trim();
    const m = message.trim();
    return (
      n.length >= 2 &&
      n.length <= 100 &&
      validEmail(e) &&
      c.length >= 2 &&
      c.length <= 60 &&
      m.length >= 5 &&
      m.length <= 3000
    );
  }, [contactFullName, email, category, message]);

  const successToast = (msg: string) =>
    toast.custom(
      <div className="flex items-center gap-3 rounded-xl bg-blue-600 text-white px-5 py-3 shadow-lg">
        <CheckCircleIcon size={22} className="text-yellow-300" />
        <span className="font-medium">{msg}</span>
      </div>,
      { duration: 3000 }
    );

  const errorToast = (msg: string) =>
    toast.custom(
      <div className="flex items-center gap-3 rounded-xl bg-red-600 text-white px-5 py-3 shadow-lg">
        <XCircleIcon size={22} className="text-yellow-300" />
        <span className="font-medium whitespace-pre-line">{msg}</span>
      </div>,
      { duration: 6000 }
    );

  const warnToast = (msg: string) =>
    toast.custom(
      <div className="flex items-center gap-3 rounded-xl bg-yellow-400 text-black px-5 py-3 shadow-lg">
        <AlertTriangleIcon size={22} />
        <span className="font-semibold">{msg}</span>
      </div>,
      { duration: 2500 }
    );

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // block if honeypot is filled
    if (website.trim()) {
      // Pretend success so bots don’t learn there’s a honeypot
      return successToast("Your message has been sent successfully!");
    }

    if (!isValid) {
      if (!contactFullName.trim() || !email.trim() || !category.trim() || !message.trim()) {
        return warnToast("Please fill all fields!");
      }
      if (!validEmail(email.trim())) return warnToast("Please enter a valid email address!");
      return warnToast("Please check your inputs.");
    }

    const payload = {
      name: contactFullName.trim(),
      email: email.trim(),
      category: category.trim(),
      message: message.trim(),
      website: website.trim(), // honeypot field (server can ignore/drop if present)
    };

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);

    try {
      setLoading(true);

      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        cache: "no-store",
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (res.ok) {
        setContactFullName("");
        setEmail("");
        setCategory("");
        setMessage("");
        setWebsite("");
        successToast("Your message has been sent successfully!");
      } else {
        const msg = await readErrorMessage(res);
        errorToast(msg || `Request failed (${res.status})`);
        console.error("Contact submit failed", { status: res.status, body: msg });
      }
    } catch (err: any) {
      clearTimeout(timeout);
      const name = err?.name || "Error";
      const msg =
        name === "AbortError"
          ? "Request timed out. Please try again."
          : "Could not reach the server.\nIf this keeps happening, the API may be down or misconfigured.";
      console.error("Network error:", name, err?.message || err);
      errorToast(msg);
    } finally {
      setLoading(false);
    }
  }

  // typed change handlers
  const onNameChange = (e: React.ChangeEvent<HTMLInputElement>) => setContactFullName(e.target.value);
  const onEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value);
  const onCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => setCategory(e.target.value);
  const onMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => setMessage(e.target.value);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-yellow-50 px-4 py-10">
      {/* Local Toaster so this file works immediately; remove if you add a global one in layout */}
      <Toaster position="top-center" />

      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-xl">
        <h1 className="text-center text-3xl font-extrabold text-blue-700 mb-8">
          Contact <span className="text-yellow-400">Jash Techno</span>
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col space-y-4" noValidate>
          {/* Honeypot (hidden from real users) */}
          <input
            name="website"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="hidden"
          />

          <input
            type="text"
            placeholder="Full Name"
            value={contactFullName}
            onChange={onNameChange}
            autoComplete="name"
            required
            maxLength={100}
            className="border border-gray-300 rounded-lg px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-600"
          />

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={onEmailChange}
            autoComplete="email"
            required
            maxLength={120}
            className="border border-gray-300 rounded-lg px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-600"
          />

          <input
            type="text"
            placeholder="Business Category (e.g. Restaurant, Smoke Shop)"
            value={category}
            onChange={onCategoryChange}
            required
            maxLength={60}
            className="border border-gray-300 rounded-lg px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-600"
          />

          <textarea
            placeholder="Your Message"
            value={message}
            onChange={onMessageChange}
            rows={4}
            required
            maxLength={3000}
            className="border border-gray-300 rounded-lg px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-600"
          />

          <button
            type="submit"
            disabled={loading || !isValid}
            aria-disabled={loading || !isValid}
            className={`w-full rounded-lg py-3 font-bold text-white transition ${
              loading || !isValid ? "bg-blue-300 cursor-not-allowed" : "bg-blue-700 hover:bg-blue-800"
            }`}
          >
            {loading ? "Submitting..." : "Send Message"}
          </button>
        </form>
      </div>
    </div>
  );
}
