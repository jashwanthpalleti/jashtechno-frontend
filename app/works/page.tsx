// app/works/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { IoCafeOutline, IoBrush, IoGlobeOutline } from "react-icons/io5";

export const metadata: Metadata = {
  title: "Our Works • Jash Techno",
  description: "Explore some of the projects we’ve proudly designed and built.",
};

export default function WorksPage() {
  return (
    <main className="bg-[#FFFFFF]">
      <section className="max-w-7xl mx-auto px-6 py-16 md:py-20">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#111827]">Our Works</h1>
          <p className="mt-4 text-base md:text-lg text-[#4B5563]">
            Explore some of the projects we’ve proudly designed and built.
          </p>
        </header>

        <div className="flex flex-col gap-6 md:gap-8">
          {/* Bagel Store */}
          <ProjectCard
            href="/store"
            title="🥯 Bagel Store"
            icon={<IoCafeOutline className="text-3xl text-[#F59E0B]" />}
            text="A modern black & white themed website design for a Bagel shop."
            clickable
          />

          {/* Coffee House (3D cup viewer) */}
          <ProjectCard
            href="/coffee-shop"
            title="☕ Coffee House"
            icon={<IoCafeOutline className="text-3xl text-[#3A8DC1]" />}
            text="Interactive homepage with a 3D cappuccino cup (GLB) you can rotate."
            clickable
          />

          {/* Portfolio (coming soon) */}
          <ProjectCard
            title="🎨 Portfolio"
            icon={<IoBrush className="text-3xl text-[#3A8DC1]" />}
            text="(Coming soon) A sleek portfolio for showcasing creative work."
          />
        </div>
      </section>
    </main>
  );
}

function ProjectCard({
  title,
  text,
  href,
  icon,
  clickable = false,
}: {
  title: string;
  text: string;
  href?: string;
  icon?: React.ReactNode;
  clickable?: boolean;
}) {
  const content = (
    <div
      className={[
        "w-full rounded-xl border border-[#E6EEF9] bg-[#F9F9F9] p-6 md:p-7",
        "shadow-[0_8px_20px_rgba(58,141,193,0.10)]",
        clickable ? "hover:shadow-[0_12px_28px_rgba(58,141,193,0.18)] transition" : "opacity-95",
      ].join(" ")}
    >
      <div className="flex items-start gap-4">
        <div className="mt-1">{icon ?? <IoGlobeOutline className="text-3xl text-[#3A8DC1]" />}</div>
        <div>
          <h3 className="text-xl md:text-2xl font-bold text-[#000000] mb-1">{title}</h3>
          <p className="text-sm md:text-base text-[#444444]">{text}</p>
        </div>
      </div>
    </div>
  );

  return clickable && href ? (
    <Link href={href} prefetch>
      {content}
    </Link>
  ) : (
    content
  );
}
