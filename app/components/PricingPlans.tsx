"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";

/**
 * PricingPlans.tsx
 * Responsive pricing grid with $149/mo as the highlighted default plan.
 * - Drop this in app/components/PricingPlans.tsx
 * - Render from a page (e.g., app/pricing/page.tsx) with: <PricingPlans />
 * - Replace Stripe links with your real checkout URLs.
 */

const featuresLite = [
  "Hosting & uptime monitoring",
  "Monthly package updates",
  "Minor content edits (1 hr)",
  "Basic SEO refresh",
  "Monthly backup",
  "Email support (48h SLA)",
];

const features149 = [
  "Hosting & uptime monitoring",
  "Monthly package updates",
  "Minor content edits (up to 3 hrs)",
  "Basic SEO (titles, sitemap, meta)",
  "Speed optimization & image compression",
  "SSL check + monthly security scan",
  "Daily cloud backups + restore",
  "Analytics report with insights",
  "1 AI chatbot tweak / month",
  "1 homepage banner/graphic update",
];

const featuresElite = [
  "Everything in Starter Growth",
  "Advanced SEO (schema + fixes)",
  "Security hardening & WAF review",
  "Automated daily backups & recovery",
  "AI analytics dashboard (monthly)",
  "Quarterly strategy call (60 min)",
  "Priority support (4h SLA + phone)",
];

export default function PricingPlans() {
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");

  const price = (monthly: number, yearly: number) =>
    billing === "monthly" ? `$${monthly}/mo` : `$${yearly}/yr`;

  return (
    <section className="relative mx-auto max-w-6xl px-6 py-16">
      {/* Header */}
      <header className="mx-auto max-w-3xl text-center">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-stone-900">
          Pricing Plans
        </h1>
        <p className="mt-3 text-stone-600">
          Subscriptions that keep your site fast, secure, and improving every month.
        </p>

        {/* Billing toggle */}
        <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white p-1">
          <button
            type="button"
            onClick={() => setBilling("monthly")}
            className={`rounded-full px-4 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 ${
              billing === "monthly" ? "bg-stone-900 text-white" : "text-stone-700"
            }`}
            aria-pressed={billing === "monthly"}
          >
            Monthly
          </button>
          <button
            type="button"
            onClick={() => setBilling("yearly")}
            className={`rounded-full px-4 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 ${
              billing === "yearly" ? "bg-stone-900 text-white" : "text-stone-700"
            }`}
            aria-pressed={billing === "yearly"}
            title="Get 2 months free"
          >
            Yearly <span className="ml-1 text-[11px] text-stone-400">(2 mo free)</span>
          </button>
        </div>
      </header>

      {/* Plans */}
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {/* Lite */}
        <PlanCard
          title="Lite Care"
          subtitle="Essentials to keep you online"
          price={price(99, 990)}
          ctaLabel="Choose Lite"
          ctaHref="https://buy.stripe.com/test_lite_placeholder" // TODO: replace
          features={featuresLite}
        />

        {/* Starter Growth (DEFAULT highlighted) */}
        <PlanCard
          highlighted
          badge="Most Popular"
          title="Starter Growth"
          subtitle="Keep it fast, secure & improving monthly"
          price={price(149, 1490)}
          ctaLabel="Start Growth Plan"
          ctaHref="https://buy.stripe.com/test_growth_placeholder" // TODO: replace
          features={features149}
        />

        {/* Elite */}
        <PlanCard
          title="Elite Security & AI"
          subtitle="For high-traffic or startup teams"
          price={price(499, 4990)}
          ctaLabel="Upgrade to Elite"
          ctaHref="https://buy.stripe.com/test_elite_placeholder" // TODO: replace
          features={featuresElite}
        />
      </div>

      {/* Footer note */}
      <p className="mt-6 text-center text-sm text-stone-500">
        Need a custom plan?{" "}
        <Link href="/contact" className="underline hover:text-stone-700">
          Talk to us
        </Link>
        .
      </p>
    </section>
  );
}

/* ---------------------------- Plan Card ---------------------------- */

function PlanCard({
  highlighted = false,
  badge,
  title,
  subtitle,
  price,
  ctaLabel,
  ctaHref,
  features,
}: {
  highlighted?: boolean;
  badge?: string;
  title: string;
  subtitle: string;
  price: string;
  ctaLabel: string;
  ctaHref: string;
  features: string[];
}) {
  return (
    <div
      className={`relative rounded-2xl border p-6 ${
        highlighted
          ? "border-sky-300 bg-white shadow-[0_10px_40px_rgba(14,165,233,0.15)] ring-1 ring-sky-200"
          : "border-stone-200 bg-white"
      }`}
      aria-label={`${title} plan`}
    >
      {badge && (
        <span className="absolute -top-3 left-6 rounded-full bg-sky-600 px-3 py-1 text-xs font-semibold text-white">
          {badge}
        </span>
      )}

      <h3 className="text-xl font-bold text-stone-900">{title}</h3>
      <p className="mt-1 text-sm text-stone-600">{subtitle}</p>

      <div className="mt-4 flex items-baseline gap-2">
        <span className="text-3xl font-extrabold text-stone-900">{price}</span>
      </div>

      <Link
        href={ctaHref}
        className={`mt-5 inline-flex w-full items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500 ${
          highlighted ? "bg-stone-900 text-white hover:bg-stone-800" : "bg-stone-800 text-white hover:bg-stone-700"
        }`}
        aria-label={ctaLabel}
      >
        {ctaLabel}
      </Link>

      <ul className="mt-6 space-y-2">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2">
            <Check className="mt-0.5 h-4 w-4 flex-none text-sky-600" aria-hidden />
            <span className="text-sm text-stone-700">{f}</span>
          </li>
        ))}
      </ul>

      <p className="mt-5 text-xs text-stone-400">Cancel anytime. Taxes may apply.</p>
    </div>
  );
}
