/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",   // keep both in case you're using /src
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: { brand: { light: "#E6F4FF", sky: "#0EA5E9", deep: "#0369A1" } },
      boxShadow: {
        card: "0 10px 25px rgba(56,189,248,.15)",
        cardHover: "0 15px 30px rgba(56,189,248,.25)",
      },
    },
  },
  plugins: [],
};
