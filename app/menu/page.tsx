"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import NavbarForBagels from "../components/NavbarForBagels"; // ✅ Added import

/** ---------- Types ---------- */
type Category = "Breakfast" | "Lunch" | "Desserts" | "Drinks" | "Trending";

type MenuRow = { name: string; price: string; note?: string };

type TableSection = {
  title: string;
  items: ReadonlyArray<MenuRow>;
  notes?: ReadonlyArray<string>;
  type?: undefined;
};

type InfoSection = {
  title: string;
  type: "info";
  bullets: ReadonlyArray<string>;
};

type BreakfastSections = readonly [TableSection, TableSection, InfoSection, TableSection];

/** ---------- Data ---------- */
const MENU = {
  Breakfast: {
    sections: [
      {
        title: "Bagels & Schmears",
        items: [
          { name: "Avocado", price: "$1.50" },
          { name: "Bagel or Toast with Avocado", price: "$4.55" },
          { name: "Bagel with Butter", price: "$2.80" },
          { name: "Breakfast Meat", price: "$2.25" },
          { name: "Jelly", price: "$0.50" },
          { name: "Side Flavored Cream Cheese", price: "$2.95" },
          { name: "Side Plain Cream Cheese", price: "$2.25" },
          { name: "Veggies", price: "$1.00" },
          { name: "Bagel with Cream Cheese", price: "$3.75" },
          { name: "Bagel with Flavored Cream Cheese", price: "$4.65" },
          { name: "Bagel with Cream Cheese & Bacon", price: "$5.50" },
          { name: "Bagel with Flavored CC & Bacon", price: "$6.75" },
          { name: "Bagel with Flavored CC, Bacon & Fresh Avocado", price: "$7.99" },
          { name: "Bagel with Peanut Butter & Jelly", price: "$4.50" },
          { name: "Bagel with Nova & Cream Cheese", price: "$12.00" },
          { name: "Bagel with Nova & *Flavored* Cream Cheese", price: "$12.50" },
          { name: "Bagel with Whitefish", price: "$8.75" },
          { name: "Bagel with Smoked Salmon Spread", price: "$7.75" },
        ],
        notes: ["Romaine Lettuce, Onion, Cream Cheese & Capers available."],
      },
      {
        title: "Signature Omelettes",
        items: [
          { name: "*Ham, Sausage, Bacon or Pork Roll & Cheese Omelette", price: "$11.99" },
          { name: "Asparagus, Onion, Swiss Cheese Omelette", price: "$10.60" },
          { name: "Broccoli & Cheese Omelette", price: "$9.95" },
          { name: "Cheese Omelette", price: "$9.95" },
          { name: "Fresh Nova, Tomato, Onion, Capers, Chive CC Omelette", price: "$13.99" },
          { name: "Fried Avocado, Grilled Tomato, Mozzarella Omelette", price: "$13.75" },
          { name: "Philly Steak Omelette", price: "$14.00", note: "Cherry Peppers & Fried Onions" },
          { name: "Spanish Omelette", price: "$10.75", note: "Peppers, Onions, Salsa & Cheddar" },
          { name: "Spinach & Feta Omelette", price: "$11.15" },
          {
            name: "Veggie Delight Omelette",
            price: "$12.99",
            note: "Spinach, Broccoli, Peppers, Onions, Mushrooms, Egg Whites & Cheese",
          },
          { name: "Western Omelette", price: "$11.75", note: "*Ham, Peppers, Onions & Cheese" },
          { name: "Zucchini, Onion, Cheese Omelette", price: "$10.60" },
        ],
      },
      {
        title: "Build Your Own Breakfast",
        type: "info",
        bullets: [
          "Meats – Bacon, Porkroll, Sausage, *Ham, Scrapple, Turkey Bacon, Turkey Sausage & Steak",
          "Cheese – American, Swiss, Provolone, Mozzarella, Pepperjack, Cheddar & Feta",
          "Veggies – Spinach, Broccoli, Avocado, Peppers, Onions, Mushrooms & Tomato",
          "Breads – Bagel, Croissant, Burrito, English",
          "Breakfast Burritos – Made with three eggs",
          "Burrito Flavors – Plain, Honey Wheat, Spinach & Herb, Tomato Basil",
        ],
      },
      {
        title: "Breakfast Platters",
        items: [
          { name: "#1 2 Eggs", price: "$8.99", note: "Side of Potatoes, Toast or Bagel" },
          { name: "#2 2 Eggs", price: "$10.99", note: "Potatoes, Breakfast Meat, Toast or Bagel" },
          { name: "#3 French Toast (3)", price: "$12.98", note: "Side of Breakfast Meat" },
          { name: "#4 Pancakes (3)", price: "$12.99", note: "Side of Breakfast Meat" },
          { name: "#5 2 Eggs", price: "$12.99", note: "Potatoes + 1 French Toast or 1 Pancake" },
          { name: "#6 2 Eggs", price: "$13.65", note: "Potatoes + Breakfast Meat + 1 FT or 1 Pancake" },
        ],
      },
    ] as BreakfastSections,
  },
  Lunch: [
    { name: "Turkey Club Sandwich", price: "$9.99" },
    { name: "Grilled Chicken Wrap", price: "$8.50" },
    { name: "Steak & Cheese Bagel Melt", price: "$10.75" },
  ] as const,
  Desserts: [
    { name: "Chocolate Croissant", price: "$3.50" },
    { name: "Cheesecake Slice", price: "$4.75" },
    { name: "Cinnamon Roll", price: "$3.99" },
  ] as const,
  Drinks: [
    { name: "Fresh Orange Juice", price: "$3.25" },
    { name: "Iced Coffee", price: "$2.99" },
    { name: "Hot Latte", price: "$3.50" },
  ] as const,
  Trending: [
    { name: "Everything Bagel Sandwich", price: "$7.50" },
    { name: "Blueberry Cream Cheese Bagel", price: "$5.25" },
    { name: "Cold Brew Latte", price: "$4.75" },
  ] as const,
} as const;

