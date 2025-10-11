"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { CheckCircleIcon, XCircleIcon, AlertTriangleIcon } from "lucide-react";

const API_URL = "/api/contact"; // ← hits your Next.js proxy route

// Helper: read response body ONCE and turn it into a friendly message
async function readErrorMessage(res: Response) {
  const raw = await res.text();
  try {
    const data = raw ? JSON.parse(raw) : null;
    if (data && typeof data === "object") {
      return (
        Object.entries(data)
          .map(([field, msgs]) =>
            Array.isArray(msgs) ? `${field}: ${msgs.join(", ")}` : `${field}: ${msgs}`
          )
          .join("\n") || "Unknown error occurred."
      );
    }
    if (typeof data === "string") return data;
  } catch {
    /* fallthrough to raw */
  }
  return raw || "Unknown error occurred.";
}

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // Brand toasts
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
      { duration: 4500 }
    );

  const warnToast = (msg: string) =>
    toast.custom(
      <div className="flex items-center gap-3 rounded-xl bg-yellow-400 text-black px-5 py-3 shadow-lg">
        <AlertTriangleIcon size={22} />
        <span className="font-semibold">{msg}</span>
      </div>,
      { duration: 2500 }
    );

  // Submit Handler → posts to Next.js proxy (/api/contact) which forwards to Django
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      name: name.trim(),
      email: email.trim(),
      category: category.trim(),
      message: message.trim(),
    };

    if (!payload.name || !payload.email || !payload.category || !payload.message) {
      warnToast("Please fill all fields!");
      return;
    }
    if (!validateEmail(payload.email)) {
      warnToast("Please enter a valid email address!");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.status === 201) {
        setName("");
        setEmail("");
        setCategory("");
        setMessage("");
        successToast("Your message has been sent successfully!");
      } else {
        const errorMessage = await readErrorMessage(res);
        errorToast(errorMessage);
      }
    } catch (err) {
      console.error("Network error:", err);
      errorToast(
        "Could not reach the server.\nMake sure the backend is running and the proxy is configured."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-yellow-50 px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-xl">
        <h1 className="text-center text-3xl font-extrabold text-blue-700 mb-8">
          Contact <span className="text-yellow-400">Jash Techno</span>
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-600"
          />

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-600"
          />

          <input
            type="text"
            placeholder="Business Category (e.g. Restaurant, Smoke Shop)"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-600"
          />

          <textarea
            placeholder="Your Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            className="border border-gray-300 rounded-lg px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-600"
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full rounded-lg py-3 font-bold text-white transition ${
              loading ? "bg-blue-300 cursor-not-allowed" : "bg-blue-700 hover:bg-blue-800"
            }`}
          >
            {loading ? "Submitting..." : "Send Message"}
          </button>
        </form>
      </div>
    </div>
  );
}