/** ---------- Image paths ---------- */
const CHIP_IMAGES: Record<Category, string> = {
  Breakfast: "/images/bagelimages/bagel_images/breakfast.jpg",
  Lunch: "/images/bagelimages/bagel_images/lunch.jpg",
  Desserts: "/images/bagelimages/bagel_images/deserts.jpg",
  Drinks: "/images/bagelimages/bagel_images/drinks.png",
  Trending: "/images/bagelimages/bagel_images/trending.jpg",
};

const BG_IMAGE = "/images/bagelimages/bagel_images/bagelbg.png";

/** ---------- Helpers ---------- */
function splitInTwo<T>(arr: ReadonlyArray<T>): [T[], T[]] {
  const mid = Math.ceil(arr.length / 2);
  return [arr.slice(0, mid), arr.slice(mid)];
}

function isInfoSection(s: TableSection | InfoSection): s is InfoSection {
  return (s as InfoSection).type === "info";
}

/** ---------- Page ---------- */
export default function MenuPage() {
  const [active, setActive] = useState<Category>("Breakfast");

  const fade = {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -8 },
  };

  return (
    <div className="relative min-h-screen">
      {/* ✅ Navbar added here */}
      <NavbarForBagels />

      {/* Background with dark tint */}
      <div
        className="absolute inset-0 -z-10 bg-[length:cover] bg-center"
        style={{ backgroundImage: `url(${BG_IMAGE})` }}
        aria-hidden
      />
      <div className="absolute inset-0 -z-10 bg-black/30" aria-hidden />

      {/* Chips */}
      <div className="mx-auto max-w-5xl px-4 pt-6">
        <div className="hidden flex-wrap items-center justify-center gap-3 md:flex">
          {(Object.keys(CHIP_IMAGES) as Category[]).map((cat) => (
            <CategoryChip
              key={cat}
              label={cat}
              img={CHIP_IMAGES[cat]}
              active={active === cat}
              onClick={() => setActive(cat)}
              widthClass="w-44"
            />
          ))}
        </div>

        {/* Mobile chips (scroll) */}
        <div className="no-scrollbar md:hidden overflow-x-auto pb-2">
          <div className="flex items-center gap-3">
            {(Object.keys(CHIP_IMAGES) as Category[]).map((cat) => (
              <CategoryChip
                key={cat}
                label={cat}
                img={CHIP_IMAGES[cat]}
                active={active === cat}
                onClick={() => setActive(cat)}
                widthClass="w-36 shrink-0"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-5xl px-4 py-6 md:py-10">
        <AnimatePresence mode="wait">
          <motion.div key={active} {...fade} transition={{ duration: 0.25 }}>
            {active === "Breakfast" ? (
              <>
                <div className="grid gap-4 md:grid-cols-2">
                  <TableCard
                    title={MENU.Breakfast.sections[0].title}
                    rows={MENU.Breakfast.sections[0].items}
                    notes={MENU.Breakfast.sections[0].notes}
                  />
                  <TableCard
                    title={MENU.Breakfast.sections[1].title}
                    rows={MENU.Breakfast.sections[1].items}
                  />
                </div>

                {isInfoSection(MENU.Breakfast.sections[2]) && (
                  <InfoCard
                    title={MENU.Breakfast.sections[2].title}
                    bullets={MENU.Breakfast.sections[2].bullets}
                  />
                )}

                <div className="mt-4">
                  <TableCard
                    title={MENU.Breakfast.sections[3].title}
                    rows={MENU.Breakfast.sections[3].items}
                  />
                </div>
              </>
            ) : (
              (() => {
                const list = MENU[active] as ReadonlyArray<MenuRow>;
                const [left, right] = splitInTwo(list);
                return (
                  <div className="grid gap-4 md:grid-cols-2">
                    <TableCard title={`${active} (1)`} rows={left} />
                    {right.length > 0 && <TableCard title={`${active} (2)`} rows={right} />}
                  </div>
                );
              })()
            )}
          </motion.div>
        </AnimatePresence>

        {/* Back to top */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="mx-auto mt-6 block rounded-lg bg-black px-4 py-2 font-bold text-white hover:bg-black/90"
        >
          ↑ Back to top
        </button>
      </div>
    </div>
  );
}

/** ---------- UI Components ---------- */
function CategoryChip({
  label,
  img,
  active,
  onClick,
  widthClass = "w-44",
}: {
  label: string;
  img: string;
  active?: boolean;
  onClick?: () => void;
  widthClass?: string;
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      whileHover={{ scale: 1.02 }}
      onClick={onClick}
      className={`${widthClass} overflow-hidden rounded-xl`}
      aria-pressed={!!active}
    >
      <div
        className={`relative h-24 rounded-xl border-2 ${
          active ? "border-white shadow-[0_0_16px_rgba(255,255,255,0.65)]" : "border-transparent shadow"
        }`}
        style={{ backgroundImage: `url(${img})`, backgroundSize: "cover", backgroundPosition: "center" }}
      >
        <div className="absolute inset-0 rounded-xl bg-black/35" />
        <span className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded bg-black/40 px-2 py-1 text-sm font-bold text-white">
          {label}
        </span>
      </div>
    </motion.button>
  );
}

function TableCard({
  title,
  rows,
  notes,
}: {
  title: string;
  rows: ReadonlyArray<MenuRow>;
  notes?: ReadonlyArray<string>;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-neutral-800 bg-white shadow-[0_10px_25px_rgba(0,0,0,0.15)]">
      <div className="border-b border-neutral-700 bg-black px-4 pb-2 pt-3 text-center">
        <h3 className="text-lg font-bold text-white">{title}</h3>
        <div className="mt-1 flex justify-between text-xs text-neutral-300">
          <span>Item</span>
          <span>Price</span>
        </div>
      </div>

      <ul className="divide-y divide-neutral-200">
        {rows.map((it, i) => (
          <li key={`${it.name}-${i}`} className="flex items-center justify-between px-4 py-3">
            <div className="pr-3">
              <p className="text-[15px] font-semibold text-black">{it.name}</p>
              {it.note ? <p className="mt-1 text-xs text-neutral-600">({it.note})</p> : null}
            </div>
            <p className="min-w-[72px] text-right text-sm font-semibold text-neutral-900">{it.price}</p>
          </li>
        ))}
      </ul>

      {!!notes?.length && (
        <div className="border-t border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-700">
          {notes.map((n, i) => (
            <p key={i}>• {n}</p>
          ))}
        </div>
      )}
    </div>
  );
}

function InfoCard({ title, bullets }: { title: string; bullets: ReadonlyArray<string> }) {
  return (
    <div className="mt-4 rounded-xl border border-neutral-800 bg-white p-4 shadow-[0_10px_25px_rgba(0,0,0,0.15)]">
      <h3 className="mb-2 text-center text-lg font-bold text-black">{title}</h3>
      <ul className="space-y-1 text-sm text-neutral-800">
        {bullets.map((b, i) => (
          <li key={i}>• {b}</li>
        ))}
      </ul>
    </div>
  );
}
